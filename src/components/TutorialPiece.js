import React from 'react';
import TutorialMessage from './TutorialMessage';


const TutorialPiece = ({left, top, id, index, message}) => {
    const displayTutorial = e => {
        if(e._reactName === 'onKeyDown' && e.key !== 'Enter')
            return;
        document.querySelector('#' + id + '-message').classList.remove('hidden');
    }

    return (
        <>
            <div
                id={id} className="tutorial" 
                style={{left, top}}
                onClick={e => displayTutorial(e, message)}
                onKeyDown={e => displayTutorial(e, message)}
                tabIndex={index}
            >
                <i className="fas fa-exclamation"></i>
                <div className="expanding-circle">
                    <div className="rotating-circle"></div>
                </div>
            </div>
            <TutorialMessage 
                id={id + '-message'} message={message}
                left={left} top={top}
            />
        </>
    )
}

export default TutorialPiece;