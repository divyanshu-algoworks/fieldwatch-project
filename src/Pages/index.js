import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { PublicRoutes } from "../Routes/PublicRoute";
import { PrivateRoutes } from "../Routes/PrivateRoute";
import PrivateLayout from "../Pages/PrivateLayout";
import TopNavBar from "../components/TopNavBar";

export default function Index() {
    const location = useLocation();

    const shouldToNavBar = () => {
      const { pathname } = location;
      return !['/login', '/signup'].includes(pathname);
    };
    const isClientSelected = () => {
      const { pathname } = location;
      return pathname.includes('clients/')
    }

  return (
    <>
    {shouldToNavBar() && <TopNavBar isClientSelected={isClientSelected()}/>}
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        {PublicRoutes.map((item, index) => {
          return (
            <Route
              exact
              key={item.element}
              path={item.path}
              element={item.element}
            />
          );
        })}
          {PrivateRoutes.map((item, index) => {
            return (
              <>
                <Route
                  exact
                  key={item.element}
                  path={item.path}
                  element={
                    <PrivateLayout headertittle={item.headerTittle}>
                      {item.element}
                    </PrivateLayout>
                  }
                />
              </>
            );
          })}
      </Routes>
    </>
  );
}
