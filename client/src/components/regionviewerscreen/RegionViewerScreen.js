import React, { useState, useEffect }           from 'react';
import { useParams }                            from 'react-router';
import { useMutation, useQuery } 		        from '@apollo/client';
import { GET_DB_MAP } 			                from '../../cache/queries';

const RegionViewerScreen = (props) => {
    let name = '';
    let parent = '';
    let capital = '';
    let leader = '';
    let numberOfSubregions = 0;

    const { id } = useParams();
	const { loading, error, data, refetch } = useQuery(GET_DB_MAP, {variables: { _id: id }});

    if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
    if(data) { 
        name = data.getMapById.name; 
        parent = data.getMapById.ancestors[data.getMapById.ancestors.length - 1];
        capital = data.getMapById.capital;
        leader = data.getMapById.leader;
        numberOfSubregions = data.getMapById.subregions_id.length;
    }

    useEffect(() => {
        refetch();
    }, []);


	return (
		<div className="region-viewer-container">
			<div className="viewer-left-content">
                <div className="viewer-image-container">
                    <img className="viewer-filler-image" src={require('../../images/image.png')}/>
                </div>
                <div className="viewer-information-container">
                    <div className="viewer-information-row">Region Name: &nbsp;&nbsp;{name}</div>
                    <div className="viewer-information-row">Parent Region: &nbsp;&nbsp;{parent}</div>
                    <div className="viewer-information-row">Region Capital: &nbsp;&nbsp;{capital}</div>
                    <div className="viewer-information-row">Region Leader: &nbsp;&nbsp;{leader}</div>
                    <div className="viewer-information-row"># Of Subregions: &nbsp;&nbsp;{numberOfSubregions}</div>
                </div>
                
            </div>
            <div className="viewer-right-content">
                <h1>hi</h1>
            </div>
		</div>
	);
};

export default RegionViewerScreen;