Hoquet = function() {};

function isStringOrNumber(tester) {
  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  return typeof tester === 'string' || isNumber(tester);
}

function hasKeys(object) {
  if (object instanceof Object)
    for (var k in object)
      if (Object.prototype.hasOwnProperty.call(object, k))
        return true;
  return false;
};

Hoquet.prototype.render = function(a) {

  function render (a) {
    if (isStringOrNumber(a)) return a;
    if (!(a instanceof Array)) return '';
    
    var out = '',
      selfClosing = true,
      last = a.length > 1 && a[a.length - 1],
      i;
    
    if (a[0] instanceof Array)
      return a.map(render, this).join('');
    else if (a[0] instanceof Object && !hasKeys(a[0]))
      a[0] = undefined;
    
    out = '<' + a[0];
    
    if (isStringOrNumber(last) ||
        typeof last === 'undefined' || 
        last instanceof Array ||
	a.length > 2)
      selfClosing = false;
    
    for (i = 1; i < a.length; i++) {
      if (i === 1) {
        if (a[i] instanceof Object &&
	    !(a[i] instanceof Array))
          for (var key in a[i])
            if (a[i][key])
              out += ' ' + key + '=' + '"' + a[i][key] + '"';
            else
              out += ' ' + key;
        if (!selfClosing)
          out += '>';
      }
      
      if (a[i] instanceof Array && a[i].length > 0)
        out += render(a[i]);
      else if (isStringOrNumber(a[i]))
        out += a[i];
    }
    
    if (!selfClosing)
      out += '</' + a[0] + '>';
    else
      out += ' />';
    
    return out;
  }
  
  if (arguments.length > 1)
    return [].map.call(arguments, render, this).join('');
  
  return render(a);
  
};

Hoquet.prototype.scripts = function(src) {
  var self = this;
  
  if (src instanceof Array)
    return src.map(script, this).join('');
  
  if (arguments.length > 1) {
    return [].map.call(arguments, script, this).join('');
  }

  function script(src) {
    return self.render(["script", {"type":"text/javascript", "src":src}, '']);
  }
  
  return script(src);
};

Hoquet.prototype.styles = function(src) {
  var self = this;
  
  if (src instanceof Array)
    return src.map(style, this).join('');
  
  if (arguments.length > 1)
    return [].map.call(arguments, style, this).join('');
  
  function style(src) {
    return self.render(["link", {"rel":"stylesheet",
                                 "type":"text/css",
                                 "href":src}]);
  };
  
  return style(src);
};

Hoquet.prototype.doc = function(type, a) {
  switch (type) {
  case 'html5':
  default:
    return "<!doctype html>" + this.render(a);
    break;
  }
};

module.exports = new Hoquet;
