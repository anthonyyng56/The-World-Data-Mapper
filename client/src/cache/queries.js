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
			parent_id
			root
		}
	}
`;

export const GET_DB_MAP = gql`
	query GetDBMap($_id: String!) {
		getMapById(_id: $_id) {
			_id
			owner
			name
			capital
			leader
			landmarks
			subregion_ids
			parent_id
			root
		}
	}
`;

export const GET_DB_PARENT = gql`
	query GetDBParent($_id: String!) {
		getParentById(_id: $_id) {
			_id
			owner
			name
			capital
			leader
			landmarks
			subregion_ids
			parent_id
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
			parent_id
			root
		}
	}
`;

export const GET_DB_ANCESTORS = gql`
	query GetDBAncestors($_id: String!) {
		getAllAncestors(_id: $_id) {
			_id
			owner
			name
			capital
			leader
			landmarks
			subregion_ids
			parent_id
			root
		}
	}
`;

export const GET_DB_LANDMARKS = gql`
	query GetDBLandmarks($_id: String!) {
		getAllLandmarks(_id: $_id)
	}
`;

export const GET_DB_POTENTIAL_PARENTS = gql`
	query GetDBPotentialParents($_id: String!) {
		getAllPotentialParents(_id: $_id) {
			_id
			owner
			name
			capital
			leader
			landmarks
			subregion_ids
			parent_id
			root
		}
	}
`;