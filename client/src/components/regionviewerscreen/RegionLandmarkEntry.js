import React, { useState } from 'react';

const RegionLandmarksEntry = (props) => {
    
    const handleDeleteLandmark = () => {
        props.deleteLandmark(props.landmark, props.index);
    }
    
    return (
        <div className="region-landmarks-entry">
            <i className="material-icons delete-landmark" onClick={handleDeleteLandmark}>close</i>
            <div className="region-landmarks-entry-name">{props.landmark}</div>
        </div>
    );
};

export default RegionLandmarksEntry;