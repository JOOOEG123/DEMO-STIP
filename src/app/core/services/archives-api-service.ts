import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class ArchieveApiService {
  user: any;
  constructor(
    private store: AngularFirestore,
    private auth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private outsideScope: NgZone,
    private http: HttpClient,
  ) {}


  getPublicArchieve() {
    return this.db.list('/persons/public').valueChanges();
  }

  adminAddArchieve(data: any) {
    return this.db.list('/persons/public').push(data);
  }
}
