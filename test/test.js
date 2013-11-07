var expect = require('chai').expect;
var hoquet = require('../');

describe('Hoquet', function() {
  it('should be a function', function() {
    expect(Hoquet).to.be.a('function');
  });
});

describe('new Hoquet', function () {
  it('is an object', function () {
    expect(hoquet).to.be.an('object');
  });
});

describe('hoquet.render', function() {
  it('is a function', function() {
    expect(hoquet.render).to.be.a('function');
  });

  it('should return a string', function() {
    expect(hoquet.render()).to.be.a('string');
  });

  it('should take a single structured array like this: ["p","foo"] and create an HTML snippet like this "<p>foo</p>', function() {
    expect(hoquet.render(['p','foo'])).to.equal('<p>foo</p>');
  });

  it('should create a string of HTML snippets by joining each of its arguments', function() {
    expect(hoquet.render(['p','foo'],['p','bar'],['p','baz'])).to.equal(
      '<p>foo</p><p>bar</p><p>baz</p>'
    );
  });

  it('should create a string of HTML snippets by joining elements of an Array', function() {
    expect(hoquet.render([['p','foo'],['p','bar']])).to.equal(
      '<p>foo</p><p>bar</p>'
    );
  });

  it('should create a string of embedded HTML by embedding Arrays like this ["p","foo", ["span","bar"]]', function() {
    expect(hoquet.render(['p','foo', ['span','bar']])).to.equal(
      '<p>foo<span>bar</span></p>'
    );
  });

  it('should add attributes to the HTML elements by putting an object in second position only, like this: ["p", {class: "foo"}, "bar"]', function() {
    expect(hoquet.render(['p', {class:'foo'}, 'bar'])).to.equal('<p class="foo">bar</p>');
    expect(hoquet.render(['p', 'foo', {class: 'bar'}])).to.equal('<p>foo</p>');
  });

  it('should ignore falsy values in every position other than the first', function() {
    expect(hoquet.render(['p', null, 'foo', false, 'bar', undefined, 'baz'])).to.equal(
      '<p>foobarbaz</p>'
    );
    expect(hoquet.render([false, 'foo'],[null, 'bar'],['undefined','baz'],[{}, 'far'])).to.equal(
      '<false>foo</false><null>bar</null><undefined>baz</undefined><undefined>far</undefined>'
    );
    expect(hoquet.render(['p', [], 'foo'])).to.equal(
      '<p>foo</p>'
    );
    expect(hoquet.render([[], 'boo'])).to.equal(
      '<undefined />boo'
    );
  });

  it('should handle self-closing elements by assuming elements without content are self-closing, e.g. ["meta"] or ["meta", {foo: "bar"}],  not ["meta", undefined/false/null/[]/{}]', function() {
    expect(hoquet.render(['meta'])).to.equal('<meta />');
    expect(hoquet.render(['meta', {foo: 'bar'}])).to.equal('<meta foo="bar" />');
    expect(hoquet.render(['br'])).to.equal('<br />');
    expect(hoquet.render(['p'],['p',''])).to.equal('<p /><p></p>');
  });
});

describe('hoquet.scripts', function() {
  
  it('should create a generic script tag with only naming the scr attribute', function() {
    expect(hoquet.scripts('js/foo.js')).to.equal('<script type="text/javascript" src="js/foo.js"></script>');
  });
  
  it('should join each argument or an Array argument', function() {
    expect(hoquet.scripts('js/foo.js', 'js/bar.js')).to.equal(
      '<script type="text/javascript" src="js/foo.js"></script><script type="text/javascript" src="js/bar.js"></script>'
    );
    expect(hoquet.scripts(['js/foo.js', 'js/bar.js'])).to.equal(
      '<script type="text/javascript" src="js/foo.js"></script><script type="text/javascript" src="js/bar.js"></script>'
    );
    expect(hoquet.scripts(['js/foo.js', 'js/bar.js'], 'js/baz.js')).not.to.equal(
      '<script type="text/javascript" src="js/foo.js"></script>' +
      '<script type="text/javascript" src="js/bar.js"></script>' +
      '<script type="text/javascript" scr="js/baz.js"></script>'
    );
  });
});

