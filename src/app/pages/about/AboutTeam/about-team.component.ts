import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  TEAM_PROFILES,
  Profile,
} from 'src/app/pages/about/AboutTeam/about-team.constants';

@Component({
  selector: 'app-about-team',
  templateUrl: './about-team.component.html',
  styleUrls: ['./about-team.component.scss'],
})
export class AboutTeamComponent implements OnInit {
  team_profile: Profile[] = TEAM_PROFILES;
  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    message: ['', Validators.required],
  });
  modalRef?: BsModalRef;
  @ViewChild('contactUsTemplate') contactUsTemplate!: TemplateRef<any>;
  constructor(private fb: FormBuilder, private modalService: BsModalService, private customApi: AngularFireFunctions,) {}

  ngOnInit(): void {}

  openContactUsModal(template: TemplateRef<any> = this.contactUsTemplate) {
    this.modalRef = this.modalService.show(template);
  }

  ngSubmit() {
    console.log(this.contactForm.value);
    this.customApi.httpsCallable('sendGridMail')(this.contactForm.value).subscribe((res) => {
      console.log(res);
      this.modalRef?.hide();
      this.contactForm.reset();
    });
  }
}
