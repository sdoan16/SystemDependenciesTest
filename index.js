//https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
const readline = require('readline')
const Node = require('./node');
const fs = require('fs')
const chalk = require('chalk')

const dependencies = {}
const installed = {}

function manageSystemDependencies (inputFile) {
    const reader = readline.createInterface({
        input: fs.createReadStream(inputFile),
        output: process.stdout,
        terminal: false
    });
    reader.on('line', (line) => {
        console.log(line)
        const newLine = line.split(/[ ]+/) 
        const command = newLine[0]
        const val = newLine[1]

        switch (command) {
            case 'DEPEND':
                const dependArr = newLine.slice(1)
                depend(dependArr)
                break
            case 'LIST':
                const components = Object.keys(installed)
                components.forEach(c => console.log(c))
                break
            case 'INSTALL':
                if (val in installed) {
                    console.log(chalk.red(val + ' is already installed'))
                    return
                }
                installComponent(val)
                break
            case 'REMOVE':
                deleteComponent(val) 
                break
            case 'END':
                break
            default:
                //handle unkown command
                console.log('Invalid command')
        }
    });
}

function depend(arr) {
    const [val, ...dependList] = arr
            dependencies[val] = dependList        
}

function installComponent(val) {
    const newNode = new Node(val)
    //install every component that val depends on if they don't already exist
    //then add newNode to each of their adjacents arrays
    if (val in dependencies) {
        const dependList =  dependencies[val]
        dependList.forEach(dep => {
            if (dep in installed) {
                installed[dep].addAdjacent(newNode)
                return
            }
            const parentNode = new Node(dep)
            parentNode.addAdjacent(newNode)
            installed[dep] = parentNode
            installComponent(dep)
            
        })
    }
    installed[val] = newNode
    console.log(chalk.blue('Installing ' + val))
}

function deleteComponent(val) {
    if (!(val in installed)) {
        console.log(chalk.red(val + ' is not installed'))
        return
    }
    //before deleting a node, check to see if every node in it's adjacents array are no londer installed
    const adjArr = installed[val].adjacents
    const needed = adjArr.find(adj =>  adj.value in installed )
    if (needed) {
        console.log(chalk.red(val + ' is still needed'))
        return
    }
    console.log(chalk.yellow('Removing ' + val))
    //remove all nodes that the current node(val) depends on if possible
    if (val in dependencies) {
        const components = dependencies[val]
        /*
        For each component that val depends on,
        remove val from the component's adjacent array.
        If the adjacent array is empty afterwards 
        remove the node for that component
        */
        components.forEach(c => {
            if (c in installed) {
                const nodeToRemove = installed[val]
                installed[c].removeAdjacent(nodeToRemove)
                const dependants = installed[c].adjacents

                if (dependants.length === 0) {
                    delete installed[c]
                    console.log(chalk.yellow('Removing ' + c))
                }
            }
    })
    }
    delete installed[val]
}

manageSystemDependencies('file.txt')

