import React from 'react';
import { connect } from 'react-redux';
import {setMessageBox} from '../store';


class MessageBox extends React.PureComponent {
    boxMouseMove = ({nativeEvent: e}) => {
        requestAnimationFrame(() => {
            document.documentElement.style.setProperty('--mouse-x-box', e.offsetX + 'px');
        });
    }

    btnMouseMove = ({nativeEvent: e}) => {
        requestAnimationFrame(() => {
            document.documentElement.style.setProperty('--mouse-x-btn', e.offsetX + 'px');
            document.documentElement.style.setProperty('--mouse-y-btn', e.offsetY + 'px');
        });
    }

    btnClick = () => {
        console.log('OK')
        this.props.setMessageBox('');
    }

    componentDidUpdate() {
        console.log('didupdate msgbox');
        const btn = document.querySelector('.message-box button');
        console.log(btn);
        if(btn)
            btn.focus();
    }

    render() {
        const message = this.props.messageBox;
        console.log('rerender messagebox')
        if(message[0]) {
            console.log(message)
            return (
                <div className={"block-screen"}>
                    <div className="message-box">
                        <div className="message" onMouseMove={e => this.boxMouseMove(e)}>
                            {message.map((row, i) => <h1 key={i}>{row}</h1>)}
                        </div>
                        <button 
                            onMouseMove={e => this.btnMouseMove(e)} 
                            onClick={e => this.btnClick(e)}>OK<span></span></button>
                    </div>
                </div>
            );
        }
        return null;
    }
}

export default connect(
    state => ({
        messageBox: state.messageBox
    }),
    {setMessageBox}
)(MessageBox);