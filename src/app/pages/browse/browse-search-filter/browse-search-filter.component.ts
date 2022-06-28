import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FilterTypes } from 'src/app/core/types/filters.type';
import { GROUPS,OCCUPATIONS} from './browse-search-filter.constant';
import {MainBrowseComponent} from 'src/app/pages/browse/main-browse/main-browse.component';



@Component({
  selector: 'app-browse-search-filter',
  templateUrl: './browse-search-filter.component.html',
  styleUrls: ['./browse-search-filter.component.scss']
})
export class BrowseSearchFilterComponent implements OnInit {
  private FILTERS: FilterTypes = {} as FilterTypes;
  drop!: boolean;

  formValues = this.formgroup.group({
    gender: [''],
    occupation: [''],
    status: [''],
    group: [''],
    date: [''],
  });
  groups = GROUPS;
  occupations = OCCUPATIONS
  
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
      let date='';
      if ( value.date) {
      
        value.date = [new Date(value.date[0]),new Date(value.date[1])];
      }

      console.log("subforming",value)
      this.filterValues = {...value, date} as any;
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
      date: '',
    });
  }

}
