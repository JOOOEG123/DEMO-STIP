import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as provider from 'firebase/auth';
import { Router } from '@angular/router';
import { Profile } from '../types/auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  user: any;
  constructor(
    private store: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    private outsideScope: NgZone
  ) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', '');
      }
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  signInWithEmail({ email, password }: { email: string; password: string }) {
    this.auth.signInWithEmailAndPassword(email, password).then((user) => {
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
      return this.store.doc<any>(`users/${p.uid}`).set(profile, { merge: true });
    }
    return null
  }

  signOut() {
    this.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    });
  }
}
