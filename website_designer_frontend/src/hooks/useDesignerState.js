import { useMemo, useReducer } from 'react';

const initialState = {
  selectedId: null,
  nodes: [
    {
      id: 'node-hero',
      type: 'Heading',
      props: { text: 'Retro Site Builder', level: 1 },
      style: { textAlign: 'center' },
    },
    {
      id: 'node-subtitle',
      type: 'Text',
      props: { text: 'Drag components from the left, tweak settings on the right.', variant: 'muted' },
      style: { textAlign: 'center' },
    },
    {
      id: 'node-cta',
      type: 'Button',
      props: { text: 'Export HTML/CSS', variant: 'primary' },
      style: { marginTop: '12px' },
    },
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_NODE':
      return { ...state, selectedId: action.id };
    case 'ADD_NODE': {
      const newNode = action.node;
      return {
        ...state,
        nodes: [...state.nodes, newNode],
        selectedId: newNode.id,
      };
    }
    case 'UPDATE_NODE_PROPS': {
      const { id, patch } = action;
      return {
        ...state,
        nodes: state.nodes.map((n) => (n.id === id ? { ...n, props: { ...n.props, ...patch } } : n)),
      };
    }
    case 'UPDATE_NODE_STYLE': {
      const { id, patch } = action;
      return {
        ...state,
        nodes: state.nodes.map((n) => (n.id === id ? { ...n, style: { ...n.style, ...patch } } : n)),
      };
    }
    case 'DELETE_NODE': {
      const nextNodes = state.nodes.filter((n) => n.id !== action.id);
      const nextSelectedId = state.selectedId === action.id ? null : state.selectedId;
      return { ...state, nodes: nextNodes, selectedId: nextSelectedId };
    }
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function useDesignerState() {
  /** State container for the designer canvas, including selection and updates. */
  const [state, dispatch] = useReducer(reducer, initialState);

  const selectedNode = useMemo(() => {
    if (!state.selectedId) return null;
    return state.nodes.find((n) => n.id === state.selectedId) || null;
  }, [state.nodes, state.selectedId]);

  // PUBLIC_INTERFACE
  const actions = useMemo(
    () => ({
      /** Select a node by id (or null to clear). */
      selectNode: (id) => dispatch({ type: 'SELECT_NODE', id }),
      /** Add a new node to the canvas. */
      addNode: (node) => dispatch({ type: 'ADD_NODE', node }),
      /** Update props of a node. */
      updateNodeProps: (id, patch) => dispatch({ type: 'UPDATE_NODE_PROPS', id, patch }),
      /** Update styles of a node. */
      updateNodeStyle: (id, patch) => dispatch({ type: 'UPDATE_NODE_STYLE', id, patch }),
      /** Delete a node. */
      deleteNode: (id) => dispatch({ type: 'DELETE_NODE', id }),
    }),
    []
  );

  return { state, selectedNode, actions };
}
