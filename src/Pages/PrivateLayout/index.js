import React from 'react';
import { Navigate } from 'react-router-dom';
// import Header from '../Header/Header';

export default function PrivateLayout(props) {
     const token = JSON.parse(localStorage.getItem('userInfoState')).userToken;;
    if(token){
        return (
            <div className='min-h-screen scr-h'>
                {props.children}
            </div>
        )
    } else {
        return (
			<Navigate replace to="/login" />
		);
    }
}
