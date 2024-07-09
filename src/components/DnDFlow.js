// src/DnDFlow.js
import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow
  
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';
import Modal from './Modal';
import LLMModelNode from './LLMModelNode';
const initialNodes = [
  { id: '1', type: 'input', position: { x: 250, y: 5 }, data: { label: 'An input node' } },
  { id: '2', type: 'llmModel', position: { x: 100, y: 100 }, data: { label: 'LLM Model Node', apiKey: 'Your API Key', model: 'Your Model', template: 'advanced' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];
let id = 3;
const getId = () => `dndnode_${id++}`;
const getEdgeId = () => `edge_${id++}`;
const nodeTypes = { llmModel: LLMModelNode };


const templates = {
  default: (node, handleInputChange) => (
    <>
      <label>API Key:</label>
      <input
        type="text"
        value={node.data.apiKey}
        onChange={(e) => handleInputChange('apiKey', e.target.value)}
      />
      <label>Model:</label>
      <input
        type="text"
        value={node.data.model}
        onChange={(e) => handleInputChange('model', e.target.value)}
      />
    </>
  ),
  advanced: (node, handleInputChange) => (
    <>
      <label>API Key:</label>
      <input
        type="text"
        value={node.data.apiKey}
        onChange={(e) => handleInputChange('apiKey', e.target.value)}
      />
      <label>Model:</label>
      <input
        type="text"
        value={node.data.model}
        onChange={(e) => handleInputChange('model', e.target.value)}
      />
      <label>Endpoint:</label>
      <input
        type="text"
        value={node.data.endpoint}
        onChange={(e) => handleInputChange('endpoint', e.target.value)}
      />
    </>
  ),
  // 더 많은 템플릿 추가 가능
};


const DnDFlowInner  = () => {

    


  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

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

  const handleTemplateChange = (event) => {
    const template = event.target.value;
    handleInputChange('template', template);
  };

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
  const renderNodeTemplate = (node) => {
    if (node.type === 'llmModel') {
      return (
        <>
          <label>Template:</label>
          <select value={node.data.template} onChange={handleTemplateChange}>
            <option value="default">Default</option>
            <option value="advanced">Advanced</option>
            {/* 다른 템플릿 옵션 추가 가능 */}
          </select>
          {templates[node.data.template](node, handleInputChange)}
        </>
      );
    }
    return (
      <>
        <label>Label:</label>
        <input
          type="text"
          value={node.data.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
        />
      </>
    );
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
              onNodeClick={onNodeClick}
              onDragOver={onDragOver}
              onDrop={onDrop}
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
              {renderNodeTemplate(selectedNode)}
            </div>
          )}
        </Modal>
      </div>
  );
};


const DnDFlow = () => {
  return (
    <ReactFlowProvider>
      <DnDFlowInner />
    </ReactFlowProvider>
  );
};

export default DnDFlow;
