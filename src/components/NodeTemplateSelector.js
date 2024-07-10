import React from 'react';
import templates from './../utils/templates';

const NodeTemplateSelector = ({ node, handleInputChange, handleTemplateChange }) => {
  if (node.type === 'llmModel') {
    return (
      <>
        <div className="template-selector">
          <label>Template:</label>
          <select value={node.data.template} onChange={handleTemplateChange}>
            <option value="default">Default</option>
            <option value="advanced">Advanced</option>
            {/* 다른 템플릿 옵션 추가 가능 */}
          </select>
        </div>
        {templates[node.data.template] && templates[node.data.template](node, handleInputChange)}
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

export default NodeTemplateSelector;
