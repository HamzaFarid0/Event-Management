import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events/events.service';
import { InvitaionService } from 'src/app/services/invitation/invitaion.service';
import { SignupService } from 'src/app/services/signup/signup.service';

@Component({
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.css']
})
export class DasboardComponent {

  totalEvents!: number 
  totalUsers!: number 
  invitationStats:any
  constructor(private _eventService: EventsService, private _invitationService : InvitaionService) {}

  ngOnInit(): void {
    this.fetchTotalEvents();
    this.fetchTotalUsers();
    this.fetchInvitationStats()
    
  }

  async fetchTotalEvents(): Promise<void> {
    try {
      this.totalEvents = await this._eventService.totalEvents();
    } catch (error) {
      console.error('Error fetching total events:', error);
    }
  }

  async fetchTotalUsers(): Promise<void> {
    try {
      this.totalUsers = await this._eventService.totalUsers();
    } catch (error) {
      console.error('Error fetching total users:', error);
    }
  }
  async fetchInvitationStats() {
    try {
      this.invitationStats = await this._invitationService.calculateInvitationStats();
      console.log('Invitation Stats:', this.invitationStats);
    } catch (error) {
      console.error('Error fetching invitation stats:', error);
    }
  }
}
