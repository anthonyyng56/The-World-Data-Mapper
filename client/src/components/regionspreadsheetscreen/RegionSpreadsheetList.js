import React 	                        from 'react';
import RegionSpreadsheetEntry           from './RegionSpreadsheetEntry';
import { useHistory }					from "react-router-dom";

const RegionSpreadsheetList = (props) => {

	return (
		<div className="region-spreadsheet-list">
			{
                props.subregions &&
                props.subregions.map((subregion, index) => (
                    <RegionSpreadsheetEntry
                        subregion={subregion} key={subregion._id} _id={subregion._id} updateMapField={props.updateMapField}
                        toggleDeleteSubregionConfirmation={props.toggleDeleteSubregionConfirmation} setDelete_id={props.setDelete_id}
                        index={index} setDeleteIndex={props.setDeleteIndex}
                    />
                ))
            }
		</div>
	);
};

export default RegionSpreadsheetList;