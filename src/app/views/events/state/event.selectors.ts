import { createSelector, createFeatureSelector } from '@ngrx/store';
import { EventState } from './event.state';

// Feature selector for the entire event state
export const getEventState = createFeatureSelector<EventState>('event');

// Selector for events list
export const selectEvents = createSelector(
    getEventState,
  (state: EventState) => state.events
);

// Selector for the search term
export const selectSearchTerm = createSelector(
  getEventState,
  (state: EventState) => state.searchTerm
);

// Selector for filtered events based on the search term
export const selectFilteredEvents = createSelector(
  selectEvents,
  selectSearchTerm,
  (events, searchTerm) =>
    events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
);

