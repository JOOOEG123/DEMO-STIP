import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Image } from 'src/app/core/types/adminpage.types';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {
  @Input() image?: Image
  @Output() close: EventEmitter<any> = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
    console.log(this.image)
  }

  onClose() {
    this.close.emit('close')
  }

}
