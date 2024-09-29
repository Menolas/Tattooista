import React from "react";
import ReactDOM from "react-dom/client";
import { AhTattooistaApp } from "./AppComponent";
import {DataProvider} from "./DataContext";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <DataProvider>
        <AhTattooistaApp />
    </DataProvider>
);
