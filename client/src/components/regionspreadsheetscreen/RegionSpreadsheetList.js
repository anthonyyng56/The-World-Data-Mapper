import React, { useState } 	                        from 'react';
import RegionSpreadsheetEntry                       from './RegionSpreadsheetEntry';

const RegionSpreadsheetList = (props) => {
    const [editingRow, setEditingRow] = useState(-1);
    const [editingColumn, setEditingColumn] = useState(-1);
	return (
		<div className="region-spreadsheet-list">
			{
                props.subregions && 
                props.subregions.map((subregion, index) => (
                    <RegionSpreadsheetEntry
                        subregion={subregion} key={subregion._id} _id={subregion._id} updateMapField={props.updateMapField}
                        toggleDeleteSubregionConfirmation={props.toggleDeleteSubregionConfirmation} setDelete_id={props.setDelete_id}
                        index={index} setDeleteIndex={props.setDeleteIndex} editingRow={editingRow} setEditingRow={setEditingRow}
                        editingColumn={editingColumn} setEditingColumn={setEditingColumn} length={props.subregions.length}
                        tps={props.tps} toggleDisableUndo={props.toggleDisableUndo} toggleDisableRedo={props.toggleDisableRedo}
                        setDeleteName={props.setDeleteName} imgPath={props.imgPath} regionName={props.regionName}
                    />
                ))
            }
		</div>
	);
};

export default RegionSpreadsheetList;