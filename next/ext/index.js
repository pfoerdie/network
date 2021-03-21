const
    ext = exports,
    _ = require('../util');

// ext
ext.Entity = require('./Entity');
ext.Relation = require('./Relation');

_.lockProp.allEntries(ext);