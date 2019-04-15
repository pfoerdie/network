# Network

## Node
This is the base class and used to create networks of Nodes. Each Node is associated with some data and can be connected with other Nodes. Events can be registered to a Node and might be used to trigger a chain reaction within the network. This way implementations of connected graphs, neural networks, process structures and finite automatons are made easy.

### Methods
- Node( data:object = null )
    > Constructs a new Node to use with other Nodes.
- attach( node:Node )
    > Creates an outgoing connection from the current to another Node.
- attachTo( node:Node )
    > An alias for Node#attach, reversing current Node and argument.
- detach( node:Node )
    > Removes an outgoing connection from the current Node.
- detachFrom( node:Node )
    > An alias for Node#detach, reversing current Node and argument.
- delete( confirm:boolean = false )
    > Removes all ingoing and outgoing connections of the current Node and deletes it permanently.
- deleted:boolean
    > Indicates, if a Node has been deleted.
- on( event:string|symbol, callback:function )
    > Adds an event listener to the current Node.
- once( event:string|symbol, callback:function )
    > Adds an event listener to the current Node for a single call.
- off( event:string|symbol, callback:function )
    > Removes an event listener from the current Node.
- trigger( event:string|symbol, ...args:any )
    > Triggers an event on the current Node with assigned arguments on the next event loop.
- emit( event:string|symbol, ...args:any )
    > Emits an event to all children of the current Node with assigned arguments.
- emitBack( event:string|symbol, ...args:any )
    > Emits an event to all parents of the current Node with assigned arguments.
- static isNode( instance:Node|* ):boolean
    > Indicates if an object is a valid Node.
