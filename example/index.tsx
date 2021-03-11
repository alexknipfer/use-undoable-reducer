import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { useUndoableReducer } from '../src/index';
import { countReducer, State, Action } from './reducer';

const App = () => {
  const {
    state,
    dispatch,
    canRedo,
    canUndo,
    triggerRedo,
    triggerUndo,
  } = useUndoableReducer<State, Action>(countReducer, { count: 0 });

  return (
    <div>
      <h1>Basic Example:</h1>
      <div>
        <div>Current count: {state.count}</div>
        <button onClick={() => dispatch({ type: 'decrement' })}>
          Decrement
        </button>
        <button onClick={() => dispatch({ type: 'increment' })}>
          Increment
        </button>
        <button disabled={!canUndo} onClick={triggerUndo}>
          Undo
        </button>
        <button disabled={!canRedo} onClick={triggerRedo}>
          Redo
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
