import React from 'react';
import { connect } from 'react-redux';
import * as utils from '../utils';
import { replaceNodes, replaceMatrix, newEdge, setMessageBox,toggleAction} from '../store';


// class Config extends React.Component {
//     textarea = React.createRef();
//     configValue = '';
//     lastDel = 0;

//     invalid = (...args) => args.some(x => !utils.isNumber(x) || x >= this.props.nodes.length || x < 0);

//     erase = () => {
//         this.configValue = this.textarea.value.split('\n')[0];
//         this.props.newEdge([]);
//         this.props.replaceMatrix(utils.emptyMatrix());
//     }

//     parseConfigInput = () => {
//         let configSplit = this.configValue.split('\n'), hasChanged = false;
//         configSplit[0] = String(this.props.nodes.length || '');
//         this.props.currentEdge.forEach(x => {
//             if(!configSplit.includes(x)) 
//                 configSplit.push(x);
//         })


//         const newAdj = utils.emptyMatrix();
//         if(this.lastDel !== this.props.deletedEdges) {
//             this.lastDel++;
//             configSplit = [configSplit[0], ...this.props.currentEdge];
//         }
//         configSplit.forEach(pair => {
//             pair = pair.split(' ').map(x => x - 1);
//             const [i, j] = pair;
//             if(pair.length < 2 || this.invalid(i, j))
//                 return;
//             newAdj[i][j] = 1;
//         });
//         for(let i = 0; i < 50; ++i)
//             for(let j = 0; j < 50; ++j)
//                 if(this.props.adj[i][j] !== newAdj[i][j])
//                     hasChanged = true;
//         if(hasChanged)
//             setTimeout(() => this.props.replaceMatrix(newAdj), 0);
        
//         this.configValue = configSplit.reduce((total, current) => total + '\n' + current);
//         return this.configValue;
//     }

//     handleChange = ({nativeEvent: e}) => {
//         if(!this.props.isAction) {
//             this.props.toggleAction(true);
//             return;
//         }
//         if(this.props.messageBox[0]) {
//             return;
//         }
//         if(e.data && !utils.isNumber(e.data) && e.data !== ' ' && e.inputType !== 'inserLineBreak')
//             return;
//         this.configValue = this.textarea.current.value;
//         if(e.inputType === 'insertFromPaste') 
//             this.configValue = this.configValue.replace(/[^0-9\s]/g, '');     
//         this.configValue = this.configValue.replace(/  +/g, ' ');
//         let splitValue = this.textarea.current.value.split('\n');
//         if(splitValue.length === 0)
//             splitValue = [this.textarea.current.value]
//         const nodeCount = splitValue[0].split(' ')[0];
//         if(+nodeCount > 20) {
//             this.props.setMessageBox([nodeCount + ' is too big!', 'You can use at most 20 nodes.']);
//             return;
//         }
//         if(this.props.nodes.length !== +nodeCount) {
//             this.props.replaceNodes(utils.generateRandomNodes.call(this, +nodeCount));
//             if(+nodeCount)
//                 return;
//         }
//         if(this.props.currentEdge.length) {
//             let newEdgeState = this.props.currentEdge.slice();
//             newEdgeState = newEdgeState.filter(x => splitValue.includes(x));
//             if(this.props.currentEdge.length !== newEdgeState.length)
//                 this.props.newEdge(newEdgeState);
//         }
//         this.forceUpdate();
//     }
//     shouldComponentUpdate = ({nodes, currentEdge, deletedEdges}) => (
//         nodes.length !== this.props.nodes.length || 
//         currentEdge !== this.props.currentEdge ||
//         deletedEdges !== this.props.deletedEdges
//     )
    

//     render() {
//         return (
//             <textarea className="config"
//                 inputMode="numeric"
//                 type="number"
//                 ref={this.textarea}
//                 onChange={this.handleChange}
//                 value={this.parseConfigInput()}
//                 tabIndex='16'
//             >
//             </textarea>
//         );
//     }
// }


const Config = props => {
    const textarea = React.useRef(null);
    const configValue = React.useRef('');
    const lastDel = React.useRef(0);
    const [T, update] = React.useState(0);

    const invalid = (...args) => args.some(x => !utils.isNumber(x) || x >= props.nodes.length || x < 0);
    
    const unit = x => (6 * props.vw + 6 * props.vh) * x;

    const parseConfigInput = () => {
        let configSplit = configValue.current.split('\n'), hasChanged = false;
        configSplit[0] = String(props.nodes.length || '');
        props.currentEdge.forEach(x => {
            if(!configSplit.includes(x)) 
                configSplit.push(x);
        })

        const newAdj = utils.emptyMatrix();
        if(lastDel.current !== props.deletedEdges) {
            lastDel.current++;
            configSplit = [configSplit[0], ...props.currentEdge];
        }
        configSplit.forEach(pair => {
            pair = pair.split(' ').map(x => x - 1);
            const [i, j] = pair;
            if(pair.length < 2 || invalid(i, j))
                return;
            newAdj[i][j] = 1;
        });
        for(let i = 0; i < 20; ++i)
            if(String(props.adj[i]) !== String(newAdj[i]))
                hasChanged = true;
        if(hasChanged)
            setTimeout(() => props.replaceMatrix(newAdj), 0);
        
        configValue.current = configSplit.reduce((total, current) => total + '\n' + current);
        return configValue.current;
    }

    const handleChange = ({nativeEvent: e}) => {
        if(!props.isAction) {
            props.toggleAction(true);
            return;
        }
        if(props.messageBox[0]) {
            return;
        }
        if(e.data && !utils.isNumber(e.data) && e.data !== ' ' && e.inputType !== 'inserLineBreak')
            return;
        configValue.current = textarea.current.value;
        if(e.inputType === 'insertFromPaste') 
            configValue.current = configValue.current.replace(/[^0-9\s]/g, '');     
        configValue.current = configValue.current.replace(/  +/g, ' ');
        let splitValue = textarea.current.value.split('\n');
        if(splitValue.length === 0)
            splitValue = [textarea.current.value]
        const nodeCount = splitValue[0].split(' ')[0];
        if(+nodeCount > 20) {
            props.setMessageBox([nodeCount + ' is too big!', 'You can use at most 20 nodes.']);
            return;
        }
        if(props.nodes.length !== +nodeCount) {
            props.replaceNodes(utils.generateRandomNodes(+nodeCount, props, unit));
            if(+nodeCount)
                return;
        }
        if(props.currentEdge.length) {
            let newEdgeState = props.currentEdge.slice();
            newEdgeState = newEdgeState.filter(x => splitValue.includes(x));
            if(props.currentEdge.length !== newEdgeState.length)
                props.newEdge(newEdgeState);
        }
        update(T + 1);
    }

    return (
        <textarea className="config"
            inputMode="numeric"
            type="number"
            ref={textarea}
            onChange={handleChange}
            value={parseConfigInput()}
            tabIndex='16'
        >
        </textarea>
    )
}

const areEqual = (prev, next) => (
    prev.nodes.length === next.nodes.length && 
    prev.currentEdge === next.currentEdge &&
    prev.deletedEdges === next.deletedEdges &&
    prev.vw === next.vw && prev.hh === next.vh
)

export default connect(
    state => ({
        nodes: state.nodes,
        adj: state.adj,
        currentEdge: state.currentEdge,
        vw: state.vw,
        vh: state.vh,
        deletedEdges: state.deletedEdges,
        isAction: state.isAction,
        messageBox: state.messageBox
    }),
    {replaceNodes, replaceMatrix, newEdge, setMessageBox, toggleAction}
)(React.memo(Config, areEqual))