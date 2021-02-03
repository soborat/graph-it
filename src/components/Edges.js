import React from 'react';
import { connect } from 'react-redux';
import { setGenerated } from '../store';
import * as utils from '../utils';

class Edges extends React.Component {
    unit = x => (6 * this.props.vw + 6 * this.props.vh) * x;

    shouldComponentUpdate(nextProps) {
        let changed = false, n = Math.max(this.props.nodes.length, nextProps.nodes.length);
        for(let i = 0; i < 50; ++i)
            if(String(this.props.adj[i]) !== String(nextProps.adj[i]))
                changed = true;

        for(let i = 0; i < n; ++i)
            if(String(this.props.nodes[i]) !== String(nextProps.nodes[i]))
                changed = true;

        if(this.props.vh !== nextProps.vh || this.props.vw !== nextProps.vw)
            changed = true;

        return changed;
    }

    render() {
        const edges = this.props.adj.map((row, i) => row.map((edge, j) => {
            if(edge && i < this.props.nodes.length && j < this.props.nodes.length) {
                const [x1, y1] = this.props.nodes[i];
                const [x2, y2] = this.props.nodes[j];
                const dist = utils.dist(x1 * this.props.vw, 
                            x2 * this.props.vw, y1 * this.props.vh, y2* this.props.vh);
                return (
                    <line 
                        id={(this.props.isGenerated ? Math.random() : `edge-${i}-${j}`)}
                        key={(this.props.isGenerated ? Math.random() : `edge-${i}-${j}`)}
                        className={this.props.isGenerated ? 'animated-line' : 'static-line'}
                        strokeDasharray={(this.props.isGenerated ? dist : '')}
                        strokeDashoffset={(this.props.isGenerated ? dist : '')}
                        x1={x1 * this.props.vw}
                        y1={y1 * this.props.vh}
                        x2={x2 * this.props.vw}
                        y2={y2 * this.props.vh} 
                        style={{strokeWidth: this.unit(0.03), strokeLinejoin: 'round'}}
                    >   
                    </line>
                )
            }
            return null;

        }))
        setTimeout(() => this.props.setGenerated(false), 0);
        return edges;
    }
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
)(Edges);