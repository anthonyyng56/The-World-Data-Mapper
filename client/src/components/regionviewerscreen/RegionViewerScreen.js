import React, { useState, useEffect }                           from 'react';
import { useParams }                                            from 'react-router';
import { useMutation, useQuery } 		                        from '@apollo/client';
import { GET_DB_MAP, GET_DB_PARENT, GET_DB_ANCESTORS } 			from '../../cache/queries';
import * as mutations 					                        from '../../cache/mutations';
import { WButton, WLMain }                                      from 'wt-frontend';
import { useHistory }					                        from "react-router-dom";
import RegionLandmarksList 		                                from './RegionLandmarksList.js'
import DeleteModal                  	                        from '../modals/DeleteModal.js'
import AncestorsList 		    					from '../AncestorComponents/AncestorsList.js'
import { AddLandmark_Transaction, DeleteLandmark_Transaction, UpdateLandmark_Transaction } 	            from '../../utils/jsTPS';

const RegionViewerScreen = (props) => {
    let name = '';
    let capital = '';
    let leader = '';
    let numberOfSubregions;
    let landmarks = [];
    let parentId = '';
    let parentName = '';
    const deleteMessage = 'Delete Landmark?'
    let ancestors = [];

    const history = useHistory();
    const [showAddLandmark, toggleShowAddLandmark] = useState(false);
    const [landmarkInput, setLandmarkInput] = useState({ name: '' });
    const [disableUndo, toggleDisableUndo]  = useState(true);
	const [disableRedo, toggleDisableRedo]  = useState(true);
    const [deleteIndex, setDeleteIndex] = useState('');
	const [deleteName, setDeleteName] = useState('');
    const [deleteMapConfirmation, toggleDeleteMapConfirmation] = useState(false);

	const undoStatus = disableUndo && ' disabledButton ';
	const redoStatus = disableRedo && ' disabledButton ';

    const [AddLandmark] 			= useMutation(mutations.ADD_LANDMARK);
    const [DeleteLandmark] 			= useMutation(mutations.DELETE_LANDMARK);
    const [UpdateLandmark] 			= useMutation(mutations.UPDATE_LANDMARK);

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

    const { loading: loading2, error: error2, data: data2, refetch: refetch2 } = useQuery(GET_DB_ANCESTORS, {variables: { _id: id }});
    if(loading2) { console.log(loading2, 'loading'); }
	if(error2) { console.log(error2, 'error'); }
    if(data2) { ancestors = data2.getAllAncestors; console.log(ancestors)}

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
        props.tps.clearAllTransactions();
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

    const deleteLandmark = async () => {
        let transaction = new DeleteLandmark_Transaction(id, deleteName, deleteIndex, DeleteLandmark, AddLandmark);
		props.tps.addTransaction(transaction);
		await tpsRedo();
        toggleDeleteMapConfirmation(false);
    }

    const updateLandmark = async (index, newVal, oldVal) => {
        let transaction = new UpdateLandmark_Transaction(id, index, newVal, oldVal, UpdateLandmark);
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
		if (event.ctrlKey === true && event.key === 'z' && props.tps.hasTransactionToUndo()) {
			tpsUndo();
		}
	}

	const redoCtrl = (event) => {
		if (event.ctrlKey === true && event.key === 'y' && props.tps.hasTransactionToRedo()) {
			tpsRedo();
		}
	}

    useEffect(() => {
		window.onpopstate = () => {
			props.tps.clearAllTransactions();
			toggleDisableUndo(true);
			toggleDisableRedo(true);
		}
	});

	useEffect(() => {
        document.addEventListener('keydown', undoCtrl);
		document.addEventListener('keydown', redoCtrl);
		return () => {
			document.removeEventListener("keydown", undoCtrl);
			document.removeEventListener("keydown", redoCtrl);
		}
    });


	return (
        <WLMain>
        <AncestorsList ancestors={ancestors} />
        <div className="navigate-sister-regions">
			<i className="material-icons navbar-arrow">arrow_back</i>
			<i className="material-icons navbar-arrow">arrow_forward</i>
		</div>
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
                    <RegionLandmarksList landmarks={landmarks} deleteLandmark={deleteLandmark} updateLandmark={updateLandmark} setDeleteIndex={setDeleteIndex} 
                    setDeleteName={setDeleteName} toggleDeleteMapConfirmation={toggleDeleteMapConfirmation} />
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
            {
			    deleteMapConfirmation && <DeleteModal deleteMessage={deleteMessage} name={deleteName} toggleDeleteConfirmation={toggleDeleteMapConfirmation} delete={deleteLandmark} />
		    }
		</div>
        </WLMain>
	);
};

export default RegionViewerScreen;