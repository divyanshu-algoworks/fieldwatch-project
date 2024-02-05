import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateLayout(props) {
     const token = JSON.parse(localStorage.getItem('userInfoState'))?.userToken;;
    if(token){
        return (
            <div className=''>
                {props.children}
            </div>
        )
    } else {
        return (
			<Navigate replace to="/login" />
		);
    }
}
