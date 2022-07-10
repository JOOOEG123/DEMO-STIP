import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(
    private func: AngularFireFunctions
  ) {}

  sendEmail( subject: string, text: string) {
    return this.func.httpsCallable('genericEmail')({ subject, text });
  }

}
