import React, { useEffect } from 'react';
import TutorialPiece from './TutorialPiece';
import { connect } from 'react-redux';


const Tutorial = ({endedTutorials}) => {
    let tutorialCompleted = localStorage.getItem('tutorialCompleted') || false;

    useEffect(() => {
        if(endedTutorials === 3) {
            localStorage.setItem('tutorialCompleted', true);
        }
    })
    if(!tutorialCompleted && endedTutorials !== 3)
        return(
            <>
                <TutorialPiece id="svg-tutorial" left='20%' top='50%' index='1' 
                    message='Press to add a node, drag and drop from a node to another to add a vertex.' />
                <TutorialPiece id="panel-tutorial" left='42%' top='5%' index='2' 
                    message='This is the control board. Algorithms and everything you need to change the aspect and composition of the graph.' />
                <TutorialPiece id="config-tutorial" left='88%' top='35%' index='3'
                    message='Here you can paste your input, or modify the current graph in real time.'/>
            </>
        )
    return null;
}

export default connect(
    state => ({
        endedTutorials: state.endedTutorials
    })
)(Tutorial);
