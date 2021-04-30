import React 	                        from 'react';
import RegionLandmarkEntry              from './RegionLandmarkEntry';

const RegionLandmarksList = (props) => {

	return (
		<div className="region-landmarks-list">
			{
                props.landmarks &&
                props.landmarks.map((landmark, index) => (
                    <RegionLandmarkEntry
                        landmark={landmark} key={index++} 
                    />
                ))
            }
		</div>
	);
};

export default RegionLandmarksList;