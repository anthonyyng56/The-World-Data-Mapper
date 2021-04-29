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
		getMapById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			if(map) return map;
			else return ({});
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
			return maps
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
				ancestors: [],
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
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const parentMap = await Map.findOne({_id: objectId});
			if(!parentMap) return ('Map Not Found');
			let ancestors = parentMap.ancestors
			let ancestors_id = parentMap.ancestors_id
			ancestors.push(parentMap.name);
			ancestors_id.push(parentMap._id);
			const subregionId = new ObjectId();
			let children = parentMap.subregions_id;
			children.push(subregionId);
			const updated1 = await Map.updateOne({_id: objectId}, { subregions_id: children });
			const newSubregion = new Map({
				_id: subregionId,	
				owner: ' ',
				name: 'Untitled Region',
				capital: 'Unknown',
				leader: 'Unknown',
				landmarks: [],
				subregions_id: [],
				ancestors_id: ancestors_id,
				ancestors: ancestors,
				root: ancestors_id[0],
			});
			const updated2 = await newSubregion.save();
			if(updated2) return subregionId;
			else return ('Could not add subregion');
		},
	}
}