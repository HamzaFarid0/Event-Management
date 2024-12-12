import { eventReducer } from "../views/events/state/event.reducer";
import { EventState } from "../views/events/state/event.state";

export interface AppState {
    event : EventState
}

export const appReducer = {
    event : eventReducer,
}