import { AppStateType } from "../redux-store";

export const getPageAboutSelector = (state: AppStateType) => {
  return state.about.pageAbout;
}

export const getFakeApiSelector = (state: AppStateType) => {
  return state.about.fakeApi;
}
