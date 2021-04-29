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

    const handleUpdateCapitalInput = () => {
        toggleEditingCapital(false);
    }

    const handleUpdateLeaderInput = () => {
        toggleEditingLeader(false);
    }
    return (
        <div className="spreadsheet-entry">
                
                {/* editingName ? 
                <div className="entry-col col-0">
                    <input className="subregion-input" type="text" defaultValue={props.subregion.name} autoFocus={true} onBlur={handleUpdateNameInput}/>
                </div>
                :  */}
                <div className="name-col-container col-0">
                    <i className="material-icons delete-subregion">close</i>
                    <div className="entry-col name-col link-color" onClick={handleSelectSubregion}>{props.subregion.name}</div>
                </div>
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