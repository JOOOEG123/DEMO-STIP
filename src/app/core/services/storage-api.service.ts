import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class StorageApIService {
  constructor(
    private afs: AngularFireStorage,
    private auth: AuthServiceService
  ) {}

  profileImage(fileName: string, uid = this.auth.uid) {
    return this.afs.ref(`userProfile/${fileName}/${uid}`);
  }

  profileImgeUrl(uid = this.auth.uid) {
    console.log('uid', uid);
    return this.profileImage(uid, 'profile_img').getDownloadURL();
  }

  uploadProfileImage(file: File, uid = this.auth.uid) {
    const ref = this.profileImage(uid, 'profile_img');
    const upload = ref.put(file);
    return upload;
  }
}
