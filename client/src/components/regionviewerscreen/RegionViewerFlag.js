import React                  from 'react';

const RegionViewerFlag = (props) => {
    
    let path = props.imgPath + props.name + ' Flag.png';

    let flagSrc;
    try {
        flagSrc = require(`../../images/${path}`)
    }
    catch(err) {
        flagSrc = require('../../images/image.png')
    }

    return (
        <div className="viewer-image-container">
            <img className = "viewer-filler-image" src={flagSrc}/> 
        </div>
    );
};

export default RegionViewerFlag;