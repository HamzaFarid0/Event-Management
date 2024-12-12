import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';
import { InvitaionService } from 'src/app/services/invitation/invitaion.service';
import { Firestore ,doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css']
})
export class InvitationsComponent implements OnInit{

  invitations: any[]=[]
  constructor(private _invitationService : InvitaionService,
     private _authService :AuthService,
    private _firestore : Firestore, private _store: Store<AppState>
    ){}

  ngOnInit() {
    this._invitationService.getUserInvitations().subscribe({
      next: (data) => {
        console.log('Invitations:', data); // Debugging
        this.invitations = data
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });

    this._authService.currentUser$.subscribe((data)=>{
      console.log('invite current user' ,data)
    })
  }


  updateInviteStatus(eventId: string, userId: string, updateStatus: string) {
    const inviteRef = doc(this._firestore, `events/${eventId}/invites/${userId}`);
  
    getDoc(inviteRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const inviteData = docSnap.data();
  
          if (inviteData?.['invited']) {
            // Update Firestore document
            updateDoc(inviteRef, { status: updateStatus }).then(() => {
              console.log(`Invite status changed for ${userId}. Event ID: ${eventId}, Status: ${updateStatus}.`);
  
              // Update local `invitations` array
              const invitationIndex = this.invitations.findIndex(
                (invite) => invite.eventId === eventId && invite.inviteData.userId === userId
              );
  
              if (invitationIndex !== -1) {
                this.invitations[invitationIndex].inviteData.status = updateStatus;
              }
            });
          }
        }
      })
      .catch((error) => {
        console.error(`Error while updating invite status for ${userId}:`, error);
      });
  }
  
}
