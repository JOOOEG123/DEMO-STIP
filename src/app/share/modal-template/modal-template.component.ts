import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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

  @ViewChild('logoutModal') logoutModal!: TemplateRef<any>;
  @ViewChild('announceModal') announceModal!: TemplateRef<any>;

  sub: Subscription[] = [];
  announceText!: string;
  constructor(
    private auth: AuthServiceService,
    private modalService: BsModalService,
    private announce: AnnouncementService
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

  logout() {
    this.auth.signOut().then(() => {
      this.modalRef?.hide();
    });
  }

  openLogoutModal(template: TemplateRef<any> = this.logoutModal) {
    this.modalRef = this.modalService.show(template);
  }

  openAnnounceModal(template: TemplateRef<any> = this.announceModal) {
    this.modalRef = this.modalService.show(template);
  }

  updateAnnouncement() {
    this.announce.trackAdminChange(this.announceText).then(() => {
      this.modalRef?.hide();
    });
  }
}
