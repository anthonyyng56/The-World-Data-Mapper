import React, { useState, useEffect } 	from 'react';
import MapList 							from './MapList.js'
import { WButton} 						from 'wt-frontend';
import { GET_DB_MAPS } 					from '../../cache/queries';
import { useMutation, useQuery } 		from '@apollo/client';
import * as mutations 					from '../../cache/mutations';
import { useHistory }					from "react-router-dom";

const MapSelectScreen = (props) => {
	let maps = [];
	const [showMapInput, toggleShowMapInput] = useState(false);
	const [createInput, setCreateInput] = useState({ name: '' });
	
	const history = useHistory();
	const [AddMap] 			= useMutation(mutations.ADD_MAP);
	const [DeleteMap] 		= useMutation(mutations.DELETE_MAP);
	const [UpdateMapField] 	= useMutation(mutations.UPDATE_MAP_FIELD);
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
		map._id = data.addMap;
		refetch();
		toggleShowMapInput(false);
		history.push("/region/" + map.name + '/' + map._id);
	};

	const deleteMap = async (_id) => {
		DeleteMap({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_MAPS }] });
	};

	const updateMapField = async (_id, field, value) => {
		const {data} = await UpdateMapField({variables: { _id: _id, field: field, value: value }})
		refetchMaps(refetch);
	}

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
				<MapList maps={maps} updateMapField={updateMapField} toggleShowMapInput={toggleShowMapInput} deleteMap={deleteMap} />
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