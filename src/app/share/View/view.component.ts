import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-View-card',
  templateUrl:'./view.component.html',
})
export class ViewComponent implements OnInit {
 @Input() data: any = {} as any;
  constructor() {
  }
  ngOnInit(): void {
  }
}
