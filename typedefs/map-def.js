const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String
		owner: String
		name: String
		capital: String
		leader: String
		landmarks: [String]
		subregion_ids: [String]
		parent_id: String
		root: String
	}
	extend type Query {
		getAllMaps: [Map]
		getMapById(_id: String!): Map 
		getParentById(_id: String!): Map 
		getSubregionsById(_id: String!): [Map]
		getAllAncestors(_id: String!): [Map]
		getAllLandmarks(_id: String!): [String]
		getAllPotentialParents(_id: String!): [Map]
	}
	extend type Mutation {
		addMap(map: MapInput!): String
		deleteMap(_id: String!): Boolean
		updateMapField(_id: String!, field: String!, value: String!): String
		addSubregion(map: SubregionInput!, parentId: String!, index: Int!): String
		deleteSubregion(_id: String!): Map	
		sortSubregionsByCategory(_id: String!, subregionField: [String]!): [String]
		reorderSubregions(_id: String!, order: [String]!): [String]
		addLandmark(_id: String!, value: String!, index: Int!): Int
		deleteLandmark(_id: String!, landmark: String!): Int
		updateLandmark(_id: String!, oldVal: String!, newVal: String!): Boolean
		selectMap(_id: String!): Boolean
		changeParent(_id: String!, oldParent_id: String!, newParent_id: String!): [String]
		undoChangeParent(_id: String!, oldParent_id: String!, newParent_id: String!, originalParentSubregions: [String]!): Boolean
	}
    input FieldInput {
		_id: String
		field: String
		value: String
	}
	input MapInput {
		_id: String
		owner: String
		name: String
	}
	input SubregionInput {
		_id: String
		owner: String
		name: String
		capital: String
		leader: String
		landmarks: [String]
		subregion_ids: [String]
		parent_id: String
		root: String
	}
`;

module.exports = { typeDefs: typeDefs }