import React from "react";
import Billing from "./screens/billing/Billing";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DealsMenu from "./screens/dealsMenu/DealsMenu";
import { Bounce, ToastContainer } from "react-toastify";
import Footer from "./components/Footer";
import AppRouter from "./router/AppRouter";

const App = () => {
  return (
    <>
      <AppRouter />
      {/* <main className="p-4">
        <Billing />
      </main> */}
    </>
  );
};

export default App;
