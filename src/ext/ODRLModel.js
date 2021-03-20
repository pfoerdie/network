/**
 * @module ODRLModel
 * @author Pfoerdie
 */

const
    _ = require("../tools"),
    _core = require("../core.js"),
    _ext = require("../ext.js"),
    _private = new WeakMap(),
    model = new _core.Model("ODRL22");

model.define(class Asset extends _ext.Entity {

});

model.define(class AssetCollection extends _ext.Entity {

});

model.define(class Party extends _ext.Entity {

});

model.define(class PartyCollection extends _ext.Entity {

});

model.define(class Policy extends _ext.Entity {

});

model.define(class Rule extends _ext.Entity {

});

model.define(class Action extends _ext.Entity {

});

model.define(class Constraint extends _ext.Entity {

});

model.define(class Operator extends _ext.Entity {

});

model.define(class LeftOperand extends _ext.Entity {

});

model.define(class RightOperand extends _ext.Entity {

});

model.define(class LogicalConstraint extends _ext.Entity {

});

model.define(class LogicalOperator extends _ext.Entity {

});

module.exports = model.lock();