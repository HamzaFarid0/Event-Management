import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { SignupComponent } from './views/signup/signup.component';
import { EventsComponent } from './views/events/events.component';
import { DasboardComponent } from './views/dasboard/dasboard.component';
import { AuthGuard } from './auth.guard';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { homeAndLoginGuard } from './home-and-login.guard';
import { UsersComponent } from './views/users/users.component';
import { InvitationsComponent } from './views/invitations/invitations.component';

const routes: Routes = [
  {path : '' , component :AppComponent, canActivate: [homeAndLoginGuard], },
  {path : 'login/:role' , component:LoginComponent, canActivate: [homeAndLoginGuard]  },
  {path : 'signup/User' , component : SignupComponent},
  {path : 'dashboard' , component : DasboardComponent, canActivate: [AuthGuard], },
  {path : 'events' , component: EventsComponent,  canActivate: [AuthGuard], },
  {path : 'users' , component : UsersComponent,  canActivate: [AuthGuard],},
  {path : 'invitations' , component : InvitationsComponent,  canActivate: [AuthGuard]},
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
