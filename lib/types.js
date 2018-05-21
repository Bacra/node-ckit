"use strict";

var Message = require('./message');

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


exports.StringType = StringType;
exports.NumberType = NumberType;
exports.BooleanType = BooleanType;
exports.ObjectType = ObjectType;
