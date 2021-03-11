import { renderHook, act } from '@testing-library/react-hooks';
import {
  useUndoableReducer,
  excludeActionTypes,
} from '../src/useUndoableReducer';

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

const initialState = {
  count: 0,
};

const testReducer = (state: { count: number }, action: any) => {
  switch (action.type) {
    case INCREMENT: {
      return {
        ...state,
        count: state.count + 1,
      };
    }
    case DECREMENT: {
      return {
        ...state,
        count: state.count - 1,
      };
    }
    default: {
      return state;
    }
  }
};

test('should undo history', () => {
  const { result } = renderHook(() =>
    useUndoableReducer(testReducer, initialState)
  );

  act(() => result.current.dispatch({ type: INCREMENT }));
  act(() => result.current.triggerUndo());

  expect(result.current.canRedo).toBeTruthy();
  expect(result.current.canUndo).toBeFalsy();
  expect(result.current.state.count).toBe(0);
});

test('should redo history', () => {
  const { result } = renderHook(() =>
    useUndoableReducer(testReducer, initialState)
  );

  for (let x = 0; x < 3; x++) {
    act(() => result.current.dispatch({ type: INCREMENT }));
  }

  act(() => result.current.triggerUndo());
  act(() => result.current.triggerUndo());
  act(() => result.current.triggerRedo());

  expect(result.current.canRedo).toBeTruthy();
  expect(result.current.canUndo).toBeTruthy();
  expect(result.current.state.count).toBe(2);
});

test('should filter out ignored action types', () => {
  const { result } = renderHook(() =>
    useUndoableReducer(testReducer, initialState, {
      filterActionTypes: excludeActionTypes([DECREMENT]),
    })
  );

  act(() => result.current.dispatch({ type: INCREMENT }));
  act(() => result.current.dispatch({ type: INCREMENT }));
  act(() => result.current.dispatch({ type: DECREMENT }));
  act(() => result.current.dispatch({ type: INCREMENT }));
  act(() => result.current.triggerUndo());

  expect(result.current.canRedo).toBeTruthy();
  expect(result.current.canUndo).toBeTruthy();
  expect(result.current.state.count).toBe(2);
});

test('should ignore initial state', () => {
  const { result } = renderHook(() =>
    useUndoableReducer(testReducer, initialState, { ignoreInitialState: true })
  );

  act(() => result.current.dispatch({ type: INCREMENT }));
  act(() => result.current.dispatch({ type: INCREMENT }));
  act(() => result.current.triggerUndo());

  expect(result.current.canUndo).toBeFalsy();
});

test('should only store state up to max history', () => {
  const { result } = renderHook(() =>
    useUndoableReducer(testReducer, initialState, { maxHistory: 2 })
  );

  for (let x = 0; x < 3; x++) {
    act(() => result.current.dispatch({ type: INCREMENT }));
  }

  act(() => result.current.triggerUndo());
  act(() => result.current.triggerUndo());

  expect(result.current.canUndo).toBeFalsy();
  expect(result.current.state.count).toBe(1);
});
