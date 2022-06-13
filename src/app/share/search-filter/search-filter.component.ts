import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FilterTypes } from 'src/app/core/types/filters.type';
import { GROUPS } from './search-filter.constant';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
})
export class SearchFilterComponent implements OnInit, OnDestroy {
  private FILTERS: FilterTypes = {} as FilterTypes;
  drop!: boolean;
  formValues = this.formgroup.group({
    gender: [''],
    occupation: [''],
    status: [''],
    group: [''],
    year: [''],
  });
  groups = GROUPS;
  formSub!: Subscription;

  @Output() filterValuesChange = new EventEmitter<any>();

  @Input()
  get filterValues() {
    return this.FILTERS;
  }
  set filterValues(value: FilterTypes) {
    this.FILTERS = value;
    this.formSub?.unsubscribe();
    this.formValues.patchValue(value);
    this.subForm();
  }

  constructor(private formgroup: FormBuilder) {}

  ngOnDestroy(): void {
    this.formSub?.unsubscribe();
  }

  ngOnInit(): void {}

  subForm() {
    this.formSub = this.formValues.valueChanges.subscribe((value) => {
      this.filterValues = value;
      this.filterValuesChange.emit(value);
    });
  }

  updateCollapse() {
    this.drop = !this.drop;
  }

  submit() {
    this.filterValuesChange.emit(this.formValues.value);
  }

  clear() {
    this.formValues.reset({
      gender: '',
      occupation: '',
      status: '',
      group: '',
      year: '',
    });
  }
}
