import { gql } from "@apollo/client";

export const GET_DB_USER = gql`
	query GetDBUser {
		getCurrentUser {
			_id
			name
			email
		}
	}
`;

export const GET_DB_MAPS = gql`
	query GetDBMaps {
		getAllMaps {
			_id
			owner
			name
			capital
			leader
			landmarks
			subregion_ids
			ancestor_ids
			root
		}
	}
`;

export const GET_DB_MAP_INFO = gql`
	query GetDBMapInfo($_id: String!) {
		getMapInfoById(_id: $_id) {
			_id
			owner
			name
			capital
			leader
			landmarks
			subregion_ids
			ancestor_ids
			root
		}
	}
`;

export const GET_DB_SUBREGIONS = gql`
	query GetDBSubregions($_id: String!) {
		getSubregionsById(_id: $_id) {
			_id
			owner
			name
			capital
			leader
			landmarks
			subregion_ids
			ancestor_ids
			root
		}
	}
`;