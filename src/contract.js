// The address is the contract that is already deployed.  The ABI should come from the truffle repository whenever the contract is
// updated.  
export const address = "0x3437369f1a8943092d4149b07c9bf48377981580";
export const abiArray = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "itemAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "index",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "iname",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "location",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "url",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "ownerAddress",
          "type": "address"
        }
      ],
      "name": "LogNewItem",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "itemAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "LogDeleteItem",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "location",
          "type": "string"
        },
        {
          "name": "url",
          "type": "string"
        },
        {
          "name": "itemAddress",
          "type": "address"
        },
        {
          "name": "ownerAddress",
          "type": "address"
        }
      ],
      "name": "addItem",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getItemCount",
      "outputs": [
        {
          "name": "count",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_itemAddress",
          "type": "address"
        }
      ],
      "name": "removeItem",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "itemAddress",
          "type": "address"
        }
      ],
      "name": "getItem",
      "outputs": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "url",
          "type": "uint256"
        },
        {
          "name": "location",
          "type": "string"
        },
        {
          "name": "index",
          "type": "uint256"
        },
        {
          "name": "ownerAddress",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getItemAtIndex",
      "outputs": [
        {
          "name": "itemAddress",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "itemAddress",
          "type": "address"
        },
        {
          "name": "url",
          "type": "string"
        }
      ],
      "name": "addUrl",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
]
