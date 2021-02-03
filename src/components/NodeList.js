import React from 'react';
import { connect } from 'react-redux';

class NodeList extends React.PureComponent {
    render() {
        return (
            this.props.nodes.map((coords, i) => (
                <div 
                    className="node" key={coords[0] + `${i}` + coords[1]} 
                    style={{left: coords[0] * this.props.vw + 'px', top: coords[1] * this.props.vh + 'px'}}
                    >
                    <h1>{i + 1}</h1>
                </div>
            ))
        )
    }
}

export default connect(
    state => ({
        nodes: state.nodes,
        vw: state.vw,
        vh: state.vh
    })
)(NodeList);