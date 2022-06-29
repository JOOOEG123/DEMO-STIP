import {
  animate,
  AnimationEvent,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import {
  Categories,
  CategoryList,
  Contribution,
  ContributionSchema,
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
export class ApprovalComponent implements OnInit {
  currentState: string = 'void';

  newContributions: Contribution[] = []
  approvedContributions: Contribution[] = []
  rejectedContributions: Contribution[] = []

  pendingContributions: Contribution[] = []
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
  
  contributions: any[] = []

  constructor(
    private modalService: BsModalService,
    private archApi: ArchieveApiService
  ) {
    this.selectedContributions = this.newContributions;
    this.activeCategory = 'New Contributions';
  }

  ngOnInit(): void { 
    // var result: ContributionSchema = {
    //   contributionId: 'victim101',
    //   contributorId: 'pL8BFnZxdSeSWSIuyAkTBQZuNbf2',
    //   publish: 'new',
    //   contributedAt: new Date().toString(),
    //   rightist: {
    //     rightistId: 'A800',
    //     birthYear: 1922,
    //     deathYear: 0,
    //     description: "",
    //     events: [
    //         {
    //           content: "Something happened!",
    //           endYear: 0,
    //           startYear: 1955
    //         },
    //         {
    //           content: "Something happened!",
    //           endYear: 0,
    //           startYear: 1955
    //         },
    //         {
    //           content: "Something happened!",
    //           endYear: 0,
    //           startYear: 1955
    //         },
    //         {
    //           content: "Something happened!",
    //           endYear: 0,
    //           startYear: 1955
    //         },
    //         {
    //           content: "Something happened!",
    //           endYear: 0,
    //           startYear: 1955
    //         },
    //         {
    //           content: "Something happened!",
    //           endYear: 0,
    //           startYear: 1955
    //         }
    //       ],
    //       firstName: "Ai",
    //       gender: "Male",
    //       imagePath: "https://firebasestorage.googleapis.com/v0/b/stip-demo.appspot.com/o/theguy.png?alt=media&token=8d31edbb-cda0-4cc2-999d-dffd59f6b747",
    //       initial: "A",
    //       job: "student",
    //       lastName: "fang",
    //       memoirs: [
    //         "Something",
    //         "Something else"
    //       ],
    //       nationality: "Han",
    //       publish: "new",
    //       reference: "",
    //       rightistYear: 1957,
    //       status: "Unknown",
    //       workplace: "Department of Physics"
    //     }
    //   }
    //   console.log(this.archApi.addContribution(result))
    // this.archApi.getContributions().snapshotChanges((data: any) => {
    //   console.log(data)
    // })

    this.archApi.getContributions().valueChanges().subscribe(data => {
      this.contributions = data as any[]

      console.log(this.contributions)
      for (var contribution of this.contributions) {
        contribution.state = 'void'
        contribution.limit = 3
        contribution.contributedAt = new Date(contribution.contributedAt)

        if (contribution.publish == 'new') {
          this.newContributions.push(contribution)
        }

        if (contribution.publish == 'approved') {
          this.approvedContributions.push(contribution)
        }

        if (contribution.publish == 'rejected') {
          this.rejectedContributions.push(contribution)
        }

        if (contribution.publish == 'pending') {
          this.pendingContributions.push(contribution)
        }
      }
    })
  }
  

  onApprove(victimId: string) {
    const index = this.pendingContributions.findIndex(
      (contribution) => contribution.contributionId == victimId
    );
    this.selectedContribution = this.pendingContributions[index];
    this.selectedContribution.state = 'removed';

    
  }

  onEdit(template: TemplateRef<any>, victimId: string) {
    this.modalRef = this.modalService.show(template);
  }

  onPending(victimId: string) {
    const index = this.selectedContributions.findIndex(
      (contribution) => contribution.contributionId == victimId
    )
    this.selectedContribution = this.newContributions[index];
    this.selectedContribution.state = 'removed';
    this.pendingContributions.unshift(this.selectedContribution);
  }

  onReject(contributionId: string) {
    
    const index = this.selectedContributions.findIndex(
      (contribution) => contribution.contributionId == contributionId
    );
    if (index == -1) {
      const i = this.pendingContributions.findIndex(
        (contribution) => contribution.contributionId == contributionId
      )
      this.selectedContribution = this.pendingContributions[i]
      this.selectedContribution.state = 'removed'
      this.rejectedContributions.unshift(this.selectedContribution)
    }
    else {
      this.selectedContribution = this.newContributions[index];
      this.selectedContribution.state = 'removed';
      this.rejectedContributions.unshift(this.selectedContribution);
    } 
  }

  onReconsider(victimId: string) {
    const index = this.rejectedContributions.findIndex(
      (contribution) => contribution.contributionId = victimId
    )
    this.selectedContribution = this.rejectedContributions[index]
    this.selectedContribution.state = 'removed'
    this.pendingContributions.unshift(this.selectedContribution)
  }

  setActiveCategory(category: Categories) {
    const index = this.selectedContributions.findIndex(
      (contribution) => contribution.contributionId == this.selectedContribution?.contributionId
    )

    if (index != -1) {
      this.selectedContributions[index].limit = 3
    }

    this.activeCategory = category;
    this.selectedContributions = this.categories[this.activeCategory];
    
  }

  animationStart(event: AnimationEvent) {
    console.log(event);
    this.disabled = true
  }

  animationDone(event: AnimationEvent) {
    if (this.activeCategory == 'Rejected Contributions') {
      if (event.toState == 'removed') {
        const index = this.rejectedContributions.findIndex(
          (contribution) => contribution.contributionId == this.selectedContribution.contributionId
        )
        this.rejectedContributions.splice(index, 1)
        this.selectedContribution.state = 'void'
      }
    }

    if (this.activeCategory == 'Approved Contributions') {
      if (event.toState == 'removed') {
        const index = this.pendingContributions.findIndex(
          (contribution) => contribution.contributionId == this.selectedContribution.contributionId
        )
        this.pendingContributions.splice(index, 1)
        if (this.selectedContribution.contributionId != this.rejectedContributions[0]?.contributionId) {
          console.log("Inside")
          this.approvedContributions.unshift(this.selectedContribution); 
        }
        this.selectedContribution.state = 'void'
      }
    }

    if (this.activeCategory == 'New Contributions') {
      if (event.toState == 'removed') {
        const index = this.newContributions.findIndex(
          (contribution) => contribution.contributionId == this.selectedContribution?.contributionId
        );
        this.newContributions.splice(index, 1);
        this.selectedContribution.state = 'void';
      }
    }

    this.disabled = false
    if (this.selectedContribution) {
      this.selectedContribution.limit = 3
    }
  }

  onReadMore(contributionId: string) {
    const index = this.selectedContributions.findIndex(
      (contribution) => contribution.contributionId == contributionId
    )
    this.selectedContribution = this.selectedContributions[index]

    if (index == -1) {
      const i = this.pendingContributions.findIndex(
        (contribution) => contribution.contributionId == contributionId
      )
      this.pendingContributions[i].limit = this.pendingContributions[i].victim.events.length
    }
    else {
      this.selectedContributions[index].limit = this.selectedContributions[index].victim.events.length
    }
  }
}
