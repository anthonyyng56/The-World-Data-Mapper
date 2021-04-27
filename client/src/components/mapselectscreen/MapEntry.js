import React, { useState } from 'react';
import { WButton } from 'wt-frontend';
import { useHistory } from "react-router-dom";

const MapEntry = (props) => {
    const [editMapName, toggleEditMapName] = useState(false);
    const [deleteMapConfirmation, toggleDeleteMapConfirmation] = useState(false);
    const history = useHistory();
    const editingMap = editMapName || deleteMapConfirmation ? ' editingMap ' : '';

    const handleEditMapName = () => {
        toggleEditMapName(true);
        props.toggleShowMapInput(false);
    }

    const handleUpdateMapName = (e) => {
        toggleEditMapName(false);
        if (props.name !== e.target.value) {
            if (e.target.value.trim() === '') {
                props.updateMapField(props._id, 'name', 'Untitled Map');
            } else {
                props.updateMapField(props._id, 'name', e.target.value);
            }
        }
    }

    const handleShowDeleteConfirmation = () => {
        toggleDeleteMapConfirmation(true);
        props.toggleShowMapInput(false);
    }

    const handleHideDeleteConfirmation = () => {
        toggleDeleteMapConfirmation(false);
    }

    const handleDeleteMap = () => {
        toggleDeleteMapConfirmation(false);
        props.deleteMap(props._id);
    }

    const handleSelectMap = () => {
        props.setCurrentRegion(props.name);
        props.setCurrentRegion_id(props._id);
		history.push("/region/" + props._id);
    }

    return (
        <div className={`${editingMap} map-entry`}>
            {
                editMapName ? 
                <>
                    <input type="text" name="name" className="edit-map-name-input" autoFocus={true} defaultValue={props.name} onBlur={handleUpdateMapName} />
                </> :
                deleteMapConfirmation ? 
                <>
                    <div className="map-delete-confirmation" onBlur={handleHideDeleteConfirmation}>
                        <div className="map-delete-confirmation-text">Delete Map?</div>
                        <WButton clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger" className="map-delete-confirmation-controls" autoFocus={true} onClick={handleDeleteMap}>
							Delete
						</WButton>
                        <WButton clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger" className="map-delete-confirmation-controls"  onClick={handleHideDeleteConfirmation}>
							Cancel
						</WButton>
                            
                    </div>
                </> :
                <>  
                    <div className="map-entry-name-container" onClick={handleSelectMap}>
                        <div className="map-entry-name">{props.name}</div>
                    </div>
                    <div className="map-entry-controls">
                        <i className="material-icons edit" onClick={handleEditMapName}>edit</i>
                    </div>
                    <div className="map-entry-controls">
                        <i className="material-icons delete" onClick={handleShowDeleteConfirmation}>delete</i>
                    </div>
                </>
            }
        </div>
    );
};

export default MapEntry;