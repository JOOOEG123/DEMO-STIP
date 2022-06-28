import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {
  userId = this.auth.uid;
  constructor(private auth: AuthServiceService) { }

  ngOnInit(): void {

  }
}
