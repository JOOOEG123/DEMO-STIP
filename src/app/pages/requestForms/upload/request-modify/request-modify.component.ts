import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { RequestModification } from 'src/app/core/types/emails.types';

@Component({
  selector: 'app-request-modify',
  templateUrl: './request-modify.component.html',
  styleUrls: ['./request-modify.component.scss'],
})
export class RequestModifyComponent implements OnInit, OnDestroy{
  sub!: Subscription;
  modalRef?: BsModalRef;
  modForm = this.fb.group({
    request: ['', Validators.required],
    email: ['', Validators.required],
    reason: ['', Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private func: AngularFireFunctions
  ) {}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  sendRequestForm() {
    // Example for Yule's request form API call. Please remove function call after checking.
    const payload: RequestModification = {
      email: this.modForm.value.email,
      rightistId: 'A00000000',
      modifyRequest: this.modForm.value.request,
      reasonRequest: this.modForm.value.reason,
      url: location.href,
    };
    this.func
      .httpsCallable('modifyRightistRequest')(payload)
      .subscribe((res) => {
        console.log('Function: ', res);
      });
  }
}
