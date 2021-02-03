import { createReducer, createAction } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import * as CONST from './constants';

export const appendNode = createAction(CONST.APPEND_NODE);
export const replaceNodes = createAction(CONST.REPLACE_NODES);
export const vwUpdate = createAction(CONST.VW_UPDATE);
export const vhUpdate = createAction(CONST.VH_UPDATE);
export const movingXUpdate = createAction(CONST.MOVINGX_UPDATE);
export const movingYUpdate = createAction(CONST.MOVINGY_UPDATE);
export const replaceMatrix = createAction(CONST.REPLACE_MATRIX);
export const newEdge = createAction(CONST.NEW_EDGE);
export const setOriginNode = createAction(CONST.SET_ORIGIN_NODE);
export const deleteEdges = createAction(CONST.DELETE_EDGES);
export const setGenerated = createAction(CONST.SET_GENERATED);
export const traverseEdges = createAction(CONST.TRAVERSE_EDGES);
export const deleteTraversedEdges = createAction(CONST.DELETE_TRAVERSED_EDGES);
export const addPathEdges = createAction(CONST.ADD_PATH_EDGES);
export const deletePathEdges = createAction(CONST.DELETE_PATH_EDGES);
export const toggleAction = createAction(CONST.TOGGLE_ACTION);
export const setAlgorithmType = createAction(CONST.SET_ALGORITHM_TYPE);
export const setAlgorithmInfo = createAction(CONST.SET_ALGORITHM_INFO);
export const setMessageBox = createAction(CONST.SET_MESSAGE_BOX);
export const setTouch = createAction(CONST.SET_TOUCH);
export const setTutorialEnded = createAction(CONST.SET_TUTORIAL_ENDED);
export default combineReducers({
    nodes: createReducer([], {
        [appendNode]: (state, action) => [...state, action.payload],
        [replaceNodes]: (state, action) => action.payload
    }),
    vw: createReducer(1, {
        [vwUpdate]: (state, action) => action.payload
    }),
    vh: createReducer(1, {
        [vhUpdate]: (state, action) => action.payload
    }),
    movingX: createReducer(null, {
        [movingXUpdate]: (state, action) => action.payload
    }),
    movingY: createReducer(null, {
        [movingYUpdate]: (state, action) => action.payload
    }),
    adj: createReducer(Array(50).fill(0).map(() => Array(50).fill(0)), {
        [replaceMatrix]: (state, action) => action.payload,
    }),
    currentEdge: createReducer([], {
        [newEdge]: (state, action) => action.payload
    }),
    originNode: createReducer(null, {
        [setOriginNode]: (state, action) => action.payload
    }),
    deletedEdges: createReducer(0, {
        [deleteEdges]: (state, action) => state + 1
    }),
    isGenerated: createReducer(false, {
        [setGenerated]: (state, action) => action.payload
    }),
    traversedEdges: createReducer([], {
        [traverseEdges]: (state, action) => [...state, action.payload],
        [deleteTraversedEdges]: () => []
    }),
    pathEdges: createReducer([], {
        [addPathEdges]: (state, action) => [...state, action.payload],
        [deletePathEdges]: () => []
    }),
    isAction: createReducer(true, {
        [toggleAction]: (state, action) => action.payload
    }),
    algorithmType: createReducer('', {
        [setAlgorithmType]: (state, action) => action.payload
    }),
    algorithmInfo: createReducer('', {
        [setAlgorithmInfo]: (state, action) => action.payload
    }),
    messageBox: createReducer([], {
        [setMessageBox]: (state, action) => action.payload
    }),
    isTouch: createReducer(false, {
        [setTouch]: (state, action) => action.payload
    }),
    endedTutorials: createReducer(0, {
        [setTutorialEnded]: (state) => state + 1
    })
});