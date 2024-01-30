import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { PublicRoutes } from '../Routes/PublicRoute';
import { PrivateRoutes } from '../Routes/PrivateRoute';
import PrivateLayout from '../Pages/PrivateLayout';

export default function index() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                <Route path="/" element={<Navigate replace to="/login" />} />
                {/* <Route path="/dashboard" element={<Navigate replace to="/dashboard" />} /> */}
                    {PublicRoutes.map((item, index) => {
                        return (
                            <Route key={item.element} path={item.path}
                                element={item.element}
                            />
                        )
                    }
                    )}
                    {PrivateRoutes.map((item, index) => {
                        return (
                            <Route key={item.element} path={item.path}
                                element={<PrivateLayout headertittle={item.headerTittle}>{item.element}</PrivateLayout>}
                            />
                        )
                    }
                    )}
                </Routes>
            </BrowserRouter>
        </>
    )
}
