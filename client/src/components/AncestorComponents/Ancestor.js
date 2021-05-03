import React                                from 'react';
import { useHistory }			            from "react-router-dom";

const Ancestor = (props) => {
    const history = useHistory();

    const navigateAncestor = () => {
        props.tps.clearAllTransactions();
        props.toggleDisableUndo(true);
        props.toggleDisableRedo(true);
        history.push("/region/" + props._id);
    }

    return (
        <>  
            {
                props.index === 0 ?
                <span className="ancestor-link" onClick={navigateAncestor}>
                {props.name}
                </span>   
                :
                <span onClick={navigateAncestor}>
                <span>&nbsp;{'>'}&nbsp;</span><span className="ancestor-link">{props.name}</span>
                </span>
            }
        </>
    );
};

export default Ancestor;