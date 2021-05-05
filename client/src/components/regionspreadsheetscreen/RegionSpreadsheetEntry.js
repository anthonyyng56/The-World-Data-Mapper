import React, { useState }                  from 'react';
import { useHistory }			            from "react-router-dom";

const RegionSpreadsheetEntry = (props) => {
    const [editName, setEditName] = useState(props.subregion.name);
    const [editCapital, setEditCapital] = useState(props.subregion.capital);
    const [editLeader, setEditLeader] = useState(props.subregion.leader);
    const history = useHistory();
    let path = props.imgPath + props.regionName + '/' + props.subregion.name + ' Flag.png';
    let firstLandmark = props.subregion.landmarks[0]
    for (let i = 1; i < props.subregion.landmarks.length; i++) {
        if (firstLandmark.toLowerCase() >= props.subregion.landmarks[i].toLowerCase()) {
            firstLandmark = props.subregion.landmarks[i]
        }
    }

    let flagSrc;
    try {
        flagSrc = require(`../../images/${path}`)
    }
    catch(err) {
        flagSrc = require('../../images/image.png')
    }
    
    const selectSubregion = () => {
        props.tps.clearAllTransactions();
        props.toggleDisableUndo(true);
        props.toggleDisableRedo(true);
        history.push("/region/" + props._id);
    }

    const openRegionViewer = () => {
        props.tps.clearAllTransactions();
        history.push("/regionview/" + props._id);
    }

    const showDeleteConfirmation = () => {
        props.setDelete_id(props._id);
        props.setDeleteName(props.subregion.name);
        props.setDeleteIndex(props.index);
        props.toggleDeleteSubregionConfirmation(true);
    }

    const updateEditName = (e) => {
        setEditName(e.target.value);
    }

    const updateEditCapital = (e) => {
        setEditCapital(e.target.value);
    }

    const updateEditLeader = (e) => {
        setEditLeader(e.target.value);
    }

    const handleUpdateNameInput = () => {
        props.setEditingRow(-1);
        props.setEditingColumn(-1);
        if (props.subregion.name !== editName) {
            if (editName.trim() === '') {
                props.updateMapField(props._id, 'name', props.subregion.name, 'Untitled Region');
            } else {
                props.updateMapField(props._id, 'name', props.subregion.name, editName);
            }
        }
    }

    const handleUpdateCapitalInput = () => {
        props.setEditingRow(-1);
        props.setEditingColumn(-1);
        if (props.subregion.capital !== editCapital) {
            if (editCapital.trim() === '') {
                props.updateMapField(props._id, 'capital', props.subregion.capital, 'Unknown');
            } else {
                props.updateMapField(props._id, 'capital', props.subregion.capital, editCapital);
            }
        }
    }

    const handleUpdateLeaderInput = () => {
        props.setEditingRow(-1);
        props.setEditingColumn(-1);
        if (props.subregion.leader !== editLeader) {
            if (editLeader.trim() === '') {
                props.updateMapField(props._id, 'leader', props.subregion.leader, 'Unknown');
            } else {
                props.updateMapField(props._id, 'leader', props.subregion.leader, editLeader);
            }
        }
    }

    const shiftFocus = (event) => {
		if (event.keyCode == '38') {
            if (props.editingRow !== 0){
                if (props.editingColumn === 0) {
                    handleUpdateNameInput();
                } else if (props.editingColumn === 1) {
                    handleUpdateCapitalInput();
                } else if (props.editingColumn === 2) {
                    handleUpdateLeaderInput();
                }
                props.setEditingRow(props.editingRow - 1);
                props.setEditingColumn(props.editingColumn)
            }
		} else if (event.keyCode == '40') {
            if (props.editingRow !== props.length - 1){
                if (props.editingColumn === 0) {
                    handleUpdateNameInput();
                } else if (props.editingColumn === 1) {
                    handleUpdateCapitalInput();
                } else if (props.editingColumn === 2) {
                    handleUpdateLeaderInput();
                }
                props.setEditingRow(props.editingRow + 1);
                props.setEditingColumn(props.editingColumn)
            }
		} else if (event.keyCode == '37') {
            if (props.editingColumn !== 0) {
                if (props.editingColumn === 1) {
                    handleUpdateCapitalInput();
                } else if (props.editingColumn === 2) {
                    handleUpdateLeaderInput();
                }
                props.setEditingRow(props.editingRow);
                props.setEditingColumn(props.editingColumn - 1)
            }
        } else if (event.keyCode == '39') {
            if (props.editingColumn !== 2) {
                if (props.editingColumn === 0) {
                    handleUpdateNameInput();
                } else if (props.editingColumn === 1) {
                    handleUpdateCapitalInput();
                }
                props.setEditingRow(props.editingRow);
                props.setEditingColumn(props.editingColumn + 1)
            }
        }
	}    

    const setEditNamePosition = () => {
        props.setEditingRow(props.index);
        props.setEditingColumn(0);
    }

    const setEditCapitalPosition = () => {
        props.setEditingRow(props.index);
        props.setEditingColumn(1);
    }

    const setEditLeaderPosition = () => {
        props.setEditingRow(props.index);
        props.setEditingColumn(2);
    }

    return (
        <div className="spreadsheet-entry">
            {
                props.editingRow === props.index && props.editingColumn === 0 ? 
                <div className="entry-input-container col-0">
                    <input className="subregion-input" type="text" defaultValue={props.subregion.name} autoFocus={true} placeholder="Enter Name" onFocus={updateEditName} onBlur={handleUpdateNameInput} onChange={updateEditName} onKeyUp={shiftFocus}/>
                </div>
                : 
                <div className="entry-container col-0">
                    <i className="material-icons delete-subregion" onClick={showDeleteConfirmation}>close</i>
                    <div className="entry-col link-color" onClick={selectSubregion} onBlur={handleUpdateNameInput}>{props.subregion.name}</div>
                    <i className="material-icons edit-subregion-name" onClick={setEditNamePosition}>edit</i>
                </div>
            }
            {
                props.editingRow === props.index && props.editingColumn === 1 ? 
                <div className="entry-input-container col-1">
                    <input className="subregion-input" type="text" defaultValue={props.subregion.capital} autoFocus={true} placeholder="Enter Capital" onFocus={updateEditCapital} onBlur={handleUpdateCapitalInput} onChange={updateEditCapital} onKeyUp={shiftFocus}/>
                </div>
                : 
                <div className="entry-container col-1">
                    <div className="entry-col" onClick={setEditCapitalPosition}>{props.subregion.capital}</div>
                </div>
            }
            {
                props.editingRow === props.index && props.editingColumn === 2 ? 
                <div className="entry-input-container col-1">
                    <input className="subregion-input" type="text" defaultValue={props.subregion.leader} autoFocus={true} placeholder="Enter Leader" onFocus={updateEditLeader} onBlur={handleUpdateLeaderInput} onChange={updateEditLeader} onKeyUp={shiftFocus}/>
                    </div>
                : 
                <div className="entry-container col-1">
                    <div className="entry-col" onClick={setEditLeaderPosition}>{props.subregion.leader}</div>
                </div>
            }
            <div className="entry-container col-2">
                <div className="entry-col flag-col">
                    <img className = "flag-image" src={flagSrc}/> 
                </div>
            </div>
            {
                props.subregion.landmarks.length === 0 ? 
                <div className="entry-container col-3" onClick={openRegionViewer}>
                    <div className="entry-col link-color">No Landmarks</div>
                </div> 
                :
                <div className="entry-container col-3" onClick={openRegionViewer}>
                    <div className="entry-col link-color">{firstLandmark}...</div>
                </div>  
            }
        </div>
    );
};

export default RegionSpreadsheetEntry;