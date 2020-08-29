# System Dependencies Programming Test

This program simulates the installation and deletion of components with dependencies on a computer system. The input is a text file that includes commands to install, delete, list, and depend components.

## Archictecture
- index.js 
    - Accepts an input file as the parameter, reads every line individually, and interprets commands
    - Contains functions to manage DEPEND, LIST, INSTALL, and REMOVE commands
- Node.js
    - Constructs a graph by creating a node for the component that is accepted as the paramter. The component name is set as the node's value property and the adjacents property is a array that contains nodes of every components that depend on the parameter.
    - Contains methods to add, remove, or retrieve from the adjacents array
- file.txt
    - Input file containing commands 
    index.js

## Requirements

1. List currently installed components
2. Install component + install every component that the current component depends on
3. Remove component + remove all components that the current component depends on

## Run and Test

- run `npm install`
- run `node index.js`

## Functions

### depend(arr) - O(1)

- This function takes an array of components as its parameter. The first element of the array is the component that depends on the rest of the components in the array. The elements of the array are mapped into dependendencies, where the first element is the key and the remaining elements are the components that the key depends on.

### installComponent(val) - O(n)

- This function takes the name of the component to be installed as its parameter. If the component is not already installed, a node is created for that component and added to installed. If the component depends on other components, then a node is created for each of those components with the original node added to its adjacents property.

### deleteComponent(val) - O(n)

- This function takes the name of the component to be removed as its parameter. If the component is installed, it is removed if all of the components depending on it is no longer installed. Once a component is removed, all of the components that it depends on are also removed if possible.
