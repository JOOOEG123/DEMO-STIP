import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as provider from 'firebase/auth';
import { Router } from '@angular/router';
import { EmailPassword, Profile } from '../types/auth.types';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private _hasAdminRole = false;

  user: any;
  isLoggedIn = new Subject<boolean>();
  readonly uid = this.getUserDetails()?.uid;

  isAdmin = new BehaviorSubject<boolean>(false);
  get hasAdminRole() {
    return this._hasAdminRole;
  }
  constructor(
    private store: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    private outsideScope: NgZone
  ) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        user.getIdTokenResult().then((token) => {
          console.log('token', token, this.user);
          this._hasAdminRole = token.claims?.['admin'];
          this.isAdmin.next(this.hasAdminRole || false);
          localStorage.setItem(
            'user',
            JSON.stringify({ user: this.user, token: token })
          );
          this.isLoggedIn.next(this.isLoggedInCheck);
        });
      } else {
        localStorage.clear();
        this.isLoggedIn.next(this.isLoggedInCheck);
      }
      console.log('user', user);
    });
  }

  get isLoggedInCheck(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.user !== null && user.token != null && user.user.uid
      ? true
      : false;
  }

  signInWithEmail({ email, password }: { email: string; password: string }) {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then(async (user) => {
        this.saveUser(user.user as Profile | null);
        this.sendEmailVerification();
      });
  }

  sendEmailVerification() {
    this.auth.currentUser.then((user) => {
      if (user && !user.emailVerified) {
        user.sendEmailVerification();
      }
    });
  }

  forgetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }

  googleSignIn() {
    return this.auth
      .signInWithPopup(new provider.GoogleAuthProvider())
      .then((user) => {
        this.saveUser(user.user as Profile | null);
      });
  }

  facebookSignIn() {
    return this.auth
      .signInWithPopup(new provider.FacebookAuthProvider())
      .then((user) => {
        this.saveUser(user.user as Profile | null);
      });
  }
  
  signInWithPopup(providers: provider.AuthProvider) {
    return this.auth.signInWithPopup(providers).then((user) => {
      console.log('user', user);
      this.outsideScope.run(() => {
        this.router.navigate(['/']);
      });
      this.saveUser(user.user as Profile | null);
    });
  }

  signUpwithEmail(profile: EmailPassword) {
    if (profile.email && profile.password) {
      return this.auth
        .createUserWithEmailAndPassword(profile.email, profile?.password)
        .then((user) => {
          this.saveUser(user.user as Profile | null);
        });
    }
    return null;
  }

  saveUser(p: Profile | null) {
    if (p) {
      console.log('save user', p);
      const profile = {
        uid: p.uid || '',
        name: p.name || '',
        email: p.email || '',
        emailVerified: p.emailVerified || '',
        avatarUrl: p.photoURL || '',
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        nickname: p.displayName || '',
        lastLoginAt: p.lastLoginAt || '',
        createdAt: p.createdAt || '',
        updatedAt: p.updatedAt || '',
      };
      console.log('profile', profile);
      return this.store
        .doc<any>(`users/${p.uid}`)
        .set(profile, { merge: true });
    }
    return null;
  }

  signOut() {
    return this.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    });
  }

  getUserDetails() {
    return JSON.parse(localStorage.getItem('user') || '{}')?.user;
  }

  editProfile(profile: Profile) {
    return this.store.doc<any>(`users/${profile.uid}`).update(profile);
  }

  deleteAccount() {
    return this.auth.currentUser.then((user: any) => {
      if (user) {
        // need to delete all the data from the database and api.
        this.store.doc<any>(`users/${this.uid}`).delete().then(() => {
          user.delete();
          this.signOut();
        });
      }
    });
  }

  changeEmail(email: string) {
    return this.auth.currentUser.then((user: any) => {
      if (user) {
        this.store.doc<any>(`users/${this.uid}`).update({ email });
        user.updateEmail(email);
      }
    });
  }

  changePassword(password: string) {
    return this.auth.currentUser.then((user: any) => {
      if (user) {
        user.updatePassword(password);
      }
    });
  }
}
