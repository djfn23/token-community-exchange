
import React, { useEffect, useRef } from 'react';

const NetworkBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const nodeCount = 25; // Number of nodes to create
    
    // Clear previous nodes if any
    container.innerHTML = '';
    
    // Create nodes
    const nodes: HTMLDivElement[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const node = document.createElement('div');
      node.className = 'network-node';
      
      // Random position within container
      const x = Math.random() * containerRect.width;
      const y = Math.random() * containerRect.height;
      
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(node);
      nodes.push(node);
    }
    
    // Create connections between nearby nodes
    nodes.forEach((node, i) => {
      const nodeRect = node.getBoundingClientRect();
      const nodeX = nodeRect.left - containerRect.left + nodeRect.width / 2;
      const nodeY = nodeRect.top - containerRect.top + nodeRect.height / 2;
      
      nodes.slice(i + 1).forEach(targetNode => {
        const targetRect = targetNode.getBoundingClientRect();
        const targetX = targetRect.left - containerRect.left + targetRect.width / 2;
        const targetY = targetRect.top - containerRect.top + targetRect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(targetX - nodeX, 2) + Math.pow(targetY - nodeY, 2)
        );
        
        // Only connect nodes that are close enough
        if (distance < 200) {
          const line = document.createElement('div');
          line.className = 'network-line';
          
          const angle = Math.atan2(targetY - nodeY, targetX - nodeX);
          
          line.style.left = `${nodeX}px`;
          line.style.top = `${nodeY}px`;
          line.style.width = `${distance}px`;
          line.style.transform = `rotate(${angle}rad)`;
          
          container.appendChild(line);
        }
      });
    });
    
    // Cleanup function
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);
  
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default NetworkBackground;
