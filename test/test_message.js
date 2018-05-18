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

	it('#submsg', function()
	{
		var msg0 = ckit.message();
		msg0.message('msg1', msg1_def);

		var msg2 = ckit.message(
		{
			d: msg0.required.string,
			// 复用原来的定义
			e: msg0.required.msg1,
		});

		expect(msg2.check({d: 4, e: msg1_obj_l})).to.eql({d: '4', e: msg1_obj_r});
	});
});
