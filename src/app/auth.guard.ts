import { Injectable, OnInit } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SignupService } from './services/signup/signup.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, OnInit {
  constructor(private _afAuth: AngularFireAuth, private _router: Router , private _signupService :SignupService) {}
  role:any 
  ngOnInit(): void {
    this._signupService.roleSubjectObservable.subscribe((val)=>{
      this.role=val
    })
  }


  canActivate(): Observable<boolean> {
    return this._afAuth.authState.pipe(
      map((user) => {
        if (user ) {
          // User is logged in, allow access
          return true;
        } else {

          // User is not logged in, redirect to login page
          this._router.navigate([``]); 
          return false;
        }
      })
    );
  }
}
