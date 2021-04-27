import React 	                        from 'react';
import RegionSpreadsheetEntry           from './RegionSpreadsheetEntry';
import { useHistory }					from "react-router-dom";

const RegionSpreadsheetList = (props) => {

	return (
		<div className="region-spreadsheet-list">
			{
                props.subregions &&
                props.subregions.map(subregion => (
                    <RegionSpreadsheetEntry
                        subregion={subregion} key={subregion.id} _id={subregion._id} 
                        setCurrentRegion={props.setCurrentRegion} setCurrentRegion_id={props.setCurrentRegion_id}
                    />
                ))
            }
		</div>
	);
};

export default RegionSpreadsheetList;