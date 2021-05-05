const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');

module.exports = {
	Query: {
		getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const maps = await Map.find({owner: _id});
			if(maps) return (maps);
			else return([]);
		},
		getMapById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			if(map) return map;
			else return ({});
		},
		getParentById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			if(!map) return ({});
			const parentObjectId = new ObjectId(map.parent_id);
			const parent = await Map.findOne({_id: parentObjectId});
			if (parent) return parent;
			else return ({});
		},
		getSubregionsById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			if(!map) return [];
			const subregions = map.subregion_ids
			let maps = []
			for (i = 0; i < subregions.length; i++) {
				let subregion = Map.findOne({_id: new ObjectId(subregions[i])});
				if (subregion) {
					maps.push(subregion);
				}
			}
			return maps
		},
		getAllAncestors: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			let map = await Map.findOne({_id: objectId});
			if(!map) return [];
			let ancestors = [];
			while (map.parent_id !== ' ') {
				map = await Map.findOne({_id: new ObjectId(map.parent_id) });
				if (map) {
					ancestors.unshift(map);
				}
			}
			return ancestors;
		},
		getAllLandmarks: async (_, args) => {
			const { _id } = args;
			const region = await Map.findOne({ _id: new ObjectId(_id) });
			if (!region) return [];
			let landmarks = region.landmarks;
			let subregions = region.subregion_ids;
			for (let i = 0; i < subregions.length; i++) {
				landmarks = landmarks.concat( await findLandmarks(subregions[i]) );
			}
			landmarks.sort(function (a, b) {
				return a.toLowerCase().localeCompare(b.toLowerCase());
			});
			return landmarks;
		},
		getAllPotentialParents: async (_, args) => {
			const { _id } = args;
			const map = await Map.findOne({ _id: new ObjectId(_id) });
			if (!map) return ([]);
			let root = map.root;
			const rootMap = await Map.findOne({ _id: new ObjectId(root) });
			if (!rootMap) return ([]);
			let maps = [];
			maps.push(rootMap);
			let subregions = rootMap.subregion_ids;
			for (let i = 0; i < subregions.length; i++) {
				maps = maps.concat( await findPotentialParents(_id, subregions[i]) )
			}
			return maps;
		}
	},
	Mutation: {
		addMap: async (_, args) => {
			const { map } = args;
			const objectId = new ObjectId();
			const { name, owner} = map;
			const newMap = new Map({
				_id: objectId,	
				owner: owner,
				name: name,
				capital: ' ',
				leader: ' ',
				landmarks: [],
				subregion_ids: [],
				parent_id: ' ',
				root: objectId.toString(),
			});
			const updated = await newMap.save();
			if(updated) {
				const maps = await Map.find({owner: owner});
				if(!maps) return ('Could not add map');
				for (let i = 0; i < maps.length - 1; i++) {
					let map = await Map.findOneAndDelete({_id: new ObjectId(maps[i]._id)});
					if (map) {
						const newMap = new Map({
						_id: map._id,	
						owner: map.owner,
						name: map.name,
						capital: map.capital,
						leader: map.leader,
						landmarks: map.landmarks,
						subregion_ids: map.subregion_ids,
						parent_id: map.parent_id,
						root: map.root,
						});
						await newMap.save();
					}
				}
				return objectId;
			}
			else return ('Could not add map');
		},
		deleteMap: async (_, args) => {
			const { _id } = args;
			const deleted = await Map.deleteMany({root: _id});
			if(deleted) return true;
			else return false;
		},
		updateMapField: async (_, args) => {
			const { field, value, _id } = args;
			const objectId = new ObjectId(_id);
			const updated = await Map.updateOne({_id: objectId}, {[field]: value});
			if(updated) return value;
			else return "Could not update field";
		},
		addSubregion: async (_, args) => {
			const { map, parentId, index } = args;
			const { _id, owner, name, capital, leader, landmarks, subregion_ids, parent_id, root } = map;
			const parentObjectId = new ObjectId(parentId);
			if (index === -1) {
				const parentMap = await Map.findOne({_id: parentObjectId});
				if(!parentMap) return ('Map Not Found');
				let tempId;
				if (_id === '') {
					tempId = new ObjectId();
				} else {
					tempId = new ObjectId(_id);
				}
				const subregionId = tempId
				let children = parentMap.subregion_ids;
				children.push(subregionId);
				const updated1 = await Map.updateOne({_id: parentObjectId}, { subregion_ids: children });
				const newSubregion = new Map({
					_id: subregionId,	
					owner: ' ',
					name: 'Untitled Region',
					capital: 'Unknown',
					leader: 'Unknown',
					landmarks: [],
					subregion_ids: [],
					parent_id: parentId,
					root: parentMap.root,
				});
				const updated2 = await newSubregion.save();
				if(updated2) return subregionId;
				else return ('Could not add subregion');
			} else {
				const subregionId = new ObjectId(_id);
				const parentMap = await Map.findOne({_id: parentObjectId});
				if(!parentMap) return ('Map Not Found');
				let children = parentMap.subregion_ids;
				children.splice(index, 0, subregionId);
				const updated1 = await Map.updateOne({_id: parentObjectId}, { subregion_ids: children });
				const existingSubregion = new Map({
					_id: subregionId,	
					owner: owner,
					name: name,
					capital: capital,
					leader: leader,
					landmarks: landmarks,
					subregion_ids: subregion_ids,
					parent_id: parent_id,
					root: root,
				});
				const updated2 = await existingSubregion.save();
				if(updated2) return subregionId;
				else return ('Could not add subregion');
			}
		},
		deleteSubregion: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const subregion = await Map.findOne({_id: objectId});
			if(!subregion) return ({});
			let parentId = subregion.parent_id;
			const parentObjectId = new ObjectId(parentId);
			const parent = await Map.findOne({_id: parentObjectId});
			if(!parent) return ({});
			let parentSubregions = parent.subregion_ids;
			let index = parentSubregions.indexOf(_id);
			if (index !== -1) {
				parentSubregions.splice(index, 1);
			}
			const updated = await Map.updateOne({_id: parentObjectId}, { subregion_ids: parentSubregions });
			const deleted = await Map.findOneAndDelete({_id: objectId});
			if (deleted) return deleted;
			else return ({});
		},
		sortSubregionsByCategory: async (_, args) => {
			const { _id, subregionField } = args;
			const objectId = new ObjectId(_id);
			const found = await Map.findOne({_id: objectId});
			if(!found) return subregionField;
			let subregion_ids = found.subregion_ids;
			let sortedNormal = true;
			for (let i = 0; i < subregionField.length-1; i++) {
				if (subregionField[i] > subregionField[i+1]) {
					sortedNormal = false;
					break
				}
			}
			if (sortedNormal) {
				subregion_ids.reverse();
				const updated = await Map.updateOne({_id: objectId}, { subregion_ids: subregion_ids });
				if (updated) return subregion_ids;
				else return subregionField;
			} else {
				for (let i = 0; i < subregion_ids.length; i++) {
					for (let j = 0; j < subregion_ids.length - 1; j++) {
						if (subregionField[j] > subregionField[j+1]) {
							let tempName = subregionField[j];
							subregionField[j] = subregionField[j+1];
							subregionField[j+1] = tempName;
							let temp_id = subregion_ids[j];
							subregion_ids[j] = subregion_ids[j+1];
							subregion_ids[j+1] = temp_id;
						}
					}
				}
				
				const updated = await Map.updateOne({_id: objectId}, { subregion_ids: subregion_ids });
				if (updated) return subregion_ids;
				else return subregionField;
			}
		},
		reorderSubregions: async (_, args) => {
			const { _id, order } = args;
			const objectId = new ObjectId(_id);	
			const updated = await Map.updateOne({_id: objectId}, { subregion_ids: order });
			return order;
		},
		addLandmark: async (_, args) => {
			const { _id, value, index } = args;
			const objectId = new ObjectId(_id);
			const found = await Map.findOne({_id: objectId});
			if(!found) return -1;
			let landmarks = found.landmarks;
			let retVal = 0;
			if (index === -1) {
				retVal = landmarks.length;
				landmarks.push(value);
			} else {
				retVal = index;
				landmarks.splice(index, 0, value);
			}
			const updated = await Map.updateOne({ _id: objectId}, { landmarks: landmarks });
			if(updated) return retVal;
			else return -1;
		},
		deleteLandmark: async (_, args) => {
			const { _id, landmark } = args;
			const objectId = new ObjectId(_id);
			const found = await Map.findOne({_id: objectId});
			if(!found) return -1;
			let landmarks = found.landmarks;
			let index = landmarks.indexOf(landmark)
			if (index != -1) {
				landmarks.splice(index, 1);
			}
			const updated = await Map.updateOne({ _id: objectId}, { landmarks: landmarks });
			if(updated) return index;
			else return index;
		},
		updateLandmark: async (_, args) => {
			const { _id, oldVal, newVal } = args;
			const objectId = new ObjectId(_id);
			const found = await Map.findOne({_id: objectId});
			if(!found) return false;
			let landmarks = found.landmarks;
			let index = landmarks.indexOf(oldVal);
			if (index != -1) {
				landmarks.splice(index, 1, newVal);
			}
			const updated = await Map.updateOne({ _id: objectId}, { landmarks: landmarks });
			if(updated) return true;
			else return false;
		},
		selectMap: async (_, args, { req }) => {
			const { _id } = args;
			const user_id = new ObjectId(req.userId);
			if(!user_id) { return false };
			const maps = await Map.find({owner: user_id});
			if(!maps) return false;
			if ((maps[0]._id).toString() === _id) {
				return true;
			}
			for (let i = 0; i < maps.length; i++) {
				if ((maps[i]._id).toString() !== _id) {
					let map = await Map.findOneAndDelete({_id: new ObjectId(maps[i]._id)});
					if (map) {
						const newMap = new Map({
						_id: map._id,	
						owner: map.owner,
						name: map.name,
						capital: map.capital,
						leader: map.leader,
						landmarks: map.landmarks,
						subregion_ids: map.subregion_ids,
						parent_id: map.parent_id,
						root: map.root,
						});
						await newMap.save();
					}
				}
			}
			return true;
		},
		changeParent: async (_, args) => {
			const { _id, oldParent_id, newParent_id } = args;
			const objectId = new ObjectId(_id)
			const region = await Map.findOne({ _id: objectId });
			if (!region) return ([]);

			const oldParentId = new ObjectId(oldParent_id)
			const oldParent = await Map.findOne({ _id: oldParentId });
			if (!oldParent) return ([]);

			const newParentId = new ObjectId(newParent_id)
			const newParent = await Map.findOne({ _id: newParentId });
			if (!newParent) return ([]);

			let oldParentSubregions = oldParent.subregion_ids;
			const originalSubregionsCopy = oldParentSubregions.slice();
			let index = oldParentSubregions.indexOf(_id);
			oldParentSubregions.splice(index,1)
			const updated1 = await Map.updateOne({ _id: oldParentId}, { subregion_ids: oldParentSubregions });
			if (!updated1) return ([]);

			let newParentSubregions = newParent.subregion_ids;
			newParentSubregions.push(_id);
			const updated2 = await Map.updateOne({ _id: newParentId}, { subregion_ids: newParentSubregions });
			if (!updated2) return ([]);

			const updated3 = await Map.updateOne({ _id: objectId}, { parent_id: newParent_id });
			if (!updated3) return ([]);

			return originalSubregionsCopy;
		},
		undoChangeParent: async (_, args) => {
			const { _id, oldParent_id, newParent_id, originalParentSubregions } = args;

			const objectId = new ObjectId(_id)
			const region = await Map.findOne({ _id: objectId });
			if (!region) return false;

			const oldParentId = new ObjectId(oldParent_id)
			const oldParent = await Map.findOne({ _id: oldParentId });
			if (!oldParent) return false;

			const newParentId = new ObjectId(newParent_id)
			const newParent = await Map.findOne({ _id: newParentId });
			if (!newParent) return false;

			const updated1 = await Map.updateOne({ _id: oldParentId}, { subregion_ids: originalParentSubregions });
			if (!updated1) return false;

			let newParentSubregions = newParent.subregion_ids;
			let index = newParentSubregions.indexOf(_id);
			newParentSubregions.splice(index,1)
			const updated2 = await Map.updateOne({ _id: newParentId}, { subregion_ids: newParentSubregions });
			if (!updated2) return false;

			const updated3 = await Map.updateOne({ _id: objectId}, { parent_id: oldParent_id });
			if (!updated3) return false;
			return true;
		}
	}
}

const findLandmarks = async(_id) => {
	const region = await Map.findOne({ _id: new ObjectId(_id) });
	if (!region) return [];
	let landmarks = region.landmarks;
	for (let j = 0; j < landmarks.length; j++) {
		landmarks[j] = landmarks[j] + ' - ' + region.name;
	}
	let subregions = region.subregion_ids;	
	for (let i = 0; i < subregions.length; i++) {
		landmarks = landmarks.concat( await findLandmarks(subregions[i]) );
	}
	return landmarks;
}

const findPotentialParents = async(_id, current_id) => {
	if (_id === current_id) {
		return ([]);
	}
	const region = await Map.findOne({ _id: new ObjectId(current_id) });
	if (!region) return ([]);
	let maps = [];
	maps.push(region);
	let subregions = region.subregion_ids;
	for (let i = 0; i < subregions.length; i++) {
		maps = maps.concat( await findPotentialParents(_id, subregions[i]) )
	}
	return maps;	
}