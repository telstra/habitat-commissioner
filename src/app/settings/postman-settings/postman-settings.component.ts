import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FileInterface } from '../../models/file.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-postman-settings',
  templateUrl: './postman-settings.component.html',
  styleUrls: ['./postman-settings.component.scss']
})
export class PostmanSettingsComponent implements OnInit {

  collection = {} as FileInterface;
  environment = {} as FileInterface;

  collectionDetails: any;
  environmentDetails: any;

  tests: any[] = [];
  selectedTest: any;

  postmanForm: FormGroup;

  fileUploadResponse;
  loading = {};

  constructor(
    private modalService: NgbModal,
    private auth: AuthService
  ) { }

  reset() {
    this.tests = this.auth.user.config.tests;
    this.selectedTest = { id: null, name: null };
    this.postmanForm.setValue({ name: '' });
    this.postmanForm.reset();
    this.collection = {} as FileInterface;
    this.environment = {} as FileInterface;
  }

  upload(event, type) {
    if (event.target.files.length > 0) {

      if (event.target.files[0].name.substring(event.target.files[0].name.lastIndexOf('.') + 1) !== 'json') {
        this[type].error = `${type.charAt(0).toUpperCase() + type.slice(1)} must be .json file`;
      }
      else {
        this[type].error = null;
        this[type].file = event.target.files[0];
        this[type].display = event.target.files[0].name;
      }
    }
  }

  async editTest(editModal, id?) {
    if (id) {
      this.selectedTest = this.tests.find(x => x.id === id);
      this.postmanForm.setValue({ name: this.selectedTest.name });
      this.collection.display = this.selectedTest.collection;
      this.environment.display = this.selectedTest.environment;
    } else {
      this.reset();
    }

    try {
      let result = await this.modalService.open(editModal, { size: 'lg' }).result;
      if (result) {
        this.saveTest(this.selectedTest.id);
      }
    }
    catch (e) { }
  }

  async viewTest(detailsModal, id) {
    this.selectedTest = this.tests.find(x => x.id === id);

    this.loading[id] = this.auth.getTests(id).subscribe(res => {
      this.collectionDetails = res.data.collection;
      this.environmentDetails = res.data.environment;
    }); 
    
    try {
      await this.modalService.open(detailsModal, { size: 'lg' }).result;
    }
    catch (e) { }
  }

  saveTest(id) {
    let formData = new FormData();
    formData.append('name', this.postmanForm.get('name').value);
    formData.append('collection', this.collection.file);
    formData.append('environment', this.environment.file);

    if (id) {
      // updating an existing test collection
      this.loading[id] = this.auth.updatePostmanTest(id, formData).flatMap(res => {
        // update the local user reference
        return this.auth.getUser();
      }).subscribe(res => {
        // update the local tests array and reset the view
        this.reset();
        this.loading[id].unsubscribe();
      });
    } else {
      // new test collection
      this.loading['new'] = this.auth.createPostmanTest(formData).flatMap(res => {
        // update the local user reference
        return this.auth.getUser();
      }).subscribe(res => {
        // update the local tests array and reset the view
        this.reset();
        this.loading['new'].unsubscribe();
      });
    }
  }

  deleteTest(id) {
    this.loading[id] = this.auth.deletePostmanTest(id).flatMap(res => {
      return this.auth.getUser();
    }).subscribe(res => {
      // update the local tests array and reset the view
      this.reset();
      this.loading[id].unsubscribe();
    })
  }

  ngOnInit() {
    this.tests = this.auth.user.config.tests;

    this.postmanForm = new FormGroup({
      name: new FormControl('', Validators.required)
    });
  }
}
