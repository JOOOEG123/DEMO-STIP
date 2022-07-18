import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';
import { Image } from 'src/app/core/types/adminpage.types';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
})
export class OverlayComponent implements OnInit {
  @Input() status?: string;
  @Input() image?: Image;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() update: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() remove: EventEmitter<any> = new EventEmitter();

  modalRef?: BsModalRef;

  constructor(private auth: AuthServiceService) {}

  isAdmin: boolean = false;
  isEditMode: boolean = false;

  title: string = '';
  detail: string = '';
  source: string = '';

  ngOnInit(): void {
    this.auth.isAdmin.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }

  onClose() {
    this.close.emit({
      status: 'close',
    });
  }

  onEdit() {
    this.isEditMode = true;
    this.title = this.image!.galleryTitle;
    this.detail = this.image!.galleryDetail;
    this.source = this.image!.gallerySource;
  }

  onSubmit() {
    this.submit.emit({
      image: {
        ...this.image,
        galleryTitle: this.title,
        galleryDetail: this.detail,
        gallerySource: this.source,
      },
      status: 'submit',
    });
  }

  onRemove() {
    this.remove.emit({
      status: 'remove',
    });
  }

  onUpdate() {
    this.update.emit({
      image: this.image,
      status: 'update',
    });
  }

  onDelete() {
    this.delete.emit({
      image: this.image,
      status: 'delete',
    });
  }

  onCancel() {
    this.cancel.emit({
      status: 'cancel',
    });
  }
}
