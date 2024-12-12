import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private _firestore: AngularFirestore) {}

  getUsersWithRoleUser(): Observable<any[]> {
    return this._firestore
      .collection('users', (ref) => ref.where('role', '==', 'User')) 
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as { username: string; email: string };
            const id = a.payload.doc.id; // Document ID (if needed)
            return { id, ...data };
          })
        )
      );
  }
}
