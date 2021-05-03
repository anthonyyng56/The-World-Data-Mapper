import React                                from 'react';
import { LOGOUT }                           from '../../cache/mutations';
import { useMutation, useApolloClient }     from '@apollo/client';
import { WButton }                          from 'wt-frontend';
import { useHistory }                       from "react-router-dom";

const LoggedIn = (props) => {
    const client = useApolloClient();
	const [Logout] = useMutation(LOGOUT);
    const history = useHistory();
    const handleLogout = async (e) => {
        history.push("/");
        props.tps.clearAllTransactions();
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
        }
    };

    return (
        <div className="credential-controls-container">
            <div className="credential-controls">
                <WButton className="navbar-options" onClick={props.toggleShowUpdate} wType="texted" hoverAnimation="text-primary">
                    {props.user.name}
                </WButton>
            </div>
            <div className="credential-controls">
                <WButton className="navbar-options" onClick={handleLogout} wType="texted" hoverAnimation="text-primary">
                    Logout
                </WButton>
            </div>
        </div>
    );
};

const LoggedOut = (props) => {
    return (
        <div className="credential-controls-container">
            <div className="credential-controls">
                <WButton className="navbar-options" onClick={props.toggleShowCreate} wType="texted" hoverAnimation="text-primary"> 
                    Create Account 
                </WButton>
            </div>
            <div className="credential-controls">
                <WButton className="navbar-options" onClick={props.toggleShowLogin} wType="texted" hoverAnimation="text-primary">
                    Login
                </WButton>
            </div>
        </div>
    );
};


const NavbarOptions = (props) => {
    return (
        <>
            {
                props.user === null ? <LoggedOut toggleShowCreate={props.toggleShowCreate} toggleShowLogin={props.toggleShowLogin} />
                : <LoggedIn fetchUser={props.fetchUser} logout={props.logout} user={props.user} toggleShowUpdate={props.toggleShowUpdate} tps={props.tps} />
            }
        </>

    );
};

export default NavbarOptions;