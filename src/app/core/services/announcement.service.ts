import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Subject } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {
  message = new Subject();
  constructor(
    private db: AngularFireDatabase,
    private auth: AuthServiceService
  ) {
    this.getAnnounce();
  }

  private getAnnounce() {
    this.db
      .object(`/announcement/announce`)
      .valueChanges()
      .subscribe((x) => {
        this.message.next(x);
      });
  }

  // Update announcement and track which admin made the change.
  trackAdminChange(message: string) {
    return this.db.object(`/announcement`).update({
      track_change: {
        updated_by: this.auth.getUserDetails()?.email || '',
        created_by: new Date().toString(),
        last_updated: new Date().toString(),
      },
      announce: message,
    });
  }
}
