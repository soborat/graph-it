import React from 'react';
import TutorialPiece from './TutorialPiece';
import { connect } from 'react-redux';

class Tutorial extends React.Component {
    constructor(props) {
        super(props);
        this.tabs = [];
        this.indexes = [];
        this.tutorialCompleted = window.localStorage.getItem('tutorialCompleted') || false;
    }

    componentDidMount() {
        const textarea = document.querySelector('.config');
        if(!this.tutorialCompleted) {
            textarea.readOnly = true;
            this.tabs = [...document.querySelectorAll('[tabindex]')].filter(el => !/tutorial/.test(el.id));
            this.indexes = Array(this.tabs.length);
            this.tabs.forEach((el, i) => {
                this.indexes[i] = el.getAttribute('tabindex');
                el.setAttribute('tabindex', '-1');
            });
        }
    }

    componentDidUpdate() {
        if(this.props.endedTutorials === 3) {
            this.tabs.forEach((el, i) => {
                el.setAttribute('tabindex', this.indexes[i]);
            });
            document.querySelector('.config').readOnly = false;
            window.localStorage.setItem('tutorialCompleted', true);
        }
    }

    render() {
        console.log('???')
        if(!this.tutorialCompleted && this.props.endedTutorials !== 3)
            return(
                <div className="block-screen">
                    <TutorialPiece id="svg-tutorial" left='20%' top='50%' index='1' 
                        message='Press to add a node, drag and drop from a node to another to add a vertex.' />
                    <TutorialPiece id="panel-tutorial" left='42%' top='5%' index='2' 
                        message='This is the control board. Algorithms and everything you need to change the aspect and composition of the graph.' />
                    <TutorialPiece id="config-tutorial" left='88%' top='35%' index='3'
                        message='Here you can paste your input, or modify the current graph in real time.'/>
                </div>
            );
        return null;
    }
}

export default connect(
    state => ({
        endedTutorials: state.endedTutorials
    }),

)(Tutorial);
