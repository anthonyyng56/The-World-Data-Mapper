const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');

module.exports = {
	Query: {
		getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const maps = await Map.find({owner: _id});
			if(maps) return (maps);

		},
		getMapInfoById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			let maps = []
			maps.push(map);
			let parent_id = map.ancestor_ids[map.ancestor_ids.length - 1];
			const parentId = new ObjectId(parent_id);
			const parent = await Map.findOne({_id: parentId});
			maps.push(parent);
			return maps;
		},
		getSubregionsById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			const subregions = map.subregion_ids
			let maps = []
			for (let i = 0; i < subregions.length; i++) {
				let subregion = Map.findOne({_id: new ObjectId(subregions[i])});
				if (subregion) {
					maps.push(subregion);
				}
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
				ancestor_ids: [],
				root: objectId.toString(),
			});
			const updated = await newMap.save();
			if(updated) return objectId;
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
			else return "";
		},
		addSubregion: async (_, args) => {
			const { map, parent_id, index } = args;
			const { _id, owner, name, capital, leader, landmarks, subregion_ids, ancestor_ids, root } = map;
			const parentId = new ObjectId(parent_id);
			if (index === -1) {
				const parentMap = await Map.findOne({_id: parentId});
				if(!parentMap) return ('Map Not Found');
				let ancestor_ids = parentMap.ancestor_ids
				ancestor_ids.push(parentMap._id);
				let tempId;
				if (_id === '') {
					tempId = new ObjectId();
				} else {
					tempId = new ObjectId(_id);
				}
				const subregionId = tempId
				let children = parentMap.subregion_ids;
				children.push(subregionId);
				const updated1 = await Map.updateOne({_id: parentId}, { subregion_ids: children });
				const newSubregion = new Map({
					_id: subregionId,	
					owner: ' ',
					name: 'Untitled Region',
					capital: 'Unknown',
					leader: 'Unknown',
					landmarks: [],
					subregion_ids: [],
					ancestor_ids: ancestor_ids,
					root: parentMap.root,
				});
				const updated2 = await newSubregion.save();
				if(updated2) return subregionId;
				else return ('Could not add subregion');
			} else {
				const subregionId = new ObjectId(_id);
				const parentMap = await Map.findOne({_id: parentId});
				let children = parentMap.subregion_ids;
				children.splice(index, 0, subregionId);
				const updated1 = await Map.updateOne({_id: parentId}, { subregion_ids: children });
				const existingSubregion = new Map({
					_id: subregionId,	
					owner: owner,
					name: name,
					capital: capital,
					leader: leader,
					landmarks: landmarks,
					subregion_ids: subregion_ids,
					ancestor_ids: ancestor_ids,
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
			let parent_id = subregion.ancestor_ids[subregion.ancestor_ids.length - 1];
			const parentId = new ObjectId(parent_id);
			const parent = await Map.findOne({_id: parentId});
			let parentSubregions = parent.subregion_ids;
			let index = parentSubregions.indexOf(_id);
			if (index !== -1) {
				parentSubregions.splice(index, 1);
			}
			const updated = await Map.updateOne({_id: parentId}, { subregion_ids: parentSubregions });
			const deleted = await Map.findOneAndDelete({_id: objectId});
			return deleted;
		},
		addLandmark: async (_, args) => {
			const { _id, value } = args;
			const objectId = new ObjectId(_id);
			const found = await Map.findOne({_id: objectId});
			landmarks = found.landmarks;
			landmarks.push(value);
			const updated = await Map.updateOne({ _id: objectId}, { landmarks: landmarks });
			if(updated) return value;
			else return "";
		},
		sortSubregionsByCategory: async (_, args) => {
			const { _id, subregionField } = args;
			const objectId = new ObjectId(_id);
			const found = await Map.findOne({_id: objectId});
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
				return subregion_ids;
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
				return subregion_ids;
			}
		},
		reorderSubregions: async (_, args) => {
			const { _id, order } = args;
			const objectId = new ObjectId(_id);	
			const updated = await Map.updateOne({_id: objectId}, { subregion_ids: order });
			return order;
		},
	}
}