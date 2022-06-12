import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    firstName: [''],
    lastName: [''],
    confirmEmail: [''],
  });
  modalRef?: BsModalRef;

  @ViewChild('template') template!: TemplateRef<any>;
  @ViewChild('templateLogout') templateLogout!: TemplateRef<any>;

  isSignIn: 'signin' | 'signup' | 'forgetpassword' = 'signup';
  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private modalService: BsModalService
  ) {}

  openModal(
    template: TemplateRef<any> = this.template) {
    this.modalRef = this.modalService.show(template);
    this.isSignIn = 'signin';
  }

  ngOnInit(): void {
    this.loginForm.setValidators([this.checkEmails]);
    this.loginForm.valueChanges.subscribe((value) => {
      console.log(value);
    });
    this.loginForm.updateValueAndValidity();
  }

  onSubmit() {
    console.log(this.loginForm.value);
  }

  switchState() {
    this.isSignIn = this.isSignIn === 'signin' ? 'signup' : 'signin';
    if (this.isSignIn) {
      this.loginForm.get('confirmEmail')?.clearValidators();
      this.loginForm.get('firstName')?.clearValidators();
      this.loginForm.get('lastName')?.clearValidators();
      this.loginForm.get('firstName')?.updateValueAndValidity();
      this.loginForm.get('lastName')?.updateValueAndValidity();
      this.loginForm.get('confirmEmail')?.updateValueAndValidity();
    } else {
      this.loginForm
        .get('confirmEmail')
        ?.setValidators([Validators.required, Validators.email]);
      this.loginForm.get('firstName')?.setValidators([Validators.required]);
      this.loginForm.get('lastName')?.setValidators([Validators.required]);
      this.loginForm.get('firstName')?.updateValueAndValidity();
      this.loginForm.get('lastName')?.updateValueAndValidity();
      this.loginForm.get('confirmEmail')?.updateValueAndValidity();
    }
  }
  signInWithEmail() {
  }

  signUpwithEmail() {
    if (this.isSignIn === 'signup') {
      this.authService.signUpwithEmail(this.loginForm.value)?.then((x) => {
        console.log('Sign up: ', x);
        this.modalRef?.hide();
      });
    } else if (this.isSignIn === 'signin') {
      this.authService.signInWithEmail(this.loginForm.value)?.then(() => {
        this.modalRef?.hide();
      })
    }
    // this.modalRef?.hide();
  }
  checkEmails(): ValidatorFn {
    console.log('checkEmails');
    const j = (group: AbstractControl): ValidationErrors | null => {
      const email = group?.get('email')?.value;
      const confirmEmail = group?.get('confirmEmail')?.value;
      console.log(email, confirmEmail);
      return email === confirmEmail ? null : { notSame: true };
    };
    return j;
  }

  userGoogleLogin() {
    this.authService.googleSignIn().then(() => {
      this.modalRef?.hide();
    });
  }
}
