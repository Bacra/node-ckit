var ckit = require('../');
var expect = require('expect.js');


describe('#base', function()
{
	it('#message', function()
	{
		var msg1 = ckit.Message(
		{
			a: ckit.required.string,
			b: ckit.repeated.number,
			c: ckit.optional.number.default(3),
		});

		msg1.addMessage('msg1', msg1);

		var msg2 = ckit.Message(
		{
			d: msg1.required.string,
			// 复用原来的定义
			e: msg1.required.msg1,
			// 直接创建一个新的定义
			// 特定情况下，比复用方便，是因为可以以object的方式，创建下去
			f: msg1.required.object.shape(
				{
					g: msg1.required.string,
					h: msg1.optional.string.default('h'),
				})
		});

		var msg1_obj_l = {a: 1, b: ['2']};
		var msg1_obj_r = {a: '1', b: [2], c: 3};
		expect(msg1.check(msg1_obj_l)).to.eql(msg1_obj_r);
		expect(msg2.check({d: 4, e: msg1_obj_l, f: {g: 'g'}})).to.eql({d: '4', e: msg1_obj_r, f: {g: 'g', h: 'h'}});
	});
});
