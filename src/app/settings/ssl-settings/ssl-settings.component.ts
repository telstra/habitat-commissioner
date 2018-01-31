import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { FileInterface } from '../../models/file.interface';
import { ApigeeResponseInterface } from '../../models/apigee-response.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ssl-settings',
  templateUrl: './ssl-settings.component.html',
  styleUrls: ['./ssl-settings.component.scss']
})
export class SslSettingsComponent implements OnInit {

  settingsForm: FormGroup;
  loading: Subscription;

  key = {} as FileInterface;
  cert = {} as FileInterface;

  showPassword: boolean;

  constructor(
    private auth: AuthService
  ) { }

  upload(event, type) {
    if (event.target.files.length > 0) {

      if (event.target.files[0].name.substring(event.target.files[0].name.lastIndexOf('.') + 1) !== 'pem') {
        this[type].error = `${type.charAt(0).toUpperCase() + type.slice(1)} must be .pem file!`;
      }
      else {
        this[type].error = null;
        this[type].file = event.target.files[0];
        this[type].display = event.target.files[0].name;
      }
    }
  }

  delete() {
    this.loading = this.auth.disableSSL().flatMap(res => {
      this.key = {} as FileInterface;
      this.cert = {} as FileInterface;

      return this.auth.getUser();
    }).subscribe(res => {
      this.loading.unsubscribe();
    });
  }

  save() {
    if(!this.settingsForm.get('enable').value) {
      this.delete();
    }
    else if (this.key.file && this.cert.file) {
      let formData = new FormData();
      formData.append('key', this.key.file);
      formData.append('cert', this.cert.file);
      formData.append('passphrase', this.settingsForm.get('passphrase').value);

      this.loading = this.auth.enableSSL(formData).flatMap(res => {

        // update the local reference to the user so that if we come back here without leaving the settings page the 
        // user will be able to see the uploaded files
        return this.auth.getUser();
      }).subscribe(res => {
        this.loading.unsubscribe();
      });

    } else {
      if (!this.key.error && !this.key.file) {
        this.key.error = 'Key is required';
      }
      if (!this.cert.error && !this.cert.file) {
        this.cert.error = 'Cert is required';
      }
    }
  }

  ngOnInit() {
    this.settingsForm = new FormGroup({
      enable: new FormControl(''),
      passphrase: new FormControl('')
    });

    if (this.auth.user.config.ssl.enable) {
      this.settingsForm.setValue({
        enable: true,
        passphrase: this.auth.user.config.ssl.passphrase || null
      });
      this.key.display = this.auth.user.config.ssl.key.substring(this.auth.user.config.ssl.key.lastIndexOf('\\' || '/') + 1);
      this.cert.display = this.auth.user.config.ssl.cert.substring(this.auth.user.config.ssl.cert.lastIndexOf('\\' || '/') + 1);
    }
  }

}
