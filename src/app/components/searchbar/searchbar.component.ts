import { Component, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Event } from 'src/app/models/event/event.model';
import { AppState } from 'src/app/store/app.state';
import { setSearchTerm } from 'src/app/views/events/state/event.actions';
import { selectEvents } from 'src/app/views/events/state/event.selectors';
@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit{

  searchIcon = faSearch
  events:Event[] = [];
  filteredEvents:Event[]= [];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {

  }

  onChange(e :any){
    const searchTerm = (e.target as HTMLInputElement).value;
    this.store.dispatch(setSearchTerm({ searchTerm })); 
  }

}
