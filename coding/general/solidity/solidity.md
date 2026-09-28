# Solidity

- Links:
  - [Solidity Language](https://www.soliditylang.org/)
  - [Remix IDE](https://app.remix.live)

## Language Spec

### Data Types

- `string`
- `bool`
- `uint`
- `int`
- `address`: a blockchain address

### Variables

#### Common Variables

- `this`: the contract itself (it's address)
  - `contractAddress = address(this);`
- `msg`: message
  - `msg.sender`
  - `msg.value`
- `tx`: transaction
  - `tx.origin`
- `block`: the current block in the chain
  - `block.number`
  - `block.timestamp`
  - `block.chainid`

### Functions

- Two main types of functions:
  - write: stores some information on the blockchain
    - a write function always costs some *gas*
  - read: gets information from the blockchain

```sol
contract MyContract {
  string name = "Example";

  function setName(string memory _name) public {
    name = _name;
  }

  function getName() public view returns(string memory) {
    return name;
  }

  function resetName() internal {
    name = "Example";
  }
}
```

- Modifiers:
  - `view`: cannot modify the state of the blockchain, only read it
  - `pure`: cannot modify the state of the blockchain neither read it
  - `payable`: can receive ether when the transaction is submitted
  - custom: can create custom modifiers to apply on the contract's functions

```sol
contract MyContract {
  address private owner;
  string public name = "";

  modifier onlyOwner {
    require(msg.sender == owner, 'caller must be owner');
    _;
  }

  function setName(string memory _name) onlyOwner public {
    name = _name;
  }
}
```

#### Constructor

- A function that is called only once when the contract is deployed on the blockchain.

```sol
contract MyContract {
  string public name;

  constructor(string memory _name) {
    name = _name;
  }
}
```

#### Operators

- Basic math:
  - `+`
  - `-`
  - `*`
  - `/`
  - `**` (exp)
  - `%` (modulo)
  - `++`
  - `--`
- Comparisons (can be applied to non-numerical variables also, like addresses):
  - `==`
  - `!=`
  - `>`
  - `<`
  - `>=`
  - `<=`
- Logical:
  - `&&`
  - `||`
  - `!`

### Scope

- A variable's/function's visibility determines if it can be accessed from the blockchain or not.
  - `public`: accessible from outside
  - `private`: only accessible inside the smart contract
  - `internal`: only accessible inside the smart contract, but can be inherited
  - `external`: can only be called outside of the smart contract (applies to functions only)
  - none: ...

```sol
string name = "Name";
string private name = "Name";
string internal name = "Name";
string public name = "Name";
```

### Flow Control

- `if/else`
- ternary also supported (`check ? true : false`)
