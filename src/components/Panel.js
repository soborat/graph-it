import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import AlgorithmInfo from './AlgorithmInfo';
import * as utils from '../utils';
import { replaceMatrix, replaceNodes, newEdge, 
         deleteEdges, setGenerated, traverseEdges, deleteTraversedEdges, 
         addPathEdges, deletePathEdges, toggleAction, setAlgorithmType,
         setMessageBox, setAlgorithmInfo, setNodeColor, setEdgeColor} from '../store';


const Panel = props => {
    const frozenScreen = React.useRef(false);
    const traverseColor = React.useRef('#8036e0');
    const pathColor = React.useRef('#de0012');
    const start = React.useRef(null);
    const end = React.useRef(null);
    const doc = document.documentElement;
    const nodeColors = [
        {color: 'rgb(0, 128, 0)', index: '9'},
        {color: 'rgb(88, 109, 176)', index: '10'},
        {color: 'rgb(235, 137, 19)', index: '11'}
    ];
    const edgeColors = [
        {color: 'rgb(155, 166, 201)', index: '13'},
        {color: 'rgb(139, 181, 151)', index: '14'},
        {color: 'rgb(111, 173, 189)', index: '15'}
    ];

    const unit = x => (6 * props.vw + 6 * props.vh) * x;

    const newRandomNodes = e => {
        if(e._reactName === 'onKeyDown' && e.key !== 'Enter')
            return;
        props.setGenerated(true);
        props.replaceNodes(
            utils.generateRandomNodes(props.nodes.length, props, unit)
        );
    }

    const newRandomEdges = e => {
        if(e._reactName === 'onKeyDown' && e.key !== 'Enter')
            return;
        props.deleteEdges();
        props.setGenerated(true);
        props.newEdge(
            utils.generateRandomEdges(props.nodes.length)
        );
    }

    const newRandomGraph = e => {
        if(e && e._reactName === 'onKeyDown' && e.key !== 'Enter')
            return;
        let newLength = utils.randInt(5, 12);
        props.replaceMatrix(utils.emptyMatrix());
        props.deleteEdges();
        props.replaceNodes(
            utils.generateRandomNodes(newLength, props, unit)
        );
        props.setGenerated(true);
        props.newEdge(
            utils.generateRandomEdges(newLength)
        );
    }

    const getInput =  async message => {
        const main = document.querySelector('.main');
        let target = null;
        const eventType = props.isTouch ? 'touchstart' : 'click';
        props.setAlgorithmInfo(message);
        const selectNode = e => {
            let event = e;
            if(eventType === 'touchstart')
                event = e.touches[0];
            if(target !== null)
                return;
            const [offsetX, offsetY] = utils.getOffset(event, main);
            const currentTarget = utils.closestNode(offsetX, offsetY, props, unit(0.7));
            if(currentTarget !== -1) {
                main.removeEventListener(eventType, selectNode);
                target = currentTarget;
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

    const startAlgorithm = async () => {
        document.querySelector('textarea').readOnly = true;
        document.querySelector('.hidden-content').classList.add('hidden');
        const main = document.querySelector('.main');
        let startTemp, endTemp;
        try {
            if(props.nodes.length < 2) {
                await utils.sleep(100);
                props.setMessageBox(['You need a graph to visualise an algorithm']);
                throw new Error('NO_GRAPH');
            }
            startTemp = await getInput('Choose the starting node');
            start.current = startTemp;
            main.children[start.current].innerHTML = '<i class="fas fa-arrow-circle-right"></i>';
            do {
                endTemp = await getInput('Choose the destination');
            }while(startTemp === endTemp);
            end.current = endTemp;
            main.children[end.current].innerHTML = '<i class="fas fa-bullseye"></i>';
        } catch(err) {
            throw new Error('NO_INPUT');
        }
        document.body.style.pointerEvents = 'none';
        props.setAlgorithmInfo(' ');
        await utils.sleep(300);
        return [main, props.nodes.length, [start.current, end.current]];
    }

    const BFS = async e => {
        if(e._reactName === 'onKeyDown' && e.key !== 'Enter')
            return;
        props.setAlgorithmType('bfs');
        let startParams;
        try {
            startParams = await startAlgorithm();
        }
        catch(err){
            cleanup();
            return;
        }
        const [main, n, [start, end]] = startParams;
        main.children[start].style.background = traverseColor.current;
        let q = [], index = -1, mark = Array(n).fill(0);
        
        mark[start] = 1;
        q.push(start);
        await utils.sleep(100);
        while(index !== q.length - 1 && !mark[end]) {
            const node = q[++index];
            let temp = [];
            for(let i = 0; i < n; ++i) {
                if((props.adj[node][i] || props.adj[i][node]) && !mark[i]) {
                    mark[i] = mark[node] + 1;
                    props.traverseEdges([node, i]);
                    q.push(i);
                    temp.push(i);
                }
            }
            if(temp.length)
                await utils.sleep(1350);
            temp.forEach(x => {
                main.children[x].style.background = traverseColor.current;
                main.children[x].style.animation = 'visitNode 0.5s ease-in-out';
                setTimeout(() => {
                    main.children[x].style.animation = null;
                }, 500);
            });
            if(temp.length)
                await utils.sleep(350);
        }
        let x = end, path = [x];

        if(mark[end]) {
            while(x !== start) {
                for(let i = 0; i < 20; ++i)
                    if((props.adj[x][i] || props.adj[i][x]) && mark[i] === mark[x] - 1) {
                        x = i;
                        path.push(x);
                        break;
                    }
            }
            for(let i = path.length - 1; i >= 0; --i) {
                main.children[path[i]].style.background = pathColor.current;
                if(i > 0) {
                    props.addPathEdges([path[i], path[i - 1]]);
                    await utils.sleep(800);
                }
            }
            props.setAlgorithmInfo(path.reverse().map(x => +x + 1).join('\u2192'));
        }
        else {
            props.setAlgorithmInfo('No path was found');
        }

        document.body.style.pointerEvents = 'auto';
        document.querySelector('textarea').readOnly = false;
        frozenScreen.current = true;
        props.toggleAction(false);
    }

    const DFS = async e => {
        if(e._reactName === 'onKeyDown' && e.key !== 'Enter')
            return;
        props.setAlgorithmType('dfs');
        let startParams;
        try {
            startParams = await startAlgorithm();
        }
        catch {
            cleanup();
            return;
        }
        const [main, n, [start, end]] = startParams;
        main.children[start].style.background = traverseColor.current;
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
            mark[node] = 1;
            for(let i = 0; i < n && !path.length; ++i) {
                if((props.adj[node][i] || props.adj[i][node]) && !mark[i]) {
                    props.traverseEdges([node, i]);
                    await utils.sleep(1000);
                    main.children[i].style.background = traverseColor.current;
                    main.children[i].style.animation = 'visitNode 0.5s ease-in-out';
                    setTimeout(() => {
                        main.children[i].style.animation = null;
                    }, 500);
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
                edge.style.animation = null;
                edge.style.strokeDasharray = dist;
                edge.style.strokeDashoffset = 0;
                document.documentElement.style.setProperty('--dist', dist);
                edge.style.animation = 'disappear 0.7s linear forwards';
                main.children[j].style.background = null;
                temp.pop();
                await utils.sleep(700);
                edge.style.display = 'none';
            }

        }
        await recursiveDFS(start);
        if(path.length) {
            for(let i = 0; i < path.length; ++i) {
                main.children[path[i]].style.background = pathColor.current;
                if(i !== path.length - 1){
                    props.addPathEdges([path[i], path[i + 1]]);
                    await utils.sleep(750);
                }
            }
            props.setAlgorithmInfo(path.map(x => Number(x) + 1).join('\u2192'));
        }
        else {
            props.setAlgorithmInfo('No path was found.');
        }
        document.body.style.pointerEvents = 'auto';
        document.querySelector('textarea').readOnly = false;
        frozenScreen.current = true;
        props.toggleAction(false);
    }


    const toggleDropdown = e => {
        if((e.target !== e.currentTarget) || (e._reactName === 'onKeyDown' && e.key !== 'Enter'))
            return;
        const currentHiddenContent = document.querySelector('#' + e.target.id + ' .hidden-content');
        const restHiddenContents = [...document.querySelectorAll('.hidden-content')].filter(x => x !== currentHiddenContent);
        restHiddenContents.forEach(x => x.classList.add('hidden'));
        currentHiddenContent.classList.toggle('hidden')
    }

    const cleanup = () => {
        const main = document.querySelector('.main');
        Array.from(main.children).filter(x => x.className === 'node').map(x => x.style.background = null);
        if(start.current != null)
            main.children[start.current].innerHTML = `<h1>${start.current + 1}</h1>`;
        if(end.current != null)
            main.children[end.current].innerHTML = `<h1>${end.current + 1}</h1>`;
        start.current = null;
        end.current = null;
        document.body.style.pointerEvents = 'auto';
        document.querySelector('textarea').readOnly = false;
        props.setAlgorithmInfo('');
        props.setAlgorithmType('');
        props.deletePathEdges();
        props.deleteTraversedEdges();
    }

    const setColor = e => {
        const target = e.target;
        const parent = target.parentElement;
        const type = parent.id[0] === 'n' ? 'node' : 'edge';
        if(e._reactName === 'onKeyDown' && e.key !== 'Enter')
            return;
        if(target.className.split(' ')[0] !== 'color-option')
            return;
        if(type === 'node')
            props.setNodeColor(target.style.backgroundColor);
        else
            props.setEdgeColor(target.style.backgroundColor);
    }

    useEffect(() => {
        ['mousedown', 'click', 'keydown', 'touchstart'].forEach(eventType => {
            document.addEventListener(eventType, e => {
                if(frozenScreen.current) {
                    frozenScreen.current = false;
                    props.toggleAction(true);
                    cleanup();
                }
            })
        });
        if(localStorage.nodeColor !== props.nodeColor && localStorage.nodeColor)
            props.setNodeColor(localStorage.nodeColor);

        if(localStorage.edgeColor !== props.edgeColor && localStorage.edgeColor)
            props.setEdgeColor(localStorage.edgeColor);
        console.log(props.vw, props.vh)
        newRandomGraph();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {

        localStorage.setItem('nodeColor', props.nodeColor);
        localStorage.setItem('edgeColor', props.edgeColor);
        doc.style.setProperty('--node-color', props.nodeColor);
        doc.style.setProperty('--edge-color', props.edgeColor);// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.nodeColor, props.edgeColor])

    return (
        <div className="panel">
            <AlgorithmInfo/>
            <ul>
                <li onClick={props.isTouch ?  null : (e => newRandomNodes(e))} 
                    onTouchStart={props.isTouch ? (e => newRandomNodes(e)) : null}
                    onKeyDown={e => newRandomNodes(e)}
                    tabIndex='1'
                >Redistribute nodes</li>
                <li onClick={props.isTouch ?  null : (e => newRandomEdges(e))}
                    onTouchStart={props.isTouch ? (e => newRandomEdges(e)) : null}
                    onKeyDown={e => newRandomEdges(e)}
                    tabIndex='2'
                >Random edges</li>
                <li onClick={props.isTouch ?  null : (e => newRandomGraph(e))}
                    onTouchStart={props.isTouch ? (e => newRandomGraph(e)) : null}
                    onKeyDown={e => newRandomGraph(e)}
                    tabIndex='3'
                >Random Graph</li>
                <li id="algorithms-dropdown" className="hover-expandable" 
                    onClick={props.isTouch ? null : (e => toggleDropdown(e))}
                    onTouchStart={props.isTouch ? (e => toggleDropdown(e)) : null}
                    onKeyDown={e => toggleDropdown(e)}
                    tabIndex='4'
                >Algorithms<span>&#9660;</span>
                    <div className="hidden-content hidden">
                        <ul>
                            <li onClick={props.isTouch ?  null : (e => BFS(e))}
                                onTouchStart={props.isTouch ? (e => BFS(e)) : null}
                                onKeyDown={e => BFS(e)}
                                tabIndex='5'
                            >BFS</li>
                            <li onClick={props.isTouch ?  null : (e => DFS(e))} 
                                onTouchStart={props.isTouch ? (e => DFS(e)) : null}
                                onKeyDown={e => DFS(e)}
                                tabIndex='6'
                            >DFS</li>
                        </ul>
                    </div>
                </li>
                <li id="colors-dropdown" 
                    className="hover-expandable" tabIndex='7'
                    onClick={props.isTouch ? null : (e => toggleDropdown(e))}
                    onTouchStart={props.isTouch ? (e => toggleDropdown(e)) : null}
                    onKeyDown={e => toggleDropdown(e)}
                >Change colors<span>&#9660;</span>
                    <div className="hidden-content hidden">
                        <ul>
                            <li tabIndex='8'>Nodes color
                                <ul className="color-list" id="node-color-picker" 
                                    onClick={props.isTouch ?  null : (e => setColor(e))}
                                    onTouchStart={props.isTouch ? (e => setColor(e)) : null}
                                    onKeyDown={e => setColor(e)}
                                >
                                    {
                                        nodeColors.map(({color, index}) => {
                                            let className = 'color-option';
                                            if(props.nodeColor === color)
                                                className += ' selected-color';
                                            return <div className={className} style={{backgroundColor: color}} tabIndex={index} key={index}></div>
                                        })
                                    }
                                </ul>
                            </li>
                            <li tabIndex='12'>Edges color
                                <ul className="color-list" id="edge-color-picker" 
                                    onClick={props.isTouch ?  null : (e => setColor(e))}
                                    onTouchStart={props.isTouch ? (e => setColor(e)) : null}
                                    onKeyDown={e => setColor(e)}
                                >
                                    {
                                        edgeColors.map(({color, index}) => {
                                            let className = 'color-option';
                                            if(props.edgeColor === color)
                                                className += ' selected-color';
                                            return <div className={className} style={{backgroundColor: color}} tabIndex={index} key={index}></div>
                                        })
                                    }
                                </ul>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    )
}

const areEqual = (prev, next) => false

export default connect(
    state => ({
        adj: state.adj,
        vw: state.vw,
        vh: state.vh,
        nodes: state.nodes,
        isTouch: state.isTouch,
        nodeColor: state.nodeColor,
        edgeColor: state.edgeColor
    }),
    {replaceMatrix, replaceNodes, newEdge, deleteEdges, 
     setGenerated, traverseEdges, deleteTraversedEdges,
     toggleAction, addPathEdges, deletePathEdges, 
     setAlgorithmType, setMessageBox, setAlgorithmInfo,
     setNodeColor, setEdgeColor}
)(React.memo(Panel, areEqual));
