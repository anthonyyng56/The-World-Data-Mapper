import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			name
			password
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $name: String!) {
		register(email: $email, password: $password, name: $name) {
			email
			password
			name
		}
	}
`;

export const UPDATE = gql`
	mutation Update($_id: String!, $email: String!, $password: String!, $name: String!) {
		update(_id: $_id, email: $email, password: $password, name: $name) 
	}
`;

export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const ADD_MAP = gql`
	mutation AddMap($map: MapInput!) {
		addMap(map: $map) 
	}
`;

export const DELETE_MAP = gql`
	mutation DeleteMap($_id: String!) {
		deleteMap(_id: $_id)
	}
`;

export const UPDATE_MAP_FIELD = gql`
	mutation UpdateMapField($_id: String!, $field: String!, $value: String!) {
		updateMapField(_id: $_id, field: $field, value: $value)
	}
`;

export const ADD_SUBREGION = gql`
	mutation AddSubregion($map: SubregionInput!, $parent_id: String!, $index: Int!) {
		addSubregion(map: $map, parent_id: $parent_id, index: $index) 
	}
`;

export const DELETE_SUBREGION = gql`
	mutation DeleteSubregion($_id: String!) {
		deleteSubregion(_id: $_id) {
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

export const ADD_LANDMARK = gql`
	mutation AddLandmark($_id: String!, $value: String!) {
		addLandmark(_id: $_id, value: $value) 
	}
`;

export const SORT_SUBREGIONS_BY_CATEGORY = gql`
	mutation SortSubregionsByCategory($_id: String!, $subregionField: [String]!) {
		sortSubregionsByCategory(_id: $_id, subregionField: $subregionField) 
	}
`;

export const REORDER_SUBREGIONS = gql`
	mutation ReorderSubregions($_id: String!, $order: [String]!) {
		reorderSubregions(_id: $_id, order: $order) 
	}
`;