import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from "mobx-react";
import stores from './stores/index';
import { rehydrate } from "rfx-core";
import reportWebVitals from './reportWebVitals';
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = rehydrate();
root.render(
  // <React.StrictMode>
  <DragDropContextProvider backend={HTML5Backend}>
    <Provider store={store}>
    <App />
    </Provider>
    </DragDropContextProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
