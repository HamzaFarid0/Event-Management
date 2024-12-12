import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SignupService } from 'src/app/services/signup/signup.service';
import { users } from 'src/assets/data/users/users';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{

  username! : string
  email! :string
  password! : string
 constructor(private _signupService : SignupService, 
             private _activatedRoute: ActivatedRoute,
             private _router : Router
             
            ) {}
role: any
signupError : any
 ngOnInit(): void {
   this._activatedRoute.paramMap.subscribe((params) => {
    this.role = params.get('role');
  console.log('signuprolepage' , this.role)
  });
 }

private  userData =users

navigateToLogin(role: any) {
  this._router.navigate(['../../login/User'], { relativeTo: this._activatedRoute,});
}

getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'The email address is already in use by another account.';
    case 'auth/invalid-email':
      return 'Invalid email format. Please enter a valid email.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    default:
      return 'An unexpected error occurred during signup. Please try again later.';
  }
}


async onSubmit() {
  this._signupService.isSigningUp = true
  this.signupError = ''; 
  this.role='User'
  try {
    // Wait for the signup process to complete
    await this._signupService.signup(this.email, this.password, this.username, this.role);
    console.log('Signup successful');
    // this.navigateToLogin(this.role) 
  } catch (error: any) {
    console.error('Error during signup:', error); 
    this.signupError = this.getErrorMessage(error.code); 
  }

  // Clear the error message after 7 seconds
  setTimeout(() => {
    this.signupError = '';
  }, 7000);
}

}
