import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { RightistSchema } from 'src/app/core/types/adminpage.types';

interface FilterData {
  filter: string,
  count: number
}

@Component({
  selector: 'app-about-research',
  templateUrl: './about-research.component.html',
  styleUrls: ['./about-research.component.scss']
})
export class AboutResearchComponent implements OnInit, OnDestroy {
  dataLoaded?: boolean = false

  total?: number
  rightistSubscription?: Subscription
  maleRightistList: RightistSchema[] = []
  femaleRightistList: RightistSchema[] = []

  rightist1957List: RightistSchema[] = []
  rightist1958List: RightistSchema[] = []
  rightist1959List: RightistSchema[] = []

  rightistYearData: FilterData[] = [];
  genderData: FilterData[] = [];

  constructor(
    private archiveAPI: ArchieveApiService
  ) { }

  ngOnInit(): void {
    this.rightistSubscription = this.archiveAPI.getArchiveList().subscribe((data: any) => {

      this.total = data.length
      this.maleRightistList = data.filter(x => x.gender == 'male')
      this.femaleRightistList = data.filter(x => x.gender == 'female')
      this.rightist1957List = data.filter(x => x.rightistYear == 1957)
      this.rightist1958List = data.filter(x => x.rightistYear == 1958)
      this.rightist1959List = data.filter(x => x.rightistYear == 1959)

      this.rightistYearData = [
        { filter: '1957', count: this.rightist1957List.length },
        { filter: '1958', count: this.rightist1958List.length },
        { filter: '1959', count: this.rightist1959List.length },
        { filter: 'unknown', count: this.total! - this.rightist1957List.length - this.rightist1958List.length - this.rightist1959List.length },
      ]

      this.genderData = [
        { filter: 'male', count: this.maleRightistList.length },
        { filter: 'female', count: this.femaleRightistList.length },
        { filter: 'unknown', count: this.total! - this.maleRightistList.length - this.femaleRightistList.length }
      ]
    })
  }

  ngOnDestroy() {
    this.rightistSubscription?.unsubscribe()
  }

}
