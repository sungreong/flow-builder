// src/InputNode.js
import React from 'react';
import "./style.css";
import { Handle } from 'reactflow';

const InputNode = ({ data }) => {
  return (
    <div className="input-node">
      <strong>{data.label}</strong>
      <Handle type="source" position="bottom" />

    </div>
  );
};

export default InputNode;
