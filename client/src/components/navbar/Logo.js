import React from 'react';
import { useHistory } from "react-router-dom";

const Logo = (props) => {
    const history = useHistory();

    const goHome = () => {
        props.setCurrentRegion('');
        props.setCurrentRegion_id('');
        history.push("/home");
    }
    return (
        <div className='logo' onClick={goHome}>
            The World Data Mapper
        </div>
    );
};

export default Logo;