import * as React from "react";
import {Provider} from 'react-redux';
import {compose} from "redux";
import {Route, Routes, BrowserRouter } from "react-router-dom";
import {store} from "./redux/redux-store";
import {withRouter} from "./hoc/withRouter";
import "./assets/scss/style.css";
import {AuthManager} from "./AuthManager";
import {HeaderContainer} from "./components/Header/HeaderContainer";
import {Contacts} from "./components/Contacts";
import {Footer} from "./components/Footer/Footer";
import {Admin} from "./pages/admin/Admin";
import {BookingsContainer} from "./components/Admin/Bookings/BookingsContainer";
import {ClientsContainer} from "./components/Admin/Clients/ClientsContainer";
import {ProfileContainer} from "./components/Admin/ClientProfile/ProfileContainer";
import {LoginContainer} from "./pages/login/LoginContainer";
import {Preloader} from "./components/common/Preloader";
import {ArchivedClients} from "./components/Admin/Archive/Clients/ArchivedClients";
import {ArchivedBookings} from "./components/Admin/Archive/Bookings/ArchivedBookings";
import {ArchivedGallery} from "./components/Admin/Archive/Gallery/ArchivedGallery";
import {RegistrationContainer} from "./pages/registration/RegistrationContainer";
import {ScrollToTopButton} from "./components/common/ScrollToTopButton";
import {UsersContainer} from "./components/Admin/Users/UsersContainer";
import {NotFound} from "./components/404-page";
import {NoAccess} from "./components/NoAccess";
import {MainPage} from "./pages/mainPage/MainPage";
import {Portfolio} from "./pages/portfolio/Portfolio";
import {MainWrap} from "./components/MainWrap";

const App = () => {

    return (
        <AuthManager>
            <React.Suspense fallback={<Preloader />}>
                <HeaderContainer />
                <MainWrap>
                    <Routes>
                        <Route path='/'
                               element={<MainPage key={Math.random()}/>} />
                        <Route path={`registration`}
                               element={<RegistrationContainer />} />
                        <Route path={`login`}
                               element={<LoginContainer />} />
                        <Route path={`portfolio`}
                               element={<Portfolio />} />
                        <Route path={`admin`}
                               element={<Admin />}>
                            <Route path={`bookedConsultations`}
                                   element={<BookingsContainer />} />
                            <Route path={`clients`}
                                   element={<ClientsContainer />} />
                            <Route path={`profile`}
                                   element={<ProfileContainer />} />
                            <Route path={`archivedClients`}
                                   element={<ArchivedClients />} />
                            <Route path={`archivedConsultations`}
                                   element={<ArchivedBookings />} />
                            <Route path={`archivedGallery`}
                                   element={<ArchivedGallery />} />
                            <Route path={`users`}
                                   element={<UsersContainer/>} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                        <Route path={`noAccess`} element={<NoAccess />} />
                    </Routes>
                </MainWrap>
                <Contacts />
                <ScrollToTopButton/>
                <Footer />
            </React.Suspense>
        </AuthManager>
    );
}

const AppContainer = compose(withRouter)(App);

export const AhTattooistaApp = () => {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Provider store={store}>
                <AppContainer />
            </Provider>
        </BrowserRouter>
    );
};
