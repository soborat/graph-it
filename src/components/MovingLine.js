import React from 'react';
import { connect } from 'react-redux';


class MovingLine extends React.PureComponent {
    unit = x => (6 * this.props.vw + 6 * this.props.vh) * x;
    render() {
        if(this.props.originNode) {
            return (
                <line
                    className="moving-line" 
                    x1={this.props.originNode.offsetLeft} y1={this.props.originNode.offsetTop}
                    x2={this.props.movingX} y2={this.props.movingY}
                    style={{strokeWidth: this.unit(0.03), strokeLinejoin: 'round'}}>
                </line>
            );
        }
        else return null;
    }
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