import React, { useState, useEffect }                           from 'react';
import { useParams }                                            from 'react-router';
import { useMutation, useQuery } 		                        from '@apollo/client';
import { GET_DB_MAP, GET_DB_PARENT, GET_DB_ANCESTORS, GET_DB_LANDMARKS } 			from '../../cache/queries';
import * as mutations 					                        from '../../cache/mutations';
import { WButton, WLMain }                                      from 'wt-frontend';
import { useHistory }					                        from "react-router-dom";
import RegionLandmarksList 		                                from './RegionLandmarksList.js'
import RegionViewerFlag 		                                from './RegionViewerFlag.js'
import DeleteModal                  	                        from '../modals/DeleteModal.js'
import AncestorsList 		    					            from '../AncestorComponents/AncestorsList.js'
import { AddLandmark_Transaction, DeleteLandmark_Transaction, UpdateLandmark_Transaction } 	            from '../../utils/jsTPS';

const RegionViewerScreen = (props) => {
    const deleteMessage = 'Delete Landmark?'
    let name = '';
    let capital = '';
    let leader = '';
    let numberOfSubregions;
    let landmarks = [];
    let parentId = '';
    let parentName = '';
    let ancestors = [];
    let index = -1;
    let length = -1;
    let left_id = '';
    let right_id='';
    let allLandmarks = [];
    let imgPath = '';

    const history = useHistory();
    const auth = props.user === null ? false : true;
    const [showAddLandmark, toggleShowAddLandmark] = useState(false);
    const [landmarkInput, setLandmarkInput] = useState({ name: '' });
    const [disableUndo, toggleDisableUndo]  = useState(true);
	const [disableRedo, toggleDisableRedo]  = useState(true);
	const [deleteName, setDeleteName] = useState('');
    const [deleteMapConfirmation, toggleDeleteMapConfirmation] = useState(false);

	const undoStatus = disableUndo && ' disabledButton ';
	const redoStatus = disableRedo && ' disabledButton ';
    let prevStatus = '';
    let nextStatus = '';

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
    if(data2) { 
        ancestors = data2.getAllAncestors; 
        for (let i = 0; i < ancestors.length; i++) {
			imgPath += ancestors[i].name + '/';
		}
    }

    const { loading: loading3, error: error3, data: data3, refetch: refetch3 } = useQuery(GET_DB_LANDMARKS, {variables: { _id: id }});
    if(loading3) { console.log(loading3, 'loading'); }
	if(error3) { console.log(error3, 'error'); }
    if(data3) { 
        allLandmarks = data3.getAllLandmarks; 
    }

    const { loading, error, data, refetch } = useQuery(GET_DB_PARENT, {variables: { _id: id }});
    if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) { 
        parentName = data.getParentById.name; 
        let siblings = data.getParentById.subregion_ids;
        index = siblings.indexOf(id);
        length = siblings.length;
        if (index > 0 && index < length - 1) {
            left_id = siblings[index - 1];
            right_id = siblings[index + 1];
            prevStatus = '';
            nextStatus = '';
        } else if (index === 0 && length === 1) {
            left_id = '';
            right_id = '';
            prevStatus = ' disabledArrow ';
            nextStatus = ' disabledArrow ';
        } else if (index === 0 && length > 1) {
            left_id = '';
            right_id = siblings[index + 1];
            prevStatus = ' disabledArrow ';
            nextStatus = '';
        } else if (index > 0 && index === length - 1) {
            left_id = siblings[index - 1];
            right_id = '';
            prevStatus = '';
            nextStatus = ' disabledArrow ';
        }
    }

    const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetch1();
        refetch2();
        refetch3();
        refetch();
		toggleDisableUndo(props.tps.mostRecentTransaction === -1);
		toggleDisableRedo(props.tps.mostRecentTransaction === props.tps.getSize() - 1);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetch1();	
        refetch2();
        refetch3();
        refetch();
		toggleDisableUndo(props.tps.mostRecentTransaction === -1);
		toggleDisableRedo(props.tps.mostRecentTransaction === props.tps.getSize() - 1);
		return retVal;
	}

    const prevSibling = () => {
        if (left_id !== '') {
            props.tps.clearAllTransactions();
            toggleDisableUndo(true);
            toggleDisableRedo(true);
            history.push("/regionview/" + left_id);
        }
    }

    const nextSibling = () => {
        if (right_id !== '') {
            props.tps.clearAllTransactions();
            toggleDisableUndo(true);
            toggleDisableRedo(true);
            history.push("/regionview/" + right_id);
        }
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
			alert("Please provide a non-empty landmark name.");
			return;
		} else if (landmarks.includes(landmarkInput.name)) {
            alert("Landmark already exists.");
			return;
        }
        let transaction = new AddLandmark_Transaction(id, landmarkInput.name, -1, AddLandmark, DeleteLandmark);
		props.tps.addTransaction(transaction);
		await tpsRedo();
        toggleShowAddLandmark(false);
    }

    const deleteLandmark = async () => {
        let transaction = new DeleteLandmark_Transaction(id, deleteName, DeleteLandmark, AddLandmark);
		props.tps.addTransaction(transaction);
		await tpsRedo();
        toggleDeleteMapConfirmation(false);
    }

    const updateLandmark = async (newVal, oldVal) => {
        let transaction = new UpdateLandmark_Transaction(id, newVal, oldVal, UpdateLandmark);
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
        refetch2();
        refetch3();
        refetch();
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

    const returnToWelcome = () => {
        history.push("/");
    }

	return (
        <WLMain>
        {
            auth ?
            <>
            <AncestorsList ancestors={ancestors} tps={props.tps} toggleDisableUndo={toggleDisableUndo} toggleDisableRedo={toggleDisableRedo}/>
            <div className="navigate-sister-regions">
                <i className={`${prevStatus} material-icons navbar-arrow`} onClick={prevSibling}>arrow_back</i>
                <i className={`${nextStatus} material-icons navbar-arrow`} onClick={nextSibling}>arrow_forward</i>
            </div>
            <div className="region-viewer-container">
                <div className="viewer-left-content">
                    <div>
                        <i className={`${undoStatus} material-icons control-buttons`} onClick={tpsUndo}>undo</i>
                        <i className={`${redoStatus} material-icons control-buttons`} onClick={tpsRedo}>redo</i>
                    </div>
                    <RegionViewerFlag imgPath={imgPath} name={name}/>
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
                        <RegionLandmarksList landmarks={landmarks} allLandmarks={allLandmarks} deleteLandmark={deleteLandmark} updateLandmark={updateLandmark}
                        setDeleteName={setDeleteName} toggleDeleteMapConfirmation={toggleDeleteMapConfirmation}/>
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
            {
                deleteMapConfirmation && <DeleteModal deleteMessage={deleteMessage} name={deleteName} toggleDeleteConfirmation={toggleDeleteMapConfirmation} delete={deleteLandmark} />
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

export default RegionViewerScreen;