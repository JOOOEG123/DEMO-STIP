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
  user: any;
  isLoggedIn = new Subject<boolean>();
  constructor(
    private store: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    private outsideScope: NgZone,
    private http: HttpClient
  ) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        user.getIdTokenResult().then((token) => {
          console.log('token', token, this.user);
          localStorage.setItem(
            'user',
            JSON.stringify({ user: this.user, token: token })
          );
          this.isLoggedIn.next(this.isLoggedInCheck);
        });
      } else {
        localStorage.setItem('user', '');
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
      .then((user) => {
        this.saveUser(user.user as Profile | null);
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
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  editProfile(profile: Profile) {
    return this.store.doc<any>(`users/${profile.uid}`).update(profile);
  }
}
