import React from 'react';
import { connect } from 'react-redux';


const AlgorithmInfo = ({algorithmInfo}) => {
    if(algorithmInfo)
        return (
            <div className="algorithm-info">
                <h1>{algorithmInfo}</h1>
            </div>
        )

    return null;
}

export default connect(
    state => ({
        algorithmInfo: state.algorithmInfo
    })
)(AlgorithmInfo);