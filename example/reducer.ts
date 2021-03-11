import { useReducer } from 'react';

export interface State {
  count: number;
}

export type Action = { type: 'increment' } | { type: 'decrement' };

export const countReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment': {
      return {
        ...state,
        count: state.count + 1,
      };
    }
    case 'decrement': {
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
