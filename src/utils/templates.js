// src/utils/templates.js
import React from 'react';

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

export default templates;
