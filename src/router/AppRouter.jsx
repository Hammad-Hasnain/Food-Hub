import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import Billing from "../screens/billing/Billing";
import DealsMenu from "../screens/dealsMenu/DealsMenu";
import Footer from "../components/Footer";
import AuthRouter from "./AuthRouter";
import LoginScreen from "../screens/login/Login";
import History from "../screens/history/History";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Routes>
        <Route element={<AuthRouter />}>
          <Route path="/" element={<Billing />} />
          <Route path="/deals" element={<DealsMenu />} />
          <Route path="/history" element={<History />} />
        </Route>

        <Route path="/login" element={<LoginScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
