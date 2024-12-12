import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SignupService } from './services/signup/signup.service';

@Injectable({
  providedIn: 'root',
})
export class homeAndLoginGuard implements CanActivate {

  role: any

  constructor(
    private _afAuth: AngularFireAuth,
    private _router: Router,
    private _firestore: AngularFirestore,
    private _signupService : SignupService
  ) {}

  canActivate(): Observable<boolean> {
    return this._afAuth.authState.pipe(
      map((user) => {
        if (user && !this._signupService.isSigningUp ) {
          this._signupService.roleSubjectObservable.subscribe((val)=>{
            this.role=val
          })
          if(this.role==='Admin'){
            this._router.navigate(['dashboard']); 
            return false;
          }else{
            this._router.navigate(['events']); 
            return false;
          }

        } else {
return true
        }
      })
    );
  }
}
