import React, { useState }      from 'react';
import { useHistory }			from "react-router-dom";

const RegionSpreadsheetEntry = (props) => {
    const [editingName, toggleEditingName] = useState(false);
    const [editingCapital, toggleEditingCapital] = useState(false);
    const [editingLeader, toggleEditingLeader] = useState(false);
    const history = useHistory();

    const selectSubregion = () => {
        history.push("/region/" + props.subregion.name + '/' + props._id);
    }

    const showDeleteConfirmation = () => {
        props.setDelete_id(props._id);
        props.setDeleteIndex(props.index);
        props.toggleDeleteSubregionConfirmation(true);
    }

    const handleUpdateNameInput = (e) => {
        toggleEditingName(false);
        if (props.subregion.name !== e.target.value) {
            if (e.target.value.trim() === '') {
                props.updateMapField(props._id, 'name', props.subregion.name, 'Unknown');
            } else {
                props.updateMapField(props._id, 'name', props.subregion.name, e.target.value);
            }
        }
    }

    const handleUpdateCapitalInput = (e) => {
        toggleEditingCapital(false);
        if (props.subregion.capital !== e.target.value) {
            if (e.target.value.trim() === '') {
                props.updateMapField(props._id, 'capital', props.subregion.capital, 'Unknown');
            } else {
                props.updateMapField(props._id, 'capital', props.subregion.capital, e.target.value);
            }
        }
    }

    const handleUpdateLeaderInput = (e) => {
        toggleEditingLeader(false);
        if (props.subregion.leader !== e.target.value) {
            if (e.target.value.trim() === '') {
                props.updateMapField(props._id, 'leader', props.subregion.leader, 'Unknown');
            } else {
                props.updateMapField(props._id, 'leader', props.subregion.leader, e.target.value);
            }
        }
    }
    
    const openRegionViewer = () => {
        history.push("/regionview/" + props.subregion.name + '/' + props._id);
    }

    return (
        <div className="spreadsheet-entry">
            {
                editingName ? 
                <div className="entry-input-container col-0">
                    <input className="subregion-input" type="text" defaultValue={props.subregion.name} autoFocus={true} onBlur={handleUpdateNameInput}/>
                </div>
                : 
                <div className="entry-container col-0">
                    <i className="material-icons delete-subregion" onClick={showDeleteConfirmation}>close</i>
                    <div className="entry-col link-color" onClick={selectSubregion} onBlur={handleUpdateNameInput}>{props.subregion.name}</div>
                    <i className="material-icons edit-subregion-name" onClick={toggleEditingName}>edit</i>
                </div>
            }
            {
                editingCapital ? 
                <div className="entry-input-container col-1">
                    <input className="subregion-input" type="text" defaultValue={props.subregion.capital} autoFocus={true} onBlur={handleUpdateCapitalInput}/>
                </div>
                : 
                <div className="entry-container col-1">
                    <div className="entry-col" onClick={toggleEditingCapital}>{props.subregion.capital}</div>
                </div>
            }
            {
                editingLeader ? 
                <div className="entry-input-container col-1">
                    <input className="subregion-input" type="text" defaultValue={props.subregion.leader} autoFocus={true} onBlur={handleUpdateLeaderInput}/>
                    </div>
                : 
                <div className="entry-container col-1">
                    <div className="entry-col" onClick={toggleEditingLeader}>{props.subregion.leader}</div>
                </div>
            }
            <div className="entry-container col-2">
                <div className="entry-col flag-col">
                    <img className = "flag-filler-image" src={require('../../images/image.png')}/>
                </div>
            </div>
            {
                props.subregion.landmarks.length === 0 ? 
                <div className="entry-container col-3" onClick={openRegionViewer}>
                    <div className="entry-col link-color">No Landmarks</div>
                </div> 
                :
                <div className="entry-container col-3" onClick={openRegionViewer}>
                    <div className="entry-col link-color">{props.subregion.landmarks[0]}...</div>
                </div>  
            }
        </div>
    );
};

export default RegionSpreadsheetEntry;