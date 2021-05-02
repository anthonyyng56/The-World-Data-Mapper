import React, { useState }          from 'react';
import { useHistory }               from "react-router-dom";

const MapEntry = (props) => {
    const [editMapName, toggleEditMapName] = useState(false);
    const history = useHistory();

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

    const selectMap = () => {
		history.push("/region/" + props._id);
    }

    const showDeleteConfirmation = () => {
        props.setDelete_id(props._id);
        props.setDeleteName(props.name);
        props.toggleDeleteMapConfirmation(true);
        props.toggleShowMapInput(false);
    }

    return (
        <div className='map-entry'>
            {
                editMapName ? 
                <>
                    <input type="text" name="name" className="edit-map-name-input" autoFocus={true} defaultValue={props.name} onBlur={handleUpdateMapName} />
                </> :
                <>  
                    <div className="map-entry-name-container" onClick={selectMap}>
                        <div className="map-entry-name">{props.name}</div>
                    </div>
                    <div className="map-entry-controls">
                        <i className="material-icons edit" onClick={handleEditMapName}>edit</i>
                    </div>
                    <div className="map-entry-controls">
                        <i className="material-icons delete" onClick={showDeleteConfirmation}>delete</i>
                    </div>
                </>
            }
        </div>
    );
};

export default MapEntry;