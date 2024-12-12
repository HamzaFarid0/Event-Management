import { createAction, props } from '@ngrx/store';

export const loadEvents = createAction('Load Events');
export const loadEventsSuccess = createAction(
  'Load Events Success',
  props<{ events: any }>()
);
export const loadEventsFailure = createAction(
  'Load Events Failure',
  props<{ error: string }>()
);

export const createEvent = createAction(
  'Create Event',
  props<{ event: any }>()
);
export const createEventSuccess = createAction(
  'Create Event Success',
  props<{ event: any }>()
);
export const createEventFailure = createAction(
  'Create Event Failure',
  props<{ error: string }>()
);


export const updateEvent = createAction(
  'Update Event',
  props<{ id: string; updatedEvent: any }>()
);

export const updateEventSuccess = createAction(
  'Update Event Success',
  props<{ updatedEvent: any }>()
);
export const updateEventFailure = createAction(
  'Update Event Failure',
  props<{ error: string }>()
);

// Delete Event
export const deleteEvent = createAction(
  'Delete Event',
  props<{ id: string }>()
);
export const deleteEventSuccess = createAction(
  'Delete Event Success',
  props<{ id: string }>()
);
export const deleteEventFailure = createAction(
  'Delete Event Failure',
  props<{ error: string }>()
);

export const setSearchTerm = createAction(
  '[Event] Set Search Term',
  props<{ searchTerm: string }>()
);