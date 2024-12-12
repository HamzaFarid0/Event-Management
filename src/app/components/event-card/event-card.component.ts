import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { from, map, Observable, retry } from 'rxjs';
import { Event } from 'src/app/models/event/event.model';
import { EventsService } from 'src/app/services/events/events.service';
import { UsersService } from 'src/app/services/users/users.service';
import { AppState } from 'src/app/store/app.state';
import { deleteEvent, loadEvents, updateEvent } from 'src/app/views/events/state/event.actions';
import { selectEvents, selectFilteredEvents } from 'src/app/views/events/state/event.selectors';
import Swal from 'sweetalert2';
import { Firestore ,doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { SignupService } from 'src/app/services/signup/signup.service';
import { InvitaionService } from 'src/app/services/invitation/invitaion.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
  eventsData$!: Observable<Event[]>;
  event: Event = {
    title: '',
    date: '',
    time: '',
    location: '',
    image: '',  // Store the Base64 image string here
    timestamp: 0,
    id: '0'
  };

  isPopupVisible = false;
  selectedEvent: any;
  isInviteModalVisible = false;
  users: any[] = [];
  enrichedUsers : any[] = []
role : any

  constructor(private _eventService: EventsService, 
    private _store: Store<AppState> , private _usersService : UsersService,
    private _firestore: Firestore , private _signupService: SignupService,
    private _invitationService : InvitaionService
  ) {}

  ngOnInit(): void {
    this.eventsData$ = this._store.select(selectFilteredEvents).pipe(
      map((events: Event[]) =>
        events.slice().sort((a, b) => {
          // Combine date and time into a single Date object for comparison
          const dateTimeA = new Date(`${a.date}T${a.time}`);
          const dateTimeB = new Date(`${b.date}T${b.time}`);
          return dateTimeA.getTime() - dateTimeB.getTime(); // Sort in descending order
        })
      )
    );
    
  
    // Fetch users with the role 'user'
    this._usersService.getUsersWithRoleUser().subscribe((data) => {
      this.users = data;
      console.log('Users with role "user":', this.users);
    });

    this._signupService.roleSubjectObservable.subscribe((val)=>{
      this.role=val
    })
  }
  
  // Populate enrichedUsers array
  populateEnrichedUsers(): void {
    this.enrichedUsers = [];
  
    if (!this.selectedEvent) {
      console.error('No event selected.');
      return;
    }
  
    this.users.forEach((user) => {
      const inviteRef = doc(this._firestore, `events/${this.selectedEvent.id}/invites/${user.uid}`);
  
      getDoc(inviteRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const inviteData = docSnap.data();
            this.enrichedUsers.push({
              ...user, // Include user data
              invited: inviteData?.['invited'] ?? false, // Default to false
              status: inviteData?.['status'] ?? 'Uninvited', // Default to 'Uninvited'
            });
          } else {
            // Add default data if invite does not exist
            this.enrichedUsers.push({
              ...user,
              invited: false,
              status: 'Uninvited',
            });
          }
        })
        .catch((error) => {
          console.error(`Error fetching invite for user ${user.uid}:`, error);
        });
    });
  }
  
  

  // Function to show popup
  showPopup(event: Event) {
    this.event = { ...event }; // Copy event data to the form
    this.isPopupVisible = true;
  }

  // Function to hide popup (called when Cancel is clicked)
  hidePopup() {
    this.isPopupVisible = false;
  }

  updateEvent() {
    if (this.event.title && this.event.date && this.event.time && this.event.location) {
      this._store.dispatch(updateEvent({ 
        id: this.event.id,        // Pass the ID of the event
        updatedEvent: this.event   // Pass the updated event data
      }));
      
      console.log('Event successfully updated', this.event);
      this.resetForm();
      this.hidePopup();
      Swal.fire({
        title: 'Loading...',
        html: 'Please wait while your event is updated.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      }); 

      // Simulate some delay, then update the alert
      setTimeout(() => {
        Swal.fire({
          title: 'Success!',
          text: 'Your event has been updated.',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
        });
      }, 3000); // Simulated 3-second delay
      
    } else {
      alert('Please fill in all the fields.');
    }
  }

  // Handle image upload and store Base64 string
  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.event.image = reader.result as string; // Store the image data as Base64
      };
      reader.readAsDataURL(file);  // Convert the image to Base64 format
    }
  }

  // Reset the form
  resetForm() {
    this.event = {
      title: '',
      date: '',
      time: '',
      location: '',
      image: '',  
      timestamp: 0,
      id: '0'
    };
  }

  deleteEvent(id: string) {
    Swal.fire({
      icon: 'warning',
      text: 'Are you sure you want to delete this event?',
      width: '600px',  
      padding: '1rem', 
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO',
      customClass: {
        popup: 'small-modal'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this._store.dispatch(deleteEvent({ id }));
        Swal.fire('Your event has been deleted', '', 'success');
      }
    });

  }


  
  // Show the invite modal
  openInviteModal(event: any): void {
    this.selectedEvent = event;
    this.isInviteModalVisible = true;
    this.populateEnrichedUsers();

  }

  // Close the invite modal
  closeInviteModal(): void {
    this.isInviteModalVisible = false;
  }

  sendInvite(user: any, eventId: string): void {
  
    const inviteRef = doc(this._firestore, `events/${eventId}/invites/${user.uid}`);
  
    getDoc(inviteRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const inviteData = docSnap.data();
          const currentInvited = inviteData?.['invited'];
  
          if (!currentInvited) {
            // Update to invited: true and status: Pending
            updateDoc(inviteRef, { invited: true, status: 'Pending' }).then(() => {
              user.invited = true; // Reflect changes in UI
              user.status = 'Pending';
             
              console.log(`Invite sent to user ${user.uid}. - ${user.invited}- ${user.status}.`);
            });
          } else {
            // Update to invited: false and status: Uninvited
            updateDoc(inviteRef, { invited: false, status: 'Uninvited' }).then(() => {
              user.invited = false; // Reflect changes in UI
              user.status = 'Uninvited';
            
              console.log(`Invite revoked for user ${user.uid}- ${user.invited}- ${user.status}.`);
            });
          }
        } else {
          // Create a new invite document if it doesn't exist
          updateDoc(inviteRef, { invited: true, status: 'Pending' }).then(() => {
            user.invited = true;
            user.status = 'Pending';
         
            console.log(`Invite created for user ${user.uid}- ${user.invited}- ${user.status}.`);
          });
        }
      })
      .catch((error) => {
        console.error(`Error sending invite for user ${user.uid}:`, error);
      });

  }
  

}