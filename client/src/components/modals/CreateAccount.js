import React, { useState } 	from 'react';
import { REGISTER }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const CreateAccount = (props) => {
	const [input, setInput] = useState({ email: '', password: '', name: '' });
	const [loading, toggleLoading] = useState(false);
	const [Register] = useMutation(REGISTER);

	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleCreateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to register');
				return;
			}
		}
		const { loading, error, data } = await Register({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			if(data.register.email === 'already exists') {
				alert('User with that email already registered');
			}
			else {
				props.fetchUser();
			}
			props.toggleShowCreate(false);

		};
	};

	const handleCancel = () => {
		props.toggleShowCreate(false);
	}

	return (
		<WModal className="signup-modal" visible={true} cover={true} animation="slide-fade-top">
			<WMHeader className="modal-header" onClose={() => props.toggleShowCreate(false)}>
				Create A New Account
			</WMHeader>

			{
				loading ? <div />
					: <WMMain>
						<WRow className="modal-row">
							<div className="modal-row-content">
								<div className="input-names">&nbsp;&nbsp;&nbsp;&nbsp;Name:</div>
							
								<WInput 
									className="modal-input" onBlur={updateInput} name="name" labelAnimation="up" 
									labelText="*Enter Name Here*" wType="outlined" inputType="text" 
								/>
							</div>
						</WRow>
						<div className="modal-spacer">&nbsp;</div>
						<WRow className="modal-row">
							<div className="modal-row-content">
								<div className="input-names">&nbsp;&nbsp;&nbsp;Email:</div>
								<WInput 
									className="modal-input" onBlur={updateInput} name="email" labelAnimation="up" 
									labelText="*Enter Email Here*" wType="outlined" inputType="text" 
								/>
							</div>
						</WRow>
						<div className="modal-spacer">&nbsp;</div>
						<WRow className="modal-row">
							<div className="modal-row-content">
								<div className="input-names">Password:</div>
								<WInput 
									className="modal-input" onBlur={updateInput} name="password" labelAnimation="up" 
									labelText="*Enter Password Here*" wType="outlined" inputType="password" 
								/>
							</div>
						</WRow>
					</WMMain>
			}
			<div className="button-layout">
				<WButton className="modal-button create" onClick={handleCreateAccount} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Create Account
				</WButton>
				<WButton className="modal-button" onClick={handleCancel} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Cancel
				</WButton>
			</div>
			<div className="modal-spacer">&nbsp;</div>
		</WModal>
	);
}

export default CreateAccount;
