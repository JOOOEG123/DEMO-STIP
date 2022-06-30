import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UUID } from '../utils/uuid';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class ContributionsService {
  uid = this.auth.getUserDetails()?.uid;
  constructor(
    private store: AngularFirestore,
    private auth: AuthServiceService
  ) {}

  private callAPI() {
    return this.store.doc<any>(`contributions/${this.uid}`);
  }
  fetchUserContributions() {
    return this.callAPI().valueChanges();
  }

  editUserContributions(id: string, obj: any) {
    return this.store
      .doc<any>(`contributions/${this.uid}`)
      .update({ [id]: obj });
  }

  addUserContributions(obj: any) {
    console.log(this.uid);
    // console.log('gok', this.auth.getUserDetails())
    const st = this.callAPI();
    const uuid = UUID();
    return st.update({ [uuid]: obj }).catch((e) => {
      return st.set({ [uuid]: obj });
    });
  }

  removeAllUserContributions() {
    return this.callAPI().delete();
  }
  // remove method 1
  removeContributionById(id: string) {
    return this.callAPI().ref.onSnapshot((x) => {
      const v = x.data();
      if (v?.[id]) {
        delete v[id];
      }
      x.ref.set(v);
    });
  }
  // remove method 2
  removeContributionsById(id: string) {
    const s = this.fetchUserContributions().subscribe((x) => {
      if (x?.[id]) {
        delete x[id];
      }
      this.callAPI()
        .set(x)
        .then(() => {
          s.unsubscribe();
        });
    });
  }

  // Admin get all contribution
  fetchAllContribution() {
    return this.store.collection<any>('contributions').valueChanges();
  }
}
