import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FilterTypes } from 'src/app/core/types/filters.type';
import { GROUPS,OCCUPATIONS} from './browse-search-filter.constant';
import {MainBrowseComponent} from 'src/app/pages/browse/main-browse/main-browse.component';

var STATUS = [
  { id:1, value: 'deceased', name: 'Deceased', checked:false},
  { id:2, value: 'unknown', name: 'Unknown', checked: false},
];

@Component({
  selector: 'app-browse-search-filter',
  templateUrl: './browse-search-filter.component.html',
  styleUrls: ['./browse-search-filter.component.scss']
})
export class BrowseSearchFilterComponent implements OnInit {
  private FILTERS: FilterTypes = {} as FilterTypes;
  drop!: boolean;
  radioSelected: any;
  formValues = this.formgroup.group({
    gender: [''],
    occupation: [''],
    status: [''],
    group: [''],
    date: [''],
  });
  groups = GROUPS;
  occupations = OCCUPATIONS
  statues= STATUS
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

      console.log("subforming")
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

  resetRadio(index: any){
    console.log("in reset ratio",this.formValues)
    //this.formValues.controls['status'].reset()
    console.log(this.statues[index].checked)
    console.log(this.statues[index])
      // this.statues[index].checked = !this.statues[index].checked
      // this.formValues.controls['status'].reset('')
      // console.log("printing formvalues",this.formValues.value)

    
    console.log("end reset ratio")

    if (index == 1) {
      // deselect

        this.statues[index].checked = !this.statues[index].checked
      

      if (this.statues[2].checked) {
        this.statues[2].checked = !this.statues[2].checked
      }
    }
    else {
      // deselect
  
        this.statues[index].checked = !this.statues[index].checked
      
      if (this.statues[1].checked) {
        this.statues[1].checked = !this.statues[1].checked
      }
    }
 }
}
