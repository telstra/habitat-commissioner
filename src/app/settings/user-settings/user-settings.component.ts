import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  async open(content) {
    try {
      let result = await this.modalService.open(content, { size: 'lg' }).result;
      if (result) {
        this.auth.deleteUser().subscribe(res => {
          // account deleted
          localStorage.clear();
          this.router.navigateByUrl('/login');
        });
      }
    }
    catch (e) {
      // do nothing on error
    }
  }

  ngOnInit() {
  }

}
