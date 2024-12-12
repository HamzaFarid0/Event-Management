import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/authentication/auth.service';
import { catchError, from, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvitaionService {
  constructor(private _firestore: Firestore, private _authService: AuthService) {}

  getUserInvitations() {
    return this._authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          console.warn('No user logged in. Returning empty invitations.');
          return of([]); // Return an empty array if UID is not available
        }
  
        const uid = user.uid; // Extract the UID
        const eventsRef = collection(this._firestore, 'events');
        return from(getDocs(eventsRef)).pipe(
          switchMap((eventDocs) => {
            const invitationsPromises = eventDocs.docs.map(async (event) => {
              const eventId = event.id;
              const eventData = event.data();
  
              // Reference the invites subcollection for this event
              const invitesRef = collection(this._firestore, `events/${eventId}/invites`);
              const invitesDocs = await getDocs(invitesRef);
  
              // Check if any invite document for the current user has invited: true
              const userInvite = invitesDocs.docs.find(
                (inviteDoc) =>
                  inviteDoc.id === uid && inviteDoc.data()?.['invited'] === true
              );
  
              if (userInvite) {
                return {
                  eventId,
                  eventData,
                  inviteData: userInvite.data(), // Include invite data if needed
                };
              }
  
              return null; // Skip if no valid invite found
            });
  
            return from(Promise.all(invitationsPromises)).pipe(
              map((invitations) => invitations.filter((invite) => invite !== null)), // Remove null entries
            );
          }),
          catchError((error) => {
            console.error('Error fetching invitations:', error);
            return of([]); // Return an empty array on error
          })
        );
      })
    );
  }
  
  
  async calculateInvitationStats() {
    const eventsCollectionRef = collection(this._firestore, 'events');
    const eventsSnapshot = await getDocs(eventsCollectionRef);

    let totalInvited = 0;
    let totalPending = 0;
    let totalAccepted = 0;
    let totalRejected = 0;

    // Loop through each event document
    for (const eventDoc of eventsSnapshot.docs) {
      const eventId = eventDoc.id;
      const invitesSubcollectionRef = collection(this._firestore, `events/${eventId}/invites`);

      // Get all invites in the subcollection
      const invitesSnapshot = await getDocs(invitesSubcollectionRef);

      invitesSnapshot.forEach((inviteDoc) => {
        const inviteData = inviteDoc.data();
        if (inviteData?.['invited']) {
          totalInvited++;

          // Check the status and update counts accordingly
          switch (inviteData?.['status']) {
            case 'Pending':
              totalPending++;
              break;
            case 'Accepted':
              totalAccepted++;
              break;
            case 'Rejected':
              totalRejected++;
              break;
          }
        }
      });
    }

    return {
      totalInvited,
      totalPending,
      totalAccepted,
      totalRejected,
    };
  }
  
}
