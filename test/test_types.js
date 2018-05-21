var ckit = require('../');
var expect = require('expect.js');

describe('#message', function()
{
	describe('#string', function()
	{
		it('#base', function()
		{
			var msg = ckit.message(
			{
				a: ckit.required.string,
			});

			expect(msg.check({a: '1'})).to.eql({a: '1'});
			expect(msg.check({a: ''})).to.eql({a: ''});
			expect(msg.check({a: 1})).to.eql({a: '1'});
			expect(msg.check({a: 0})).to.eql({a: '0'});
			expect(msg.check({a: true})).to.eql({a: 'true'});
			expect(msg.check({a: false})).to.eql({a: 'false'});
			expect(msg.check({a: null})).to.eql({a: undefined});
			expect(msg.check({a: {}})).to.eql({a: '[object Object]'});
			expect(msg.check({a: []})).to.eql({a: ''});
			expect(function(){msg.check({a: undefined})})
				.to.throwError();
		});

		it('#min max', function()
		{
			var msg = ckit.message(
			{
				a: ckit.required.string.max(3).min(1)
			});

			expect(function(){msg.check({a: ''})}).to.throwError();
			expect(msg.check({a: '1'})).to.eql({a: '1'});
			expect(msg.check({a: '123'})).to.eql({a: '123'});
			expect(function(){msg.check({a: '1234'})}).to.throwError();
		});

		it('#trim', function()
		{
			var msg = ckit.message(
			{
				a: ckit.required.string.max(1).trim()
			});

			expect(msg.check({a: ' 1 '})).to.eql({a: '1'});

			var msg = ckit.message(
			{
				a: ckit.required.string.min(2).trim(false)
			});

			expect(msg.check({a: ' 1 '})).to.eql({a: ' 1 '});
		});
	});

	describe('#number', function()
	{
		it('#base', function()
		{
			var msg = ckit.message(
			{
				a: ckit.required.number,
			});

			expect(msg.check({a: '1'})).to.eql({a: 1});
			expect(msg.check({a: ''})).to.eql({a: 0});
			expect(msg.check({a: 1})).to.eql({a: 1});
			expect(msg.check({a: 0})).to.eql({a: 0});
			expect(msg.check({a: true})).to.eql({a: 1});
			expect(msg.check({a: false})).to.eql({a: 0});
			expect(msg.check({a: null})).to.eql({a: undefined});
			expect(msg.check({a: []})).to.eql({a: 0});
			expect(function(){msg.check({a: {}})})
				.to.throwError();
			expect(function(){msg.check({a: undefined})})
				.to.throwError();
		});

		it('#min max', function()
		{
			var msg = ckit.message(
			{
				a: ckit.required.number.max(3).min(1)
			});

			expect(function(){msg.check({a: 0})}).to.throwError();
			expect(msg.check({a: 1})).to.eql({a: 1});
			expect(msg.check({a: 3})).to.eql({a: 3});
			expect(function(){msg.check({a: 4})}).to.throwError();
		});
	});

	describe('#boolean', function()
	{
		it('#base', function()
		{
			var msg = ckit.message(
			{
				a: ckit.required.boolean,
			});

			expect(msg.check({a: '1'})).to.eql({a: true});
			expect(msg.check({a: ''})).to.eql({a: false});
			expect(msg.check({a: 1})).to.eql({a: true});
			expect(msg.check({a: 0})).to.eql({a: false});
			expect(msg.check({a: true})).to.eql({a: true});
			expect(msg.check({a: false})).to.eql({a: false});
			expect(msg.check({a: null})).to.eql({a: false});
			expect(msg.check({a: {}})).to.eql({a: true});
			expect(msg.check({a: []})).to.eql({a: true});
			expect(function(){msg.check({a: undefined})})
				.to.throwError();
		});
	});

	describe('#object', function()
	{
		it('#base', function()
		{
			var msg = ckit.message(
			{
				a: ckit.required.object.shape(
				{
					b: ckit.required.string,
					c: ckit.optional.string.default('c'),
				})
			});

			expect(msg.check({a: {b: 1, d: 2}})).to.eql({a: {b: '1', c: 'c'}});
		});
	});
});
