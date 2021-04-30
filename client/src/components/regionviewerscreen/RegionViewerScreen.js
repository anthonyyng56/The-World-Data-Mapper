import React, { useState, useEffect }           from 'react';
import { useParams }                            from 'react-router';
import { useMutation, useQuery } 		        from '@apollo/client';
import { GET_DB_MAP } 			                from '../../cache/queries';
import { WButton }                              from 'wt-frontend';
import { useHistory }					        from "react-router-dom";

const RegionViewerScreen = (props) => {
    let name = '';
    let capital = '';
    let leader = '';
    let numberOfSubregions;
    let parent_id = '';
    let parent = '';
    const [showAddLandmark, toggleShowAddLandmark] = useState(false);

    const history = useHistory();
    const { id } = useParams();
	const { loading, error, data, refetch } = useQuery(GET_DB_MAP, {variables: { _id: id }});

    if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) { 
        name = data.getMapById[0].name; 
        capital = data.getMapById[0].capital;
        leader = data.getMapById[0].leader;
        numberOfSubregions = data.getMapById[0].subregions_id.length;
        parent_id = data.getMapById[0].ancestors_id[data.getMapById[0].ancestors_id.length - 1]
        parent = data.getMapById[1].name;
    }

    const handleHideShowLandmark = () => {
        toggleShowAddLandmark(false);
    }

    const handleReturnToSpreadsheet = () => {
        history.push("/region/" + parent + '/' + parent_id);
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
                    <div className="viewer-information-row">Parent Region: &nbsp;&nbsp;<span className="link-color navigate-parent" onClick={handleReturnToSpreadsheet}>{parent}</span></div>
                    <div className="viewer-information-row">Region Capital: &nbsp;&nbsp;{capital}</div>
                    <div className="viewer-information-row">Region Leader: &nbsp;&nbsp;{leader}</div>
                    <div className="viewer-information-row"># Of Subregions: &nbsp;&nbsp;{numberOfSubregions}</div>
                </div>
            </div>
            <div className="viewer-right-content">
                <div className="viewer-landmarks-title">Region Landmarks:</div>
                <div className="viewer-landmarks-container">
                    <div>Landmarks</div>
                </div>
                <div className="viewer-add-landmark">
                {
                    showAddLandmark ?
                    <div className="add-landmark-input-container">
                        <input type="text" placeholder="Enter Landmark Name Here" className="add-landmark-input" autoFocus={true} />
                        <div className="submit-add-landmark" onClick={handleHideShowLandmark}>
						    Add
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