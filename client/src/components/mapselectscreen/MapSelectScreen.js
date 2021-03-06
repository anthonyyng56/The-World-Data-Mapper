import React, { useState, useEffect } 	from 'react';
import MapList 							from './MapList.js'
import { WButton} 						from 'wt-frontend';
import { GET_DB_MAPS } 					from '../../cache/queries';
import { useMutation, useQuery } 		from '@apollo/client';
import * as mutations 					from '../../cache/mutations';
import { useHistory }					from "react-router-dom";
import { WLMain} 						from 'wt-frontend';
import DeleteModal                  	from '../modals/DeleteModal.js'

const MapSelectScreen = (props) => {
	let maps = [];
	const [showMapInput, toggleShowMapInput] = useState(false);
	const [createInput, setCreateInput] = useState({ name: '' });
	const [deleteMapConfirmation, toggleDeleteMapConfirmation] = useState(false);
	const [delete_id, setDelete_id] = useState('');
	const [deleteName, setDeleteName] = useState('');
	const deleteMessage = 'Delete Map?'
	
	const history = useHistory();
	const auth = props.user === null ? false : true;
	const [AddMap] 			= useMutation(mutations.ADD_MAP);
	const [DeleteMap] 		= useMutation(mutations.DELETE_MAP);
	const [UpdateMapField] 	= useMutation(mutations.UPDATE_MAP_FIELD);
	const [SelectMap] 		= useMutation(mutations.SELECT_MAP);
	
	const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }

	const refetchMaps = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			maps = data.getAllMaps;
		}
	}

	useEffect(() => {
        refetch();
    }, []);

	const createNewMap = async () => {
		if (createInput.name.trim() === '') {
			alert("Please provide a non-empty name for your map");
			return;
		}
		let map = {
			_id: '',
			owner: props.user._id,
			name: createInput.name,
		}
		const {data} = await AddMap({ variables: { map: map }});
		if (data) {
			toggleShowMapInput(false);
			if (data.addMap != 'Could not add map') {
				history.push("/region/" + data.addMap);
			}
		}
	};

	const deleteMap = async () => {
		const { data } = await DeleteMap({ variables: { _id: delete_id } });
		if (data) {
			await refetchMaps(refetch);
			toggleDeleteMapConfirmation(false);
		}
	};

	const updateMapField = async (_id, field, value) => {
		const {data} = await UpdateMapField({variables: { _id: _id, field: field, value: value }})
		refetchMaps(refetch);
	}

	const hideCreateInput = () => {
		toggleShowMapInput(false)
	}

	const updateCreateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...createInput, [name]: value };
		setCreateInput(updated);
	}

	const returnToWelcome = () => {
        history.push("/");
    }

	return (
		<WLMain>
		{
			auth ?
			<>
			<div className="map-select">
				<h1 className="map-select-header">Your Maps</h1>
				<div className="maps-container">
					<MapList maps={maps} updateMapField={updateMapField} toggleShowMapInput={toggleShowMapInput} toggleDeleteMapConfirmation={toggleDeleteMapConfirmation} 
					 setDelete_id={setDelete_id} setDeleteName={setDeleteName} />
					<div className="create-map-container">
						<div className="map-earth-container">
							<img src={require('../../images/earth-1.png')} className = "map-earth" />
						</div>
						{
							showMapInput ? 
							<div className="create-map-input-container">
								<input type="text" placeholder="Enter Map Name Here" name="name" className="create-map-input" autoFocus={true} onBlur={updateCreateInput} />
								<div className="create-button-container">
									<WButton clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary" className="create-map-buttons" onClick={createNewMap}>
										Create
									</WButton>
									<WButton clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary" className="create-map-buttons" onClick={hideCreateInput}>
										Cancel
									</WButton>
								</div>
							</div> : 
							<WButton className="create-map" clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary" onClick={toggleShowMapInput}>
								Create New Map
							</WButton>
						}
					</div>
				</div>
			</div>
			{
				deleteMapConfirmation && <DeleteModal deleteMessage={deleteMessage} name={deleteName} toggleDeleteConfirmation={toggleDeleteMapConfirmation} delete={deleteMap} />
			}
			</>
			:
			<div className="no-access-page">
				<div className="no-access-header">You do not have access to this page!</div>
				<div className="no-access-text">Please log into your account to view your maps,  or click the button below to be redirected back to the welcome screen.</div>
				<div className="no-access-return-container">
				<WButton clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary" className="no-access-return-button" onClick={returnToWelcome}>
					Return to Welcome page
				</WButton>
				</div>
			</div>
		}
		</WLMain>
	);
};

export default MapSelectScreen;