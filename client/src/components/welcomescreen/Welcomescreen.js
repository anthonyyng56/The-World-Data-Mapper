import React, { useState, useEffect } 	from 'react';
import { GET_DB_TODOS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import WInput from 'wt-frontend/build/components/winput/WInput';
import Logo 							from '../navbar/Logo';
import NavbarOptions					from '../navbar/NavbarOptions';



const Welcomescreen = (props) => {




	return (
		<WLayout wLayout="header-lside">
			

			
		</WLayout>
	);
};

export default Welcomescreen;