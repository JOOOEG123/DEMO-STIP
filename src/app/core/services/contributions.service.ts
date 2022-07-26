import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ContributionSchema } from '../types/adminpage.types';
import { UUID } from '../utils/uuid';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class ContributionsService {
  constructor(
    private store: AngularFirestore,
    private auth: AuthServiceService,
    private db: AngularFireDatabase
  ) {}

  private callAPI() {
    return this.db.object(
      `/persons/requestArchieve/contributions/${this.auth.uid}`
    );
  }

  private callAPI_List() {
    return this.db.list(`/persons/requestArchieve/contributions/${this.auth.uid}`, ref => ref.orderByChild('contributedAt'));
    }

  fetchContributorByContributionId(contId: string) {
    return this.db
      .object(
        `/persons/requestArchieve/contributions/${this.auth.uid}/${contId}`
      )
      .valueChanges();
  }

  fetchUserContributions() {
    return this.callAPI_List().valueChanges();
  }

  editUserContributions(contributionId: string, obj: ContributionSchema) {
    obj.rightist!.lastUpdatedAt = new Date();
    return this.callAPI().update({ [contributionId]: obj });
  }

  addUserContributions(obj: ContributionSchema) {
    const st = this.callAPI();
    const contributionId = UUID();
    obj.contributionId = contributionId;
    obj.contributedAt = new Date();
    obj.contributorId = this.auth.uid;
    obj.publish = 'new';
    return st.update({ [contributionId]: obj }).catch((e) => {
      return st.set({ [contributionId]: obj });
    });
  }

  contributionsAddEdit(obj: ContributionSchema) {
    if (obj.contributionId) {
      return this.editUserContributions(obj.contributionId, obj);
    } else {
      return this.addUserContributions(obj);
    }
  }

  removeAllUserContributions() {
    return this.callAPI().remove();
  }

  // remove method 1
  removeContributionById(id: string) {
    return this.db
      .object(`/persons/requestArchieve/contributions/${this.auth.uid}/${id}`)
      .remove();
  }

  // Admin get all contribution
  fetchAllContributions(language: string) {
    return this.db
      .object(`/persons/data/${language}/contributions`)
      .valueChanges();
  }

  fetchAllContributionsList(language: string) {
    return this.db
      .list(`/persons/data/${language}/contributions`)
      .valueChanges();
  }

  addOrUpdateUserContribution(
    language: string,
    contributorId: string,
    contributionId: string,
    obj: ContributionSchema
  ) {
    return this.db
      .object(`/persons/data/${language}/contributions/${contributorId}`)
      .update({ [contributionId]: obj });
  }

  getUserContribution(
    language: string,
    contributorId: string,
    contributionId: string
  ) {
    return this.db
      .object(`/persons/data/${language}/contributions/${contributorId}/${contributionId}`)
      .valueChanges()
  }

  getUserContributionByAuth(language: string, contributionId: string) {
    return this.db
    .object(`/persons/data/${language}/contributions/${this.auth.uid}/${contributionId}`)
    .valueChanges()
  }

  removeUserContribution(
    language: string,
    contributorId: string,
    contributionId: string
  ) {
    return this.db
      .object(`/persons/data/${language}/contributions/${contributorId}/${contributionId}`)
      .remove()
  }
}
