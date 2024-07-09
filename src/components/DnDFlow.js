// src/DnDFlow.js
import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Controls,
  useNodesState,
  useEdgesState,
  
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';
import Modal from './Modal';
import LLMModelNode from './LLMModelNode';

const initialNodes = [
  { id: '1', type: 'input', position: { x: 250, y: 5 }, data: { label: 'An input node' } },
  { id: '2', type: 'llmModel', position: { x: 100, y: 100 }, data: { label: 'LLM Model Node', apiKey: 'Your API Key', model: 'Your Model' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];

const nodeTypes = { llmModel: LLMModelNode };
let id = 3;
const getId = () => `dndnode_${id++}`;
const getEdgeId = () => `edge_${id++}`;
const DnDFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const reactFlowWrapper = useRef(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const closeModal = () => {
    setSelectedNode(null);
  };

  const handleInputChange = (field, value) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === selectedNode.id ? { ...node, data: { ...node.data, [field]: value } } : node))
    );
    setSelectedNode((node) => ({ ...node, data: { ...node.data, [field]: value } }));
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar />
        <Modal show={!!selectedNode} onClose={closeModal}>
          {selectedNode && (
            <div>
              <h2>Edit Node</h2>
              <p>ID: {selectedNode.id}</p>
              <label>API Key:</label>
              <input
                type="text"
                value={selectedNode.data.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
              />
              <label>Model:</label>
              <input
                type="text"
                value={selectedNode.data.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
              />
            </div>
          )}
        </Modal>
      </ReactFlowProvider>
    </div>
  );
};

export default DnDFlow;
