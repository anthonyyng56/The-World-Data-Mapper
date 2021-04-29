import React, { useState } from 'react';
import { useHistory }					from "react-router-dom";

const RegionSpreadsheetEntry = (props) => {
    const [editingName, toggleEditingName] = useState(false);
    const [editingCapital, toggleEditingCapital] = useState(false);
    const [editingLeader, toggleEditingLeader] = useState(false);
    const history = useHistory();

    const handleSelectSubregion = () => {
        history.push("/region/" + props.subregion.name + '/' + props._id);
    }

    const handleUpdateNameInput = (e) => {
        toggleEditingName(false);
        if (props.subregion.name !== e.target.value) {
            if (e.target.value.trim() === '') {
                props.handleUpdateField(props._id, 'name', 'Unknown');
            } else {
                props.handleUpdateField(props._id, 'name', e.target.value);
            }
        }
    }

    const handleUpdateCapitalInput = (e) => {
        toggleEditingCapital(false);
        if (props.subregion.capital !== e.target.value) {
            if (e.target.value.trim() === '') {
                props.handleUpdateField(props._id, 'capital', 'Unknown');
            } else {
                props.handleUpdateField(props._id, 'capital', e.target.value);
            }
        }
    }

    const handleUpdateLeaderInput = (e) => {
        toggleEditingLeader(false);
        if (props.subregion.leader !== e.target.value) {
            if (e.target.value.trim() === '') {
                props.handleUpdateField(props._id, 'leader', 'Unknown');
            } else {
                props.handleUpdateField(props._id, 'leader', e.target.value);
            }
        }
    }
    return (
        <div className="spreadsheet-entry">
            {
                editingName ? 
                <div className="entry-col col-0">
                    <input className="subregion-input" type="text" defaultValue={props.subregion.name} autoFocus={true} onBlur={handleUpdateNameInput}/>
                </div>
                : 
                <div className="name-col-container col-0">
                    <i className="material-icons delete-subregion">close</i>
                    <div className="entry-col name-col link-color" onClick={handleSelectSubregion} onBlur={handleUpdateNameInput}>{props.subregion.name}</div>
                    <i className="material-icons edit-subregion-name" onClick={toggleEditingName}>edit</i>
                </div>
            }
            {
                editingCapital ? <div className="entry-col col-1"><input className="subregion-input" type="text" defaultValue={props.subregion.capital} autoFocus={true} onBlur={handleUpdateCapitalInput}/></div>
                : <div className="entry-col col-1" onClick={toggleEditingCapital}>{props.subregion.capital}</div>
            }
            {
                editingLeader ? <div className="entry-col col-1"><input className="subregion-input" type="text" defaultValue={props.subregion.leader} autoFocus={true} onBlur={handleUpdateLeaderInput}/></div>
                : <div className="entry-col col-1" onClick={toggleEditingLeader}>{props.subregion.leader}</div>
            }
			<div className="entry-col col-2">Flag</div>
            {
                props.subregion.landmarks.length === 0 ? <div className="entry-col col-3">No Landmarks</div> : 
                <div className="entry-col col-3">{props.subregion.landmarks[0]}...</div>
            }
        </div>
    );
};

export default RegionSpreadsheetEntry;