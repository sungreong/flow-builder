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
import './style.css';
import { addGroupNode, addNode, updateGroupNodeSize } from './../utils/NodeUtils';
import NodeTemplateSelector from './NodeTemplateSelector';
import Sidebar from './Sidebar';
import Modal from './Modal';
import nodeTypes from './NodeTypes';
const initialNodes = [
  { id: '1', type: 'input', position: { x: 250, y: 5 }, data: { label: 'An input node' } },
  { id: '2', type: 'llmModel', position: { x: 100, y: 100 }, data: { label: 'LLM Model Node', apiKey: 'Your API Key', model: 'Your Model', template: 'advanced' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];

const DnDFlowInner  = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const onNodesChangeWithUpdate = useCallback(
    (changes) => {
      onNodesChange(changes);
      changes.forEach(change => {
        if (change.type === 'position' || change.type === 'dimensions') {
          const groupNodeId = nodes.find(node => node.id === change.id)?.parentId;
          if (groupNodeId) {
            updateGroupNodeSize(groupNodeId, nodes, setNodes);
          }
        }
      });
    },
    [nodes, onNodesChange, setNodes]
  );

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
    if (selectedNode.parentId) {
      updateGroupNodeSize(selectedNode.parentId, nodes, setNodes);
    }
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
      if (type === 'groupNode') {
        addGroupNode(position, setNodes, setEdges);
      } else {
        addNode(type, position, setNodes);
      }
    },
    [screenToFlowPosition]
  );



  return (
      <div className="dndflow">
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChangeWithUpdate}
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
              <NodeTemplateSelector node={selectedNode} handleInputChange={handleInputChange} handleTemplateChange={handleTemplateChange} />
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
