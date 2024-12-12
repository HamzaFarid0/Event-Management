import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import { SignupService } from 'src/app/services/signup/signup.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isSidebarVisible: boolean = false; 

    
  constructor(private _signupService : SignupService, private _authService :AuthService,
              private _router : Router
  ){}
  role :any
  ngOnInit(): void {
     this._signupService.roleSubjectObservable.subscribe((val)=>{
      this.role=val
      console.log('sidebar role' , this.role)
     })    
     console.log('onint same route')
  }

  reloadCurrentRoute(route : string): void {

    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      console.log('same route')
      this._router.navigate([`/${route}`]);
    });
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      this.isSidebarVisible = !this.isSidebarVisible;
      if (this.isSidebarVisible) {
        sidebar.classList.remove('-translate-x-full');
      } else {
        sidebar.classList.add('-translate-x-full');
      }
    }
  }

  closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      this.isSidebarVisible = false;
      sidebar.classList.add('-translate-x-full');
    }
  }
  logout(){
    this._authService.logout()

  }
}
