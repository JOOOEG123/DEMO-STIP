import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TranslateService } from '@ngx-translate/core';
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
    private db: AngularFireDatabase,
    private translateService: TranslateService
  ) {}

  private callAPI() {
    return this.db.object(
      `/persons/requestArchieve/contributions/${this.auth.uid}`
    );
  }

  private callAPI_List() {
    return this.db.list(
      `/persons/requestArchieve/contributions/${this.auth.uid}`,
      (ref) => ref.orderByChild('contributedAt')
    );
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
    obj.lastUpdatedAt = new Date();
    return this.callAPI().update({ [contributionId]: obj });
  }

  addUserContributions(obj: ContributionSchema) {
    const st = this.callAPI();
    const contributionId = UUID();
    obj.contributionId = contributionId;
    obj.contributedAt = new Date();
    // obj.contributorId = [this.auth.uid];
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
  fetchAllContributions() {
    return this.db
      .object(`/persons/requestArchieve/contributions`)
      .valueChanges();
  }

  updateUserContribution(
    contributorId: string,
    contributionId: string,
    obj: ContributionSchema
  ) {
    return this.db
      .object(`/persons/requestArchieve/contributions/${contributorId}`)
      .update({ [contributionId]: obj });
  }

  // Admin get all contribution
  fetchAllContributionsNew(language: string) {
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
      .object(
        `/persons/data/${language}/contributions/${contributorId}/${contributionId}`
      )
      .valueChanges();
  }

  getUserContributionByAuth(language: string, contributionId: string) {
    return this.db
      .object(
        `/persons/data/${language}/contributions/${this.auth.uid}/${contributionId}`
      )
      .valueChanges();
  }
  getUserContributionBy(language: string) {
    return this.db
      .list(`/persons/data/${language}/contributions/${this.auth.uid}`)
      .valueChanges();
  }

  removeUserContribution(
    language: string,
    contributorId: string,
    contributionId: string
  ) {
    return this.db
      .object(
        `/persons/data/${language}/contributions/${contributorId}/${contributionId}`
      )
      .remove();
  }

  async removeUserContributionById(
    id: string,
    language: string = this.translateService.currentLang,
    contributorId: string = this.auth.uid
  ) {
    await Promise.all([
      this.db
        .object(
          `/persons/data/${language}/contributions/${contributorId}/${id}`
        )
        .remove(),
      this.db
        .object(
          `/persons/data/${
            language === 'en' ? 'cn' : 'en'
          }/contributions/${contributorId}/${id}`
        )
        .remove(),
    ]);
  }
}
