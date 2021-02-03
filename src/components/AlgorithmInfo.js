import React from 'react';
import { connect } from 'react-redux';


class AlgorithmInfo extends React.PureComponent {
    render () {
        const info = this.props.algorithmInfo;
        if(info) {
            return (
                <div className="algorithm-info">
                    <h1>{this.props.algorithmInfo}</h1>
                </div>
            );
        }
        return null;

    }
}

export default connect(
    state => ({
        algorithmInfo: state.algorithmInfo
    })
)(AlgorithmInfo);