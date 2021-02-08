import React from 'react';
import { connect } from 'react-redux';
import * as utils from '../utils'; 


const TraversedEdges = ({vw, vh, nodes, traversedEdges, pathEdges, algorithmType}) => {
    const unit = x => (6 * vw + 6 * vh) * x;

    const edges = [traversedEdges, pathEdges];
    const config = {
        className: ['traversed-line', 'path-line'],
        stroke: ['#8036e0', '#de0012'],
        strokeWidth: [0.035, 0.05]
    }
    return (
        edges.map((edgeArray, k) => edgeArray.map(pair => {
            const [i, j] = pair;
            const [x1, y1] = nodes[i];
            const [x2, y2] = nodes[j];
            const dist = utils.dist(x1 * vw, x2 * vw, y1 * vh, y2 * vh);
            return (
                <line 
                    key={`edge-${i}${k}${j}`}
                    id={`edge-${i}${k}${j}`}
                    className={algorithmType + '-' + config.className[k]}
                    strokeDasharray={dist}
                    strokeDashoffset={dist}
                    x1={x1 * vw }y1={y1 * vh} x2={x2 * vw} y2={y2 * vh} 
                    style={{stroke: config.stroke[k], strokeWidth: unit(config.strokeWidth[k]), strokeLinejoin: 'round'}}
                >   
                </line>
            )
        }))
    )

}

const areEqual = (prev, next)  => (
    prev.traversedEdges.length === next.traversedEdges.length &&
    prev.pathEdges.length === next.pathEdges.length &&
    prev.vw === next.vw && prev.vh === next.vh && 
    next.traversedEdges.length && next.pathEdges.length
)

export default connect(
    state => ({
        vw: state.vw,
        vh: state.vh,
        nodes: state.nodes,
        traversedEdges: state.traversedEdges,
        pathEdges: state.pathEdges,
        algorithmType: state.algorithmType
    })
)(React.memo(TraversedEdges, areEqual));