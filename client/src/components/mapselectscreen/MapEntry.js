import React from 'react';
import { WNavItem } from 'wt-frontend';

const MapEntry = (props) => {
    
    return (
        <WNavItem >
            <div className="map-entry">
                <div className="map-entry-name">{props.name}</div>
                <div className="map-entry-controls"> 
                    <i className="material-icons edit">edit</i>
                    <i className="material-icons delete">delete</i>
                </div>
            </div>
        </WNavItem>
    );
};

export default MapEntry;