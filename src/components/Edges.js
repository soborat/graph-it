import React from 'react';
import { connect } from 'react-redux';
import { setGenerated } from '../store';
import * as utils from '../utils';


const Edges = ({adj, nodes, vw, vh, isGenerated, setGenerated}) => {
    const unit = x => (6 * vw + 6 * vh) * x;

    const edges = adj.map((row, i) => row.map((edge, j) => {
        if(edge && i < nodes.length && j < nodes.length) {
            const [x1, y1] = nodes[i];
            const [x2, y2] = nodes[j];
            const dist = utils.dist(x1 * vw, x2 * vw, y1 * vh, y2 * vh);
            return (
                <line 
                    id={(isGenerated ? Math.random() : `edge-${i}-${j}`)}
                    key={(isGenerated ? Math.random() : `edge-${i}-${j}`)}
                    className={isGenerated ? 'animated-line' : 'static-line'}
                    strokeDasharray={(isGenerated ? dist : '')}
                    strokeDashoffset={(isGenerated ? dist : '')}
                    x1={x1 * vw} y1={y1 * vh} x2={x2 * vw} y2={y2 * vh} 
                    style={{strokeWidth: unit(0.03), strokeLinejoin: 'round'}}
                >   
                </line>
            )
        }
        return null;
    }));
    setTimeout(() => setGenerated(false), 0);
    return edges;

}

const areEqual = (prev, next) => {
    let same = true, n = Math.max(prev.nodes.length, next.nodes.length);
    for(let i = 0; i < 20; ++i)
        if(String(prev.adj[i]) !== String(next.adj[i]))
            same = false;

    for(let i = 0; i < n; ++i)
        if(String(prev.nodes[i]) !== String(next.nodes[i]))
            same = false;

    if(prev.vh !== next.vh || prev.vw !== next.vw)
        same = false;

    return same;
}


export default connect(
    state => ({
        adj: state.adj,
        nodes: state.nodes,
        vw: state.vw,
        vh: state.vh,
        isGenerated: state.isGenerated,
    }),
    {setGenerated}
)(React.memo(Edges, areEqual));