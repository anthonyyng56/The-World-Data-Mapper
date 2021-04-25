import React 	from 'react';
import MapEntry from './MapEntry';


const MapList = (props) => {

	return (
		<div className="map-list">
			{
                props.maps &&
                props.maps.map(map => (
                    <MapEntry
                        name={map.name} key={map.id}
                    />
                ))
            }
		</div>
	);
};

export default MapList;