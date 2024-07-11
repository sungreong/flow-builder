// src/FunctionNode.js
import React from 'react';
import "./style.css";
import { Handle } from 'reactflow';


const FunctionNode = ({ data }) => {
  return (
    <div className="function-node">
        <Handle type="target" position="top" />
      <strong>{data.label}</strong>
      <Handle type="source" position="bottom" />

    </div>
  );
};

export default FunctionNode;
