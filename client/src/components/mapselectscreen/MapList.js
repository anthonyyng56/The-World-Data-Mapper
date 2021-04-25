import React 	from 'react';
import MapEntry from './MapEntry';


const MapList = (props) => {

	return (
		<div className="map-list">
			{
                props.maps &&
                props.maps.map(map => (
                    <MapEntry
                        name={map.name} key={map.id} _id={map._id} updateMapField={props.updateMapField} toggleShowMapInput={props.toggleShowMapInput} 
                    />
                ))
            }
		</div>
	);
};

export default MapList;