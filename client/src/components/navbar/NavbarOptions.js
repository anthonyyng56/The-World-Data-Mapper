import React, { useState }                                from 'react';
import { LOGOUT }                           from '../../cache/mutations';
import { useMutation, useApolloClient }     from '@apollo/client';
import { WButton, WNavItem }                from 'wt-frontend';

const LoggedIn = (props) => {
    const client = useApolloClient();
	const [Logout] = useMutation(LOGOUT);

    const handleLogout = async (e) => {
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
        }
    };

    return (
        <>
            <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" onClick={props.toggleShowUpdate} wType="texted" hoverAnimation="text-primary">
                    {props.user.name}
                </WButton>
            </WNavItem >
            <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" onClick={handleLogout} wType="texted" hoverAnimation="text-primary">
                    Logout
                </WButton>
            </WNavItem >
        </>
    );
};

const LoggedOut = (props) => {
    return (
        <>
            <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" onClick={props.toggleShowCreate} wType="texted" hoverAnimation="text-primary"> 
                    Create Account 
                </WButton>
            </WNavItem>
            <WNavItem hoverAnimation="lighten">
                <WButton className="navbar-options" onClick={props.toggleShowLogin} wType="texted" hoverAnimation="text-primary">
                    Login
                </WButton>
            </WNavItem>
        </>
    );
};


const NavbarOptions = (props) => {
    return (
        <>
            {
                props.user === null ? <LoggedOut toggleShowCreate={props.toggleShowCreate} toggleShowLogin={props.toggleShowLogin} />
                : <LoggedIn fetchUser={props.fetchUser} logout={props.logout} user={props.user} toggleShowUpdate={props.toggleShowUpdate} />
            }
        </>

    );
};

export default NavbarOptions;