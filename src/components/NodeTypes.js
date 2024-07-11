// src/NodeTypes.js
import InputNode from './nodes/InputNode';
import LLMModelNode from './nodes/LLMModelNode';
import OutputNode from './nodes/OutputNode';
import FunctionNode from './nodes/FunctionNode';
import GroupNode from './nodes/GroupNode';

const nodeTypes = {
  input: InputNode,
  llmModel: LLMModelNode,
  output: OutputNode,
  function: FunctionNode,
  groupNode: GroupNode,
};

export default nodeTypes;
