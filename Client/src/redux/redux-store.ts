import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { portfolioReducer } from "./Portfolio/portfolio-reducer";
import { generalReducer } from "./General/general-reducer";
import { bookingsReducer } from "./Bookings/bookings-reducer";
import { clientsReducer } from "./Clients/clients-reducer";
import { authReducer } from "./Auth/auth-reducer";
import { usersReducer} from "./Users/users-reducer";

let rootReducer = combineReducers({
  portfolio: portfolioReducer,
  general: generalReducer,
  bookings: bookingsReducer,
  clients: clientsReducer,
  auth: authReducer,
  users: usersReducer,
})

type RootReducerType = typeof rootReducer; // (global-state: AppStateType) => AppStateType
export type AppStateType = ReturnType<RootReducerType>;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)));

//window.store = store

//export default store
