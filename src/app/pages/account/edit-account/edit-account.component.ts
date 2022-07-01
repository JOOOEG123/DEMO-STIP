import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';
import { StorageApIService } from 'src/app/core/services/storage-api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss'],
})
export class EditAccountComponent implements OnInit {
  userId = this.auth.uid;
  imageUrl!: Observable<string> | undefined;
  uploadImgProg!: Observable<number | undefined>;
  constructor(
    private auth: AuthServiceService,
    private storage: StorageApIService
  ) {
    this.imageUrl = this.storage.profileImgeUrl();
  }

  ngOnInit(): void {}
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
          this.imageUrl = ref.getDownloadURL();
        })
      )
      .subscribe();
  }
}
