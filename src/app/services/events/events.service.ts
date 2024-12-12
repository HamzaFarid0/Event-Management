import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  collection,
  Firestore,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
} from '@angular/fire/firestore';
import { where } from 'firebase/firestore';
import {firestore, environment } from 'src/environments/environment';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private eventsCollection;
  users : any[] = []

  constructor(private firestore: Firestore ,private _auth: AngularFireAuth , private _usersService : UsersService) {
    this.eventsCollection = collection(this.firestore, 'events');
  }

  async createEvent(event: any): Promise<string> {
    const eventsCollection = collection(this.firestore, 'events'); // Reference to 'events' collection
    const docRef = await addDoc(eventsCollection, event); // Add the event document
    console.log('Event created with ID:', docRef.id);
  
    // Update the event document with its generated ID
    await updateDoc(docRef, { id: docRef.id });
  
    // Reference to the 'invites' subcollection
    const invitesCollectionRef = collection(docRef, 'invites');
  
    // Fetch users with role 'user' and create invite documents
    this._usersService.getUsersWithRoleUser().subscribe(async (users) => {
      this.users = users; // Assign the fetched users to the component
      const createInvitePromises = this.users.map((user: any) =>
        setDoc(doc(invitesCollectionRef,user.uid), {
          userId: user.uid, // Assume each user has an `id` property
          userName: user.username, // Include user details as needed
          invited: false,
          status: 'Uninvited',
        })
      );
  
      // Wait for all invites to be created
      await Promise.all(createInvitePromises);
      console.log(`Invites created for ${this.users.length} users.`);
    });
  
    return docRef.id; // Return the auto-generated event ID
  }
  

  async getEvents(): Promise<Event[]> {
    try {
      const eventsQuery = query(this.eventsCollection, orderBy('timestamp', 'asc'));
      const snapshot = await getDocs(eventsQuery);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Event),
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  // Update Event
  async updateEvent(eventId: string, updatedEvent: any): Promise<void> {
    try {
      const eventRef = doc(this.firestore, 'events', eventId);
      await updateDoc(eventRef, {
        ...updatedEvent,
        timestamp: serverTimestamp(),
      });
      console.log('Event successfully updated');
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }


  
// Delete Event
async deleteEvent(eventId: string): Promise<void> {
  
  try {
    const eventDocRef = doc(this.firestore, 'events', eventId); // Use `this.firestore` here
    await deleteDoc(eventDocRef);
    console.log('Event deleted with ID:', eventId);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

async totalEvents(): Promise<number> {
  try {
    // Query to get all events
    const snapshot = await getDocs(this.eventsCollection);
    return snapshot.size;  // Return the number of documents
  } catch (error) {
    console.error('Error counting events:', error);
    return 0;  // Return 0 in case of an error
  }
}

async totalUsers(): Promise<number> {
  try {
    // Query all users
    const usersQuery = collection(this.firestore, 'users');
    const snapshot = await getDocs(usersQuery);

    // Filter users with 'User' role
    const usersWithRoleUser = snapshot.docs.filter(doc => doc.data()?.['role'] === 'User');
    
    console.log('Filtered Users:', usersWithRoleUser);
    return usersWithRoleUser.length;  // Return the number of filtered users
  } catch (error) {
    console.error('Error counting users:', error);
    return 0;  // Return 0 in case of an error
  }
}

}
