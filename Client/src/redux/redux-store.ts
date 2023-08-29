import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { portfolioReducer } from './Portfolio/portfolio-reducer'
import { mainPageReducer } from './MainPage/mainPage-reducer'
import { customersReducer } from './Customers/customers-reducer'
import { clientsReducer } from './Clients/clients-reducer'
import { authReducer } from './Auth/auth-reducer'
import { adminReducer } from './admin-reducer'
import { appReducer } from './app-reducer'

let rootReducer = combineReducers({
  portfolio: portfolioReducer,
  mainPage: mainPageReducer,
  customers: customersReducer,
  clients: clientsReducer,
  auth: authReducer,
  admin: adminReducer,
  app: appReducer,
})

type RootReducerType = typeof rootReducer; // (global-state: AppStateType) => AppStateType
export type AppStateType = ReturnType<RootReducerType>

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)))

//window.store = store

//export default store
