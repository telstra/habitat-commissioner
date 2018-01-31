import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-api-config-settings',
  templateUrl: './api-config-settings.component.html',
  styleUrls: ['./api-config-settings.component.scss']
})
export class ApiConfigSettingsComponent implements OnInit {

  settingsForm: FormGroup;
  loading: Subscription;

  constructor(
    private fb: FormBuilder,
    private utils: UtilsService,
    private auth: AuthService
  ) { }

  addOrg() {
    const control = <FormArray>this.settingsForm.get('orgs');
    control.push(new FormControl('', Validators.required));
  }

  removeOrg(i) {
    const control = <FormArray>this.settingsForm.get('orgs');
    control.removeAt(i);
  }

  save() {
    if (this.settingsForm.valid) {
      this.loading = this.auth.updateUser(this.settingsForm.value).subscribe(res => {
        this.loading.unsubscribe();
      }, error => {
        this.loading.unsubscribe();
        console.error(error)
      });
    } else {
      this.utils.setAsTouched(this.settingsForm);
    }
  }

  ngOnInit() {
    this.settingsForm = this.fb.group({
      apiHostName: new FormControl('', Validators.required),
      repoParentDirectory: new FormControl('', Validators.required),
      orgs: this.fb.array([])
    });

    if (this.auth.user.config.orgs && this.auth.user.config.orgs.length > 0) {

      this.auth.user.config.orgs.forEach(org => {
        this.addOrg();
      });

      this.settingsForm.setValue({
        apiHostName: this.auth.user.config.apiHostName || '',
        repoParentDirectory: this.auth.user.config.repoParentDirectory || '',
        orgs: this.auth.user.config.orgs || null
      });
    } else {
      this.addOrg();
    }
  }

}
