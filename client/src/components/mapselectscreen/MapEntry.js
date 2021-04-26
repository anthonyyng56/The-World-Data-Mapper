import React, { useState } from 'react';
import { WButton } from 'wt-frontend';

const MapEntry = (props) => {
    const [editMapName, toggleEditMapName] = useState(false);
    const [deleteMapConfirmation, toggleDeleteMapConfirmation] = useState(false);

    const editingMap = editMapName || deleteMapConfirmation ? ' editingMap ' : '';

    const handleEditMapName = () => {
        toggleEditMapName(true);
        props.toggleShowMapInput(false);
    }

    const handleUpdateMapName = (e) => {
        toggleEditMapName(false);
        if (props.name !== e.target.value) {
            props.updateMapField(props._id, 'name', e.target.value);
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
                    <div className="map-entry-name">{props.name}</div>
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