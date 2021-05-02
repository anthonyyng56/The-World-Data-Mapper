import React, { useState, useEffect }           from 'react';
import { useParams }                            from 'react-router';
import { useMutation, useQuery } 		        from '@apollo/client';
import { GET_DB_MAP, GET_DB_PARENT } 			from '../../cache/queries';
import * as mutations 					        from '../../cache/mutations';
import { WButton }                              from 'wt-frontend';
import { useHistory }					        from "react-router-dom";
import RegionLandmarksList 		                from './RegionLandmarksList.js'
import { AddLandmark_Transaction, DeleteLandmark_Transaction } 	            from '../../utils/jsTPS';

const RegionViewerScreen = (props) => {
    let name = '';
    let capital = '';
    let leader = '';
    let numberOfSubregions;
    let landmarks = [];
    let parentId = '';
    let parentName = '';

    const history = useHistory();
    const [showAddLandmark, toggleShowAddLandmark] = useState(false);
    const [landmarkInput, setLandmarkInput] = useState({ name: '' });
    const [disableUndo, toggleDisableUndo]  = useState(true);
	const [disableRedo, toggleDisableRedo]  = useState(true);

	const undoStatus = disableUndo && ' disabledButton ';
	const redoStatus = disableRedo && ' disabledButton ';

    const [AddLandmark] 			= useMutation(mutations.ADD_LANDMARK);
    const [DeleteLandmark] 			= useMutation(mutations.DELETE_LANDMARK);

    const { id } = useParams();
	const { loading: loading1, error: error1, data: data1, refetch: refetch1 } = useQuery(GET_DB_MAP, {variables: { _id: id }});
    if(loading1) { console.log(loading1, 'loading'); }
	if(error1) { console.log(error1, 'error'); }
    if(data1) { 
        name = data1.getMapById.name; 
        capital = data1.getMapById.capital;
        leader = data1.getMapById.leader;
        numberOfSubregions = data1.getMapById.subregion_ids.length;
        landmarks = data1.getMapById.landmarks;
        parentId = data1.getMapById.parent_id;
    }

    const { loading, error, data, refetch } = useQuery(GET_DB_PARENT, {variables: { _id: id }});
    if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) { parentName = data.getParentById.name; }

    const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetch1();
		toggleDisableUndo(props.tps.mostRecentTransaction === -1);
		toggleDisableRedo(props.tps.mostRecentTransaction === props.tps.getSize() - 1);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetch1();	
		toggleDisableUndo(props.tps.mostRecentTransaction === -1);
		toggleDisableRedo(props.tps.mostRecentTransaction === props.tps.getSize() - 1);
		return retVal;
	}

    const hideAddLandmark = () => {
        toggleShowAddLandmark(false);
    }

    const returnToSpreadsheet = () => {
        history.push("/region/" + parentId);
    }

    const addNewLandmark = async () => {
        if (landmarkInput.name.trim() === '') {
			alert("Please provide a non-empty landmark name");
			return;
		}
        let transaction = new AddLandmark_Transaction(id, landmarkInput.name, -1, AddLandmark, DeleteLandmark);
		props.tps.addTransaction(transaction);
		await tpsRedo();
        toggleShowAddLandmark(false);
    }

    const deleteLandmark = async (landmark, index) => {
        let transaction = new DeleteLandmark_Transaction(id, landmark, index, DeleteLandmark, AddLandmark);
		props.tps.addTransaction(transaction);
		await tpsRedo();
    }

    const updateLandmarkInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...landmarkInput, [name]: value };
		setLandmarkInput(updated);
	}

    useEffect(() => {
        refetch1();
    }, []);

    const undoCtrl = (event) => {
		if (event.ctrlKey === true && event.key === 'z') {
			tpsUndo();
		}
	}

	const redoCtrl = (event) => {
		if (event.ctrlKey === true && event.key === 'y') {
			tpsRedo();
		}
	}

	useEffect(() => {
        document.addEventListener('keydown', undoCtrl);
		document.addEventListener('keydown', redoCtrl);
		return () => {
			document.removeEventListener("keydown", undoCtrl);
			document.removeEventListener("keydown", redoCtrl);
		}
    });


	return (
		<div className="region-viewer-container">
			<div className="viewer-left-content">
                <div>
                    <i className={`${undoStatus} material-icons control-buttons`} onClick={tpsUndo}>undo</i>
					<i className={`${redoStatus} material-icons control-buttons`} onClick={tpsRedo}>redo</i>
                </div>
                <div className="viewer-image-container">
                    <img className="viewer-filler-image" src={require('../../images/image.png')}/>
                </div>
                <div className="viewer-information-container">
                    <div className="viewer-information-row">Region Name: &nbsp;&nbsp;{name}</div>
                    <div className="viewer-name-field">
                        <div className="viewer-parent-name-field">Parent Region: &nbsp;&nbsp;</div>
                        <div className="link-color navigate-parent" onClick={returnToSpreadsheet}>{parentName}</div>
                        <div className="viewer-edit-parent edit"><i className="material-icons edit-parent">edit</i></div>
                    </div>
                     
                        
                    <div className="viewer-information-row">Region Capital: &nbsp;&nbsp;{capital}</div>
                    <div className="viewer-information-row">Region Leader: &nbsp;&nbsp;{leader}</div>
                    <div className="viewer-information-row"># Of Subregions: &nbsp;&nbsp;{numberOfSubregions}</div>
                </div>
            </div>
            <div className="viewer-right-content">
                <div className="viewer-landmarks-title">Region Landmarks:</div>
                <div className="viewer-landmarks-container">
                    <RegionLandmarksList landmarks={landmarks} deleteLandmark={deleteLandmark}/>
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