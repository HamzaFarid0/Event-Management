import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, from } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as EventActions from './event.actions';
import { EventsService } from 'src/app/services/events/events.service';

@Injectable()
export class EventEffects {
  constructor(
    private actions$: Actions,
    private eventsService: EventsService
  ) {}

  loadEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventActions.loadEvents),
      mergeMap(() =>
        from(this.eventsService.getEvents()).pipe(
          map((events) => EventActions.loadEventsSuccess({ events })),
          catchError((error) =>
            of(EventActions.loadEventsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventActions.createEvent),
      mergeMap(({ event }) =>
        from(this.eventsService.createEvent(event)).pipe(
          map((createdEventId) =>
            EventActions.createEventSuccess({
              event: { ...event, id: createdEventId }, // Attach the generated ID
            
            })
        
          
          ),
          catchError((error) =>
            of(EventActions.createEventFailure({ error: error.message }))
          )
        )
      )
    )
  );
  
  

  updateEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventActions.updateEvent),
      mergeMap(({ id, updatedEvent }) =>
        from(this.eventsService.updateEvent(id, updatedEvent)).pipe(
          map(() => EventActions.updateEventSuccess({ updatedEvent })),
          catchError((error) =>
            of(EventActions.updateEventFailure({ error: error.message }))
          )
        )
      )
    )
  );

deleteEvent$ = createEffect(() =>
  this.actions$.pipe(
    ofType(EventActions.deleteEvent),
    mergeMap(({ id }) =>
      from(this.eventsService.deleteEvent(id)).pipe(
        map(() => EventActions.deleteEventSuccess({ id })),
        catchError((error) =>
          of(EventActions.deleteEventFailure({ error: error.message }))
        )
      )
    )
  )
);

  
}
