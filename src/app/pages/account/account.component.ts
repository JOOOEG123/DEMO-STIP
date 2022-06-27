import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {
  subscription: Subscription[] = [];
  isAdmin = false;
  // @ViewChild('modalTemplates') modalTemplates!: LogoutComponent;
  constructor(private auth: AuthServiceService) {}
  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscription.push(
      this.auth.isAdmin.subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      })
    );
  }
}
