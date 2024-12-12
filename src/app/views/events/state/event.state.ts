import { Event } from "src/app/models/event/event.model";

export interface EventState {
  events: Event[];
  searchTerm: string;
}

export const initialEventState: EventState = {
  events: [],
  searchTerm: '',
};
