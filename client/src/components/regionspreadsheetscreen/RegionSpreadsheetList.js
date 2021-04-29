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
                        subregion={subregion} key={subregion._id} _id={subregion._id} handleUpdateField={props.handleUpdateField}
                    />
                ))
            }
		</div>
	);
};

export default RegionSpreadsheetList;