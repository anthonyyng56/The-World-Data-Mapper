import React, { useState, useEffect } 				from 'react';
import Welcomescreen 								from './components/welcomescreen/Welcomescreen';
import { useQuery } 								from '@apollo/client';
import * as queries 								from './cache/queries';
import { jsTPS } 									from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect } 	from 'react-router-dom';
import Logo 										from './components/navbar/Logo';
import CreateAccount								from './components/modals/CreateAccount';
import Login										from './components/modals/Login';
import NavbarOptions								from './components/navbar/NavbarOptions';
import { WNavbar, WSidebar, WNavItem } 				from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } 		from 'wt-frontend';
 
const App = () => {
	let user = null;
    let transactionStack = new jsTPS();

	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);


    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);

    if(error) { console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser; }
    }










	
	// const undoCtrl = (event) => {
	// 	if (event.ctrlKey === true && event.key === 'z') {
	// 		tpsUndo();
	// 	}
	// }

	// const redoCtrl = (event) => {
	// 	if (event.ctrlKey === true && event.key === 'y') {
	// 		tpsRedo();
	// 	}
	// }

	// useEffect(() => {
    //     document.addEventListener('keydown', undoCtrl);
	// 	document.addEventListener('keydown', redoCtrl);
	// 	return () => {
	// 		document.removeEventListener("keydown", undoCtrl);
	// 		document.removeEventListener("keydown", redoCtrl);
	// 	}
    // });

	return(
		<BrowserRouter>

			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={refetch} user={user} 
							toggleShowCreate={toggleShowCreate} toggleShowLogin={toggleShowLogin}
						/>
					</ul>
				</WNavbar>
			</WLHeader>
			
			<Switch>
				<Redirect exact from="/" to={ {pathname: "/welcome"} } />
				<Route 
					path="/welcome" exact
					name="welcome" 
					render={() => 
						<Welcomescreen tps={transactionStack} fetchUser={refetch} user={user} />
					} 
				/>
				<Route/>
			</Switch>

			{
				showCreate && (<CreateAccount fetchUser={refetch} toggleShowCreate={toggleShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={refetch} toggleShowLogin={toggleShowLogin} />)
			}
		</BrowserRouter>
	);
}

export default App;