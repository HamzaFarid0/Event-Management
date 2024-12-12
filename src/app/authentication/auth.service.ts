import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { SignupService } from '../services/signup/signup.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _afAuth: AngularFireAuth,
    private _firestore: AngularFirestore,
    private _router :Router,
    private _signupService : SignupService
  ) {}

  private currentUserSubject = new BehaviorSubject(
    this.getStoredCurrentUser()
  );
  currentUser$ = this.currentUserSubject.asObservable();

  async login(email: string, password: string, role: string): Promise<any> {
    try {
      // Authenticate the user with email and password
      const userCredential = await this._afAuth.signInWithEmailAndPassword(email, password);
  
      // Extract UID and other user details
      const user = userCredential.user;
      const userWithUid= {
        uid: user?.uid || '' , // Ensure UID is not undefined
        email: user?.email || '',
       
      };
      localStorage.setItem('currentUser', JSON.stringify(userWithUid));
      // Update the currentUserSubject with the formatted User object
      this.currentUserSubject.next(userWithUid);
      console.log('Logged in user UID:', userWithUid.uid);
  
      // Check and verify role in Firestore (as before)
      const userDoc = await this._firestore.collection('users').doc(userWithUid.uid).get().toPromise();
      if (userDoc?.exists) {
        const userData = userDoc.data() as { role: string };
        if (userData.role !== role) {
          throw { code: 'auth/role-mismatch', message: 'Role does not match the login page.' };
        }
      } else {
        throw { code: 'auth/user-not-found', message: 'User not found.' };
      }
  
      console.log(`${role} login successful`);
      return userCredential;
    } catch (error) {
      console.error('Login failed:', error); 
      throw error; 
    }
  }
  


  role:any
  logout(): void {
    this._signupService.roleSubjectObservable.subscribe((val)=>{
      this.role=val
    })
    this._afAuth.signOut().then(() => {
      this._router.navigate([`login/${this.role}`]); // Redirect to login after logout
    });
  }

  private getStoredCurrentUser() {
    try {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null; // Default to null if parsing fails
    }
  }
}
