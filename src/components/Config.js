import React from 'react';
import { connect } from 'react-redux';
import * as utils from '../utils';
import { replaceNodes, replaceMatrix, newEdge, setMessageBox,toggleAction} from '../store';


class Config extends React.Component {
    textarea = React.createRef();
    configValue = '';
    lastDel = 0;

    unit = x => (6 * this.props.vw + 6 * this.props.vh) * x;
    invalid = (...args) => args.some(x => !utils.isNumber(x) || x >= this.props.nodes.length || x < 0);

    erase = () => {
        this.configValue = this.textarea.value.split('\n')[0];
        this.props.newEdge([]);
        this.props.replaceMatrix(utils.emptyMatrix());
    }

    parseConfigInput = () => {
        let configSplit = this.configValue.split('\n'), hasChanged = false;
        configSplit[0] = String(this.props.nodes.length || '');
        this.props.currentEdge.forEach(x => {
            if(!configSplit.includes(x)) 
                configSplit.push(x);
        })


        const newAdj = utils.emptyMatrix();
        if(this.lastDel !== this.props.deletedEdges) {
            this.lastDel++;
            configSplit = [configSplit[0], ...this.props.currentEdge];
        }
        configSplit.forEach(pair => {
            pair = pair.split(' ').map(x => x - 1);
            const [i, j] = pair;
            if(pair.length < 2 || this.invalid(i, j))
                return;
            newAdj[i][j] = 1;
        });
        for(let i = 0; i < 50; ++i)
            for(let j = 0; j < 50; ++j)
                if(this.props.adj[i][j] !== newAdj[i][j])
                    hasChanged = true;
        if(hasChanged)
            setTimeout(() => this.props.replaceMatrix(newAdj), 0);
        
        this.configValue = configSplit.reduce((total, current) => total + '\n' + current);
        return this.configValue;
    }

    handleChange = ({nativeEvent: e}) => {
        if(!this.props.isAction) {
            this.props.toggleAction(true);
            return;
        }
        if(this.props.messageBox[0]) {
            console.log('nU')
            return;
        }
        if(e.data && !utils.isNumber(e.data) && e.data !== ' ' && e.inputType !== 'inserLineBreak')
            return;
        this.configValue = this.textarea.current.value;
        if(e.inputType === 'insertFromPaste') 
            this.configValue = this.configValue.replace(/[^0-9\s]/g, '');     
        this.configValue = this.configValue.replace(/  +/g, ' ');
        let splitValue = this.textarea.current.value.split('\n');
        if(splitValue.length === 0)
            splitValue = [this.textarea.current.value]
        const nodeCount = splitValue[0].split(' ')[0];
        if(+nodeCount > 20) {
            this.props.setMessageBox([nodeCount + ' is too big!', 'You can use at most 20 nodes.']);
            return;
        }
        if(this.props.nodes.length !== +nodeCount) {
            this.props.replaceNodes(utils.generateRandomNodes.call(this, +nodeCount));
            if(+nodeCount)
                return;
        }
        if(this.props.currentEdge.length) {
            let newEdgeState = this.props.currentEdge.slice();
            newEdgeState = newEdgeState.filter(x => splitValue.includes(x));
            if(this.props.currentEdge.length !== newEdgeState.length)
                this.props.newEdge(newEdgeState);
        }
        this.forceUpdate();
    }
    shouldComponentUpdate = ({nodes, currentEdge, deletedEdges}) => (
        nodes.length !== this.props.nodes.length || 
        currentEdge !== this.props.currentEdge ||
        deletedEdges !== this.props.deletedEdges
    );
    

    render() {
        return (
            <textarea className="config"
                inputMode="numeric"
                type="number"
                ref={this.textarea}
                onChange={this.handleChange}
                value={this.parseConfigInput()}
                tabIndex='16'
            >
            </textarea>
        );
    }
}

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
)(Config)