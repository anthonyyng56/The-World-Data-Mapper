const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		owner: String!
		name: String!
		capital: String!
		leader: String!
		landmarks: [String]!
		subregion_ids: [String]!
		ancestor_ids: [String]!
		root: String!
	}
	extend type Query {
		getAllMaps: [Map]
		getMapInfoById(_id: String!): [Map] 
		getSubregionsById(_id: String!): [Map]
	}
	extend type Mutation {
		addMap(map: MapInput!): String
		deleteMap(_id: String!): Boolean
		updateMapField(_id: String!, field: String!, value: String!): String
		addSubregion(map: SubregionInput!, parent_id: String!, index: Int!): String
		deleteSubregion(_id: String!): Map
		addLandmark(_id: String!, value: String!): String
		sortSubregionsByCategory(_id: String!, subregionField: [String]!): [String]
		reorderSubregions(_id: String, order: [String]!): [String]!
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
		ancestor_ids: [String]
		root: String
	}
`;

module.exports = { typeDefs: typeDefs }