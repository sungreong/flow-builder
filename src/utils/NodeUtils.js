// src/utils/NodeUtils.js
let id = 3;
const getId = () => `dndnode_${id++}`;
const getEdgeId = () => `edge_${id++}`;

const calculateGroupNodeSize = (childNodes) => {
    const padding = 20;
    const minX = Math.min(...childNodes.map(node => node.position.x));
    const minY = Math.min(...childNodes.map(node => node.position.y));
    const maxX = Math.max(...childNodes.map(node => node.position.x + node.width));
    const maxY = Math.max(...childNodes.map(node => node.position.y + node.height));
    
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;
  
    return { width, height };
  };

export const addGroupNode = (position, setNodes, setEdges) => {
    const aNodeId = getId();
    const bNodeId = getId();
    const cNodeId = getId();
    const groupId = getId();


    const aNode = {
        id: aNodeId,
        // type: 'default',
        data: { label: 'Node A' },
        position: { x: 10, y: 10 },
        width: 150,
        height: 50,
        parentId: null,
    };

    const bNode = {
        id: bNodeId,
        // type: 'default',
        data: { label: 'Node B' },
        position: { x: 10, y: 100 },
        width: 150,
        height: 50,
        parentId: null,
    };

    const cNode = {
        id: cNodeId,
        // type: 'default',
        data: { label: 'Node C' },
        position: { x: 10, y: 200 },
        width: 150,
        height: 50,
        parentId: null,
    };

    const childNodes = [aNode, bNode, cNode];
    const { width, height } = calculateGroupNodeSize(childNodes);
    const groupNode = {
        id: groupId,
        type: 'group',
        position,
        data: { label: 'Group Node' },
        style: { width, height },
    };

    // Update parentId for child nodes
    childNodes.forEach(node => {
        node.parentId = groupId;
        node.position.x += 10; // Adding padding inside the group
        node.position.y += 10; // Adding padding inside the group
        node.extent= 'parent';

    });

    const groupEdges = [
        { id: getEdgeId(), source: aNodeId, target: bNodeId },
        { id: getEdgeId(), source: bNodeId, target: cNodeId },
    ];

    setNodes((nds) => nds.concat(groupNode, ...childNodes));
    setEdges((eds) => eds.concat(groupEdges));
};
const constrainPosition = (position, groupWidth, groupHeight) => {
    const padding = 10; // Add some padding to avoid touching the edges
    const x = Math.max(padding, Math.min(position.x, groupWidth - padding));
    const y = Math.max(padding, Math.min(position.y, groupHeight - padding));
    return { x, y };
  };
export const updateGroupNodeSize = (groupNodeId, nodes, setNodes) => {
    const groupNode = nodes.find(node => node.id === groupNodeId);
    const childNodes = nodes.filter(node => node.parentId === groupNodeId);
    const { width, height } = calculateGroupNodeSize(childNodes);
    const oldWidth = groupNode.style.width;
    const oldHeight = groupNode.style.height;
  
    const widthRatio = width / oldWidth;
    const heightRatio = height / oldHeight;
  
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === groupNodeId) {
          return { ...node, style: { ...node.style, width, height }, data: { ...node.data, width, height } };
        } else if (node.parentId === groupNodeId) {
          const newPosition = constrainPosition(
            { x: node.position.x * widthRatio, y: node.position.y * heightRatio },
            width,
            height
          );
          return {
            ...node,
            position: newPosition,
          };
        }
        return node;
      })
    );
  };

export const addNode = (type, position, setNodes) => {
  const newNode = {
    id: getId(),
    type,
    position,
    data: { label: `${type} node` },
  };

  setNodes((nds) => nds.concat(newNode));
};
