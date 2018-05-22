var ckit = require('../');
var expect = require('expect.js');

describe('#message', function()
{
	var msg1_def =
	{
		a: ckit.required.string,
		b: ckit.repeated.number,
		c: ckit.optional.number.default(3),
	};

	var msg1_obj_l = {a: 1, b: ['2']};
	var msg1_obj_r = {a: '1', b: [2], c: 3};

	it('#base', function()
	{
		var msg1 = ckit.message(msg1_def);

		expect(msg1.check(msg1_obj_l)).to.eql(msg1_obj_r);
	});

	it('#empty repeated', function()
	{
		var msg1 = ckit.message(msg1_def);
		expect(msg1.check({a: 1})).to.eql({a: '1', b: [], c: 3});
		expect(msg1.check({a: 1, b: []})).to.eql({a: '1', b: [], c: 3});
		expect(msg1.check({a: 1, b: '12'})).to.eql({a: '1', b: [], c: 3});
	});

	it('#submsg', function()
	{
		var msg0 = ckit.message();
		var msg1 = msg0.message('msg1', msg1_def);

		// msg1自动admessage到msg0
		var msg2 = ckit.message(
		{
			d: msg0.required.string,
			// 复用原来的定义
			e: msg0.required.msg1,
		});
		expect(msg2.check({d: 4, e: msg1_obj_l})).to.eql({d: '4', e: msg1_obj_r});

		// 子类一样具有msg1
		var msg3 = ckit.message(
		{
			d: msg1.required.string,
			e: msg1.required.msg1,
		});
		expect(msg3.check({d: 4, e: msg1_obj_l})).to.eql({d: '4', e: msg1_obj_r});
	});

	it('#new type with config', function()
	{
		var msg0 = ckit.message();
		msg0.addMessage('lt10num', ckit.required.number.max(9));

		var msg1 = ckit.message(
		{
			a: msg0.repeated.lt10num
		});

		expect(msg1.check({a: [1]})).to.eql({a: [1]});
		expect(function(){msg1.check({a: [11]})})
			.to.throwError();
	});
});
