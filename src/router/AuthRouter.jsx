import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthRouter = () => {
  // const auth = true;
  const auth = localStorage.getItem("user");

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthRouter;
