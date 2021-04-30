import React, { useState, useEffect }           from 'react';
import { useParams }                            from 'react-router';
import { useMutation, useQuery } 		        from '@apollo/client';
import { GET_DB_MAP } 			                from '../../cache/queries';
import { WButton }                              from 'wt-frontend';
import { useHistory }					        from "react-router-dom";

const RegionViewerParent = (props) => {
    

	return (
		<span className="link-color navigate-parent">x</span>
	);
};

export default RegionViewerParent;