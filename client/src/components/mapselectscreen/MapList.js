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
                        deleteMap={props.deleteMap} setCurrentRegion={props.setCurrentRegion} setCurrentRegion_id={props.setCurrentRegion_id}
                    />
                ))
            }
		</div>
	);
};

export default MapList;