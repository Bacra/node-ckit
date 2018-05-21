"use strict";

var Message = require('./message');
var debug = require('debug')('ckit:types');

var BooleanType = Message.BaseType.extend(function(parent)
{
	return {
		check: function(val)
		{
			var self = this;
			val = self.super_(parent, 'check', arguments);
			if (val === undefined) return;

			if (self.isArray())
			{
				return val.map(function(val2){return !!val2});
			}
			else
			{
				return !!val;
			}
		},
	};
});

var StringType = Message.BaseType.extend(function(parent)
{
	return {
		min: function(val)
		{
			val = +val;
			if (val < 0) throw new Error('MIN_MUST_RT0');
			this.data_.min = val;
			return this;
		},
		max: function(val)
		{
			val = +val;
			if (val < 0) throw new Error('MAX_MUST_RT0');
			this.data_.max = +val;
			return this;
		},
		trim: function(enabled)
		{
			this.data_.trim = !(enabled === false);
			return this;
		},

		check: function(val)
		{
			var self = this;
			val = self.super_(parent, 'check', arguments);

			if (val === undefined || val === null) return;

			if (self.isArray())
			{
				return val.map(function(val2)
				{
					return self._checkOne(val2);
				});
			}
			else
			{
				return self._checkOne(val);
			}
		},

		_checkOne: function(val)
		{
			var data = this.data_;
			if (data.trim && val) val = (''+val).trim();

			if (val === undefined || val === null) throw new Error('STR_NULL');;
			if (typeof val != 'string') val += '';

			if (data.min || data.max)
			{
				var len = val.length;
				if (data.min && len < data.min) throw new Error('STR_LENGTH');
				if (data.max && len > data.max) throw new Error('STR_LENGTH');
			}

			return val;
		},
	};
});

var NumberType = Message.BaseType.extend(function(parent)
{
	return {
		min: function(val)
		{
			val = +val;
			if (val < 0) throw new Error('MIN_MUST_RT0');
			this.data_.min = val;
			return this;
		},
		max: function(val)
		{
			val = +val;
			if (val < 0) throw new Error('MAX_MUST_RT0');
			this.data_.max = +val;
			return this;
		},

		check: function(val)
		{
			var self = this;
			val = self.super_(parent, 'check', arguments);

			if (val === undefined || val === null) return;

			if (self.isArray())
			{
				return val.map(function(val2)
				{
					return self._checkOne(val2);
				});
			}
			else
			{
				return self._checkOne(val);
			}
		},

		_checkOne: function(val)
		{
			if (val === undefined || val === null) throw new Error('STR_NULL');

			if (typeof val != 'nubmer') val = +val;

			if (isNaN(val)) throw new Error('NUM_NAN');

			var data = this.data_;
			if (data.min && val < data.min) throw new Error('NUM_SIZE');
			if (data.max && val > data.max) throw new Error('NUM_SIZE');

			return val;
		}
	};
});

var ObjectType = Message.BaseObject.extend(function(parent)
{
	return {
		shape: function(obj)
		{
			this._shape = obj;
			return this;
		}
	};
});

var EnumType = Message.BaseType.extend(function(parent)
{
	return {
		values: function(val)
		{
			if (typeof val != 'object') throw new Error('ENUM_TYPE');
			this.data_.enum = val;
			return this;
		},
		check: function(val)
		{
			var enumVals = this.data_.enum;
			if (!enumVals) throw new Error('ENUM_NO_VALUES');

			var self = this;
			val = self.super_(parent, 'check', arguments);

			if (val === undefined || val === null) return;
			var isarr = Array.isArray(this.data_.enum);

			if (self.isArray())
			{
				return val.map(function(val2)
				{
					return self._checkOne(val2, isarr);
				});
			}
			else
			{
				return self._checkOne(val, isarr);
			}
		},
		_checkOne: function(val, isarr)
		{
			if (val === undefined || val === null) throw new Error('ENUM_NULL');

			var enumVals = this.data_.enum;
			if (isarr)
			{
				if (enumVals.indexOf(val) == -1) throw new Error('ENUM_OUT');
				return val;
			}
			else
			{
				if (val in enumVals)
					return enumVals[val];
				else
					throw new Error('ENUM_OUT');
			}
		},
	};
});

exports.StringType = StringType;
exports.NumberType = NumberType;
exports.BooleanType = BooleanType;
exports.ObjectType = ObjectType;
exports.EnumType = EnumType;
