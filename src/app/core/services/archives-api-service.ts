import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
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
    private http: HttpClient
  ) {}

  getArchieveByAlphabet(alphabet: string) {
    return this.db.list(`/persons/publics/${alphabet}`).valueChanges();
  }

  getArchieveEventsByAlphabet(alphabet: string) {
    return this.db.list(`/persons/publics/${alphabet}/events`).valueChanges();
  }

  getArchievePersonByAlphabet(alphabet: string) {
    return this.db.list(`/persons/publics/${alphabet}/persons`).valueChanges();
  }

  getEventByAlphabetAndEventId(alphabet: string, id: string) {
    return this.db
      .list(`/persons/publics/${alphabet}/events`, (ref) =>
        ref.orderByChild('event_id').equalTo(id)
      )
      .valueChanges();
  }

  getEventByAlphabetAndPersonId(alphabet: string, id: string) {
    return this.db
      .list(`/persons/publics/${alphabet}/events`, (ref) =>
        ref.orderByChild('person_id').equalTo(id)
      )
      .valueChanges();
  }

  getPersonByAlphabetAndPersonId(alphabet: string, id: string) {
    return this.db
      .list(`/persons/publics/${alphabet}/persons`, (ref) =>
        ref.orderByChild('person_id').equalTo(id)
      )
      .valueChanges();
  }

  // Admin Functions
  adminAddPersonByAlphabet(alphabet: string, data: any) {
    return this.db.list(`/persons/publics/${alphabet}/persons`).push(data);
  }

  adminAddEventByAlphabet(alphabet: string, data: any) {
    return this.db.list(`/persons/publics/${alphabet}/events`).push(data);
  }
  // if we use array format, we can use push() to add new item
  // Ex: [{}, {}, {}]
  adminUpdatePersonByAlphabetAndPersonId(alphabet: string, data: any) {
    var ref = this.db.database.ref(`/persons/publics/${alphabet}/persons`);
    return ref
      .orderByChild('person_id')
      .equalTo(data.person_id)
      .once('value', function (snapshot) {
        snapshot.forEach(function (e) {
          e.ref.update(data);
        });
      });
    // return this.db.list(`/persons/publics/${alphabet}/persons`, (ref) =>  ref.orderByChild('person_id').equalTo(data.person_id)).update(data.person_id, data);
  }

  // key value pair is person_id: data. Scenario: update person_id: 1 to data: {name: "new name"}
  // if we use object. key is person_id, we can use update() to update person_id: 1 to data: {name: "new name"}
  // Ex : {A1: {}, A2: {}, A3: {}}
  adminUpdateEventByAlphabetAndEventId(alphabet: string, data: any) {
    this.db
      .object(`/persons/publics/${alphabet}/events/${data.event_id}`)
      .update(data);
  }
  adminUpdateEventByAlphabetAndPersonId(alphabet: string, data: any) {
    this.db
      .object(`/persons/publics/${alphabet}/persons/${data.person_id}`)
      .update(data);
  }

  getPersonsByLetter(letter: string, limit: number) {
    return this.db.list(`/persons/publics/${letter}/persons`, ref => ref.limitToFirst(limit)).valueChanges();
  }

//   getPersonEventsByLetter(letter: string)
 }
