import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { galleryReducer } from "./Gallery/gallery-reducer";
import { generalReducer } from "./General/general-reducer";
import { bookingsReducer } from "./Bookings/bookings-reducer";
import { clientsReducer } from "./Clients/clients-reducer";
import { authReducer } from "./Auth/auth-reducer";
import { usersReducer} from "./Users/users-reducer";
import {stylesReducer} from "./Styles/styles-reducer";
import {servicesReducer} from "./Services/services-reducer";
import {aboutReducer} from "./About/about-reducer";
import {faqReducer} from "./Faq/faq-reducer";
import {archivedBookingsReducer} from "./ArchivedBookings/archived-bookings-reducer";

let rootReducer = combineReducers({
  about: aboutReducer,
  services: servicesReducer,
  faq: faqReducer,
  gallery: galleryReducer,
  styles: stylesReducer,
  general: generalReducer,
  bookings: bookingsReducer,
  archivedBookings: archivedBookingsReducer,
  clients: clientsReducer,
  auth: authReducer,
  users: usersReducer,
});

type RootReducerType = typeof rootReducer; // (global-state: AppStateType) => AppStateType
export type AppStateType = ReturnType<RootReducerType>;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)));

//window.store = store
