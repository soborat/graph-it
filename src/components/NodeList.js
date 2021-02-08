import React from 'react';
import { connect } from 'react-redux';


const NodeList = ({nodes, vw, vh}) => {
    return (
        nodes.map((coords, i) => (
            <div 
                className="node" key={coords[0] + `${i}` + coords[1]} 
                style={{left: coords[0] * vw + 'px', top: coords[1] * vh + 'px'}}
            >
                <h1>{i + 1}</h1>
            </div>
        ))
    )
}

export default connect(
    state => ({
        nodes: state.nodes,
        vw: state.vw,
        vh: state.vh
    })
)(NodeList);