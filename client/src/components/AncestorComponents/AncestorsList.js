import React	                                   from 'react';
import Ancestor                                    from './Ancestor';

const AncestorsList = (props) => {
	return (
		<div className="path">
			{
                props.ancestors &&
                props.ancestors.map((ancestor, index) => (
                    <Ancestor key={ancestor._id} name={ancestor.name} _id={ancestor._id} index={index} tps={props.tps}
                     toggleDisableUndo={props.toggleDisableUndo} toggleDisableRedo={props.toggleDisableRedo}
                    />
                ))
            }
		</div>
	);
};

export default AncestorsList;