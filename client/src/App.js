import React, { useState, useEffect } 				from 'react';
import WelcomeScreen 								from './components/welcomescreen/WelcomeScreen';
import MapSelectScreen 								from './components/mapselectscreen/MapSelectScreen';
import RegionSpreadsheetScreen 						from './components/regionspreadsheetscreen/RegionSpreadsheetScreen';
import RegionViewerScreen 							from './components/regionviewerscreen/RegionViewerScreen';
import { useQuery } 								from '@apollo/client';
import * as queries 								from './cache/queries';
import { jsTPS } 									from './utils/jsTPS';
import { BrowserRouter, Switch, Route, Redirect } 	from 'react-router-dom';
import Logo 										from './components/navbar/Logo';
import CreateAccount								from './components/modals/CreateAccount';
import Login										from './components/modals/Login';
import Update										from './components/modals/Update';
import NavbarOptions								from './components/navbar/NavbarOptions';
import { WLHeader, WNavbar, WNavItem } 				from 'wt-frontend';
 
const App = () => {
	let user = null;
    let transactionStack = new jsTPS();

	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showUpdate, toggleShowUpdate] 	= useState(false);
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);

    if(error) { console.log(error); }
	if(loading) { console.log(loading); }
	if(data) { 
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { 
			user = getCurrentUser; 
		}
    }




	


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
							toggleShowUpdate={toggleShowUpdate} 
						/>
					</ul>
				</WNavbar>
			</WLHeader>
			
			<Switch>
				<Redirect exact from="/" to={ {pathname: "/welcome"} } />
				<Route 
					exact path="/welcome"
					name="welcome" 
					render={() => 
						<WelcomeScreen fetchUser={refetch} user={user} />
					} 
				/>
				<Route 
					exact path="/home"
					name="home" 
					render={() => 
						<MapSelectScreen fetchUser={refetch} user={user} />
					} 
				/>
				<Route 
					path="/region/:name/:id"
					name="region" 
					render={() => 
						<RegionSpreadsheetScreen tps={transactionStack} fetchUser={refetch} user={user} />
					} 
				/>
				<Route 
					path="/regionview/:name/:id"
					name="regionview" 
					render={() => 
						<RegionViewerScreen tps={transactionStack} fetchUser={refetch} user={user} />
					} 
				/>
			</Switch>

			{
				showCreate && (<CreateAccount fetchUser={refetch} toggleShowCreate={toggleShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={refetch} toggleShowLogin={toggleShowLogin} />)
			}
			
			{
				showUpdate && (<Update fetchUser={refetch} toggleShowUpdate={toggleShowUpdate} user={user}/>)
			}
		</BrowserRouter>
	);
}

export default App;