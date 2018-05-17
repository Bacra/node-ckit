"use strict";

var Message = require('./lib/message');
var Types = require('./lib/types');

exports = module.exports = new Message.Message();

exports.addMessage('boolean', new Types.BooleanType());
exports.addMessage('string', new Types.StringType());
exports.addMessage('number', new Types.NumberType());
exports.addMessage('object', new Types.ObjectType());
