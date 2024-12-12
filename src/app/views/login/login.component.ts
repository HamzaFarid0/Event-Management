import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../authentication/auth.service';
import { SignupService } from 'src/app/services/signup/signup.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _signupService: SignupService,
    private _router: Router
  ) {}

  role: any;

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params) => {
      this.role = params.get('role');
      console.log('loginprolepage' , this.role)
    });
  }
  email: string = '';
  password: string = '';
  loginError = '';

  navigateToSignup(role: any) {
    this._router.navigate(['../../signup/User'], { relativeTo: this._activatedRoute,});
  }

  getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email format. Please enter a valid email.';
      case 'auth/invalid-credential':
        return 'Invalid credentials'  
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No user found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
       case 'auth/role-mismatch' :
        return 'Error: Role mismatch'
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  }
  

  async onSubmit() {
    this._signupService.isSigningUp = false
    this._signupService.roleSubject.next(this.role)
    localStorage.setItem('role', this.role);
    this.loginError = ''; // Clear any previous errors
    // if(this.role === 'User'){
    try {
      await this._authService.login(this.email, this.password, this.role);
      if(this.role === 'Admin'){
        this._router.navigate(['../../dashboard' ], {relativeTo: this._activatedRoute})
      }else{
        this._router.navigate(['../../events' ], {relativeTo: this._activatedRoute})
      }
  
      console.log('Login successful');
      // Navigate or perform actions for successful login
    } catch (error: any) {
      console.error('Error during login:', error); // Log the error
      this.loginError = this.getErrorMessage(error.code); // Update the UI with the error message
    }
    setTimeout(() => {
      this.loginError = '';
    }, 7000);
  
}

showHint(){
  Swal.fire({
    title: 'Hi Recruiter!',
    html: '<p style="font-size: 20px;">Below are admin credentials:</p>' + 
          '<p style="font-size: 20px;">Admin email: admin@gmail.com<br>Admin Password: 12345678</p>'+
          '<p style="font-size: 16px;">No sign up for Admin because this web application is designed to support only a single admin account to maintain centralized control.</p>'
  });
  
}

}
