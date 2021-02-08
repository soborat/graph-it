import React from 'react';
import { connect } from 'react-redux';


const MovingLine = ({vw, vh, originNode, movingX, movingY}) => {
    const unit = x => (6 * vw + 6 * vh) * x;
    if(originNode) {
        return (
            <line
                className="moving-line" 
                x1={originNode.offsetLeft} y1={originNode.offsetTop}
                x2={movingX} y2={movingY}
                style={{strokeWidth: unit(0.03), strokeLinejoin: 'round'}}>
            </line>
        )
    }

    return null;
}

export default connect(
    state => ({
        vw: state.vw,
        vh: state.vh,
        originNode: state.originNode,
        movingX: state.movingX,
        movingY: state.movingY,
    })
)(MovingLine);