import React, { useState, useEffect }  from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';
import RegionSpreadsheetList 		   from './RegionSpreadsheetList.js'
import { useMutation, useQuery } 		from '@apollo/client';
import * as mutations 					from '../../cache/mutations';
import { GET_DB_SUBREGIONS } 					from '../../cache/queries';
import { useParams } from 'react-router';

const RegionSpreadsheetScreen = (props) => {
	let subregions = [];
	const [AddSubregion] 			= useMutation(mutations.ADD_SUBREGION);

	const { loading, error, data, refetch } = useQuery(GET_DB_SUBREGIONS, {variables: { _id: props.currentRegion_id }});
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { subregions = data.getSubregionsById; }


	const handleAddSubregion = async () => {
		let subregion = {
			_id: '',
			id: 1575,
			owner: '',
			name: '',
		}
		const {data} = await AddSubregion({ variables: { _id: props.currentRegion_id, subregion: subregion }});
		refetch();
	}

	return (
		<div className="region-spreadsheet-container">
			<div className="region-spreadsheet-preheader">
				<WRow>
					<WCol size="2">
						<div>
							<i className="material-icons" onClick={handleAddSubregion}>add</i>
						</div>
					</WCol>
					<WCol size="8">
						<div className="region-spreadsheet-name-container">Region Name: <span className="region-spreadsheet-name">{props.currentRegion}</span></div>
					</WCol>
				</WRow>	
			</div>
			<div className="region-spreadsheet-header">
				<div className="header-col col-0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name&nbsp;</div>
				<div className="header-col col-1">Capital</div>
				<div className="header-col col-1">Leader</div>
				<div className="header-col col-2">Flag</div>
				<div className="header-col col-3">Landmarks</div>
			</div>
			<div className="region-spreadsheet">
				<RegionSpreadsheetList subregions={subregions} setCurrentRegion={props.setCurrentRegion} setCurrentRegion_id={props.setCurrentRegion_id} />
			</div>
		</div>
	);
};

export default RegionSpreadsheetScreen;