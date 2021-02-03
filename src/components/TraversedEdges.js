import React from 'react';
import { connect } from 'react-redux';
import * as utils from '../utils'; 


class TraversedEdges extends React.Component {
    unit = x => (6 * this.props.vw + 6 * this.props.vh) * x;

    shouldComponentUpdate = (nextProps) => (
        this.props.traversedEdges.length !== nextProps.traversedEdges.length ||
        this.props.pathEdges.length !== nextProps.pathEdges.length ||
        ((this.props.vw !== nextProps.vw || this.props.vh !== nextProps.vh) && 
        (nextProps.traversedEdges.length || nextProps.pathEdges.length))
    )

    render() {
        const edges = [this.props.traversedEdges, this.props.pathEdges];
        const config = {
            className: ['traversed-line', 'path-line'],
            stroke: ['#8036e0', '#de0012'],
            strokeWidth: [0.035, 0.05]
        }
        return (
            edges.map((edgeArray, k) => edgeArray.map(pair => {
                const [i, j] = pair;
                const [x1, y1] = this.props.nodes[i];
                const [x2, y2] = this.props.nodes[j];
                const dist = utils.dist(x1 * this.props.vw, 
                            x2 * this.props.vw, y1 * this.props.vh, y2 * this.props.vh);
                return (
                    <line 
                        key={`edge-${i}${k}${j}`}
                        id={`edge-${i}${k}${j}`}
                        className={this.props.algorithmType + '-' + config.className[k]}
                        strokeDasharray={dist}
                        strokeDashoffset={dist}
                        x1={x1 * this.props.vw}
                        y1={y1 * this.props.vh}
                        x2={x2 * this.props.vw}
                        y2={y2 * this.props.vh} 
                        style={{stroke: config.stroke[k], strokeWidth: this.unit(config.strokeWidth[k]), strokeLinejoin: 'round'}}
                    >   
                    </line>
                )
            }))
        )
    }
}

export default connect(
    state => ({
        vw: state.vw,
        vh: state.vh,
        nodes: state.nodes,
        traversedEdges: state.traversedEdges,
        pathEdges: state.pathEdges,
        algorithmType: state.algorithmType
    })
)(TraversedEdges);