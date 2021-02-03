import React from 'react';
import { connect } from 'react-redux';
import { setTutorialEnded } from '../store';


class TutorialMessage extends React.Component {
    closeMessage = e => {
        console.log(e.target.parentElement);
        let id = e.target.parentElement.id.replace('-message', '');
        document.querySelector('#' + id).classList.add('hidden');
        e.target.parentElement.classList.add('hidden');
        console.log(id)
        this.props.setTutorialEnded();
    }

    render() {
        return (
            <div 
                id={this.props.id} className="hidden small-message"
                style={{left: this.props.left, top: this.props.top}}
            >
                <a href="/#" onClick={e => this.closeMessage(e)}>Got it</a>
                <h4>{this.props.message}</h4>
            </div>
        );
    }
}

export default connect(
    null,
    {setTutorialEnded}
)(TutorialMessage);