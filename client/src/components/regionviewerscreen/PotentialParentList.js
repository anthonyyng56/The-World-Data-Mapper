import React 	                        from 'react';
import PotentialParentEntry              from './PotentialParentEntry';

const PotentialParentList = (props) => {

	return (
		<select className="parentSelect" autoFocus={true} onBlur={props.hideChangeParent} defaultValue={props.parentName}>
			{
                props.potentialParents &&
                props.potentialParents.map(region => (
                    <PotentialParentEntry region={region} parentName={props.parentName} hideChangeParent={props.hideChangeParent} changeParentRegion={props.changeParentRegion} key={region._id}/>
                ))
            }
		</select>
	);
};

export default PotentialParentList;