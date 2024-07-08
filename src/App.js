import React, { useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';

import './index.css';

const initialNodes = [
  {
    id: 'trigger',
    type: 'input',
    data: { label: 'Trigger Node' },
    position: { x: 250, y: 5 },
  },
  {
    id: '1',
    type: 'default',
    data: { label: 'Node 1' },
    position: { x: 250, y: 100 },
  },
  {
    id: '2',
    type: 'default',
    data: { label: 'Node 2' },
    position: { x: 250, y: 200 },
  },
];

const initialEdges = [
  { id: 'e1-1', source: 'trigger', target: '1' , animated: false, style: {}},
  { id: 'e1-2', source: '1', target: '2' },
];

let id = 3;
const getId = () => `dndnode_${id++}`;
const getEdgeId = () => `edge_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params) => {
      const newEdge = { ...params, id: getEdgeId() };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition]
  );

  const executeFlow = async () => {
    const updatedNodes = [...nodes];

    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const sourceNode = updatedNodes.find(node => node.id === edge.source);
      const targetNode = updatedNodes.find(node => node.id === edge.target);

      if (sourceNode && targetNode) {
        const updatedEdge = { id: edge.id, animated: true, style: { strokeDasharray: '5,5' }, source: edge.source, target: edge.target };
        console.log('updatedEdge:', updatedEdge);
        setEdges((eds) =>
          eds.map((e) =>
            e.id === edge.id
              ? { ...e, animated: true, style: { strokeDasharray: '5,5' } }
              : e
          )
        );
        // Simulate data transfer with a delay
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        
        // Pass data from source to target
        try {
          const response = await fetch('http://localhost:8000/execute', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ source: sourceNode.data, target: targetNode.data }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log(data);
          const newColor = data.status === 'success' ? 'blue' : 'red';

          // Pass data from source to target
          targetNode.data = { ...targetNode.data, receivedData: sourceNode.data.label };

          setEdges((eds) =>
            eds.map((e) =>
              e.id === edge.id
                ? { ...e, animated: false, style: { stroke: newColor } }
                : e
            )
          );
        } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
          setEdges((eds) =>
            eds.map((e) =>
              e.id === edge.id
                ? { ...e, animated: false, style: { stroke: 'red' } }
                : e
            )
          );
        }
        targetNode.data = { ...targetNode.data, receivedData: sourceNode.data.label };
           }
    }

    setNodes(updatedNodes);
  };

  const onTrigger = async () => {
    executeFlow();
  };
  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Controls />
        </ReactFlow>
      </div>
      <Sidebar onTrigger={onTrigger} />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDFlow />
  </ReactFlowProvider>
);
