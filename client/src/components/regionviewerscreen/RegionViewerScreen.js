import React, { useState, useEffect }           from 'react';
import { useParams }                            from 'react-router';
import { useMutation, useQuery } 		        from '@apollo/client';
import { GET_DB_MAP_INFO } 			            from '../../cache/queries';
import * as mutations 					        from '../../cache/mutations';
import { WButton }                              from 'wt-frontend';
import { useHistory }					        from "react-router-dom";
import RegionLandmarksList 		                from './RegionLandmarksList.js'

const RegionViewerScreen = (props) => {
    let name = '';
    let capital = '';
    let leader = '';
    let numberOfSubregions;
    let landmarks = [];
    let parent_id = '';
    let parent = '';
    
    const [showAddLandmark, toggleShowAddLandmark] = useState(false);
    const [landmarkInput, setLandmarkInput] = useState({ name: '' });

    const history = useHistory();
    const [AddLandmark] 			= useMutation(mutations.ADD_LANDMARK);
    const { id } = useParams();
	const { loading, error, data, refetch } = useQuery(GET_DB_MAP_INFO, {variables: { _id: id }});

    if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) { 
        name = data.getMapInfoById[0].name; 
        capital = data.getMapInfoById[0].capital;
        leader = data.getMapInfoById[0].leader;
        numberOfSubregions = data.getMapInfoById[0].subregions_id.length;
        landmarks = data.getMapInfoById[0].landmarks;
        parent_id = data.getMapInfoById[0].ancestors_id[data.getMapInfoById[0].ancestors_id.length - 1]
        parent = data.getMapInfoById[1].name;
    }

    const hideAddLandmark = () => {
        toggleShowAddLandmark(false);
    }

    const returnToSpreadsheet = () => {
        history.push("/region/" + parent + '/' + parent_id);
    }

    const addNewLandmark = async () => {
        if (landmarkInput.name.trim() === '') {
			alert("Please provide a non-empty landmark name");
			return;
		}
		const {data} = await AddLandmark({variables: { _id: id, value: landmarkInput.name }});
        toggleShowAddLandmark(false);
        refetch();
    }

    const updateLandmarkInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...landmarkInput, [name]: value };
		setLandmarkInput(updated);
	}

    useEffect(() => {
        refetch();
    }, []);


	return (
		<div className="region-viewer-container">
			<div className="viewer-left-content">
                <div className="viewer-image-container">
                    <img className="viewer-filler-image" src={require('../../images/image.png')}/>
                </div>
                <div className="viewer-information-container">
                    <div className="viewer-information-row">Region Name: &nbsp;&nbsp;{name}</div>
                    <div className="viewer-information-row">Parent Region: &nbsp;&nbsp;<span className="link-color navigate-parent" onClick={returnToSpreadsheet}>{parent}</span></div>
                    <div className="viewer-information-row">Region Capital: &nbsp;&nbsp;{capital}</div>
                    <div className="viewer-information-row">Region Leader: &nbsp;&nbsp;{leader}</div>
                    <div className="viewer-information-row"># Of Subregions: &nbsp;&nbsp;{numberOfSubregions}</div>
                </div>
            </div>
            <div className="viewer-right-content">
                <div className="viewer-landmarks-title">Region Landmarks:</div>
                <div className="viewer-landmarks-container">
                    <RegionLandmarksList landmarks={landmarks}/>
                </div>
                <div className="viewer-add-landmark">
                {
                    showAddLandmark ?
                    <div className="add-landmark-input-container">
                        <input type="text" placeholder="Enter Landmark Name Here" name="name" className="add-landmark-input" autoFocus={true} onBlur={updateLandmarkInput}/>
                        <div className="add-landmark-controls" onClick={addNewLandmark}>
						    Add
					    </div>
                        <div className="add-landmark-controls" onClick={hideAddLandmark}>
						    Cancel
					    </div>
                    </div>
                    :
                    <WButton className="add-landmark" clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary" onClick={toggleShowAddLandmark}>
						Add Landmark
					</WButton>
                }
                </div>
            </div>   
		</div>
	);
};

export default RegionViewerScreen;