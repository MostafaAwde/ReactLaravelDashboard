import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export const GuestLayout = () => {
  const { token } = useStateContext();

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div id="guestLayout">
      <Outlet />
    </div>
  );
};
