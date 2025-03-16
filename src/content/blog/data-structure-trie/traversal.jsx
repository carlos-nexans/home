"use client";

import React, { useEffect } from 'react';
import * as d3 from "d3";

const TreeTraversalComponent = () => {
  useEffect(() => {
    // Datos del árbol
    const treeData = {
      name: "A",
      children: [
        {
          name: "B",
          children: [
            { name: "D" },
            { name: "E" }
          ]
        },
        {
          name: "C",
          children: [
            { name: "F" },
            { name: "G" }
          ]
        }
      ]
    };
    
    // Function to create/update chart
    const createChart = () => {
      // Clear previous chart
      d3.select("#treeTraversal").selectAll("*").remove();

      // Get current container dimensions
      const container = d3.select("#treeTraversal");
      const width = container.node().getBoundingClientRect().width;
      const height = Math.min(400, window.innerHeight * 0.7); // Responsive height
      const margin = { top: 20, right: 20, bottom: 30, left: 20 };

      // Create SVG with current dimensions
      const svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

      // Update tree layout with new dimensions
      const treeLayout = d3.tree()
        .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
        .separation((a, b) => (a.parent == b.parent ? 1 : 1));
    
      // Convertir datos a jerarquía D3
      const root = d3.hierarchy(treeData);
      const treeData2 = treeLayout(root);
      
      // Crear el grupo principal centrado
      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      
      // Crear los enlaces
      const links = g.selectAll(".link")
        .data(treeData2.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("d", d3.linkVertical()
          .x(d => d.x)
          .y(d => d.y));
      
      // Crear los nodos
      const nodes = g.selectAll(".node")
        .data(treeData2.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);
      
      // Agregar rectángulos a los nodos
      nodes.append("rect")
        .attr("x", -15) // Offset to center the rectangle
        .attr("y", -15)
        .attr("width", 30)
        .attr("height", 30)
        .attr("rx", 4) // Rounded corners
        .style("fill", "#4a90e2") // Light blue fill
        .style("stroke", "#2171cd") // Darker blue border
        .style("stroke-width", 2);
      
      // Agregar texto a los nodos
      nodes.append("text")
        .attr("dy", ".35em")
        .attr("x", 0)
        .attr("y", 0)
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "white") // White text for contrast
        .text(d => d.data.name);
    };

    // Initial chart creation
    createChart();

    // Add resize handler
    const handleResize = () => {
      createChart();
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Implementar DFS
    let animationRunning = false;
    
    // Stack for DFS nodes
    let nodeStack = [];
    let visited = new Set();
    let animationInterval;
    
    function fillStack(startNode) {
      nodeStack = [startNode];
      visited.clear();
    }
    
    async function processNextNode() {
      if (nodeStack.length === 0) {
        clearInterval(animationInterval);
        // Reset all nodes to original color when animation completes
        d3.select("#treeTraversal").selectAll("rect")
          .transition()
          .duration(500)
          .style("fill", "#4a90e2")
          .style("stroke", "#2171cd");
        return;
      }
    
      const node = nodeStack.pop();
      
      if (!node || visited.has(node)) return;
      
      visited.add(node);
    
      // Resaltar nodo actual
      d3.select(node)
        .select("rect")
        .transition()
        .duration(500)
        .style("fill", "#4CAF50")
        .style("stroke", "#4CAF50");
    
      // Add unvisited children to stack
      const children = node.__data__.children || [];
      for (const child of children) {
        const childNode = nodes.nodes().find(n => n.__data__ === child);
        if (!visited.has(childNode)) {
          nodeStack.push(childNode);
        }
      }
    }
    
    function dfs(startNode) {
      // Clear any existing animation
      clearInterval(animationInterval);
      
      // Reset and fill stack
      fillStack(startNode);
      
      // Start animation loop
      animationInterval = setInterval(processNextNode, 1000);
    }
    
    // Crear botón para iniciar/reiniciar animación
    // Agregar event listener al botón
    document.getElementById('dfsButton').addEventListener('click', () => {
      if (animationRunning) {
        // Detener animaciones actuales
        d3.select("#treeTraversal").selectAll("rect")
          .interrupt()
          .style("fill", "#4a90e2") // Light blue fill
          .style("stroke", "#2171cd") // Darker blue border
          .style("stroke-width", 2);
      }
      animationRunning = true;
      const rootNode = nodes.nodes()[0];
      dfs(rootNode);
    });

    // Clean up function
    return () => {
      window.removeEventListener('resize', handleResize);
      d3.select("#treeTraversal").selectAll("*").remove();
      document.getElementById('dfsButton')?.removeEventListener('click', dfs);
    };
  }, []);

  return (
    <div className="tree-traversal-demo">
      <button id="dfsButton">Iniciar recorrido</button>
      <div id="treeTraversal" className="w-full h-full"></div>
    </div>
  );
};

export default TreeTraversalComponent;
