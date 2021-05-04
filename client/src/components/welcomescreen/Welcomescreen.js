import React from 'react';

const Welcomescreen = (props) => {

	return (
		<div className="welcome-screen">
			<div className="welcome-container">
				<img className = "welcome-earth" src={require('../../images/earth-0.png')}/>
			</div>
			<div className="welcome-text">Welcome To The World Data Mapper</div>
		</div>
	);
};

export default Welcomescreen;