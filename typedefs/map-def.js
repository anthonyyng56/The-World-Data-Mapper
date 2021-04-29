const { gql } = require('apollo-server');


const typeDefs = gql `
	type Map {
		_id: String!
		owner: String!
		name: String!
		capital: String!
		leader: String!
		landmarks: [String]!
		subregions_id: [String]!
		ancestors_id: [String]!
		ancestors: [String]!
		root: String!
	}
	extend type Query {
		getAllMaps: [Map]
		getMapById(_id: String!): Map 
		getSubregionsById(_id: String!): [Map]
	}
	extend type Mutation {
		addMap(map: MapInput!): String
		deleteMap(_id: String!): Boolean
		updateMapField(_id: String!, field: String!, value: String!): String
		addSubregion(_id: String!): String
		deleteSubregion(_id: String!): Boolean
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
`;

module.exports = { typeDefs: typeDefs }