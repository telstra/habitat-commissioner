import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-proxy-settings',
  templateUrl: './proxy-settings.component.html',
  styleUrls: ['./proxy-settings.component.scss']
})
export class ProxySettingsComponent implements OnInit {

  settingsForm: FormGroup;
  loading: Subscription;
  showPassword: boolean;

  constructor(
    private auth: AuthService,
    private utils: UtilsService
  ) { }

  save() {
    if (this.settingsForm.valid) {
      this.loading = this.auth.updateProxy(this.settingsForm.value).subscribe(res => {
      }, error => console.error(error));
    } else {
      this.utils.setAsTouched(this.settingsForm);
    }
  }

  ngOnInit() {
    this.settingsForm = new FormGroup({
      enable: new FormControl(false),
      username: new FormControl({ value: '', disabled: true }),
      password: new FormControl({ value: '', disabled: true }),
      scheme: new FormControl({ value: '', disabled: true }),
      host: new FormControl({ value: '', disabled: true }),
      port: new FormControl({ value: '', disabled: true })
    });

    Observable.interval(250).take(1).subscribe(() => {
      let proxySettings = this.auth.user.config.proxy;
      this.settingsForm.setValue({
        enable: proxySettings.enable,
        username: proxySettings.username,
        password: proxySettings.password,
        scheme: proxySettings.scheme,
        host: proxySettings.host,
        port: proxySettings.port
      });
    });

    this.settingsForm.get('enable').valueChanges.subscribe(value => {
      Object.keys(this.settingsForm['controls']).forEach(key => {
        if (key !== 'enable') {
          this.settingsForm.get(key).setValidators(value ? Validators.required : null);
          value ? this.settingsForm.get(key).enable() : this.settingsForm.get(key).disable()
          this.settingsForm.get(key).updateValueAndValidity();
        }
      });
    });
  }

}
