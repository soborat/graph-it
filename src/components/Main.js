import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import NodeList from './NodeList';
import Edges from './Edges';
import TraversedEdges from './TraversedEdges';
import MovingLine from './MovingLine';
import * as utils from '../utils';
import {appendNode, movingXUpdate, movingYUpdate, newEdge, 
        setOriginNode, toggleAction, setMessageBox} from '../store';


// class Main extends React.Component {
//     constructor(props) {
//         super(props);
//         this.main = React.createRef();
//         this.svg = React.createRef();
//         this.lastTarget = null;
//     }

//     unit = x => (6 * this.props.vw + 6 * this.props.vh) * x;
//     inBounds = (x, y, margin) => {
//         return(
//             (x > margin / this.props.vw) && (y > margin / this.props.vh) && 
//             (Math.abs(x - this.main.current.clientWidth / this.props.vw) > margin / this.props.vw) && 
//             (Math.abs(y - this.main.current.clientHeight / this.props.vh) > margin / this.props.vh)
//         );
//     }

//     noMovingLine = () => {
//         this.lastTarget = null;
//         this.props.setOriginNode(null);
//         this.props.movingXUpdate(null);
//         this.props.movingYUpdate(null);
//     }

//     updateViewPort() {
//         if(!this.svg.current)
//             return;
//         this.svg.current.setAttribute('width', this.main.current.clientWidth);
//         this.svg.current.setAttribute('height', this.main.current.clientHeight);
//         if(this.lastTarget && this.lastTarget.className && this.props.movingX)
//             this.noMovingLine();
//     }
    
//     handleMouseDown = e => {
//         let event = e;
//         if(e._reactName === 'onTouchStart')
//             event = e.changedTouches[0];
//         console.log(e._reactName, 'main mousedown')
//         const [offsetX, offsetY] = utils.getOffset.call(this, event, this.main.current);
//         if(this.props.algorithmType) {
//             return;
//         }
//         if(!this.props.isAction) {
//             this.props.toggleAction(true);
//             return;
//         }
//         this.lastTarget = this.main.current.children[utils.closestNode.call(this, offsetX, offsetY)] || this.main;
//     }   

    // handleMouseUp = e => {
    //     let event = e;
    //     if(e._reactName === 'onTouchEnd') {
    //         event = e.changedTouches[0];
    //         this.eventWasTouch = true;
    //     }
    //     const [offsetX, offsetY] = utils.getOffset.call(this, event, this.main.current);
    //     let currentTarget = this.main.current.children[utils.closestNode.call(this, offsetX, offsetY)] || this.main;
    //     let [x, y] =  [offsetX / this.props.vw, offsetY / this.props.vh];
    //     console.log(this.props.vw, this.props.vh, 'vw vh');
    //     console.log(x, y);
    //     if(this.lastTarget === currentTarget && currentTarget === this.main) {
    //         if(this.inBounds(x, y, this.unit(0.30)) && this.props.nodes.length !== 20) {
    //             this.props.appendNode([x, y]);
    //         }
    //         else {
    //             console.log('out/overflow');
    //             const root = document.querySelector('#root');
    //             if(!root.style.animation) {
    //                 root.style.animation = 'shake 0.5s linear';
    //                 setTimeout(() => {
    //                     root.style.animation = '';
    //                     if(this.props.nodes.length === 20)
    //                         this.props.setMessageBox(['20 Is the nodes limit']);
    //                  }, 500);
    //             }

    //         }
                
    //     }
    //     else if(this.lastTarget && this.lastTarget.className && currentTarget.className && this.lastTarget !== currentTarget) {
    //         let lastNode, thisNode;
    //         Array.from(this.main.current.children).forEach((node, i) => {
    //             if(this.lastTarget === node)
    //                 lastNode = i;
    //             if(currentTarget === node)
    //                 thisNode = i;
    //         });
    //         if(!this.props.adj[lastNode][thisNode] && !this.props.adj[thisNode][lastNode]) {
    //             this.props.newEdge([`${lastNode + 1} ${thisNode + 1}`]);
    //         }
    //     }
    //     this.noMovingLine();
    // }

    // handleMouseMove = e => {
    //     let event = e;
    //     if(e._reactName === 'onTouchMove')
    //         event = e.changedTouches[0];
    //     const [offsetX, offsetY] = utils.getOffset.call(this, event, this.main.current);
    //     if(this.lastTarget && this.lastTarget.className){
    //         if(this.inBounds(offsetX / this.props.vw, offsetY / this.props.vh, this.unit(0.025))) {
    //             if(!this.props.originNode)
    //                 this.props.setOriginNode({offsetLeft: this.lastTarget.offsetLeft, offsetTop: this.lastTarget.offsetTop});
    //             this.props.movingXUpdate(offsetX);
    //             this.props.movingYUpdate(offsetY);
    //         }
    //         else 
    //             this.noMovingLine();
    //     }
    // }
    
    // componentDidMount() {
    //     this.updateViewPort();
    //     window.addEventListener('resize', () => this.updateViewPort());
    // }


//     componentWillUnmount() {
//         this.setState = (state, callback) => { return };
//     }

    // shouldComponentUpdate(nextProps) {
    //     let changed = false;
    //     if(String(this.props.nodes) !== String(nextProps.nodes))
    //         changed = true;
    //     if(this.props.vw !== nextProps.vw || this.props.vh !== nextProps.vh)
    //         changed = true;
    //     for(let i = 0; i < 50; ++i)
    //         if(String(this.props.adj[i]) !== String(nextProps.adj[i]))
    //             changed = true;
    //     if(this.props.isTouch !== nextProps.isTouch)
    //         changed = true;
    //     return changed;
    // }

//     render() {
//         return (
//             <div 
//                 className="main" 
//                 ref={this.main} 
//                 onMouseUp={this.props.isTouch ?  null : (e => this.handleMouseUp(e))}
//                 onMouseDown={this.props.isTouch ?  null : (e => this.handleMouseDown(e))}
//                 onMouseMove={this.props.isTouch ?  null : (e => this.handleMouseMove(e))}
//                 onTouchEnd={this.props.isTouch ? (e => this.handleMouseUp(e)) : null}
//                 onTouchStart={this.props.isTouch ? (e => this.handleMouseDown(e)) : null}
//                 onTouchMove={this.props.isTouch ? (e => this.handleMouseMove(e)) : null}
//             >
//                 <NodeList/>
//                 <svg ref={this.svg}>
//                     <Edges/>
//                     <TraversedEdges/>
//                     <MovingLine/>
//                 </svg>
//             </div>
//         )
//     }
// }

const Main = props => {
    const main = React.useRef(null);
    const svg = React.useRef(null);
    const lastTarget = React.useRef(null);

    const unit = x => (6 * props.vw + 6 * props.vh) * x;

    const inBounds = (x, y, margin) => (
            (x > margin / props.vw) && (y > margin / props.vh) && 
            (Math.abs(x - main.current.clientWidth / props.vw) > margin / props.vw) && 
            (Math.abs(y - main.current.clientHeight / props.vh) > margin / props.vh)
        )
    
    const noMovingLine = () => {
        lastTarget.current = null;
        props.setOriginNode(null);
        props.movingXUpdate(null);
        props.movingYUpdate(null);
    }

    const updateViewPort = () => {
        if(!svg.current)
            return;
        svg.current.setAttribute('width', main.current.clientWidth);
        svg.current.setAttribute('height', main.current.clientHeight);
        if(lastTarget.current && lastTarget.current.className && props.movingX)
            noMovingLine();
    }

    const handleMouseDown = e => {
        let event = e;
        if(e._reactName === 'onTouchStart')
            event = e.changedTouches[0];
        const [offsetX, offsetY] = utils.getOffset(event, main.current);
        if(props.algorithmType) {
            return;
        }
        if(!props.isAction) {
            props.toggleAction(true);
            return;
        }
        lastTarget.current = main.current.children[utils.closestNode(offsetX, offsetY, props, unit(0.7))] || main;
    } 

    const handleMouseUp = e => {
        let event = e;
        if(e._reactName === 'onTouchEnd')
            event = e.changedTouches[0];
        const [offsetX, offsetY] = utils.getOffset(event, main.current);
        let currentTarget = main.current.children[utils.closestNode(offsetX, offsetY, props, unit(0.7))] || main;
        let [x, y] =  [offsetX / props.vw, offsetY / props.vh];
        if(lastTarget.current === currentTarget && currentTarget === main) {
            if(inBounds(x, y, unit(0.30)) && props.nodes.length !== 20) {
                props.appendNode([x, y]);
            }
            else {
                console.log('out/overflow');
                const root = document.querySelector('#root');
                if(!root.style.animation) {
                    root.style.animation = 'shake 0.5s linear';
                    setTimeout(() => {
                        root.style.animation = '';
                        if(props.nodes.length === 20)
                            props.setMessageBox(['20 Is the nodes limit']);
                     }, 500);
                }

            }
                
        }
        else if(lastTarget.current && lastTarget.current.className && currentTarget.className && lastTarget.current !== currentTarget) {
            let lastNode, thisNode;
            Array.from(main.current.children).forEach((node, i) => {
                if(lastTarget.current === node)
                    lastNode = i;
                if(currentTarget === node)
                    thisNode = i;
            });
            if(!props.adj[lastNode][thisNode] && !props.adj[thisNode][lastNode]) {
                props.newEdge([`${lastNode + 1} ${thisNode + 1}`]);
            }
        }
        noMovingLine();
    }

    const handleMouseMove = e => {
        let event = e;
        if(e._reactName === 'onTouchMove')
            event = e.changedTouches[0];
        const [offsetX, offsetY] = utils.getOffset(event, main.current);
        if(lastTarget.current && lastTarget.current.className){
            if(inBounds(offsetX / props.vw, offsetY / props.vh, unit(0.025))) {
                if(!props.originNode)
                    props.setOriginNode({offsetLeft: lastTarget.current.offsetLeft, offsetTop: lastTarget.current.offsetTop});
                props.movingXUpdate(offsetX);
                props.movingYUpdate(offsetY);
            }
            else 
                noMovingLine();
        }
    }
    useEffect(() => {
        updateViewPort();
        window.addEventListener('resize', () => updateViewPort());// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div 
            className="main" 
            ref={main} 
            onMouseUp={props.isTouch ?  null : (e => handleMouseUp(e))}
            onMouseDown={props.isTouch ?  null : (e => handleMouseDown(e))}
            onMouseMove={props.isTouch ?  null : (e => handleMouseMove(e))}
            onTouchEnd={props.isTouch ? (e => handleMouseUp(e)) : null}
            onTouchStart={props.isTouch ? (e => handleMouseDown(e)) : null}
            onTouchMove={props.isTouch ? (e => handleMouseMove(e)) : null}
        >
            <NodeList/>
            <svg ref={svg}>
                <Edges/>
                <TraversedEdges/>
                <MovingLine/>
            </svg>
        </div>
    )
}


const areEqual = (prev, next) => {
    let changed = true;
    if(String(prev.nodes) === String(next.nodes))
        changed = false;
    if(prev.vw === next.vw && prev.vh === next.vh)
        changed = false;
    for(let i = 0; i < 20; ++i)
        if(String(prev.adj[i]) === String(next.adj[i]))
            changed = false;
    if(prev.isTouch === next.isTouch)
        changed = false;
    return changed;
}

export default connect(
    state => ({
        nodes: state.nodes,
        vw: state.vw,
        vh: state.vh,
        adj: state.adj,
        originNode: state.originNode,
        isAction: state.isAction,
        algorithmType: state.algorithmType,
        isTouch: state.isTouch
    }),
    {appendNode, movingXUpdate, movingYUpdate, newEdge, 
     setOriginNode, toggleAction, setMessageBox}
)(React.memo(Main, areEqual));
