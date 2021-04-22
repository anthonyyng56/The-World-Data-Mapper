import React, { useState, useEffect } 	from 'react';
import { GET_DB_TODOS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';

const Welcomescreen = (props) => {

	let todolists 							= [];
	const [activeList, setActiveList] 		= useState({});
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [disableUndo, toggleDisableUndo]  = useState(true);
	const [disableRedo, toggleDisableRedo]  = useState(true);
	const [disableAdd, toggleDisableAdd] = useState(false);
	const [disableHeaders, toggleDisableHeaders] = useState(true);

	const [ReorderTodoItems] 		= useMutation(mutations.REORDER_ITEMS);
	const [UpdateTodoItemField] 	= useMutation(mutations.UPDATE_ITEM_FIELD);
	const [UpdateTodolistField] 	= useMutation(mutations.UPDATE_TODOLIST_FIELD);
	const [DeleteTodolist] 			= useMutation(mutations.DELETE_TODOLIST);
	const [DeleteTodoItem] 			= useMutation(mutations.DELETE_ITEM);
	const [AddTodolist] 			= useMutation(mutations.ADD_TODOLIST);
	const [AddTodoItem] 			= useMutation(mutations.ADD_ITEM);
	const [SortByTask]				= useMutation(mutations.SORT_BY_TASK);
	const [SortByDate]				= useMutation(mutations.SORT_BY_DATE);
	const [SortByCompleted]			= useMutation(mutations.SORT_BY_COMPLETED);
	const [SortByAssignedTo]		= useMutation(mutations.SORT_BY_ASSIGNED_TO);
	const [UndoSortItems]			= useMutation(mutations.UNDO_SORT_ITEMS);


	const { loading, error, data, refetch } = useQuery(GET_DB_TODOS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { todolists = data.getAllTodos; }

	const auth = props.user === null ? false : true;

	const refetchTodos = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			todolists = data.getAllTodos;
			if (activeList._id) {
				let tempID = activeList._id;
				let list = todolists.find(list => list._id === tempID);
				setActiveList(list);
			}
		}
	}

	const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchTodos(refetch);
		toggleDisableUndo(props.tps.mostRecentTransaction === -1);
		toggleDisableRedo(props.tps.mostRecentTransaction === props.tps.getSize() - 1);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchTodos(refetch);
		toggleDisableUndo(props.tps.mostRecentTransaction === -1);
		toggleDisableRedo(props.tps.mostRecentTransaction === props.tps.getSize() - 1);
		return retVal;
	}
	
	const copyList = (originalList) => {
		let newList = [];
		for (let i = 0; i < originalList.length; i++) {
			let item = {
				_id: originalList[i]._id,
				id: originalList[i].id,
				description: originalList[i].description,
				due_date: originalList[i].due_date,
				assigned_to: originalList[i].assigned_to,
				completed: originalList[i].completed
			};
			newList[i] = item;
		}
		return newList;
	}

	// Creates a default item and passes it to the backend resolver.
	// The return id is assigned to the item, and the item is appended
	//  to the local cache copy of the active todolist. 
	const addItem = async () => {
		let list = activeList;
		const items = list.items;
		let lastID = 0;
		for (let i = 0; i < items.length; i++) {
			if (items[i].id >= lastID) {
				lastID = items[i].id + 1;
			}
		}
		const newItem = {
			_id: '',
			id: lastID,
			description: 'No Description',
			due_date: 'No Date',
			assigned_to: 'No One',
			completed: false
		};
		let opcode = 1;
		let index = -1;
		let itemID = newItem._id;
		let listID = activeList._id;
		let transaction = new UpdateListItems_Transaction(listID, itemID, newItem, opcode, index, AddTodoItem, DeleteTodoItem);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};


	const deleteItem = async (item) => {
		let listID = activeList._id;
		let itemID = item._id;
		let opcode = 0;
		let itemToDelete = {
			_id: item._id,
			id: item.id,
			description: item.description,
			due_date: item.due_date,
			assigned_to: item.assigned_to,
			completed: item.completed
		}
		let index;
		for (let i = 0; i < activeList.items.length; i++) {
			if (activeList.items[i]._id === itemToDelete._id) {
				index = i;
				break;
			}
		}
		let transaction = new UpdateListItems_Transaction(listID, itemID, itemToDelete, opcode, index, AddTodoItem, DeleteTodoItem);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

	const editItem = async (itemID, field, value, prev) => {
		let flag = 0;
		if (field === 'completed') flag = 1;
		let listID = activeList._id;
		let transaction = new EditItem_Transaction(listID, itemID, field, prev, value, flag, UpdateTodoItemField);
		if (!(prev === value)) {
			props.tps.addTransaction(transaction);
			tpsRedo();
		}
	};

	const reorderItem = async (itemID, dir) => {
		let listID = activeList._id;
		let transaction = new ReorderItems_Transaction(listID, itemID, dir, ReorderTodoItems);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

	const sortTasks = async () => {
		let listID = activeList._id;
		let originalList = copyList(activeList.items);
		let transaction = new UpdateListFromSorting_Transaction(listID, originalList, SortByTask, UndoSortItems);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const sortDates = async () => {
		let listID = activeList._id;
		let originalList = copyList(activeList.items);
		let transaction = new UpdateListFromSorting_Transaction(listID, originalList, SortByDate, UndoSortItems);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const sortCompleted = async () => {
		let listID = activeList._id;
		let originalList = copyList(activeList.items);
		let transaction = new UpdateListFromSorting_Transaction(listID, originalList, SortByCompleted, UndoSortItems);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const sortAssignedTo = async () => {
		let listID = activeList._id;
		let originalList = copyList(activeList.items);
		let transaction = new UpdateListFromSorting_Transaction(listID, originalList, SortByAssignedTo, UndoSortItems);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const createNewList = async () => {
		toggleDisableAdd(true);
		toggleDisableHeaders(false);
		const length = todolists.length
		let largestId = 0;
		for (let i = 0; i < length; i++) {
			if (todolists[i].id >= largestId) {
				largestId = todolists[i].id + 1;
			}
		}
		largestId =  largestId + Math.floor((Math.random() * 100) + 1);
		const id = largestId;
		let list = {
			_id: '',
			id: id,
			name: 'Untitled',
			owner: props.user._id,
			items: [],
		}
		let listCopy = [];
		for (let i = 0; i < todolists.length; i++) {
			let itemsCopy = copyList(todolists[i].items)
				let list = {
					_id: todolists[i]._id,
					id: todolists[i].id,
					name: todolists[i].name,
					owner: todolists[i].owner,
					items: itemsCopy,
				}
				listCopy.push(list);
				DeleteTodolist({ variables: { _id: list._id }});
		}
		const { data } = await AddTodolist({ variables: { todolist: list }});
		for (let k = 0; k < listCopy.length; k++) {
			const {data1} = await AddTodolist({ variables: { todolist: listCopy[k] }});
		}
		refetch();
		props.tps.clearAllTransactions();
		toggleDisableUndo(props.tps.mostRecentTransaction === -1);
		toggleDisableRedo(props.tps.mostRecentTransaction === props.tps.getSize() - 1);
		list._id = data.addTodolist;
		setActiveList(list);
	};

	const deleteList = async (_id) => {
		DeleteTodolist({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_TODOS }] });
		refetch();
		setActiveList({});
		props.tps.clearAllTransactions();
		toggleDisableUndo(props.tps.mostRecentTransaction === -1);
		toggleDisableRedo(props.tps.mostRecentTransaction === props.tps.getSize() - 1);
		toggleDisableAdd(false);
		toggleDisableHeaders(true);
	};

	const updateListField = async (_id, field, value, prev) => {
		let transaction = new UpdateListField_Transaction(_id, field, prev, value, UpdateTodolistField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const handleSetActive = async (id) => {
		toggleDisableHeaders(false);
		toggleDisableAdd(true);
		const todo = todolists.find(todo => todo.id === id || todo._id === id);
		setActiveList(todo);
		let top;
		for(let i = 0; i < todolists.length; i++) {
			if (todolists[i].id === id) {
				top = i;
				break;
			}
		}
		let listCopy = [];
		if (top !== 0) {
			props.tps.clearAllTransactions();
			toggleDisableUndo(props.tps.mostRecentTransaction === -1);
			toggleDisableRedo(props.tps.mostRecentTransaction === props.tps.getSize() - 1);
			let bottom = todolists.length - top - 1;
			for (let i = 0; i < top; i++) {
				let itemsCopy = copyList(todolists[i].items)
				let list = {
					_id: todolists[i]._id,
					id: todolists[i].id,
					name: todolists[i].name,
					owner: todolists[i].owner,
					items: itemsCopy,
				}
				listCopy.push(list);
				DeleteTodolist({ variables: { _id: list._id }});
			}
			for (let j = 0; j < bottom; j++) {
				let itemsCopy = copyList(todolists[top + j + 1].items)
				let list = {
					_id: todolists[top + j + 1]._id,
					id: todolists[top + j + 1].id,
					name: todolists[top + j + 1].name,
					owner: todolists[top + j + 1].owner,
					items: itemsCopy,
				}
				listCopy.push(list);
				DeleteTodolist({ variables: { _id: list._id }});
			}
		}
		
		for (let k = 0; k < listCopy.length; k++) {
			const {data1} = await AddTodolist({ variables: { todolist: listCopy[k] }});
		}
		refetch();
	};

	
	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/
	const setShowLogin = () => {
		toggleShowDelete(false);
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};

	const setShowDelete = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDelete(!showDelete)
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
		<WLayout wLayout="header-lside">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth} 
							setShowCreate={setShowCreate} setShowLogin={setShowLogin}
							refetchTodos={refetch} setActiveList={setActiveList}
						/>
					</ul>
				</WNavbar>
			</WLHeader>

			<WLSide side="left">
				<SidebarHeader 
                	auth={auth} createNewList={createNewList} disableAdd={disableAdd}
            	/>
				<WSidebar>
					{
						activeList ?
							<SidebarContents
								todolists={todolists} activeid={activeList.id} auth={auth}
								handleSetActive={handleSetActive} createNewList={createNewList}
								updateListField={updateListField}
							/>
							:
							<></>
					}
				</WSidebar>
			</WLSide>
			<WLMain>
				{
					activeList ? 
							<div className="container-secondary">
								<MainContents
									addItem={addItem} deleteItem={deleteItem}
									editItem={editItem} reorderItem={reorderItem}
									setShowDelete={setShowDelete}
									activeList={activeList} setActiveList={setActiveList}
									sortTasks={sortTasks} sortDates={sortDates} sortCompleted={sortCompleted}
									sortAssignedTo={sortAssignedTo} tps={props.tps}
									undo={tpsUndo} redo={tpsRedo} auth={auth}
									disableUndo={disableUndo} disableRedo={disableRedo}
									toggleDisableRedo={toggleDisableRedo} toggleDisableUndo={toggleDisableUndo}
									toggleDisableAdd={toggleDisableAdd} disableHeaders={disableHeaders}
									toggleDisableHeaders={toggleDisableHeaders}
								/>
							</div>
						:
							<div className="container-secondary" />
				}

			</WLMain>

			{
				showDelete && (<Delete deleteList={deleteList} activeid={activeList._id} setShowDelete={setShowDelete} />)
			}

			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} refetchTodos={refetch}setShowLogin={setShowLogin} />)
			}

		</WLayout>
	);
};

export default Homescreen;