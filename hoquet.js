Hoquet = function() {};

Hoquet.prototype.render = function(a) {
  
  if (typeof a === 'string') return a;
  if (!(a instanceof Array)) return '';
  
  var out = '',
      selfClosing = true,
      last = a.length > 1 && a[a.length - 1],
      i;
  
  if (a[0] instanceof Array)
    return a.map(this.render, this).join('');
  
  out = '<' + a[0];
  
  if (typeof last === 'string' ||
      typeof last === 'undefined' || 
      last instanceof Array)
    selfClosing = false;
  
  for (i = 1; i < a.length; i++) {
    if (i === 1) {
      if (a[i] instanceof Object && !(a[i] instanceof Array))
        for (var key in a[i])
          out += ' ' + key + '=' + '"' + a[i][key] + '"';
      if (!selfClosing)
        out += '>';
    }
    
    if (a[i] instanceof Array)
      out += this.render(a[i]);
    else if (typeof a[i] === 'string')
      out += a[i];
  }
  
  if (!selfClosing)
    out += '</' + a[0] + '>';
  else
    out += ' />';
  
  return out;

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
