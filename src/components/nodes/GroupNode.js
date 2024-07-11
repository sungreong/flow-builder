import React from 'react';
import "./style.css";

const GroupNode = ({ data }) => {
  return (
    <div style={{ padding: 10, border: '1px solid black', background: 'rgba(0, 0, 255, 0.1)' }}>
      <strong>{data.label}</strong>
    </div>
  );
};

export default GroupNode;
