// src/components/LLMModelNode.js
import React from 'react';
import { Handle } from 'reactflow';

const LLMModelNode = ({ data }) => {
  return (
    <div style={{ border: '1px solid black', padding: '10px', background: 'white' }}>
      <Handle type="target" position="top" />
      <div>{data.label}</div>
      <div>API Key: {data.apiKey}</div>
      <div>Model: {data.model}</div>
      <Handle type="source" position="bottom" />
    </div>
  );
};

export default LLMModelNode;
