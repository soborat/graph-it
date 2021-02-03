import React from 'react';
import TutorialMessage from './TutorialMessage';


class TutorialPiece extends React.Component {
    displayTutorial = e => {
        if(e._reactName === 'onKeyDown' && e.key !== 'Enter')
            return;
        document.querySelector('#' + this.props.id + '-message').classList.remove('hidden');
    }

    render() {
        return (
            <React.Fragment>
                <div
                    id={this.props.id} className="tutorial" 
                    style={{left: this.props.left, top: this.props.top}}
                    onClick={e => this.displayTutorial(e, this.props.message)}
                    onKeyDown={e => this.displayTutorial(e, this.props.message)}
                    tabIndex={this.props.index}
                >
                    <i className="fas fa-exclamation"></i>
                    <div className="expanding-circle">
                        <div className="rotating-circle"></div>
                    </div>
                </div>
                <TutorialMessage 
                    id={this.props.id + '-message'} message={this.props.message}
                    left={this.props.left} top={this.props.top}
                />
            </React.Fragment>
        );
    }
}

export default TutorialPiece;