import {
  animate,
  AnimationEvent,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  TemplateRef,
} from '@angular/core';
import {
  Categories,
  Contribution,
  Publish,
} from 'src/app/core/types/adminpage.types';

@Component({
  selector: 'app-contribution',
  templateUrl: './contribution.component.html',
  styleUrls: ['./contribution.component.scss'],
  animations: [
    trigger('contributionAnimation', [
      state('void', style({ opacity: 1 })),
      state('removed', style({ opacity: 0, display: 'none' })),
      transition('void -> removed', animate('800ms ease-in-out')),
    ]),
  ],
})
export class ContributionComponent implements OnInit {
  @Input() contribution!: Contribution
  @Input() activeCategory?: Categories
  @Output() approve: EventEmitter<Contribution> = new EventEmitter()
  @Output() reject: EventEmitter<Contribution> = new EventEmitter()
  @Output() reconsider: EventEmitter<Contribution> = new EventEmitter()
  @Output() readMore: EventEmitter<Contribution> = new EventEmitter()
  @Output() remove: EventEmitter<Contribution> = new EventEmitter()
  @Output() edit: EventEmitter<Contribution> = new EventEmitter()

  limit: number = 3;

  constructor() {}

  ngOnInit(): void {
    console.log(this.contribution)
  }

  onApprove() {
    this.approve.emit(this.contribution);
  }

  onReject() {
    this.reject.emit(this.contribution);
  }

  onReconsider() {
    this.reconsider.emit(this.contribution);
  }

  onReadMore() {
    this.readMore.emit(this.contribution);
  }

  onRemove() {
    this.remove.emit(this.contribution)
  }

  onEdit() {
    this.edit.emit(this.contribution)
  }
}
