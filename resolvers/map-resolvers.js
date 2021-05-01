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
			let parent_id = map.ancestors_id[map.ancestors_id.length - 1];
			const parentId = new ObjectId(parent_id);
			const parent = await Map.findOne({_id: parentId});
			maps.push(parent);
			return maps;
		},
		getSubregionsById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			const subregions = map.subregions_id
			let maps = []
			for (i = 0; i < subregions.length; i++) {
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
				subregions_id: [],
				ancestors_id: [],
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
			const { _id, owner, name, capital, leader, landmarks, subregions_id, ancestors_id, root } = map;
			const parentId = new ObjectId(parent_id);
			if (index === -1) {
				const parentMap = await Map.findOne({_id: parentId});
				if(!parentMap) return ('Map Not Found');
				let ancestors_id = parentMap.ancestors_id
				ancestors_id.push(parentMap._id);
				let tempId;
				if (_id === '') {
					tempId = new ObjectId();
				} else {
					tempId = new ObjectId(_id);
				}
				const subregionId = tempId
				let children = parentMap.subregions_id;
				children.push(subregionId);
				const updated1 = await Map.updateOne({_id: parentId}, { subregions_id: children });
				const newSubregion = new Map({
					_id: subregionId,	
					owner: ' ',
					name: 'Untitled Region',
					capital: 'Unknown',
					leader: 'Unknown',
					landmarks: [],
					subregions_id: [],
					ancestors_id: ancestors_id,
					root: parentMap.root,
				});
				const updated2 = await newSubregion.save();
				if(updated2) return subregionId;
				else return ('Could not add subregion');
			} else {
				const subregionId = new ObjectId(_id);
				const parentMap = await Map.findOne({_id: parentId});
				let children = parentMap.subregions_id;
				children.splice(index, 0, subregionId);
				const updated1 = await Map.updateOne({_id: parentId}, { subregions_id: children });
				const existingSubregion = new Map({
					_id: subregionId,	
					owner: owner,
					name: name,
					capital: capital,
					leader: leader,
					landmarks: landmarks,
					subregions_id: subregions_id,
					ancestors_id: ancestors_id,
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
			let parent_id = subregion.ancestors_id[subregion.ancestors_id.length - 1];
			const parentId = new ObjectId(parent_id);
			const parent = await Map.findOne({_id: parentId});
			let parentSubregions = parent.subregions_id;
			let index = parentSubregions.indexOf(_id);
			if (index !== -1) {
				parentSubregions.splice(index, 1);
			}
			const updated = await Map.updateOne({_id: parentId}, { subregions_id: parentSubregions });
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
	}
}