import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  modalRef?: BsModalRef;

  @ViewChild('logoutModal') logoutModal!: TemplateRef<any>;
  constructor(
    private auth: AuthServiceService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {}

  logout() {
    this.auth.signOut().then(() => {
      this.modalRef?.hide();
    });
  }
  openModal(template: TemplateRef<any> = this.logoutModal) {
    this.modalRef = this.modalService.show(template);
  }
}
