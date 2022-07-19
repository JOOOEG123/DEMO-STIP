import { Component, OnInit } from '@angular/core';
import {
  TEAM_PROFILES,
  Profile,
} from 'src/app/pages/about/AboutTeam/about-team.constants';

@Component({
  selector: 'app-about-team',
  templateUrl: './about-team.component.html',
  styleUrls: ['./about-team.component.scss'],
})
export class AboutTeamComponent implements OnInit {
  team_profile: Profile[] = TEAM_PROFILES;

  constructor() {}

  ngOnInit(): void {}
}
