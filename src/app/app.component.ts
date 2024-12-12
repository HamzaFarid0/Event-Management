import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SignupService } from './services/signup/signup.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor( private _router: Router , private _activatedRoute : ActivatedRoute,
               private _signupService : SignupService ){}
  showAppComponent : any

ngOnInit(): void {
  this._router.events.subscribe((event)=>{
    if(event instanceof NavigationEnd){
      if(event.url==='/'){
        this.showAppComponent=true
      }else{
        this.showAppComponent=false
      }
    }
  })
}

  navigateToLogin(role: any){
    this._signupService.roleSubject.next(role)
    this._router.navigate(['login' , role] , {relativeTo : this._activatedRoute})

    console.log('home role' , role)

  }

}
