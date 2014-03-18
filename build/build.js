
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
require.register("hoquet/index.js", Function("exports, require, module",
"Hoquet = function() {};\n\
\n\
function isStringOrNumber(tester) {\n\
  function isNumber(n) {\n\
    return !isNaN(parseFloat(n)) && isFinite(n);\n\
  }\n\
  return typeof tester === 'string' || isNumber(tester);\n\
}\n\
\n\
function hasKeys(object) {\n\
  if (object instanceof Object)\n\
    for (var k in object)\n\
      if (Object.prototype.hasOwnProperty.call(object, k))\n\
        return true;\n\
  return false;\n\
};\n\
\n\
Hoquet.prototype.render = function(a) {\n\
\n\
  function render (a) {\n\
    if (isStringOrNumber(a)) return a;\n\
    if (!(a instanceof Array)) return '';\n\
    \n\
    var out = '',\n\
      selfClosing = true,\n\
      last = a.length > 1 && a[a.length - 1],\n\
      i;\n\
    \n\
    if (a[0] instanceof Array)\n\
      return a.map(render, this).join('');\n\
    else if (a[0] instanceof Object && !hasKeys(a[0]))\n\
      a[0] = undefined;\n\
    \n\
    out = '<' + a[0];\n\
    \n\
    if (isStringOrNumber(last) ||\n\
        typeof last === 'undefined' || \n\
        last instanceof Array ||\n\
\ta.length > 2)\n\
      selfClosing = false;\n\
    \n\
    for (i = 1; i < a.length; i++) {\n\
      if (i === 1) {\n\
        if (a[i] instanceof Object &&\n\
\t    !(a[i] instanceof Array))\n\
          for (var key in a[i])\n\
            if (a[i][key])\n\
              out += ' ' + key + '=' + '\"' + a[i][key] + '\"';\n\
            else\n\
              out += ' ' + key;\n\
        if (!selfClosing)\n\
          out += '>';\n\
      }\n\
      \n\
      if (a[i] instanceof Array && a[i].length > 0)\n\
        out += render(a[i]);\n\
      else if (isStringOrNumber(a[i]))\n\
        out += a[i];\n\
    }\n\
    \n\
    if (!selfClosing)\n\
      out += '</' + a[0] + '>';\n\
    else\n\
      out += ' />';\n\
    \n\
    return out;\n\
  }\n\
  \n\
  if (arguments.length > 1)\n\
    return [].map.call(arguments, render, this).join('');\n\
  \n\
  return render(a);\n\
  \n\
};\n\
\n\
Hoquet.prototype.scripts = function(src) {\n\
  var self = this;\n\
  \n\
  if (src instanceof Array)\n\
    return src.map(script, this).join('');\n\
  \n\
  if (arguments.length > 1) {\n\
    return [].map.call(arguments, script, this).join('');\n\
  }\n\
\n\
  function script(src) {\n\
    return self.render([\"script\", {\"type\":\"text/javascript\", \"src\":src}, '']);\n\
  }\n\
  \n\
  return script(src);\n\
};\n\
\n\
Hoquet.prototype.styles = function(src) {\n\
  var self = this;\n\
  \n\
  if (src instanceof Array)\n\
    return src.map(style, this).join('');\n\
  \n\
  if (arguments.length > 1)\n\
    return [].map.call(arguments, style, this).join('');\n\
  \n\
  function style(src) {\n\
    return self.render([\"link\", {\"rel\":\"stylesheet\",\n\
                                 \"type\":\"text/css\",\n\
                                 \"href\":src}]);\n\
  };\n\
  \n\
  return style(src);\n\
};\n\
\n\
Hoquet.prototype.doc = function(type, a) {\n\
  switch (type) {\n\
  case 'html5':\n\
  default:\n\
    return \"<!doctype html>\" + this.render(a);\n\
    break;\n\
  }\n\
};\n\
\n\
Hoquet.prototype.renderFile = function(file, context, callback) {\n\
  var fs;\n\
  try {\n\
    fs = require('fs');\n\
    fs.readFile(file, 'utf8', function(e, data) {\n\
      e ? callback(e)\n\
      : (function() {\n\
        var forms = eval(data);\n\
        callback(null,\n\
          Hoquet.prototype.doc(\"html5\", forms)\n\
        );\n\
      })();\n\
    });\n\
  } catch (e) {\n\
    callback(e);\n\
  }\n\
}\n\
\n\
module.exports = new Hoquet;\n\
//@ sourceURL=hoquet/index.js"
));
require.alias("hoquet/index.js", "hoquet/index.js");