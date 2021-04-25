import React, { useState } 	from 'react';
import MapList 							from './MapList.js'
import { WButton} 				from 'wt-frontend';
import { GET_DB_MAPS } 				from '../../cache/queries';
import { useMutation, useQuery } 		from '@apollo/client';
import * as mutations 					from '../../cache/mutations';

const MapSelectScreen = (props) => {
	let maps = [];
	const [showMapInput, toggleShowMapInput] = useState(false);
	const [createInput, setCreateInput] = useState({ name: '' });
	const [AddMap] 			= useMutation(mutations.ADD_MAP);

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

	const createNewMap = async () => {
		if (createInput.name === '') {
			alert("Please provide a name for your map");
			return;
		}
		const length = maps.length
		let largestId = 0;
		for (let i = 0; i < length; i++) {
			if (maps[i].id >= largestId) {
				largestId = maps[i].id + 1;
			}
		}
		largestId =  largestId + Math.floor((Math.random() * 100) + 1);
		const id = largestId;
		let map = {
			_id: '',
			id: id,
			name: createInput.name,
			owner: props.user._id,
		}
		const {data} = await AddMap({ variables: { map: map }});
		map._id = data.addMap;
		refetch();
		toggleShowMapInput(false);
	};

	const handleHideCreateInput = () => {
		toggleShowMapInput(false)
	}

	const updateCreateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...createInput, [name]: value };
		setCreateInput(updated);
	}

	return (
		<div className="map-select">
			<h1 className="map-select-header">Your Maps</h1>
			<div className="maps-container">
				<MapList maps={maps} />
				<div className="create-map-container">
					<img src={require('../../images/earth-1.png')} className = "map-earth" />
					{
						showMapInput ? 
						<div className="create-map-input-container">
							<input type="text" placeholder="Enter Map Name Here" name="name" className="create-map-input" autoFocus={true} onBlur={updateCreateInput} />
							<div className="create-button-container">
								<WButton clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary" className="create-map-buttons" onClick={createNewMap}>
									Create
								</WButton>
								<WButton clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary" className="create-map-buttons" onClick={handleHideCreateInput}>
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
	);
};

export default MapSelectScreen;