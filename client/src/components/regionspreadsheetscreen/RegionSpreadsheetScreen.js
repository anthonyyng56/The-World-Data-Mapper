import React, { useState, useEffect }				from 'react';
import { WLMain } 									from 'wt-frontend';
import RegionSpreadsheetList 		    			from './RegionSpreadsheetList.js'
import { useMutation, useQuery } 					from '@apollo/client';
import * as mutations 								from '../../cache/mutations';
import { GET_DB_SUBREGIONS } 						from '../../cache/queries';
import { useParams } 								from 'react-router';
import DeleteModal                  				from '../modals/DeleteModal.js'
import { AddSubregion_Transaction, DeleteSubregion_Transaction, UpdateMapField_Transaction, SortSubregions_Transaction } 	from '../../utils/jsTPS';

const RegionSpreadsheetScreen = (props) => {
	let subregions = [];
	const [AddSubregion] 			= useMutation(mutations.ADD_SUBREGION);
	const [UpdateMapField] 			= useMutation(mutations.UPDATE_MAP_FIELD);
	const [DeleteSubregion] 		= useMutation(mutations.DELETE_SUBREGION);
	const [SortSubregionsByCategory] 		= useMutation(mutations.SORT_SUBREGIONS_BY_CATEGORY);
	const [ReorderSubregions] 		= useMutation(mutations.REORDER_SUBREGIONS);
	const [deleteSubregionConfirmation, toggleDeleteSubregionConfirmation] = useState(false);
	const [delete_id, setDelete_id] = useState('');
	const [deleteIndex, setDeleteIndex] = useState(0);
	const deleteMessage = 'Delete Subregion?'

	const { name, id } = useParams();
	const { loading, error, data, refetch } = useQuery(GET_DB_SUBREGIONS, {variables: { _id: id }});
	
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { subregions = data.getSubregionsById; }

	const refetchSubregions = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			subregions = data.getSubregionsById;
		}
	}

	const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchSubregions(refetch);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchSubregions(refetch);	
		return retVal;
	}

	const addSubregion = async () => {
		let index = -1;
		let parent_id = id;
		const newSubregion = {
			_id: '',	
			owner: ' ',
			name: 'Untitled Region',
			capital: 'Unknown',
			leader: 'Unknown',
			landmarks: [],
			subregion_ids: [],
			ancestor_ids: [],
			root: '',
		};
		let transaction = new AddSubregion_Transaction(newSubregion, parent_id, index, AddSubregion, DeleteSubregion);
		props.tps.addTransaction(transaction);
		await tpsRedo();
	}

	const deleteSubregion = async () => {
		let transaction = new DeleteSubregion_Transaction(delete_id, deleteIndex, DeleteSubregion, AddSubregion);
		props.tps.addTransaction(transaction);
		await tpsRedo();
		toggleDeleteSubregionConfirmation(false);
	}

	const updateMapField = async (_id, field, prev, value) => {
		let transaction = new UpdateMapField_Transaction(_id, field, prev, value, UpdateMapField);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const sortSubregionsByName = async () => {
		let subregionNames = [];
		let subregion_ids = []
		for (let i = 0; i < subregions.length; i++) {
			subregionNames.push(subregions[i].name);
			subregion_ids.push(subregions[i]._id);
		}
		let transaction = new SortSubregions_Transaction(id, subregionNames, subregion_ids, SortSubregionsByCategory, ReorderSubregions);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const sortSubregionsByCapital = async () => {
		let subregionCapitals = [];
		let subregion_ids = []
		for (let i = 0; i < subregions.length; i++) {
			subregionCapitals.push(subregions[i].capital);
			subregion_ids.push(subregions[i]._id);
		}
		let transaction = new SortSubregions_Transaction(id, subregionCapitals, subregion_ids, SortSubregionsByCategory, ReorderSubregions);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const sortSubregionsByLeader = async () => {
		let subregionLeaders = [];
		let subregion_ids = []
		for (let i = 0; i < subregions.length; i++) {
			subregionLeaders.push(subregions[i].leader);
			subregion_ids.push(subregions[i]._id);
		}
		let transaction = new SortSubregions_Transaction(id, subregionLeaders, subregion_ids, SortSubregionsByCategory, ReorderSubregions);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const undoCtrl = (event) => {
		if (event.ctrlKey === true && event.key === 'z') {
			tpsUndo();
		}
	}

	const redoCtrl = (event) => {
		if (event.ctrlKey === true && event.key === 'y') {
			tpsRedo();
		}
	}

	useEffect(() => {
        document.addEventListener('keydown', undoCtrl);
		document.addEventListener('keydown', redoCtrl);
		return () => {
			document.removeEventListener("keydown", undoCtrl);
			document.removeEventListener("keydown", redoCtrl);
		}
    });

	return (
		<WLMain>
		<div className="region-spreadsheet-container">
			<div className="region-spreadsheet-preheader">
				<div className="spreadsheet-controls">
					<i className="material-icons spreadsheet-buttons" onClick={addSubregion}>add</i>
					<i className="material-icons spreadsheet-buttons" onClick={tpsUndo}>undo</i>
					<i className="material-icons spreadsheet-buttons" onClick={tpsRedo}>redo</i>
				</div>	
				<div className="region-spreadsheet-name-container">Region Name: <span className="region-spreadsheet-name">{name}</span></div>

			</div>
			<div className="region-spreadsheet-header">
				<div className="header-col sort-col col-0" onClick={sortSubregionsByName}>Name</div>
				<div className="header-col sort-col col-1" onClick={sortSubregionsByCapital}>Capital</div>
				<div className="header-col sort-col col-1" onClick={sortSubregionsByLeader}>Leader</div>
				<div className="header-col col-2">Flag</div>
				<div className="header-col col-3">Landmarks</div>
			</div>
			<div className="region-spreadsheet">
				<RegionSpreadsheetList subregions={subregions} updateMapField={updateMapField} toggleDeleteSubregionConfirmation={toggleDeleteSubregionConfirmation} setDelete_id={setDelete_id} setDeleteIndex={setDeleteIndex} />
			</div>
		</div>
		{
			deleteSubregionConfirmation && <DeleteModal deleteMessage={deleteMessage} toggleDeleteConfirmation={toggleDeleteSubregionConfirmation} delete={deleteSubregion} />
		}
		</WLMain>
	);
};

export default RegionSpreadsheetScreen;