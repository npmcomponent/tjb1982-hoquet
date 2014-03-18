;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("hoquet/index.js", function(exports, require, module){
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

Hoquet.prototype.renderFile = function(file, context, callback) {
  var fs;
  try {
    fs = require('fs');
    fs.readFile(file, 'utf8', function(e, data) {
      e ? callback(e)
      : (function() {
        var forms = eval(data);
        callback(null,
          Hoquet.prototype.doc("html5", forms)
        );
      })();
    });
  } catch (e) {
    callback(e);
  }
}

module.exports = new Hoquet;

});
require.alias("hoquet/index.js", "hoquet/index.js");if (typeof exports == "object") {
  module.exports = require("hoquet");
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return require("hoquet"); });
} else {
  this["hoquet"] = require("hoquet");
}})();