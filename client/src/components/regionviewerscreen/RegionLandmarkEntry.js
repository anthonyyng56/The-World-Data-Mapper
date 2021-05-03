import React, { useState } from 'react';

const RegionLandmarksEntry = (props) => {
    const [editingLandmark, toggleEditingLandmark] = useState(false);

    const handleUpdateLandmark = (e) => {
        if (e.target.value !== props.landmark) {
            if (e.target.value.trim() === '') {
                props.updateLandmark(props.index, 'Untitled Landmark', props.landmark);
            } else {
                props.updateLandmark(props.index, e.target.value, props.landmark);
            }
        } 
        toggleEditingLandmark(false);
    }

    const showDeleteConfirmation = () => {
        props.setDeleteIndex(props.index);
        props.setDeleteName(props.landmark);
        props.toggleDeleteMapConfirmation(true);
    }
    
    return (
        editingLandmark ?
        <div className="region-landmarks-edit-entry">
            <input className="landmark-input" type="text" defaultValue={props.landmark} placeholder="Enter Updated Landmark" autoFocus={true} onBlur={handleUpdateLandmark} />
        </div>
        :
        <div className="region-landmarks-entry">
            <i className="material-icons delete-landmark" onClick={showDeleteConfirmation}>close</i>
            <div className="region-landmarks-entry-name" onClick={toggleEditingLandmark}>{props.landmark}</div>
        </div> 
    );
};

export default RegionLandmarksEntry;