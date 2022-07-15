import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';
import { Image } from 'src/app/core/types/adminpage.types';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {
  @Input() image?: Image
  @Output() close: EventEmitter<any> = new EventEmitter()
  constructor(private auth: AuthServiceService) { }

  isAdmin: boolean = false
  isEditMode: boolean = false

  title?: string
  detail?: string
  source?: string

  ngOnInit(): void {
    console.log(this.image)
    this.auth.isAdmin.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    })
  }

  onClose() {
    this.close.emit('close')
  }

  onEdit() {
    this.isEditMode = true
    this.title = this.image?.galleryTitle
    this.detail = this.image?.galleryDetail
    this.source = this.image?.gallerySource
  }

  onRemove() {

  }

}
