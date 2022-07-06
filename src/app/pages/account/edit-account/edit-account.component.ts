import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';
import { StorageApIService } from 'src/app/core/services/storage-api.service';
import { finalize, take } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss'],
})
export class EditAccountComponent implements OnInit, OnDestroy {
  userId = this.auth.uid;
  imageUrl!: string | undefined;
  uploadImgProg!: Observable<number | undefined>;

  sub: Subscription[] = [];

  edit_form = this.fb.group({
    nickname: [''],
    firstName: [''],
    lastName: [''],
    email: [''],
    occupation: [''],
    ethnic: [''],
    gender: [''],
    desc: [''],
  });
  constructor(
    private auth: AuthServiceService,
    private storage: StorageApIService,
    private fb: FormBuilder
  ) {}
  ngOnDestroy(): void {
    this.sub.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    try {
      const h = this.storage.profileImgeUrl();
      if (h) {
        this.sub.push(
          h.subscribe((url) => {
            this.imageUrl = url;
          })
        );
      }
      this.fetchuser();
    } catch (error) {
      console.log(error);
      this.fetchuser();
    }
  }

  fetchuser() {
    this.edit_form.get('email')?.disable();
    this.sub.push(
      this.auth.userDetaills.subscribe((user: any) => {
        console.log('Subscribe: ', user);
        this.edit_form.patchValue({
          ...user,
        });
        if (user?.['uid']) {
          this.userId = user['uid'];
        }
      })
    );
  }
  uploadImage(event: any) {
    const file = event.target.files[0];
    this.imageUrl = undefined;
    // this.profileErrors = [];
    // create ref
    const ref = this.storage.profileImage(this.userId);
    const upload = ref.put(file);
    // oberserver per changes
    this.uploadImgProg = upload.percentageChanges();
    // get notified when the download URL is accessable
    upload
      .snapshotChanges()
      .pipe(
        finalize(() => {
          ref
            .getDownloadURL()
            .pipe(take(1))
            .subscribe((url) => {
              this.imageUrl = url;
            });
        })
      )
      .subscribe();
  }

  savechanges() {
    this.auth.editProfile(this.edit_form.value);
  }
}
