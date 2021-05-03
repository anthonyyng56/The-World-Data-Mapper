import React from 'react';
import { useHistory } from "react-router-dom";

const Logo = (props) => {
    const history = useHistory();

    const goHome = () => {
        if (props.user === null) {
            history.push("/");
        } else {
            props.tps.clearAllTransactions();
        history.push("/home");
        }
    }
    return (
        <div className='logo' onClick={goHome}>
            The World Data Mapper
        </div>
    );
};

export default Logo;