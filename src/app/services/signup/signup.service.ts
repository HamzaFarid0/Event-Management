import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  constructor(  
      private _afAuth: AngularFireAuth,
      private _firestore: AngularFirestore) {}

     roleSubject = new BehaviorSubject(localStorage.getItem('role') || '')
     roleSubjectObservable = this.roleSubject.asObservable()

      errorMessage =new BehaviorSubject('')
      errorMessageObservable = this.errorMessage.asObservable()

      isSigningUp =false

      async signup(email: string, password: string,username:string, role: string): Promise<void> {
        try {
          // Create a new user with email and password
          const userCredential = await this._afAuth.createUserWithEmailAndPassword(email, password);
      
          // Extract the `uid` from the created user
          const uid = userCredential.user?.uid;
      
          if (!uid) {
            throw new Error('Failed to retrieve user UID.');
          }
      
          // Add user data to Firestore with `uid` field
          await this._firestore.collection('users').doc(uid).set({
            uid: uid, // Store UID explicitly
            username :username,
            email: email,
            role: role,
            createdAt: new Date(),
          });
      
          console.log('User successfully signed up', { uid, email, role, username });
        } catch (error: any) {
          console.error('Signup failed:', error);
          throw error; // Re-throw the error to handle in the component
        }
      }
      

}
