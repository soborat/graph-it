import React from 'react';
import { connect } from 'react-redux';
import AlgorithmInfo from './AlgorithmInfo';
import * as utils from '../utils';
import { replaceMatrix, replaceNodes, newEdge, 
         deleteEdges, setGenerated, traverseEdges, deleteTraversedEdges, 
         addPathEdges, deletePathEdges, toggleAction, setAlgorithmType,
         setMessageBox, setAlgorithmInfo} from '../store';


// sa fie complet utilizabil doar din tastatura

class Panel extends React.Component {
    frozenScreen = false;
    traverseColor = '#8036e0';
    pathColor = '#de0012';
    start = null;
    end = null;
    focusedDropdown = null;

    unit = x => (6 * this.props.vw + 6 * this.props.vh) * x;

    shouldComponentUpdate = (nextProps) => (
        this.props.isTouch !== nextProps.isTouch
    )

    newRandomNodes = e => {
        if(e._reactName === 'onKeyDown' && e.key !== 'Enter')
            return;
        this.props.setGenerated(true);
        this.props.replaceNodes(
            utils.generateRandomNodes.call(this, this.props.nodes.length)
        );
    }

    newRandomEdges = e => {
        if(e._reactName === 'onKeyDown' && e.key !== 'Enter')
            return;
        this.props.deleteEdges();
        this.props.setGenerated(true);
        this.props.newEdge(
            utils.generateRandomEdges.call(this, this.props.nodes.length)
        );
    }

    newRandomGraph = e => {
        if(e._reactName === 'onKeyDown' && e.key !== 'Enter')
            return;
        let newLength = utils.randInt(5, 12);
        this.props.replaceMatrix(utils.emptyMatrix());
        this.props.deleteEdges();
        this.props.replaceNodes(
            utils.generateRandomNodes.call(this, newLength)
        );
        this.props.setGenerated(true);
        this.props.newEdge(
            utils.generateRandomEdges.call(this, newLength)
        );
    }

    getInput =  async message => {
        const main = document.querySelector('.main');
        let target = null;
        const eventType = this.props.isTouch ? 'touchstart' : 'click';
        this.props.setAlgorithmInfo(message);
        const selectNode = e => {
            let event = e;
            if(eventType === 'touchstart')
                event = e.touches[0];
            console.log(event)
            if(target !== null)
                return;
            const [offsetX, offsetY] = utils.getOffset.call(this, event, main);
            console.log(offsetX, offsetY, event.clientX, event.clientY, 'offsets');
            const currentTarget = utils.closestNode.call(this, offsetX, offsetY);
            console.log(currentTarget, 'currentTarget')
            if(currentTarget !== -1) {
                main.removeEventListener(eventType, selectNode);
                target = currentTarget;
                console.log(target);
            }
        }
        main.addEventListener(eventType, e => selectNode(e));
        for(let i = 0; i < 100; ++i) {
            if(target !== null)
                return target;
            await utils.sleep(100);
        }
        throw new Error('USER_TIMEOUT');
    }

    startAlgorithm = async () => {
        document.querySelector('textarea').readOnly = true;
        document.querySelector('.hidden-content').classList.add('hidden');
        const main = document.querySelector('.main');
        let start, end;
        try {
            if(this.props.nodes.length < 2) {
                console.log('nu merge')
                await utils.sleep(100);
                this.props.setMessageBox(['You need a graph to visualise an algorithm']);
                throw new Error('NO_GRAPH');
            }
            start = await this.getInput('Choose the starting node');
            this.start = start;
            main.children[start].innerHTML = '<i class="fas fa-arrow-circle-right"></i>';
            do {
                end = await this.getInput('Choose the destination');
            }while(start === end);
            this.end = end;
            main.children[end].innerHTML = '<i class="fas fa-bullseye"></i>';
        } catch(err) {
            // console.log(err);
            throw new Error('NO_INPUT');
        }
        
        console.log(start + 1, end + 1, 'points');
        document.body.style.pointerEvents = 'none';
        this.props.setAlgorithmInfo(' ');
        await utils.sleep(300);
        return [main, this.props.nodes.length, [start, end]];
    }

    BFS = async e => {
        if(e._reactName === 'onKeyDown' && e.key !== 'Enter')
            return;
        this.props.setAlgorithmType('bfs');
        let startParams;
        try {
            startParams = await this.startAlgorithm();
        }
        catch {
            this.cleanup();
            return;
        }
        const [main, n, [start, end]] = startParams;
        main.children[start].style.background = this.traverseColor;
        let q = [], index = -1, mark = Array(n).fill(0);
        
        mark[start] = 1;
        q.push(start);
        await utils.sleep(100);
        while(index !== q.length - 1 && !mark[end]) {
            const node = q[++index];
            console.log(node + 1);
            let temp = [];
            for(let i = 0; i < n; ++i) {
                if((this.props.adj[node][i] || this.props.adj[i][node]) && !mark[i]) {
                    mark[i] = mark[node] + 1;
                    console.log('conneciton', node + 1, i + 1);
                    this.props.traverseEdges([node, i]);
                    q.push(i);
                    temp.push(i);
                }
            }
            if(temp.length)
                await utils.sleep(1350);
            temp.forEach(x => {
                main.children[x].style.background = this.traverseColor;
                main.children[x].style.animation = 'visitNode 0.5s ease-in-out';
                setTimeout(() => {
                    main.children[x].style.animation = null;
                }, 500);
            });
            if(temp.length)
                await utils.sleep(350);
        }
        console.log('gata bf')
        let x = end, path = [x];

        if(mark[end]) {
            while(x !== start) {
                for(let i = 0; i < 50; ++i)
                    if((this.props.adj[x][i] || this.props.adj[i][x]) && mark[i] === mark[x] - 1) {
                        x = i;
                        path.push(x);
                        break;
                    }
            }
            console.log(path);
            for(let i = path.length - 1; i >= 0; --i) {
                main.children[path[i]].style.background = this.pathColor;
                if(i > 0) {
                    this.props.addPathEdges([path[i], path[i - 1]]);
                    await utils.sleep(800);
                }
            }
            this.props.setAlgorithmInfo(path.reverse().map(x => +x + 1).join('\u2192'));
        }
        else {
            this.props.setAlgorithmInfo('No path was found');
        }

        document.body.style.pointerEvents = 'auto';
        document.querySelector('textarea').readOnly = false;
        this.frozenScreen = true;
        this.props.toggleAction(false);
    }

    DFS = async e => {
        if(e._reactName === 'onKeyDown' && e.key !== 'Enter')
            return;
        this.props.setAlgorithmType('dfs');
        let startParams;
        try {
            startParams = await this.startAlgorithm();
        }
        catch {
            this.cleanup();
            return;
        }
        const [main, n, [start, end]] = startParams;
        main.children[start].style.background = this.traverseColor;
        let mark = Array(n).fill(0), temp = [], path = [];
        await utils.sleep(100);

        const recursiveDFS = async node => {
            if(node === end) {
                path = [...temp, end].slice();
            }

            if(path.length) {
                return;
            }

            temp.push(node);
            console.log(node, 'current node');
            mark[node] = 1;
            for(let i = 0; i < n && !path.length; ++i) {
                if((this.props.adj[node][i] || this.props.adj[i][node]) && !mark[i]) {
                    this.props.traverseEdges([node, i]);
                    await utils.sleep(1000);
                    main.children[i].style.background = this.traverseColor;
                    main.children[i].style.animation = 'visitNode 0.5s ease-in-out';
                    setTimeout(() => {
                        main.children[i].style.animation = null;
                    }, 500);
                    console.log(node, i, 'alta');
                    await utils.sleep(350);
                    await recursiveDFS(i);
                }
            }
            if(!path.length) {
                await utils.sleep(150);
                const [i, j] = temp.slice(-2);
                const edge = document.querySelector(`#edge-${i}0${j}`);
                if(!edge)
                    return;
                const dist = utils.dist(...['x1', 'x2', 'y1', 'y2'].map(k => +edge.getAttribute(k)));
                console.log(dist, 'dist')
                edge.style.animation = null;
                edge.style.strokeDasharray = dist;
                edge.style.strokeDashoffset = 0;
                document.documentElement.style.setProperty('--dist', dist);
                edge.style.animation = 'disappear 0.7s linear forwards';
                main.children[j].style.background = null;
                console.log('renuntam la ', i + 1, j + 1);
                temp.pop();
                await utils.sleep(700);
                edge.style.display = 'none';
            }

        }
        await recursiveDFS(start);
        console.log(path, 'path')
        if(path.length) {
            for(let i = 0; i < path.length; ++i) {
                main.children[path[i]].style.background = this.pathColor;
                if(i !== path.length - 1){
                    this.props.addPathEdges([path[i], path[i + 1]]);
                    await utils.sleep(750);
                }
            }
            this.props.setAlgorithmInfo(path.map(x => Number(x) + 1).join('\u2192'));
        }
        else {
            this.props.setAlgorithmInfo('No path was found.');
        }
        document.body.style.pointerEvents = 'auto';
        document.querySelector('textarea').readOnly = false;
        this.frozenScreen = true;
        this.props.toggleAction(false);
    }


    toggleDropdown = e => {
        console.log(e._reactName, 'toggledropdown', this.props.isTouch)
        if((e.target !== e.currentTarget) || (e._reactName === 'onKeyDown' && e.key !== 'Enter'))
            return;
        const currentHiddenContent = document.querySelector('#' + e.target.id + ' .hidden-content');
        const restHiddenContents = [...document.querySelectorAll('.hidden-content')].filter(x => x !== currentHiddenContent);
        console.log(restHiddenContents)
        restHiddenContents.forEach(x => x.classList.add('hidden'));
        currentHiddenContent.classList.toggle('hidden')
    }

    test2 = e => {
        console.log('related', e.relatedTarget, 'related')
    }

    cleanup = () => {
        const main = document.querySelector('.main');
        Array.from(main.children).filter(x => x.className === 'node').map(x => x.style.background = null);
        if(this.start != null)
            main.children[this.start].innerHTML = `<h1>${this.start + 1}</h1>`;
        if(this.end != null)
            main.children[this.end].innerHTML = `<h1>${this.end + 1}</h1>`;
        this.start = null;
        this.end = null;
        document.body.style.pointerEvents = 'auto';
        document.querySelector('textarea').readOnly = false;
        this.props.setAlgorithmInfo('');
        this.props.setAlgorithmType('');
        this.props.deletePathEdges();
        this.props.deleteTraversedEdges();
    }


    setColor = e => {
        if(e._reactName === 'onKeyDown' && e.key !== 'Enter')
            return;
        const target = e.target;
        if(target.className.split(' ')[0] !== 'color-option')
            return;
        const parent = target.parentElement;
        Array.from(parent.children).forEach(sibling => {
            sibling.classList.remove('selected-color');
        });
        const type = parent.id[0] === 'n' ? 'node' : 'edge';
        const background = target.style.background;
        document.documentElement.style.setProperty('--' + type + '-color', background);
        window.localStorage.setItem(type + 'Color', background);
        target.classList.add('selected-color');
    }

    componentDidMount() {
        ['mousedown', 'click', 'keydown', 'touchstart'].forEach(eventType => {
            document.addEventListener(eventType, e => {
                if(this.frozenScreen) {
                    this.frozenScreen = false;
                    this.props.toggleAction(true);
                    this.cleanup();
                }
            })
        });
        const {localStorage} = window, doc = document.documentElement;
        // localStorage.clear();
        console.log(localStorage)
        const nodeColor = localStorage.getItem('nodeColor') || 'rgb(0, 128, 0)';
        const edgeColor = localStorage.getItem('edgeColor') || 'rgb(155, 166, 201)';
        localStorage.setItem('nodeColor', nodeColor);
        localStorage.setItem('edgeColor', edgeColor);
        doc.style.setProperty('--node-color', nodeColor);
        doc.style.setProperty('--edge-color', edgeColor);
        const colors = Array.from(document.querySelectorAll('.color-option'));
        const defaultNodeColor = colors.filter(color => color.style.backgroundColor === nodeColor)[0];
        const defaultEdgeColor = colors.filter(color => color.style.backgroundColor === edgeColor)[0];
        [defaultNodeColor, defaultEdgeColor].forEach(x => x.classList.add('selected-color'));
    }

    render() {
        return (
            <div className="panel">
                <AlgorithmInfo/>
                <ul>
                    <li onClick={this.props.isTouch ?  null : (e => this.newRandomNodes(e))} 
                        onTouchStart={this.props.isTouch ? (e => this.newRandomNodes(e)) : null}
                        onKeyDown={e => this.newRandomNodes(e)}
                        tabIndex='1'
                    >Redistribute nodes</li>
                    <li onClick={this.props.isTouch ?  null : (e => this.newRandomEdges(e))}
                        onTouchStart={this.props.isTouch ? (e => this.newRandomEdges(e)) : null}
                        onKeyDown={e => this.newRandomEdges(e)}
                        tabIndex='2'
                    >Random edges</li>
                    <li onClick={this.props.isTouch ?  null : (e => this.newRandomGraph(e))}
                        onTouchStart={this.props.isTouch ? (e => this.newRandomGraph(e)) : null}
                        onKeyDown={e => this.newRandomGraph(e)}
                        tabIndex='3'
                    >Random Graph</li>
                    <li id="algorithms-dropdown" className="hover-expandable" 
                        onClick={this.props.isTouch ? null : (e => this.toggleDropdown(e))}
                        onTouchStart={this.props.isTouch ? (e => this.toggleDropdown(e)) : null}
                        onKeyDown={e => this.toggleDropdown(e)}
                        // onFocus={e => this.test(e)}
                        onBlur={e => this.test2(e)}
                        tabIndex='4'
                    >Algorithms<span>&#9660;</span>
                        <div className="hidden-content hidden">
                            <ul>
                                <li onClick={this.props.isTouch ?  null : (e => this.BFS(e))}
                                    onTouchStart={this.props.isTouch ? (e => this.BFS(e)) : null}
                                    onKeyDown={e => this.BFS(e)}
                                    tabIndex='5'
                                >BFS</li>
                                <li onClick={this.props.isTouch ?  null : (e => this.DFS(e))} 
                                    onTouchStart={this.props.isTouch ? (e => this.DFS(e)) : null}
                                    onKeyDown={e => this.DFS(e)}
                                    tabIndex='6'
                                >DFS</li>
                            </ul>
                        </div>
                    </li>
                    <li id="colors-dropdown" 
                        className="hover-expandable" tabIndex='7'
                        onClick={this.props.isTouch ? null : (e => this.toggleDropdown(e))}
                        onTouchStart={this.props.isTouch ? (e => this.toggleDropdown(e)) : null}
                        onKeyDown={e => this.toggleDropdown(e)}
                        onBlur={e => this.test2(e)}
                    >Change colors<span>&#9660;</span>
                        <div className="hidden-content hidden">
                            <ul>
                                <li tabIndex='8'>Nodes color
                                    <ul className="color-list" id="node-color-picker" 
                                        onClick={this.props.isTouch ?  null : (e => this.setColor(e))}
                                        onTouchStart={this.props.isTouch ? (e => this.setColor(e)) : null}
                                        onKeyDown={e => this.setColor(e)}
                                    >
                                        <div className="color-option" style={{background: 'rgb(0, 128, 0)'}} tabIndex='9'></div>
                                        <div className="color-option" style={{background: 'rgb(88, 109, 176)'}} tabIndex='10'></div>
                                        <div className="color-option" style={{background: 'rgb(235, 137, 19)'}} tabIndex='11'></div>
                                    </ul>
                                </li>
                                <li tabIndex='12'>Edges color
                                    <ul className="color-list" id="edge-color-picker" 
                                        onClick={this.props.isTouch ?  null : (e => this.setColor(e))}
                                        onTouchStart={this.props.isTouch ? (e => this.setColor(e)) : null}
                                        onKeyDown={e => this.setColor(e)}
                                    >
                                        <div className="color-option" style={{background: 'rgb(155, 166, 201)'}} tabIndex='13'></div>
                                        <div className="color-option" style={{background: 'rgb(139, 181, 151)'}} tabIndex='14'></div>
                                        <div className="color-option" style={{background: 'rgb(111, 173, 189)'}} tabIndex='15'></div>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        )
    }
}

export default connect(
    state => ({
        adj: state.adj,
        vw: state.vw,
        vh: state.vh,
        nodes: state.nodes,
        isTouch: state.isTouch
    }),
    {replaceMatrix, replaceNodes, newEdge, deleteEdges, 
     setGenerated, traverseEdges, deleteTraversedEdges,
     toggleAction, addPathEdges, deletePathEdges, 
     setAlgorithmType, setMessageBox, setAlgorithmInfo}
)(Panel);

