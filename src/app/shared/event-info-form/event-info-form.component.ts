import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';
import { FormCustomProvider } from 'src/app/core/utils/helper';

@Component({
  selector: 'app-event-info-form',
  templateUrl: './event-info-form.component.html',
  providers: [FormCustomProvider(EventInfoFormComponent)],
})
export class EventInfoFormComponent implements OnInit, ControlValueAccessor {
  private _disabled: boolean = false;
  private newEvent(a = {} as any): FormGroup {
    return this.formBuilder.group({
      startYear: this.formBuilder.control(a.startYear || ''),
      event: this.formBuilder.control(a.event || ''),
      otherEvent: this.formBuilder.control(a.otherEvent || ''),
    });
  }
  eventArray = this.formBuilder.array([]);
  sub: Subscription[] = [];
  subLang: Subscription[] = [];
  subImageChange: Subscription[] = [];
  isAdmin: boolean = false;

  profileControl = this.formBuilder.control('');

  language?: string;
  otherLanguage?: string;

  get controls(): FormGroup[] {
    return this.eventArray.controls as FormGroup[];
  }

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthServiceService,
    private transService: TranslateService
  ) {}

  ngOnInit(): void {
    this.sub.push(
      this.auth.isAdmin.subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      })
    );
    this.language = this.transService.currentLang;
    this.otherLanguage = this.language === 'en' ? 'cn' : 'en';
    this.subLang.push(
      this.transService.onLangChange.subscribe((lang) => {
        this.language = lang.lang;
        this.otherLanguage = lang.lang === 'en' ? 'cn' : 'en';
      })
    );
  }

  onChange = (imageArray) => {};

  onTouched = (event) => {};

  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  writeValue(obj: any[]): void {
    if (obj) {
      if (obj.length > 0) {
        this.eventArray.setParent(
          this.formBuilder.array(obj.map((item) => this.newEvent(item)))
        );
        this.eventArray.patchValue(obj);
      }
      if (this.eventArray.controls.length === 0) {
        this.addEvent();
      }
      this.eventsChange();
    } else {
      this.eventArray.controls = [];
      if (this.eventArray.controls.length === 0) {
        this.addEvent();
        this.eventsChange();
      }
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  addEvent() {
    this.eventArray.push(this.newEvent());
  }

  remove(i: number) {
    this.eventArray.removeAt(i);
  }
  onImageCategoryChange(data: any, i: number) {}

  eventsChange() {
    this.subImageChange.forEach((sub) => sub.unsubscribe());
    this.onChange(this.eventArray.value);
    this.subImageChange.push(
      this.eventArray.valueChanges.subscribe((data) => {
        console.log(data);
        this.onChange(data);
      })
    );
  }
}
