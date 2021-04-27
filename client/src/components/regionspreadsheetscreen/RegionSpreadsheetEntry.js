import React, { useState } from 'react';

const RegionSpreadsheetEntry = (props) => {
    

    return (
        <div className="spreadsheet-entry">
            <div className="entry-col col-1">{props.subregion.name}</div>
			<div className="entry-col col-1">{props.subregion.capital}</div>
			<div className="entry-col col-1">{props.subregion.leader}</div>
			<div className="entry-col col-2">Flag</div>
            {
                props.subregion.landmarks.length === 0 ? <div className="entry-col col-3">No Landmarks</div> : 
                <div className="entry-col col-3">{props.subregion.landmarks[0]}...</div>
            }
        </div>
    );
};

export default RegionSpreadsheetEntry;