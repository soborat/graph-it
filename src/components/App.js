import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { vwUpdate, vhUpdate, setTouch } from '../store';
import Panel from './Panel';
import Main from './Main';
import Config from './Config';
import MessageBox from './MessageBox';
import Tutorial from './Tutorial';


// class App extends React.Component {
//     updateViewPort() {
//         const vw = window.innerWidth / 100, vh = window.innerHeight / 100, doc = document.documentElement;
//         this.props.vwUpdate(vw);
//         this.props.vhUpdate(vh);
//         doc.style.setProperty('--vh', `${vh}px`);

//         const touchSupport = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
//         if (!touchSupport)
//             doc.classList.add('non-touch');
//         else
//             doc.classList.remove('non-touch');
//         if(this.props.isTouch !== touchSupport) {
//             this.props.setTouch(touchSupport);
//             console.log(touchSupport);
//         }
//     }

//     fixSVG(e) {
//         if(e.target.className !== 'main' && this.props.movingX) {
//             window.dispatchEvent(new Event('resize'));
//         }
//     }

//     componentDidMount() {
//         const tabs = [...document.querySelectorAll('[tabindex]')];
//         tabs.forEach(el => {
//             el.addEventListener('focus', () => {
//                 el.style.outline = 'none';
//             });
//             el.addEventListener('keyup', () => {
//                 el.style.outline = null;
//             });
//         });
//         document.body.addEventListener('mousedown', () => {
//             document.documentElement.classList.remove('using-keyboard');
//             // console.log(document.body.className)
//         });
//         document.body.addEventListener('keydown', e => {
//             if(e.key === 'Tab') {
//                 document.documentElement.classList.add('using-keyboard');
//             }
                
//         });
//         this.updateViewPort();
//         window.addEventListener('resize', () => this.updateViewPort());
//         window.addEventListener('mousemove', e => this.fixSVG(e));
        
//     }

//     shouldComponentUpdate = () => false;

//     render() {
//         return (
//             <React.Fragment>
//                 <Panel/>
//                 <Main/>
//                 <Config/>
//                 <MessageBox/>
//                 <Tutorial/>
//             </React.Fragment>
//         )
//     }
// }

const App = ({movingX, isTouch, vwUpdate, vhUpdate, setTouch}) => {
    const doc = document.documentElement;

    useEffect(() => {
        const tabs = [...document.querySelectorAll('[tabindex]')];
        tabs.forEach(el => {
            el.addEventListener('focus', () => {
                el.style.outline = 'none';
            });
            el.addEventListener('keyup', () => {
                el.style.outline = null;
            });
        });
        document.body.addEventListener('mousedown', () => {
            doc.classList.remove('using-keyboard');
        });
        document.body.addEventListener('keydown', e => {
            if(e.key === 'Tab') 
                doc.classList.add('using-keyboard');
                
        });
        const updateViewPort = () => {
            const vw = window.innerWidth / 100, vh = window.innerHeight / 100;
            vwUpdate(vw);
            vhUpdate(vh);
            doc.style.setProperty('--vh', `${vh}px`);
    
            const touchSupport = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
            if (!touchSupport)
                doc.classList.add('non-touch');
            else
                doc.classList.remove('non-touch');
            if(isTouch !== touchSupport) {
                setTouch(touchSupport);
                console.log(touchSupport);
            }
        }
        updateViewPort();
        window.addEventListener('resize', () => updateViewPort());
        window.addEventListener('mousemove', e => {
            if(e.target.className !== 'main' && movingX) 
                window.dispatchEvent(new Event('resize'));
        });
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <Panel/>
            <Main/>
            <Config/>
            <MessageBox/>
            <Tutorial/>
        </>
    )


}

const areEqual = () => true;

export default connect(
    state => ({
        movingX: state.movingX,
        isTouch: state.isTouch
    }),
    {vwUpdate, vhUpdate, setTouch}
)(React.memo(App, areEqual));
