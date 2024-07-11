// src/OutputNode.js
import React from 'react';
import "./style.css";
import { Handle } from 'reactflow';

const OutputNode = ({ data }) => {
  return (
    <div className="output-node">
        <Handle type="target" position="top" />

      <strong>{data.label}</strong>
    </div>
  );
};

export default OutputNode;
