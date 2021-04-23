import React, { useState, useEffect } 	from 'react';
import { GET_DB_TODOS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import WInput from 'wt-frontend/build/components/winput/WInput';


const WelcomeScreen = (props) => {

	return (
		<div>
			<img className = "welcome-earth" src={require('../../images/earth.png')}/>
			<div className="welcome-text">Welcome To The World Data Mapper</div>
		</div>
	);
};

export default WelcomeScreen;