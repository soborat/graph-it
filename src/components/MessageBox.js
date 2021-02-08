import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {setMessageBox} from '../store';


const MessageBox = ({messageBox, setMessageBox}) => {
    const doc = document.documentElement;

    const boxMouseMove = ({nativeEvent: e}) => {
        requestAnimationFrame(() => {
            doc.style.setProperty('--mouse-x-box', e.offsetX + 'px');
        });
    }

    const btnMouseMove = ({nativeEvent: e}) => {
        requestAnimationFrame(() => {
            doc.style.setProperty('--mouse-x-btn', e.offsetX + 'px');
            doc.style.setProperty('--mouse-y-btn', e.offsetY + 'px');
        });
    }

    const btnClick = () => {
        setMessageBox('');
    }

    useEffect(() => {
        const btn = document.querySelector('.message-box button');
        if(btn)
            btn.focus();
    });
    if(messageBox[0]) {
        return (
            <div className="block-screen">
                <div className="message-box">
                    <div className="message" onMouseMove={e => boxMouseMove(e)}>
                        {messageBox.map((row, i) => <h1 key={i}>{row}</h1>)}
                    </div>
                    <button 
                        onMouseMove={e => btnMouseMove(e)} 
                        onClick={e => btnClick(e)}>OK<span></span>
                    </button>
                </div>
            </div>
        )
    }
    return null;
}

export default connect(
    state => ({
        messageBox: state.messageBox
    }),
    {setMessageBox}
)(MessageBox);