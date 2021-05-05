import React 	                        from 'react';

const PotentialParentEntry = (props) => {

    const handleChangeParentRegion = () => {
        props.changeParentRegion(props.region._id);
		props.hideChangeParent();
    }

	return (
		<option className="potentialParentName" onClick={handleChangeParentRegion}>
			{props.region.name}
		</option>
	);
};

export default PotentialParentEntry;