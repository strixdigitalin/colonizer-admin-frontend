import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'react-quill/dist/quill.snow.css';


ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ToastContainer autoClose={2000}/>
    <App />
  </Provider>
);
