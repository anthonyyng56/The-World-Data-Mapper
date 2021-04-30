import React, { useState } 	from 'react';
import { UPDATE }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';
import { useHistory } from "react-router-dom";

import { WModal, WMHeader, WMMain, WButton, WRow } from 'wt-frontend';

const Update = (props) => {
	const [input, setInput] = useState({ _id: props.user._id, email: props.user.email, password: '', name: props.user.name });
	const [loading, toggleLoading] = useState(false);
	const [showPassword, toggleShowPassword] = useState(false);
	const passwordType = showPassword ? 'text' : 'password';
	const [showErr1, displayErrorMsg1] = useState(false);
	const [showErr2, displayErrorMsg2] = useState(false);
	const errorMsg1 = "All fields must be filled out to update account information.";
	const errorMsg2 = "User with that email already registered.";
	
	const [Update] = useMutation(UPDATE);
	const history = useHistory();

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleCheckShowPassword = () => {
		toggleShowPassword(!showPassword);
	}

	const handleUpdate = async (e) => {
		displayErrorMsg1(false);
		displayErrorMsg2(false);
		for (let field in input) {
			if (!input[field]) {
				displayErrorMsg1(true);
				return;
			}
		}
		const { loading, error, data } = await Update({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			if(data.update === false) {
				displayErrorMsg2(true);
				return;
			}
			else {
				props.fetchUser();
				history.push("/home");
			}
			props.toggleShowUpdate(false);
		};
	};

	const handleCancel = () => {
		props.toggleShowUpdate(false);
	}

	return (
		<WModal className="signup-modal" visible={true} cover={true} animation="slide-fade-top">
			<WMHeader className="modal-header" onClose={() => props.toggleShowUpdate(false)}>
				Enter Updated Account Information
			</WMHeader>
			{
				loading ? <div />
				:
				<WMMain>
				<WRow className="modal-row">
					<div className="modal-row-content">
						<div className="input-names">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name:</div>
						<input 
							className="modal-input update-input" onBlur={updateInput} name="name" defaultValue={props.user.name}
							placeholder="*Enter Updated Name Here*" type="text" 
						/>
					</div>
				</WRow>
				<div className="modal-spacer">&nbsp;</div>
				<WRow className="modal-row">
					<div className="modal-row-content">
						<div className="input-names">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Email:</div>
						<input 
							className="modal-input update-input" onBlur={updateInput} name="email" defaultValue={props.user.email}
							placeholder="*Enter Updated Email Here*" type="text" 
						/>
					</div>
				</WRow>
				<div className="modal-spacer">&nbsp;</div>
				<WRow className="modal-row">
					<div className="modal-row-content">
						<div className="input-names">Password:</div>
						<input 
							className="modal-input update-input password" onBlur={updateInput} name="password"
							placeholder="**********" type={passwordType}
						/>
					</div>
				</WRow>
				<div className='show-password'>
					<input type="checkbox" id="create-password" name="password" onClick={handleCheckShowPassword}/>
					<div>Show password&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
				</div>
				{
					showErr1 ? <div className='modal-error'>
						{errorMsg1}
					</div> : 
					showErr2 ? <div className='modal-error'>
						{errorMsg2}
					</div> : 
					<div className='modal-error'>&nbsp;</div>
				}
			</WMMain>
			}
			<div className="button-layout">
				<WButton className="modal-button left-button" onClick={handleUpdate} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Update
				</WButton>
				<WButton className="modal-button" onClick={handleCancel} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Cancel
				</WButton>
			</div>
			<div className="modal-spacer">&nbsp;</div>
		</WModal>
	);
}

export default Update;
