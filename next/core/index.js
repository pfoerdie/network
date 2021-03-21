const
    core = exports,
    _ = require('../util');

// private
core.secret = Symbol();
core.protected = new WeakMap();

_.hideProp.andLock(core, 'secret', 'protected');

// core
core.Node = require('./Node');
core.Edge = require('./Edge');
core.Message = require('./Message');
core.Model = require('./Model');
core.Network = require('./Network');

_.lockProp.allEntries(core);