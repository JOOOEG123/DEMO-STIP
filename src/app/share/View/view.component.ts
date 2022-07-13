import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contribution, Rightist } from 'src/app/core/types/adminpage.types';

@Component({
  selector: 'app-View-card',
  templateUrl:'./view.component.html',
})
export class ViewComponent implements OnInit {
 @Input() data: Contribution = {} as Contribution;
  constructor(private router: Router) {
  }
  ngOnInit(): void {
  }
}
