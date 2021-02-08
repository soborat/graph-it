import React from 'react';
import { connect } from 'react-redux';
import { setTutorialEnded } from '../store';


const TutorialMessage = ({left, top, id, message, setTutorialEnded}) => {
    const closeMessage = e => {
        console.log(e.target.parentElement);
        const id = e.target.parentElement.id.replace('-message', '');
        document.querySelector('#' + id).classList.add('hidden');
        e.target.parentElement.classList.add('hidden');
        setTutorialEnded();
    }

    return (
        <div 
            id={id} className="hidden small-message"
            style={{left: left, top: top}}
        >
            <a href="/#" onClick={e => closeMessage(e)}>Got it</a>
            <h4>{message}</h4>
        </div>
    )
}


export default connect(
    null,
    {setTutorialEnded}
)(TutorialMessage);