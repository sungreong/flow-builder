// src/Sidebar.js
import React from 'react';

const onDragStart = (event, nodeType) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const Sidebar = ({ onTrigger }) => {
  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div className="group">
        <h3>Input</h3>
        <div
          className="dndnode inputNode"
          onDragStart={(event) => onDragStart(event, 'input')}
          draggable
        >
          Input Node
        </div>
      </div>
      <div className="group">
        <h3>LLM Nodes</h3>
        <div
          className="dndnode llmNode"
          onDragStart={(event) => onDragStart(event, 'llmModel')}
          draggable
        >
          LLM Model Node
        </div>
      </div>
      <div className="group">
        <h3>Output</h3>
        <div
          className="dndnode outputNode"
          onDragStart={(event) => onDragStart(event, 'output')}
          draggable
        >
          Output Node
        </div>
      </div>
      <div className="group">
        <h3>Function</h3>
        <div
          className="dndnode functionNode"
          onDragStart={(event) => onDragStart(event, 'function')}
          draggable
        >
          Function Node
        </div>
      </div>
      <div className="group">
        <h3>Group</h3>
        <div
          className="dndnode groupNode"
          onDragStart={(event) => onDragStart(event, 'groupNode')}
          draggable
        >
          Group Node
        </div>
      </div>
      <button onClick={onTrigger}>Trigger Flow</button>
    </aside>
  );
};

export default Sidebar;
