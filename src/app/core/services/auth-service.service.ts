import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as provider from 'firebase/auth';
import { Router } from '@angular/router';
import { EmailPassword, Profile } from '../types/auth.types';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private _hasAdminRole = false;
  private _hasVerifiedEmail = false;

  user: any;
  isLoggedIn = new Subject<boolean>();
  userDetaills = new BehaviorSubject<Profile>({} as Profile);

  isAdmin = new BehaviorSubject<boolean>(false);
  get hasAdminRole() {
    return this._hasAdminRole;
  }

  get hasVerifiedEmail() {
    return this._hasVerifiedEmail || this._hasAdminRole;
  }
  get uid() {
    return this.getUserDetails()?.uid;
  }
  private userDocs(uid: string = this.uid) {
    return this.store.doc<any>(`users/${uid}`);
  }

  get userProviders() {
    return this.getUserDetails()?.providerData?.map((provider) => {
      return provider.providerId;
    });
  }

  get userExternalId() {
    return this.userProviders.includes('google.com', 'facebook.com');
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
          this._hasAdminRole = token.claims?.['admin'];
          this._hasVerifiedEmail = user.emailVerified;
          this.isAdmin.next(this.hasAdminRole || false);
          console.log('is Admin: ', this.hasAdminRole);
          localStorage.setItem(
            'user',
            JSON.stringify({ user: this.user, token: token })
          );
          this.userDocs()
            .valueChanges()
            .subscribe((user) => {
              this.userDetaills.next(user);
            });
          this.isLoggedIn.next(this.isLoggedInCheck);
        });
      } else {
        if (localStorage.getItem('user')) {
          localStorage.removeItem('user');
        }
        this.isLoggedIn.next(this.isLoggedInCheck);
      }
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
    return this.userDocs(p?.uid || '').ref.onSnapshot((snapshot) => {
      if (snapshot.exists && p) {
        snapshot.ref.update({ uid: p.uid });
      } else {
        if (p) {
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
          this.store
            .doc<any>(`users/${p.uid}`)
            .set(profile, { merge: true })
            .then(() => {
              this.userDetaills.next({ ...(profile as any) });
            });
        }
      }
    });
  }

  signOut() {
    return this.auth.signOut().then(() => {
      this._hasAdminRole = false;
      this.isAdmin.next(false);
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    });
  }

  getUserDetails() {
    return JSON.parse(localStorage.getItem('user') || '{}')?.user;
  }

  editProfile(profile: Profile) {
    return this.userDocs().update(profile);
  }

  deleteAccount() {
    return this.auth.currentUser.then((user: any) => {
      if (user) {
        // need to delete all the data from the database and api.
        user.delete();
        this.store
          .doc<any>(`users/${this.uid}`)
          .delete()
          .then(() => {
            user.delete();
            this.signOut();
          })
          .catch((error) => {
            location.reload();
            this.signOut();
          });
      }
    });
  }

  changeEmail(email: string) {
    return this.auth.currentUser.then((user: any) => {
      if (user) {
        user.updateEmail(email).then(() => {
          this.userDocs().update({ email });
        });
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

  userDetails() {
    return this.userDocs().valueChanges();
  }
}
