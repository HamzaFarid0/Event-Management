import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Event } from 'src/app/models/event/event.model';
import { EventsService } from 'src/app/services/events/events.service';
import { SignupService } from 'src/app/services/signup/signup.service';
import { createEvent, loadEvents } from 'src/app/views/events/state/event.actions';

@Component({
  selector: 'app-create-event-form',
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.css']
})
export class CreateEventFormComponent implements OnInit{

  role: any

  constructor(private _eventService : EventsService , private _store : Store,
              private _signupService : SignupService
  ) {}

  ngOnInit(): void {
    this._signupService.roleSubjectObservable.subscribe((val)=>{
      this.role=val
    })
  }
  // Event object to bind form fields
  event : Event = {
    title: '',
    date: '',
    time: '',
    location: '',
    image: '',  // Store the Base64 image string here
    timestamp : 0,
    id : '0',
  };

  // Flag to control popup visibility
  isPopupVisible = false;

  // Function to show popup
  showPopup() {
    this.isPopupVisible = true;
  }

  // Function to hide popup (called when Cancel is clicked)
  hidePopup() {
    this.isPopupVisible = false;
  }

  // Handle form submission
 submitEvent() {
    if (this.event.title && this.event.date && this.event.time  && this.event.location) {
     
     this._store.dispatch(createEvent({event :this.event})) 
        console.log('Event successfully created', this.event);
        this.resetForm();
        this.hidePopup();
 
    } else {
      alert('Please fill in all the fields.');
    }
  }

  // Handle image upload and store Base64 string
  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.event.image = reader.result as string; // Store the image data as Base64
      };
      reader.readAsDataURL(file);  // Convert the image to Base64 format
    }
  }

  // Reset the form
  resetForm() {
    this.event = {
      title: '',
      date: '',
      time: '',
      location: '',
      image: '',  // Reset the image data
      timestamp : 0,
      id : '0',
    };
  }
}
