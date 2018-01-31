import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserInterface } from '../models/user.interface';
import { Animations } from '../animations/animations';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [Animations.flyInOut]
})
export class SettingsComponent implements OnInit {

  selectedSetting: string = 'config';
  menuActive: boolean;

  constructor(
    private router: Router
  ) { }

  navigate(dest) {
    this.router.navigateByUrl(dest);
  }

  ngOnInit() {
  }

}
