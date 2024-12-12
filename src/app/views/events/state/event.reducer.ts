import { createReducer, on } from '@ngrx/store';
import * as EventActions from './event.actions';
import { EventState, initialEventState } from './event.state';

export const eventReducer = createReducer(
  initialEventState,
  // Load Events
  on(EventActions.loadEvents, (state) => ({
    ...state,
  })),
  on(EventActions.loadEventsSuccess, (state, { events }) => ({
    ...state,
    events,
  })),
  on(EventActions.loadEventsFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(EventActions.createEventSuccess, (state, { event }) => ({
    ...state,
    events: [...state.events, event], // Add the new event with its ID
  })),
  
  on(EventActions.createEventFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Update Event
  on(EventActions.updateEventSuccess, (state, { updatedEvent }) => ({
    ...state,
    events: state.events.map((event) =>
      event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
    ),
  })),

  on(EventActions.deleteEventSuccess, (state, { id }) => ({
    ...state,
    events: state.events.filter((event) => event.id !== id), // Remove the event
  })),
  
  
  on(EventActions.deleteEventFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(EventActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm, // Update search term in the state
  }))
);
