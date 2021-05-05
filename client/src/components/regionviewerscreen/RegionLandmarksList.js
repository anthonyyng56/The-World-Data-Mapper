import React 	                        from 'react';
import RegionLandmarkEntry              from './RegionLandmarkEntry';

const RegionLandmarksList = (props) => {

	return (
		<div className="region-landmarks-list">
			{
                props.allLandmarks && props.landmarks &&
                props.allLandmarks.map((landmark, index) => (
                    <RegionLandmarkEntry
                        landmark={landmark} landmarks={props.landmarks} key={index++} deleteLandmark={props.deleteLandmark} updateLandmark={props.updateLandmark}
                        setDeleteName={props.setDeleteName} toggleDeleteMapConfirmation={props.toggleDeleteMapConfirmation}
                    />
                ))
            }
		</div>
	);
};

export default RegionLandmarksList;