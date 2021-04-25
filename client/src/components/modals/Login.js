import React, { useState } 	from 'react';
import { LOGIN } 			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { useHistory } from "react-router-dom";


import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const Login = (props) => {
	const [input, setInput] = useState({ email: '', password: '' });
	const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "Email/Password not found.";
	const [Login] = useMutation(LOGIN);
	const history = useHistory();

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	}

	const handleLogin = async (e) => {
		const { loading, error, data } = await Login({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (data.login._id === null) {
			displayErrorMsg(true);
			return;
		}
		if (data) {
			props.fetchUser();
			toggleLoading(false)
			props.toggleShowLogin(false)
			history.push("/maps");
		};
	};

	const handleCancel = () => {
		props.toggleShowLogin(false);
	}


	return (
		<WModal className="login-modal" visible={true} cover={true} animation="slide-fade-top">
			<WMHeader className="modal-header" onClose={() => props.toggleShowLogin(false)}>
				Login To Your Account
			</WMHeader>

			{
				loading ? <div />
					: <WMMain>
						<WRow className="modal-row">
							<div className="modal-row-content">
								<div className="input-names">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Email:</div>
								<WInput 
									className="modal-input" onBlur={updateInput} name='email' labelAnimation="up" 
									labelText="*Enter Email Here*" wType="outlined" inputType='text' 

								/>
							</div>
						</WRow>
						<div className="modal-spacer">&nbsp;</div>
						<WRow className="modal-row">
							<div className="modal-row-content">
								<div className="input-names">Password:</div>
								<WInput 
									className="modal-input" onBlur={updateInput} name='password' labelAnimation="up" 
									labelText="*Enter Password Here*" wType="outlined" inputType='password' 
								/>
							</div>
						</WRow>
						<div className="modal-spacer">&nbsp;</div>

						{
							showErr ? <div className='modal-error'>
								{errorMsg}
							</div>
								: <div className='modal-error'>&nbsp;</div>
						}

					</WMMain>
			}
			<div className="button-layout">
				<WButton className="modal-button left-button" onClick={handleLogin} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Login
				</WButton>
				<WButton className="modal-button" onClick={handleCancel} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Cancel
				</WButton>
			</div>
			<div className="modal-spacer">&nbsp;</div>
		</WModal>
	);
}

export default Login;