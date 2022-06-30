import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { AnnouncementService } from 'src/app/core/services/announcement.service';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';

@Component({
  selector: 'app-modal-template',
  templateUrl: './modal-template.component.html',
  styleUrls: ['./modal-template.component.scss'],
})
export class ModalTemplateComponent implements OnInit {
  modalRef?: BsModalRef;

  @ViewChild('announceModal') announceModal!: TemplateRef<any>;
  @ViewChild('changeEmailTemplate') changeEmailTemplate!: TemplateRef<any>;
  @ViewChild('deleteConfirmation') deleteConfirmation!: TemplateRef<any>;
  @ViewChild('logoutModal') logoutModal!: TemplateRef<any>;

  changeEmailForm = this.formBuilder.group({
    newEmail: ['', [Validators.required, Validators.email]],
    oldEmail: ['', [Validators.required, Validators.email]],
  });

  sub: Subscription[] = [];
  announceText!: string;
  constructor(
    private auth: AuthServiceService,
    private modalService: BsModalService,
    private announce: AnnouncementService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // For annuncement template.
    this.sub.push(
      this.announce.message.subscribe((x: any) => {
        this.announceText = x;
      })
    );

    // unsubscribe from all observable.
    if (this.modalRef?.onHidden) {
      this.sub.push(
        this.modalRef.onHidden.subscribe(() => {
          this.sub?.forEach((x) => x?.unsubscribe());
        })
      );
    }
  }

  // open Modals
  openLogoutModal(template: TemplateRef<any> = this.logoutModal) {
    this.modalRef = this.modalService.show(template);
  }

  openAnnounceModal(template: TemplateRef<any> = this.announceModal) {
    this.modalRef = this.modalService.show(template);
  }
  openDeleteConfirmModal(template: TemplateRef<any> = this.deleteConfirmation) {
    this.modalRef = this.modalService.show(template);
  }

  openChangeEmailModal(template: TemplateRef<any> = this.changeEmailTemplate) {
    this.modalRef = this.modalService.show(template);
  }

  // function to close modal

  changeEmail() {
    this.auth.changeEmail(this.changeEmailForm.value.newEmail);
  }

  deleteAccount() {
    this.auth.deleteAccount().then(() => {
      this.modalRef?.hide();
    });
  }

  logout() {
    this.auth.signOut().then(() => {
      this.modalRef?.hide();
    });
  }

  updateAnnouncement() {
    this.announce.trackAdminChange(this.announceText).then(() => {
      this.modalRef?.hide();
    });
  }
}
