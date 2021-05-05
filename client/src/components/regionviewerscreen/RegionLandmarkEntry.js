import React, { useState } from 'react';

const RegionLandmarksEntry = (props) => {
    const [editingLandmark, toggleEditingLandmark] = useState(false);

    const handleUpdateLandmark = (e) => {
        if (e.target.value !== props.landmark) {
            if (e.target.value.trim() === '') {
                alert('Please provide a valid non-empty landmark.')
            } else if (props.landmarks.includes(e.target.value)) {
                alert('Landmark already exists.')
            } else {
                props.updateLandmark(e.target.value, props.landmark);
            } 
        } 
        toggleEditingLandmark(false);
    }

    const showDeleteConfirmation = () => {
        props.setDeleteName(props.landmark);
        props.toggleDeleteMapConfirmation(true);
    }
    
    return (
        props.landmarks.includes(props.landmark) && editingLandmark ?
        <div className="region-landmarks-edit-entry">
            <input className="landmark-input" type="text" defaultValue={props.landmark} placeholder="Enter Updated Landmark" autoFocus={true} onBlur={handleUpdateLandmark} />
        </div>
        :
        props.landmarks.includes(props.landmark) ?
        <div className="region-landmarks-entry">
            <i className="material-icons delete-landmark" onClick={showDeleteConfirmation}>close</i>
            <div className="region-landmarks-entry-name" onClick={toggleEditingLandmark}>{props.landmark}</div>
        </div> 
        :
        <div className="region-landmarks-entry child-landmark">
            <div className="region-landmarks-entry-name child-landmark-name">{props.landmark}</div>
        </div>
    );
};

export default RegionLandmarksEntry;