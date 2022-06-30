import {
  animate,
  AnimationEvent,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import {
  Categories,
  CategoryList,
  Contribution,
  ContributionSchema,
  Publish,
} from 'src/app/core/types/adminpage.types';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss'],
  animations: [
    trigger('contributionAnimation', [
      state('void', style({ opacity: 1 })),
      state('removed', style({ opacity: 0, display: 'none' })),
      transition('void -> removed', animate('800ms ease-in-out')),
    ]),
  ],
})
export class ApprovalComponent implements OnInit, OnDestroy {
  currentState: string = 'void';

  newContributions: Contribution[] = []
  approvedContributions: Contribution[] = []
  rejectedContributions: Contribution[] = []

  selectedContributions: Contribution[] = []

  activeCategory!: Categories;
  selectedContribution!: Contribution;

  categoriesList: Categories[] = [
    'New Contributions',
    'Approved Contributions',
    'Rejected Contributions',
  ];
  categories: CategoryList = {
    'New Contributions': this.newContributions,
    'Approved Contributions': this.approvedContributions,
    'Rejected Contributions': this.rejectedContributions,
  };

  disabled: boolean = false
  modalRef?: BsModalRef;
  
  subcription?: Subscription
  contributions: any[] = []
  publish: Publish = 'new'
  isLoaded: boolean = false
  limit: number = 3

  emptyContributionMessage = "Nothing Here!"

  constructor(
    private modalService: BsModalService,
    private archApi: ArchieveApiService
  ) {
    this.selectedContributions = this.newContributions;
    this.activeCategory = 'New Contributions';
  }

  ngOnInit(): void { 
    //  console.log(this.archApi.addContribution(result))
    // this.archApi.getContributions().snapshotChanges((data: any) => {
    //   console.log(data)
    // })

  
    this.subcription = this.archApi.getContributions().subscribe(data => {
      
      this.newContributions.length = 0
      this.approvedContributions.length = 0
      this.rejectedContributions.length = 0
      this.contributions = data as any[]
      
      console.log(this.contributions)
    
      for (let contributionId in this.contributions) {

        let contribution = this.contributions[contributionId]
        let data: Contribution = {
          ...this.contributions[contributionId],
          contributionId: contributionId,
          state: 'void',
        }
  
        data.contributedAt = new Date(contribution.contributedAt)

        if (contribution.publish == 'new') {
          this.newContributions.push(data)
        }

        if (contribution.publish == 'approved') {
          this.approvedContributions.push(data)
        }

        if (contribution.publish == 'rejected') {
          this.rejectedContributions.push(data)
        }
      }
      // this.selectedContributions =  JSON.parse(JSON.stringify(this.newContributions));

      // console.log(this.selectedContributions, this.newContributions, this.approvedContributions, this.rejectedContributions)
    })
  }

  ngOnDestroy(): void {
    this.subcription?.unsubscribe()
  }
  

  onApprove(contributionId: string) {
    this.publish = 'approved'
    const index = this.selectedContributions.findIndex(
      (contribution) => contribution.contributionId == contributionId
    );
    this.selectedContribution = this.newContributions[index];
    this.selectedContribution.state = 'removed';
    // this.approvedContributions.unshift(this.selectedContribution)
  }

  // onEdit(template: TemplateRef<any>, rightistId: string) {
  //   this.modalRef = this.modalService.show(template);
  // }

  // onPending(victimId: string) {
  //   const index = this.selectedContributions.findIndex(
  //     (contribution) => contribution.contributionId == victimId
  //   )
  //   this.selectedContribution = this.newContributions[index];
  //   this.selectedContribution.state = 'removed';
  //   this.pendingContributions.unshift(this.selectedContribution);
  // }

  onReject(contributionId: string) {
    this.publish = 'rejected'

    const index = this.selectedContributions.findIndex(
      (contribution) => contribution.contributionId == contributionId
    );
    // if (index == -1) {
    //   const i = this.pendingContributions.findIndex(
    //     (contribution) => contribution.contributionId == contributionId
    //   )
    //   this.selectedContribution = this.pendingContributions[i]
    //   this.selectedContribution.state = 'removed'
    //   this.rejectedContributions.unshift(this.selectedContribution)
    // }
   
    this.selectedContribution = this.newContributions[index];
    this.selectedContribution.state = 'removed';
    // this.rejectedContributions.unshift(this.selectedContribution); 
    // this.archApi.updateContributionPublishAttribute(this.selectedContribution.contributionId, publish)
  }

  onReconsider(contributionId: string) {
    const index = this.selectedContributions.findIndex(
      (contribution) => contribution.contributionId = contributionId
    )
    this.selectedContribution = this.rejectedContributions[index]
    this.selectedContribution.state = 'removed'
    // this.newContributions.unshift(this.selectedContribution)
  }

  setActiveCategory(category: Categories) {
    // const index = this.selectedContributions.findIndex(
    //   (contribution) => contribution.contributionId == this.selectedContribution?.contributionId
    // )

    // if (index != -1) {
    //   this.selectedContributions[index].limit = 3
    // }
    this.activeCategory = category;
    this.selectedContributions = this.categories[this.activeCategory];
    
  }

  animationStart(event: AnimationEvent) {
    console.log(event);
    this.disabled = true
  }

  animationDone(event: AnimationEvent) {
    // if (this.activeCategory == 'Rejected Contributions') {
    //   if (event.toState == 'removed') {
    //     // const index = this.rejectedContributions.findIndex(
    //     //   (contribution) => contribution.contributionId == this.selectedContribution.contributionId
    //     // )
    //     // this.rejectedContributions.splice(index, 1)
    //     this.selectedContribution.state = 'void'
    //   }
    // }

    // if (this.activeCategory == 'Approved Contributions') {
    //   if (event.toState == 'removed') {
    //     // this.approvedContributions.unshift(this.selectedContribution); 
    //     this.selectedContribution.state = 'void'
    //   }
    // }

    // if (this.activeCategory == 'New Contributions') {
    //   if (event.toState == 'removed') {
    //     // const index = this.newContributions.findIndex(
    //     //   (contribution) => contribution.contributionId == this.selectedContribution?.contributionId
    //     // );
    //     // this.newContributions.splice(index, 1);
    //     this.selectedContribution.state = 'void';
    //   }
    // }

    this.disabled = false
    if (this.selectedContribution) {
      this.archApi.updateContributionByPublish(this.selectedContribution.contributionId, this.publish)
    }
  }

  onReadMore(template: TemplateRef<any>, contribution: Contribution) {
    this.selectedContribution = contribution
    this.modalRef = this.modalService.show(template)
    // const index = this.selectedContributions.findIndex(
    //   (contribution) => contribution.contributionId == contributionId
    // )
    // this.selectedContribution = this.selectedContributions[index]  
    // this.selectedContributions[index].limit = this.selectedContributions[index].rightist['events'].length
    // }
  }
}
