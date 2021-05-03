import React, { useState, useEffect }				from 'react';
import { WLMain } 									from 'wt-frontend';
import RegionSpreadsheetList 		    			from './RegionSpreadsheetList.js'
import AncestorsList 		    					from '../AncestorComponents/AncestorsList.js'
import { useMutation, useQuery } 					from '@apollo/client';
import * as mutations 								from '../../cache/mutations';
import { GET_DB_SUBREGIONS, GET_DB_MAP, GET_DB_ANCESTORS } 			from '../../cache/queries';
import { useParams } 								from 'react-router';
import DeleteModal                  				from '../modals/DeleteModal.js'
import { AddSubregion_Transaction, DeleteSubregion_Transaction, UpdateMapField_Transaction, SortSubregions_Transaction } 	from '../../utils/jsTPS';

const RegionSpreadsheetScreen = (props) => {
	let subregions = [];
	let ancestors = [];
	let parentName = '';
	const deleteMessage = 'Delete Subregion?'

	const [deleteSubregionConfirmation, toggleDeleteSubregionConfirmation] = useState(false);
	const [delete_id, setDelete_id] = useState('');
	const [deleteName, setDeleteName] = useState('');
	const [deleteIndex, setDeleteIndex] = useState(0);
	const [disableUndo, toggleDisableUndo]  = useState(true);
	const [disableRedo, toggleDisableRedo]  = useState(true);

	const undoStatus = disableUndo && ' disabledButton ';
	const redoStatus = disableRedo && ' disabledButton ';

	const [AddSubregion] 				= useMutation(mutations.ADD_SUBREGION);
	const [UpdateMapField] 				= useMutation(mutations.UPDATE_MAP_FIELD);
	const [DeleteSubregion] 			= useMutation(mutations.DELETE_SUBREGION);
	const [SortSubregionsByCategory] 	= useMutation(mutations.SORT_SUBREGIONS_BY_CATEGORY);
	const [ReorderSubregions] 			= useMutation(mutations.REORDER_SUBREGIONS);

	const { id } = useParams();
	const { loading: loading1, error: error1, data: data1, refetch: refetch1 } = useQuery(GET_DB_SUBREGIONS, {variables: { _id: id }});
	if(loading1) { console.log(loading1, 'loading'); }
	if(error1) { console.log(error1, 'error'); }
	if(data1) { subregions = data1.getSubregionsById; }

	const { loading: loading2, error: error2, data: data2, refetch: refetch2 } = useQuery(GET_DB_ANCESTORS, {variables: { _id: id }});
    if(loading2) { console.log(loading2, 'loading'); }
	if(error2) { console.log(error2, 'error'); }
    if(data2) { ancestors = data2.getAllAncestors; }

	const { loading, error, data, refetch } = useQuery(GET_DB_MAP, {variables: { _id: id }});
    if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) { parentName = data.getMapById.name; }
	
	const refetchSubregions = async (refetch1) => {
		const { loading, error, data } = await refetch1();
		if (data) {
			subregions = data.getSubregionsById;
		}
	}

	const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchSubregions(refetch1);
		toggleDisableUndo(props.tps.mostRecentTransaction === -1);
		toggleDisableRedo(props.tps.mostRecentTransaction === props.tps.getSize() - 1);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchSubregions(refetch1);	
		toggleDisableUndo(props.tps.mostRecentTransaction === -1);
		toggleDisableRedo(props.tps.mostRecentTransaction === props.tps.getSize() - 1);
		return retVal;
	}

	const addSubregion = async () => {
		let index = -1;
		let parentId = id;
		const newSubregion = {
			_id: '',	
			owner: ' ',
			name: 'Untitled Region',
			capital: 'Unknown',
			leader: 'Unknown',
			landmarks: [],
			subregion_ids: [],
			parent_id: '',
			root: '',
		};
		let transaction = new AddSubregion_Transaction(newSubregion, parentId, index, AddSubregion, DeleteSubregion);
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
		let subregion_ids = [];
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
		if (event.ctrlKey === true && event.key === 'z' && props.tps.hasTransactionToUndo()) {
			tpsUndo();
		}
	}

	const redoCtrl = (event) => {
		if (event.ctrlKey === true && event.key === 'y' && props.tps.hasTransactionToRedo()) {
			tpsRedo();
		}
	}

	useEffect(() => {
		window.onpopstate = () => {
			props.tps.clearAllTransactions();
			toggleDisableUndo(true);
			toggleDisableRedo(true);
		}
	});

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
		<AncestorsList ancestors={ancestors} tps={props.tps} toggleDisableUndo={toggleDisableUndo} toggleDisableRedo={toggleDisableRedo}/>
		<div className="region-spreadsheet-container">
			<div className="region-spreadsheet-preheader">
				<div className="spreadsheet-controls">
					<i className="material-icons control-buttons" onClick={addSubregion}>add</i>
					<i className={`${undoStatus} material-icons control-buttons`} onClick={tpsUndo}>undo</i>
					<i className={`${redoStatus} material-icons control-buttons`} onClick={tpsRedo}>redo</i>
				</div>	
				<div className="region-spreadsheet-name-container">Region Name: <span className="region-spreadsheet-name">{parentName}</span></div>

			</div>
			<div className="region-spreadsheet-header">
				<div className="header-col sort-col col-0" onClick={sortSubregionsByName}>Name</div>
				<div className="header-col sort-col col-1" onClick={sortSubregionsByCapital}>Capital</div>
				<div className="header-col sort-col col-1" onClick={sortSubregionsByLeader}>Leader</div>
				<div className="header-col col-2">Flag</div>
				<div className="header-col col-3">Landmarks</div>
			</div>
			<div className="region-spreadsheet">
				<RegionSpreadsheetList subregions={subregions} updateMapField={updateMapField} toggleDeleteSubregionConfirmation={toggleDeleteSubregionConfirmation} 
				setDelete_id={setDelete_id} setDeleteIndex={setDeleteIndex} tps={props.tps} toggleDisableUndo={toggleDisableUndo} toggleDisableRedo={toggleDisableRedo} 
				setDeleteName={setDeleteName}
				/>
			</div>
		</div>
		{
			deleteSubregionConfirmation && <DeleteModal deleteMessage={deleteMessage} name={deleteName} toggleDeleteConfirmation={toggleDeleteSubregionConfirmation} delete={deleteSubregion} />
		}
		</WLMain>
	);
};

export default RegionSpreadsheetScreen;