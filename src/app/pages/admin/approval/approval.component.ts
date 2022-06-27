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
import {
  Categories,
  CategoryList,
  Contribution,
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

  newContributions: Contribution[] = [
    {
      id: 'victim1',
      imgSrc: 'assets/homepage/theguy.png',
      surname: 'John Doe',
      occupation: 'Student',
      ethnicGroup: '',
      gender: 'male',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      date: new Date(),
      state: 'void',
    },
    {
      id: 'victim2',
      imgSrc: 'assets/homepage/theguy.png',
      surname: 'Jane Doe',
      occupation: 'Butcher',
      ethnicGroup: 'Han',
      gender: 'female',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      date: new Date(),
      state: 'void',
    },
    {
      id: 'victim3',
      imgSrc: 'assets/homepage/theguy.png',
      surname: 'Joe Doe',
      occupation: 'Butcher',
      ethnicGroup: 'Han',
      gender: 'female',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      date: new Date(),
      state: 'void',
    },
    {
      id: 'victim4',
      imgSrc: 'assets/homepage/theguy.png',
      surname: 'Josh Doe',
      occupation: 'Butcher',
      ethnicGroup: 'Han',
      gender: 'female',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      date: new Date(),
      state: 'void',
    },
  ];

  pendingContributions: Contribution[] = [
    {
      id: 'victim100',
      imgSrc: 'assets/homepage/theguy.png',
      surname: 'Pending Doe',
      occupation: 'Butcher',
      ethnicGroup: 'Han',
      gender: 'female',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      date: new Date(),
      state: 'void',
    }
  ]

  approvedContributions: Contribution[] = [
    {
      id: 'victim10',
      imgSrc: 'assets/homepage/theguy.png',
      surname: 'Joshua Doe',
      occupation: 'Butcher',
      ethnicGroup: 'Han',
      gender: 'female',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      date: new Date(),
      state: 'void',
    },
    {
      id: 'victim11',
      imgSrc: 'assets/homepage/theguy.png',
      surname: 'Jenny Doe',
      occupation: 'Butcher',
      ethnicGroup: 'Han',
      gender: 'female',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      date: new Date(),
      state: 'void',
    },
    {
      id: 'victim12',
      imgSrc: 'assets/homepage/theguy.png',
      surname: 'Jap Doe',
      occupation: 'Butcher',
      ethnicGroup: 'Han',
      gender: 'female',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
      date: new Date(),
      state: 'void',
    },
  ];
  rejectedContributions: Contribution[] = [];
  selectedContributions: Contribution[] = [];

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
  
  constructor(private modalService: BsModalService) {
    this.selectedContributions = this.newContributions;
    this.activeCategory = 'New Contributions';
  }

  ngOnInit(): void { }

  onApprove(victimId: string) {
    const index = this.pendingContributions.findIndex(
      (contribution) => contribution.id == victimId
    );
    this.selectedContribution = this.pendingContributions[index];
    this.selectedContribution.state = 'removed';
  }

  onEdit(template: TemplateRef<any>, victimId: string) {
    this.modalRef = this.modalService.show(template);
  }

  onPending(victimId: string) {
    const index = this.newContributions.findIndex(
      (contribution) => contribution.id == victimId
    )
    this.selectedContribution = this.newContributions[index];
    this.selectedContribution.state = 'removed';
    this.pendingContributions.unshift(this.selectedContribution);
  }

  onReject(victimId: string) {
    const index = this.newContributions.findIndex(
      (contribution) => contribution.id == victimId
    );
    this.selectedContribution = this.newContributions[index];
    this.selectedContribution.state = 'removed';
    this.rejectedContributions.unshift(this.selectedContribution);
  }

  onReconsider(victimId: string) {
    const index = this.rejectedContributions.findIndex(
      (contribution) => contribution.id = victimId
    )
    this.selectedContribution = this.rejectedContributions[index]
    this.selectedContribution.state = 'removed'
    this.pendingContributions.unshift(this.selectedContribution)
  }

  setActiveCategory(category: Categories) {
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
          (contribution) => contribution.id == this.selectedContribution.id
        )
        this.rejectedContributions.splice(index, 1)
        this.selectedContribution.state = 'void'
      }
    }

    if (this.activeCategory == 'Approved Contributions') {
      if (event.toState == 'removed') {
        const index = this.pendingContributions.findIndex(
          (contribution) => contribution.id == this.selectedContribution.id
        )
        this.pendingContributions.splice(index, 1)
        this.approvedContributions.unshift(this.selectedContribution);
        this.selectedContribution.state = 'void'
      }
    }

    if (this.activeCategory == 'New Contributions') {
      if (event.toState == 'removed') {
        const index = this.newContributions.findIndex(
          (contribution) => contribution.id == this.selectedContribution?.id
        );
        this.newContributions.splice(index, 1);
        this.selectedContribution.state = 'void';
      }
    }

    this.disabled = false
  }
}
