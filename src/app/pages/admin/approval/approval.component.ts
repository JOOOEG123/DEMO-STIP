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
import { ObjectUnsubscribedError, Subscription } from 'rxjs';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { ContributionsService } from 'src/app/core/services/contributions.service';
import {
  Categories,
  CategoryList,
  Contribution,
  ContributionJson,
  ContributionSchema,
  Publish,
  Rightist,
} from 'src/app/core/types/adminpage.types';
import { ContributionComponent } from '../contribution/contribution.component';

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

  newContributions: Contribution[] = [];
  approvedContributions: Contribution[] = [];
  rejectedContributions: Contribution[] = [];

  selectedContributions: Contribution[] = [];

  activeCategory!: Categories;

  selectedContribution: Contribution = {
    state: 'void',
    contributionId: '',
    contributorId: [],
    rightistId: '',
    publish: 'original',
    contributedAt: new Date(),
    approvedAt: new Date(),
    lastUpdatedAt: new Date()
  };
  updatedContribution!: Contribution;

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

  disabled: boolean = false;
  readMoreRef?: BsModalRef;
  deleteRef?: BsModalRef;

  contributionSubcription?: Subscription;
  rightistSubscription?: Subscription;

  contributions: any[] = [];
  publish: Publish = 'new';
  isLoaded: boolean = false;
  limit: number = 3;

  emptyContributionMessage = 'Nothing Here!';

  constructor(
    private modalService: BsModalService,
    private contributionAPI: ContributionsService,
    private archiveAPI: ArchieveApiService
  ) {}

  ngOnInit(): void {
    this.contributionSubcription = this.contributionAPI
      .fetchAllContributions()
      .subscribe((data: any) => {
        this.contributions.length = 0;
        this.newContributions.length = 0;
        this.approvedContributions.length = 0;
        this.rejectedContributions.length = 0;
        this.selectedContribution = {
          state: 'void',
          contributionId: '',
          contributorId: [],
          rightistId: '',
          publish: 'original',
          contributedAt: new Date(),
          approvedAt: new Date(),
          lastUpdatedAt: new Date()
        }; 
        const test: ContributionJson[] = Object.values(data);
        for (let lol of test) {
          for (const contribution of Object.values(lol)) {
            this.contributions.push(contribution);
          }
        }

        // make sure the latest contribution is at the top
        this.contributions.sort(function (a, b) {
          return (
            new Date(b.lastUpdatedAt).getTime() -
            new Date(a.lastUpdatedAt).getTime()
          );
        });

        for (let contribution of this.contributions) {
          if (contribution.rightist) {
            if (!contribution.rightist.events) {
              contribution.rightist!.events = []
            }
  
            if (!contribution.rightist.memoirs) {
              contribution.rightist!.memoirs = []
            }
          }

          let data: Contribution = {
            ...contribution,
            contributedAt: contribution.contributedAt,
            approvedAt: contribution.approvedAt,
            lastUpdatedAt: contribution.lastUpdatedAt,
            state: 'void',
          };

          if (contribution.publish == 'new') {
            
            this.newContributions.push(data);
          }

          if (contribution.publish == 'approved') {
            this.archiveAPI
              .getPersonById(data.rightistId)
              .subscribe((rightist: any) => {
                // Initialize empty array because Firebase does not store empty arrays
                if (!rightist.events) {
                  rightist.events = []
                }

                if (!rightist.memoirs) {
                  rightist.memoirs = []
                }

                data.rightist = rightist;
              });

            this.approvedContributions.push(data);
          }

          if (contribution.publish == 'rejected') {
            this.rejectedContributions.push(data);
          }
        }
      });

    this.selectedContributions = this.newContributions;
    this.activeCategory = 'New Contributions';
  }

  ngOnDestroy(): void {
    this.contributionSubcription?.unsubscribe();
    this.rightistSubscription?.unsubscribe();
  }

  updateSelectedContribution() {
    this.selectedContribution.rightist!.fullName =
      this.updatedContribution.rightist!.fullName;
    this.selectedContribution.rightist!.gender =
      this.updatedContribution.rightist!.gender;
    this.selectedContribution.rightist!.status =
      this.updatedContribution.rightist!.status;
    this.selectedContribution.rightist!.ethnicity =
      this.updatedContribution.rightist!.ethnicity;
    this.selectedContribution.rightist!.job =
      this.updatedContribution.rightist!.job;
    this.selectedContribution.rightist!.rightistYear =
      this.updatedContribution.rightist!.rightistYear;
    this.selectedContribution.rightist!.birthYear =
      this.updatedContribution.rightist!.birthYear;
    this.selectedContribution.rightist!.events =
      this.updatedContribution.rightist!.events;
    this.selectedContribution.rightist!.memoirs =
      this.updatedContribution.rightist!.memoirs;
    this.selectedContribution.lastUpdatedAt = new Date();
  }

  onEdit(contribution: Contribution) {
    this.readMoreRef?.hide();
    // this.updateSelectedContribution();
    this.publish = 'approved'
    this.selectedContribution.state = 'removed';
    // let { state, rightist, ...result} = this.selectedContribution
    // let contributorId = result.contributorId[result.contributorId.length - 1]
    // let contributionId = result.contributionId
    // this.contributionAPI.updateUserContribution(contributorId, contributionId, result)
    // this.archiveAPI.editArchieveById(rightist, result.rightistId)
  }

  onApprove(contribution: Contribution) {
    this.readMoreRef?.hide();
    this.selectedContribution = contribution;
    this.publish = 'approved';
    this.selectedContribution.state = 'removed';
  }


  onReject(contribution: Contribution) {
    this.readMoreRef?.hide();
    this.selectedContribution = contribution;
    this.publish = 'rejected';
    this.selectedContribution.state = 'removed';
  }

  onReconsider(contribution: Contribution) {
    this.readMoreRef?.hide();
    this.selectedContribution = contribution;
    this.publish = 'approved';
    this.selectedContribution.state = 'removed';
  }

  onRemove(template: TemplateRef<any>, contribution: Contribution) {
    this.selectedContribution = contribution;
    this.readMoreRef?.hide();
    this.deleteRef = this.modalService.show(template, {
      class: 'modal-dialog-centered',
      backdrop: 'static',
    });
  }

  onDelete() {
    this.deleteRef?.hide();
    this.publish = 'deleted';
    this.selectedContribution.state = 'removed';
  }

  onCancel() {
    this.deleteRef?.hide();
  }

  setActiveCategory(category: Categories) {
    this.activeCategory = category;
    this.selectedContributions = this.categories[this.activeCategory];
  }

  animationStart(event: AnimationEvent) {
    this.disabled = true;
  }

  animationDone(event: AnimationEvent) {
    this.disabled = false;

    if (
      this.selectedContribution &&
      this.selectedContribution.state === 'removed'
    ) {
      if (this.updated) {
        this.updateSelectedContribution();
      }

      if (this.selectedContribution.rightist) {
        let contributorId =
          this.selectedContribution.contributorId[
            this.selectedContribution.contributorId.length - 1
          ];
        let contributionId = this.selectedContribution.contributionId;
        let rightistId = this.selectedContribution.rightistId;

        this.selectedContribution.publish = this.publish;

        const { state, ...contribution } = this.selectedContribution;
  
        console.log(contribution);
        if (this.selectedContribution.publish === 'approved') {
          let { rightist, ...result } = contribution;

          rightist = this.selectedContribution.rightist;
          result.rightistId = rightist.rightistId;
          result.approvedAt = new Date();

          this.archiveAPI
            .addNewArchieve(rightist)
            .then((data) => console.log(data));
          this.contributionAPI.updateUserContribution(
            contributorId,
            this.selectedContribution.contributionId,
            result
          );
        } else if (this.selectedContribution.publish === 'deleted') {
          this.contributionAPI.removeUserContribution(
            contributorId,
            contributionId
          );
          this.archiveAPI.removeArchieveById(rightistId);
        } else {
          this.contributionAPI.updateUserContribution(
            contributorId,
            this.selectedContribution.contributionId,
            contribution
          );
        }
        this.selectedContribution.state = 'void'
        this.updated = false
      }
    }
  }

  onReadMore(template: TemplateRef<any>, contribution: Contribution) {
    this.selectedContribution = contribution;
    this.updatedContribution = { ...contribution };
    this.readMoreRef = this.modalService.show(template, { class: 'modal-xl' });
  }

  updated: boolean = false

  onFormChange(data: any) { 
    let { name, gender, status, ethnic, occupation, rightestYear, birthYear } =
      data; 
    if (
      name &&
      gender &&
      status &&
      ethnic &&
      occupation &&
      rightestYear &&
      birthYear
    ) { 
      this.updated = true
      this.updatedContribution = {
        ...this.updatedContribution!,
        rightist: {
          ...this.updatedContribution!.rightist!,
          fullName: data.name,
          gender: data.gender,
          status: data.status,
          ethnicity: data.ethnic,
          job: data.occupation,
          rightistYear: data.rightestYear,
          birthYear: data.birthYear,
        },
      };
    }
  }

  onEventChange(data: any) {
    this.updated = true
    this.updatedContribution = {
      ...this.updatedContribution!,
      rightist: {
        ...this.updatedContribution!.rightist!,
        events: data.value,
      },
    };
  }

  onMemoirChange(data: any) {
    this.updated = true
    this.updatedContribution = {
      ...this.updatedContribution!,
      rightist: {
        ...this.updatedContribution!.rightist!,
        memoirs: data.value,
      },
    };
  }
}
