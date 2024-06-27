import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Header from "./components/App/header/Header";
import Footer from "./components/App/footer/Footer";
import Login from "./components/App/login/Login";
import User from "./components/App/lesson/User";
import Admin from "./components/App/lesson/Admin";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          element: (
            <>
              <Header />
              <Login />
              <Footer />
            </>
          ),
        },
        {
          path: "/login",
          element: (
            <>
              <Header />
              <Login />
              <Footer />
            </>
          ),
        },
        {
          path: "/:userId/lessons",
          element: (
            <>
              <Header />
              <User />
              <Footer />
            </>
          ),
        },
        {
          path: "/:userId/admin/lessons",
          element: (
            <>
              <Header />
              <Admin />
              <Footer />
            </>
          ),
        },
      ])}
    />
  </React.StrictMode>
);

reportWebVitals();
