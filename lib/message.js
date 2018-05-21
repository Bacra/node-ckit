"use strict";

var _ = require('lodash');
var debug = require('debug')('ckit:message');

function BaseType()
{
	// optional (0) + required (1) + repeated (2) 的标志位
	this._orr_flag = 0;

	// 成员设置的数据，必须保存在此数据中
	this.data_ = new this._Data();
}

_.extend(BaseType.prototype,
{
	_Data: CustomObject,
	default: function(val)
	{
		this.data_.default = val;
		return this;
	},
	length: function(val)
	{
		val = +val;
		if (val < 0) throw new Error('LENGTH_MUST_RT0');
		this.data_.length = val;
		return this;
	},

	isArray: function()
	{
		return this._orr_flag == 2;
	},

	check: function(val)
	{
		if (val === undefined)
		{
			if (this._orr_flag == 1)
				throw new Error('IS_REQUIRED');
			else
				val = this.data_.default;
		}

		if (this.isArray())
		{
			// 不符合条件的，全部返回空数组
			// 1. 在业务那边判断更加简单
			// 2. Type继承的时候，可以减少对undefined 和 null的判断
			var len = Array.isArray(val) && val.length;
			if (len)
			{
				if (len > this.data_.length)
					throw new Error('TOO_MUCH');
				else
					return val;
			}

			return [];
		}
		else
		{
			return val;
		}
	},


	super_: function(parent, protoName, args)
	{
		var handler = (typeof parent == 'function' ? parent.prototype : parent)[protoName];

		if (args && typeof args.length == 'number')
			return handler.apply(this, args);
		else
			return handler.call(this);
	},
});

BaseType.extend = ClassExtend;


var BaseObject = BaseType.extend(function(parent)
{
	return {
		check: function(val)
		{
			var self = this;
			// 先检查基础的几个设置
			val = self.super_(parent, 'check', arguments);
			debug('before message check val: %o', val);

			// message 必然是一个结构体
			// 非结构体的，直接返回undefined
			if (!val || typeof val != 'object') return;

			// 处理数组模式
			if (self.isArray())
			{
				return val.map(function(val2)
				{
					return self._checkOne(val2);
				});
			}
			// 普通结构体
			else
			{
				return self._checkOne(val);
			}

			return newObj;
		},

		_checkOne: function(val)
		{
			var newObj = {};

			var shape = this._shape;
			if (!shape) return newObj;

			for(var name in shape)
			{
				var checker = shape[name];
				if (checker && checker.check)
				{
					debug('check start: %s', name);
					newObj[name] = checker.check(val[name]);
				}
				else
				{
					debug('check is not found: %o', checker);
				}
			}

			return newObj;
		}
	};
});



var Message = BaseObject.extend(function(parent)
{
	return {
		optional	: new CustomObject(),
		required	: new CustomObject(),
		repeated	: new CustomObject(),

		message: function(name, obj)
		{
			if (!obj)
			{
				obj = name;
				name = null;
			}

			var NewMessage = this.constructor.extend();
			var proto = NewMessage.prototype;

			// 和extend拷贝相比，继承的好处是在父类添加的时候，子类会同步更新
			proto.optional = new (genCustomObject(this.optional));
			proto.required = new (genCustomObject(this.required));
			proto.repeated = new (genCustomObject(this.repeated));

			var obj2 = new NewMessage();
			// 由于不用保存原来的配置数据，可以直接赋值
			// data_数据在这里不需要保留（保留也不符合预期，Message是全新的开始）
			obj2._shape = obj;

			if (name) this.addMessage(name, obj2);

			return obj2;
		},

		addMessage: function(name, message)
		{
			var self = this;

			// 新的类
			var NewMessage = message.constructor.extend();
			var proto = NewMessage.prototype;

			// 和extend拷贝相比，继承的好处是在父类添加的时候，子类会同步更新
			proto._Data = genCustomObject(message.data_);
			// 需要将shape结构体同步过来，但不用考虑继承关系
			// shape的修改，一直是全量修改
			proto._shape = message._shape;

			// 添加的子类，是不允许再拓展出来的
			delete proto.optional;
			delete proto.required;
			delete proto.repeated;


			// 对当前optional required repeated 进行扩展
			Object.defineProperty(self.optional, name,
			{
				get: function()
				{
					var obj = new NewMessage;
					obj._orr_flag = 0;
					return obj;
				}
			});

			Object.defineProperty(self.required, name,
			{
				get: function()
				{
					var obj = new NewMessage;
					obj._orr_flag = 1;
					return obj;
				}
			});

			Object.defineProperty(self.repeated, name,
			{
				get: function()
				{
					var obj = new NewMessage;
					obj._orr_flag = 2;
					return obj;
				}
			});
		},
	};
});



function CustomObject(){}
function genCustomObject(proto)
{
	function NewCustomObject(){}
	NewCustomObject.prototype = proto;
	return NewCustomObject;
}


function ClassExtend(protoProps)
{
	var parent = this;
	var Constructor = parent;
	var child = function()
	{
		return Constructor.apply(this, arguments);
	};

	if (typeof protoProps == 'function')
	{
		protoProps = protoProps(parent, child);
	}

	var Surrogate = function()
	{
		this.constructor = child;
	}
	Surrogate.prototype = parent.prototype;
	child.prototype = new Surrogate;
	child.extend = parent.extend;

	if (protoProps)
	{
		delete protoProps.constructor;
		_.extend(child.prototype, protoProps);
	}

	return child;
}


exports.Message = Message;
exports.BaseType = BaseType;
exports.BaseObject = BaseObject;
