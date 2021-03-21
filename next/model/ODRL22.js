const
    _ = require('../util'),
    core = require('../core'),
    ext = require('../ext'),
    ODRL22 = module.exports = new core.Model('ODRL22'),
    _private = new WeakMap();

// TODO ODRL22