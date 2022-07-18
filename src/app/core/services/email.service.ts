import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

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
