import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './views/login/login.component';
import { SignupComponent } from './views/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { EventsComponent } from './views/events/events.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CreateEventFormComponent } from './components/create-event-form/create-event-form.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import {AngularFireModule}  from '@angular/fire/compat'
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './store/app.state';
import { EventEffects } from './views/events/state/event.effects';
import { EffectsModule } from '@ngrx/effects';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { DasboardComponent } from './views/dasboard/dasboard.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { UsersComponent } from './views/users/users.component';
import { InvitationsComponent } from './views/invitations/invitations.component';
import { RouteReuseStrategy } from '@angular/router';

@NgModule({
  
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    SidebarComponent,
    EventsComponent,
    SearchbarComponent,
    CreateEventFormComponent,
    EventCardComponent,
    DasboardComponent,
    PageNotFoundComponent,
    UsersComponent,
    InvitationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([EventEffects]),
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
