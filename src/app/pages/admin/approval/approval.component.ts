import { Component, OnInit } from '@angular/core';

interface Contribution {
  id: string,
  imgSrc: string,
  surname: string,
  occupation: string,
  ethnicGroup: string,
  gender: string,
  content: string,
  date: Date
}

type Categories = 'New Contributions' | 'Approved Contributions' | 'Rejected Contributions'
type CategoryList = Record<Categories, Contribution[]>

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit {

  newContributions: Contribution[] = [
    {
      id: 'vimtim1',
      imgSrc: 'assets/homepage/theguy.png',
      surname: 'John Doe',
      occupation: 'Student',
      ethnicGroup: '',
      gender: 'male',
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      date: new Date()
    },
    {
      id: 'victim2',
      imgSrc: 'assets/homepage/theguy.png',
      surname: 'Jane Doe',
      occupation: 'Butcher',
      ethnicGroup: 'Han',
      gender: 'female',
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      date: new Date()
    },
    {
      id: 'victim2',
      imgSrc: 'assets/homepage/theguy.png',
      surname: 'Joe Doe',
      occupation: 'Butcher',
      ethnicGroup: 'Han',
      gender: 'female',
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      date: new Date()
    },
    {
      id: 'victim2',
      imgSrc: 'assets/homepage/theguy.png',
      surname: 'Josh Doe',
      occupation: 'Butcher',
      ethnicGroup: 'Han',
      gender: 'female',
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      date: new Date(),
    }
  ]

  approvedContribution: Contribution[] = []
  rejectedContributions: Contribution[] = []
  selectedContributions?: Contribution[]

  activeCategory?: Categories
  
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

  ngOnInit(): void {
    console.log(this.categories)
  }

  onApprove(victimId: string) {
    const index = this.newContributions.findIndex(contribution => contribution.id == victimId)
    const returned = this.newContributions.splice(index, 1)
    this.approvedContribution.unshift(returned[0])
  }

  onEdit(victimId: string) {
    alert(victimId)
  }

  onReject(victimId: string) {
    const index = this.newContributions.findIndex(contribution => contribution.id == victimId)
    const returned = this.newContributions.splice(index, 1)
    this.rejectedContributions.unshift(returned[0])
  }

  setActiveCategory(category: Categories) {
    this.activeCategory = category;
    this.selectedContributions = this.categories[this.activeCategory]
  }
}
