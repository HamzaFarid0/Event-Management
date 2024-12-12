import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { loadEvents } from './state/event.actions';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit{
 
  constructor(private _store : Store<AppState>) {}
  ngOnInit(): void {
    this._store.dispatch(loadEvents())
  }

}
