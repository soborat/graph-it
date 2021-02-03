import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import reducers from './store';
import './style.css';
import App from './components/App';


ReactDOM.render(
    <Provider store={configureStore({reducer: reducers, middleware: []})}>
        <App/>
    </Provider>,
    document.querySelector('#root')
);