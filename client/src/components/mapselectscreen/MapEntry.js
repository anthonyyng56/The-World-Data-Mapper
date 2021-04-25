import React, { useState } from 'react';
import { WNavItem } from 'wt-frontend';
import { WButton } from 'wt-frontend';

const MapEntry = (props) => {
    const [editMapName, toggleEditMapName] = useState(false);
    const [nameInput, setNameInput] = useState({ name: '' });

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

    return (
        <WNavItem >
            <div className="map-entry">
                {
                    editMapName ? 
                    <>
                        <input type="text" name="name" className="edit-map-name-input" autoFocus={true} defaultValue={props.name} onBlur={handleUpdateMapName} />
                    </> :
                    <>
                        <div className="map-entry-name">{props.name}</div>
                        <div className="map-entry-controls"> 
                            <i className="material-icons edit" onClick={handleEditMapName}>edit</i>
                            <i className="material-icons delete">delete</i>
                        </div>
                    </>
                }
            </div>
        </WNavItem>
    );
};

export default MapEntry;