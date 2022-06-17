import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

interface Contribution {
  id: string,
  imgSrc: string,
  surname: string,
  occupation: string,
  ethnicGroup: string,
  gender: string,
  content: string,
  date: Date,
  state: string
}

type Categories = 'New Contributions' | 'Approved Contributions' | 'Rejected Contributions'
type CategoryList = Record<Categories, Contribution[]>

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss'],
  animations: [
    trigger('contributionAnimation', [
      state('void', style({ opacity: 1})),
      state('removed', style({ opacity: 0, display: 'none'})),
      transition('void -> removed', animate('800ms ease-in-out')),
    ])
  ],
})
export class ApprovalComponent implements OnInit {

  currentState: string = 'void'

  newContributions: Contribution[] = [
    {
      id: 'victim1',
      imgSrc: 'assets/homepage/theguy.png',
      surname: 'John Doe',
      occupation: 'Student',
      ethnicGroup: '',
      gender: 'male',
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      date: new Date(),
      state: 'void'
    },
    {
      id: 'victim2',
      imgSrc: 'assets/homepage/theguy.png',
      surname: 'Jane Doe',
      occupation: 'Butcher',
      ethnicGroup: 'Han',
      gender: 'female',
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      date: new Date(),
      state: 'void'
    },
    {
      id: 'victim3',
      imgSrc: 'assets/homepage/theguy.png',
      surname: 'Joe Doe',
      occupation: 'Butcher',
      ethnicGroup: 'Han',
      gender: 'female',
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      date: new Date(),
      state: 'void'
    },
    {
      id: 'victim4',
      imgSrc: 'assets/homepage/theguy.png',
      surname: 'Josh Doe',
      occupation: 'Butcher',
      ethnicGroup: 'Han',
      gender: 'female',
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      date: new Date(),
      state: 'void'
    }
  ]

  approvedContribution: Contribution[] = []
  rejectedContributions: Contribution[] = []
  selectedContributions: Contribution[] = []

  activeCategory?: Categories
  selectedContribution?: Contribution

  categoriesList: Categories[] = ['New Contributions', 'Approved Contributions', 'Rejected Contributions']
  categories: CategoryList = {
    'New Contributions': this.newContributions, 
    'Approved Contributions': this.approvedContribution,
    'Rejected Contributions': this.rejectedContributions 
  };

  constructor() { 
    this.selectedContributions = this.newContributions;
    this.activeCategory = 'New Contributions'
  }

  ngOnInit(): void {}

  onApprove(victimId: string) {
    const index = this.newContributions.findIndex(contribution => contribution.id == victimId)
    this.selectedContribution = this.newContributions[index]
    this.selectedContribution.state = 'removed'
    this.approvedContribution.unshift(this.selectedContribution)
  }

  onEdit(victimId: string) {
    alert(victimId)
  }

  onReject(victimId: string) {
    const index = this.newContributions.findIndex(contribution => contribution.id == victimId)
    this.selectedContribution = this.newContributions[index]
    this.selectedContribution.state = 'removed'
    this.rejectedContributions.unshift(this.selectedContribution)
  }

  setActiveCategory(category: Categories) {
    this.activeCategory = category;
    this.selectedContributions = this.categories[this.activeCategory]
  }

  animationStart(event: AnimationEvent) {
    console.log(event);
  }

  animationDone(event: AnimationEvent) {
    if (this.selectedContribution) {
      if (event.toState == 'removed') {
        const index = this.newContributions.findIndex(contribution => contribution.id == this.selectedContribution?.id)
        this.newContributions.splice(index, 1)
        this.selectedContribution.state = 'void'
      }
    } 
  }
}
