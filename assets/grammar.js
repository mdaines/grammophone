(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Grammar = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
const Relation = require('../relation');
const END = require("../symbols").END;



  module.exports["grammar.classification"] = function(grammar) {

    return {
      "ll1": grammar.calculate("parsing.ll.ll1_classification"),
      "lr0": grammar.calculate("parsing.lr.lr0_classification"),
      "slr1": grammar.calculate("parsing.lr.slr1_classification"),
      "lr1": grammar.calculate("parsing.lr.lr1_classification"),
      "lalr1": grammar.calculate("parsing.lr.lalr1_classification")
    };

  };

  module.exports["grammar.nonterminals"] = function(grammar) {

    var i;
    var nonterminals = {};

    for (i = 0; i < grammar.productions.length; i++)
      nonterminals[grammar.productions[i][0]] = true;

    return nonterminals;

  };

  module.exports["grammar.terminals"] = function(grammar) {

    var i, j;
    var terminals = {};
    var nonterminals = grammar.calculate("grammar.nonterminals");

    for (i = 0; i < grammar.productions.length; i++) {
      for (j = 1; j < grammar.productions[i].length; j++) {

        if (!nonterminals[grammar.productions[i][j]])
          terminals[grammar.productions[i][j]] = true;

      }
    }

    return terminals;

  };

  module.exports["grammar.symbolInfo"] = function(grammar) {

    var i, j, s;

    var terminalOrder = [];
    var nonterminalOrder = [];
    var productionOrder = [];

    var nonterminals = grammar.calculate("grammar.nonterminals");
    var terminals = grammar.calculate("grammar.terminals");

    for (i = 0; i < grammar.productions.length; i++) {

      s = grammar.productions[i][0];

      if (productionOrder.indexOf(s) === -1)
        productionOrder.push(s);

      for (j = 0; j < grammar.productions[i].length; j++) {

        s = grammar.productions[i][j];

        if (nonterminals[s] && nonterminalOrder.indexOf(s) === -1)
          nonterminalOrder.push(s);

        if (terminals[s] && terminalOrder.indexOf(s) === -1)
          terminalOrder.push(s);

      }

    }

    return {
      terminalOrder: terminalOrder,
      nonterminalOrder: nonterminalOrder,
      productionOrder: productionOrder,

      nonterminals: nonterminals,
      terminals: terminals
    };

  };

  module.exports["grammar.start"] = function(grammar) {

    return grammar.productions[0][0];

  };

  module.exports["grammar.productions"] = function(grammar) {

    return grammar.productions;

  };

  module.exports["grammar.unreachable"] = function(grammar) {

    var relation, closure, unreachable;
    var i, j, s;

    var nonterminals = grammar.calculate("grammar.nonterminals");
    var start = grammar.calculate("grammar.start");

    // Build relation:
    // (x,y) | x -> a y b where a and b are strings of terminals or nonterminals

    relation = Relation.create();

    for (i = 0; i < grammar.productions.length; i++) {
      for (j = 1; j < grammar.productions[i].length; j++) {

        if (nonterminals[grammar.productions[i][j]])
          Relation.add(relation, grammar.productions[i][0], grammar.productions[i][j]);

      }
    }

    // Obtain the closure of the relation

    closure = Relation.closure(relation);

    // Collect unreachable nonterminals

    unreachable = {};

    for (s in nonterminals) {

      if (s != start && (!closure[start] || !closure[start][s]))
        unreachable[s] = true;

    }

    return unreachable;

  };

  module.exports["grammar.unrealizable"] = function(grammar) {

    var marked, added, unrealizable;
    var i, j, s;
    var nonterminals = grammar.calculate("grammar.nonterminals");

    // Is a particular nonterminal realizable?

    marked = {};

    do {

      added = [];

      for (i = 0; i < grammar.productions.length; i++) {

        // Are there any unmarked nonterminals? Break at the first one.

        for (j = 1; j < grammar.productions[i].length; j++) {

          if (!marked[grammar.productions[i][j]] && nonterminals[grammar.productions[i][j]])
            break;

        }

        // If the head of this production is not marked, and all of the symbols in
        // the body of the production were not unmarked nonterminals (ie, they were
        // either marked or terminals), mark the head and record
        // that we marked it in this step.

        if (!marked[grammar.productions[i][0]] && j == grammar.productions[i].length) {
          marked[grammar.productions[i][0]] = true;
          added.push(grammar.productions[i][0]);
        }

      }

    } while (added.length > 0);

    // Collect nonterminals which were not marked.

    unrealizable = {};

    for (s in nonterminals) {

      if (!marked[s])
        unrealizable[s] = true;

    }

    return unrealizable;

  };

  module.exports["grammar.cycle"] = function(grammar) {

    var relation;
    var i, j, k;
    var nonterminals = grammar.calculate("grammar.nonterminals");
    var nullable = grammar.calculate("grammar.nullable");

    // Build relation
    // (x,y) | x -> a y b, y a nonterminal, a and b nullable

    relation = Relation.create();

    for (i = 0; i < grammar.productions.length; i++) {
      for (j = 1; j < grammar.productions[i].length; j++) {

        if (nonterminals[grammar.productions[i][j]]) {

          for (k = 1; k < grammar.productions[i].length; k++) {

            if (j === k)
              continue;

            if (!nonterminals[grammar.productions[i][k]] || !nullable[grammar.productions[i][k]])
              break;

          }

          if (k === grammar.productions[i].length)
            Relation.add(relation, grammar.productions[i][0], grammar.productions[i][j]);

        }

      }
    }

    // Find a cycle if there is one

    return Relation.cycle(relation);

  };

  module.exports["grammar.nullAmbiguity"] = function(grammar) {

    var nonterminals = grammar.calculate("grammar.nonterminals");
    var nullable = grammar.calculate("grammar.nullable");
    var found;
    var nt;
    var i, j;

    // For each nonterminal...

    for (nt in nonterminals) {

      // Look through the productions of this nonterminal for
      // productions which are nullable. If we find more than
      // one, return them as an array (in order).

      found = undefined;

      for (i = 0; i < grammar.productions.length; i++) {

        if (grammar.productions[i][0] == nt) {

          // An empty production is nullable.

          if (grammar.productions[i].length == 1) {

            if (typeof found !== "undefined")
              return i < found ? [i, found] : [found, i];
            else
              found = i;

            continue;

          }

          // A production is nullable if all of its symbols are nullable.

          for (j = 1; j < grammar.productions[i].length; j++) {

            if (!nullable[grammar.productions[i][j]])
              break;

          }

          if (j == grammar.productions[i].length) {

            if (typeof found !== "undefined")
              return i < found ? [i, found] : [found, i];
            else
              found = i;

          }

        }

      }

    }

    return [];

  }

  module.exports["grammar.nullable"] = function(grammar) {

    var nullable = {};
    var added;
    var i, j, head;

    do {

      added = [];

      for (i = 0; i < grammar.productions.length; i++) {

        for (j = 1; j < grammar.productions[i].length; j++) {
          if (!nullable[grammar.productions[i][j]])
            break;
        }

        head = grammar.productions[i][0];

        if (j == grammar.productions[i].length && !nullable[head]) {
          nullable[head] = true;
          added.push(head);
        }

      }

    } while (added.length > 0);

    return nullable;

  };

  module.exports["grammar.first"] = function(grammar) {

    var immediate, propagation, result;
    var i, j, k;
    var nullable = grammar.calculate("grammar.nullable");
    var nonterminals = grammar.calculate("grammar.nonterminals");

    immediate = Relation.create();
    propagation = Relation.create();

    // For each production, add the first terminal symbol after a sequence of nullable symbols.

    for (i = 0; i < grammar.productions.length; i++) {

      // Skip nullable symbols...

      for (j = 1; j < grammar.productions[i].length; j++) {

        if (!nullable[grammar.productions[i][j]])
          break;

      }

      // If the first non-nullable symbol is a terminal, add it to the immediate first set
      // of this nonterminal.

      if (j < grammar.productions[i].length && !nonterminals[grammar.productions[i][j]])
        Relation.add(immediate, grammar.productions[i][0], grammar.productions[i][j]);

    }

    // For each production, add the prefix of nullable nonterminals, and then the next symbol
    // if it is also a nonterminal.

    for (i = 0; i < grammar.productions.length; i++) {
      for (j = 1; j < grammar.productions[i].length; j++) {

        // Is it a nonterminal? Add it.

        if (nonterminals[grammar.productions[i][j]])
          Relation.add(propagation, grammar.productions[i][0], grammar.productions[i][j]);

        // Is it not nullable? Stop.

        if (!nullable[grammar.productions[i][j]])
          break;

      }
    }

    // Propagate the relation.

    result = Relation.propagate(immediate, propagation);

    // Ensure that all nonterminals are present as keys, even if that particular follow set is empty.

    for (k in nonterminals) {
      if (typeof result[k] === "undefined")
        result[k] = {};
    }

    return result;

  };

  module.exports["grammar.follow"] = function(grammar) {

    var immediate, propagation, result;
    var i, j, k, s;
    var first = grammar.calculate("grammar.first");
    var nullable = grammar.calculate("grammar.nullable");
    var nonterminals = grammar.calculate("grammar.nonterminals");
    var start = grammar.calculate("grammar.start");

    immediate = Relation.create();
    propagation = Relation.create();

    // Add the end of input symbol to the immediate follow set of the grammar's start symbol.

    Relation.add(immediate, start, END);

    // Given a production X -> ... A β, follow(A) includes first(β), except for the empty string.

    for (i = 0; i < grammar.productions.length; i++) {

      for (j = 1; j < grammar.productions[i].length - 1; j++) {

        // If the symbol is a nonterminal...

        if (nonterminals[grammar.productions[i][j]]) {

          // Add the first set of the remaining symbols to the follow set of the symbol

          for (k = j + 1; k < grammar.productions[i].length; k++) {

            // If this symbol is a terminal, add it, and then stop adding.

            if (!nonterminals[grammar.productions[i][k]]) {
              Relation.add(immediate, grammar.productions[i][j], grammar.productions[i][k]);
              break;
            }

            // If it is a nonterminal, add the first set of that nonterminal.

            for (s in first[grammar.productions[i][k]])
              Relation.add(immediate, grammar.productions[i][j], s);

            // Stop if it isn't nullable.

            if (!nullable[grammar.productions[i][k]])
              break;

          }

        }

      }

    }

    // Given a production B -> ... A β where β is nullable or is the empty string, follow(A) includes follow(B)

    for (i = 0; i < grammar.productions.length; i++) {

      // Scan from the end of the right side of the production to the beginning...

      for (j = grammar.productions[i].length - 1; j > 0; j--) {

        // If the symbol is a nonterminal, add the left side.

        if (nonterminals[grammar.productions[i][j]])
          Relation.add(propagation, grammar.productions[i][j], grammar.productions[i][0]);

        // If it isn't nullable, stop.

        if (!nullable[grammar.productions[i][j]])
          break;

      }

    }

    // Propagate the relation

    result = Relation.propagate(immediate, propagation);

    // Ensure that all nonterminals are present as keys, even if that particular follow set is empty.

    for (k in nonterminals) {
      if (typeof result[k] === "undefined")
        result[k] = {};
    }

    return result;

  };

  module.exports["grammar.endable"] = function(grammar) {

    var s;
    var endable = {};
    var follow = grammar.calculate("grammar.follow");

    for (s in follow) {
      if (follow[s][END])
        endable[s] = true;
    }

    return endable;

  };

  // Given a "sentence node" and a grammar, expand the sentence's first
  // realizable nonterminal and return the resulting list of sentence nodes
  // (which may be empty).
  //
  // Each sentence node's "step" member is incremented and its "nonterminals"
  // member adjusted.

  function expandSentenceNode(node, grammar) {

    var i, j;
    var expanded = [];
    var nonterminals = grammar.calculate("grammar.nonterminals");
    var unrealizable = grammar.calculate("grammar.unrealizable");
    var sentence, replacement, nonterminalCount;

    // expand the first realizable nonterminal.

    for (i = 0; i < node.sentence.length; i++) {

      if (nonterminals[node.sentence[i]] && !unrealizable[node.sentence[i]]) {

        for (j = 0; j < grammar.productions.length; j++) {

          if (grammar.productions[j][0] === node.sentence[i]) {

            replacement = grammar.productions[j].slice(1);
            nonterminalCount = 0;

            for (k = 0; k < replacement.length; k++) {
              if (nonterminals[replacement[k]])
                nonterminalCount++;
            }

            expanded.push({
              sentence: node.sentence.slice(0, i).concat(replacement).concat(node.sentence.slice(i+1)),
              steps: node.steps + 1,
              nonterminals: node.nonterminals - 1 + nonterminalCount
            });

          }

        }

        break;

      }

    }

    return expanded;

  }

  var MAX_SENTENCES = 30;

  module.exports["grammar.sentences"] = function(grammar) {

    var start = grammar.calculate("grammar.start");

    var i, j;
    var sentences = [];
    var queue = [{ sentence: [start], steps: 0, nonterminals: 1 }];
    var node;
    var expanded;

    do {

      node = queue.shift();
      expanded = expandSentenceNode(node, grammar);

      for (i = 0; i < expanded.length; i++) {

        if (expanded[i].nonterminals === 0)
          sentences.push(expanded[i].sentence);
        else
          queue.push(expanded[i]);

        if (sentences.length >= MAX_SENTENCES)
          break;

      }

      // Sort the queue so that the next sentence is the one with the
      // fewest nonterminals and steps.

      queue = queue.sort(function(a, b) {
        return (a.nonterminals + a.steps) - (b.nonterminals + b.steps);
      });

    } while (queue.length > 0 && sentences.length < MAX_SENTENCES);

    return sentences.sort(function(a, b) {
      if (a.length === b.length)
        return a < b;
      else
        return a.length - b.length;
    });

  };

  module.exports["grammar.ambiguous"] = function(grammar) {

    var i, j;
    var sentences = grammar.calculate("grammar.sentences");
    var ambiguous = [];

    for (i = 0; i < sentences.length - 1; i++) {
      if (sentences[i].length != sentences[i+1].length)
        continue;

      for (j = 0; j < sentences[i].length; j++) {
        if (sentences[i][j] !== sentences[i+1][j])
          break;
      }

      if (j === sentences[i].length)
        return sentences[i];
    }

  }



},{"../relation":12,"../symbols":14}],5:[function(require,module,exports){
const grammar = require('./grammar');
const parsing = require('./parsing');
const transformations = require('./transformations');

module.exports = Object.assign({},
  grammar,
  parsing,
  transformations
);

},{"./grammar":4,"./parsing":6,"./transformations":9}],6:[function(require,module,exports){
const ll = require('./ll');
const lr = require('./lr');

module.exports = Object.assign({},
  ll,
  lr
);

},{"./ll":7,"./lr":8}],7:[function(require,module,exports){
const Set = require("../../set");
const END = require("../../symbols").END;


  module.exports["parsing.ll.ll1_classification"] = function(grammar) {

    var p, i, j, k, l;
    var head, body, first;

    var nullAmbiguity = grammar.calculate("grammar.nullAmbiguity");

    // We can return immediately if the grammar contains a null ambiguity.

    if (nullAmbiguity.length > 0)
      return { member: false, reason: "it contains a null ambiguity" };

    var follow = grammar.calculate("grammar.follow");
    var terminals = grammar.calculate("grammar.terminals");
    var nonterminals = grammar.calculate("grammar.nonterminals");
    var nullable = grammar.calculate("grammar.nullable");

    // Check for first set clashes. Instead of checking intersections of
    // first sets of all productions alpha_i for a given nonterminal A,
    // set the [A, a] entry of a table for every a in first(alpha_i) for
    // all A and alpha_i in A -> alpha_1 | alpha_2 | ... | alpha_n. If we
    // come upon an entry that has already been set, there is a first
    // set clash.

    var table = {};

    for (k in nonterminals) {

      table[k] = {};

      for (l in terminals)
        table[k][l] = false;

    }

    for (i = 0; i < grammar.productions.length; i++) {

      head = grammar.productions[i][0];
      body = grammar.productions[i].slice(1);

      first = grammar.getFirst(body);

      for (s in first) {
        if (table[head][s])
          return { member: false, reason: "it contains a first set clash" };

        table[head][s] = true;
      }

    }

    // Check for first/follow set clashes. That is, check that every nullable
    // production has disjoint first and follow sets.

    first = grammar.calculate("grammar.first");

    for (k in nullable) {

      if (Set.any(Set.intersection(first[k], follow[k])))
        return { member: false, reason: "it contains a first/follow set clash" };

    }

    return { member: true };

  }

  module.exports["parsing.ll.ll1_table"] = function(grammar) {

    var i, k, l, s;
    var table = {};
    var head, body, first;

    var terminals = grammar.calculate("grammar.terminals");
    var nonterminals = grammar.calculate("grammar.nonterminals");
    var follow = grammar.calculate("grammar.follow");

    // Populate table with blank arrays

    for (k in nonterminals) {

      table[k] = {};

      for (l in terminals)
        table[k][l] = [];

      table[k][END] = [];

    }

    // Collect moves

    for (i = 0; i < grammar.productions.length; i++) {

      head = grammar.productions[i][0];
      body = grammar.productions[i].slice(1);

      // Get the first set of the production's body

      first = grammar.getFirst(body);

      // For each symbol s in first(body), add the production
      // to table[nonterminal][s].

      for (s in first)
        table[head][s].push(i);

      // If the production is nullable, for each symbol s of follow(head),
      // add this production to table[head][s].

      if (grammar.isNullable(body)) {

        for (s in follow[head])
          table[head][s].push(i);

      }

    }

    return table;

  };



},{"../../set":13,"../../symbols":14}],8:[function(require,module,exports){
// Calculations for building LR(0), LR(1), SLR(1), and LALR(1)
// automata and parsing tables.
//
// Automata are lists of states like this:
//
//   { kernel: [ ... ], items: [ ... ], transitions: { ... } }
//
// Items:
//
//   LR0: { production: -1, index: 0 }
//   LR1: { production: -1, index: 0, lookahead: Grammar.END }
//   LALR1: { production: -1, index: 0, lookaheads: [ Grammar.END, "XYZ" ] }
//
// Parsing tables are also lists of states, each of which are objects
// representing the entries in the parsing table for that state.
//
// Rows for LR(0) parsing tables:
//
//   { shift: { ... }, reduce: [ ... ] }
//
// Examples:
//
//   { shift: { "(": 3, "a": 2, "A": 1 } }
//   { reduce: -1 }
//
// -1 = augmented start state production.
//
// Rows for SLR(1), LR(1), and LALR(1) tables:
//
//   { "symbol": { shift: 6, reduce: [3] }, ... }
//
// Examples:
//
//   { "else": { shift: 6, reduce: [3] } }
//   { "if": { shift: 4 }, "other": { shift: 3 }, "S": { shift: 7 }, "I": { shift: 2 } }


const END = require("../../symbols").END;


  // Build an LR automaton for the grammar, using the provided "build" functions.

  function automaton(grammar, build) {

    var states = [ { kernel: build.initial() } ];

    var state;
    var l;
    var s = 0;

    var transitions, symbol, kernel;
    var i;

    // While no more states have been added... (outer loop)

    while (s < states.length) {

      // Process existing states... (inner loop)

      for (l = states.length; s < l; s++) {

        state = states[s];

        // Find the closure of the state's kernel

        state.items = build.closure(grammar, state.kernel);

        // Find the transitions out of the state (a map from symbol to kernel)

        transitions = build.transitions(grammar, state.items);

        // Build the state's list of transitions...

        state.transitions = {};

        for (symbol in transitions) {

          // Given a symbol and kernel in the transition map, find out if we've
          // already added the kernel as a state. If we have, assign that state's
          // index to the transition table for the symbol. If not, create a
          // new state.

          var kernel = transitions[symbol];

          for (i = 0; i < states.length; i++) {

            if (build.same(states[i].kernel, kernel)) {
              state.transitions[symbol] = i;
              break;
            }

          }

          if (i === states.length) {

            state.transitions[symbol] = states.length;
            states.push({ kernel: kernel });

          }

        }

      }

    }

    return states;

  }

  // lr0 and lr1 objects define the "build" functions for forming LR automata.

  var lr0 = {

    // What is the initial item?

    initial: function() {

      // production is an index into the grammar's list of productions,
      // index is the distinguished position in that production,
      // -1 is the production added by augmenting the grammar.

      return [ { production: -1, index: 0 } ];

    },

    // Given an item's kernel, find its epsilon closure of items.

    closure: function(grammar, kernel) {

      var i, j;
      var item, symbol;
      var start = grammar.calculate("grammar.start");

      // Which items were added?

      var added;

      // Which productions have been used?

      var used = {};

      // Copy the kernel as the initial list of items

      var result = [];

      for (i = 0; i < kernel.length; i++)
        result.push({ production: kernel[i].production, index: kernel[i].index });

      // While we cannot add more items...

      do {

        added = [];

        // For each item we have...

        for (i = 0; i < result.length; i++) {

          // Find the nonterminal symbol...

          item = result[i];

          // If the production is the augmented start production, we're looking
          // for the original start symbol. Otherwise, use the grammar's productions
          // to find the symbol, but add one to account for the left-hand side of
          // the production.

          if (item.production === -1)
            symbol = [start][item.index];
          else
            symbol = grammar.productions[item.production][item.index + 1];

          // Find unused matching productions and add them.

          for (j = 0; j < grammar.productions.length; j++) {

            if (!used[j] && grammar.productions[j][0] == symbol) {
              added.push({ production: j, index: 0 });
              used[j] = true;
            }

          }

        }

        for (i = 0; i < added.length; i++)
          result.push(added[i]);

      } while (added.length > 0);

      return result;

    },

    // For the given list of (closure) items, return a map from symbol to kernel
    // representing the transitions that can be taken out of the
    // corresponding state.

    transitions: function(grammar, closure) {

      var result = {};
      var i;
      var item, symbol;
      var start = grammar.calculate("grammar.start");

      // For each item...

      for (i = 0; i < closure.length; i++) {

        item = closure[i];

        // Calculate the leaving symbol by looking in the grammar's productions,
        // handling the augmented grammar production as above.

        if (item.production === -1)
          symbol = [start][item.index];
        else
          symbol = grammar.productions[item.production][item.index + 1];

        // If there is a leaving symbol, add the next item.

        if (typeof symbol != "undefined") {

          if (!result[symbol])
            result[symbol] = [];

          result[symbol].push({ production: item.production, index: item.index + 1 });

        }

      }

      return result;

    },

    // Are the two kernels equal?

    same: function(a, b) {

      var i, j;

      if (a.length !== b.length)
        return false;

      for (i = 0; i < a.length; i++) {

        for (j = 0; j < b.length; j++) {

          if (a[i].production === b[j].production && a[i].index === b[j].index)
            break;

        }

        if (j === b.length)
          return false;

      }

      return true;

    }

  }

  var lr1 = {

    initial: function() {

      return [ { production: -1, index: 0, lookahead: END } ];

    },

    closure: function(grammar, kernel) {

      var i, j, k, l;
      var item, remaining, symbol, lookaheads;
      var start = grammar.calculate("grammar.start");

      // Which items were added in a given iteration?

      var added;

      // Which productions/lookaheads have we already used for the closure?

      var used = {};

      for (i = 0; i < grammar.productions.length; i++)
        used[i] = {};

      // Copy the kernel as the initial list of items

      var result = [];

      for (i = 0; i < kernel.length; i++)
        result.push({ production: kernel[i].production, index: kernel[i].index, lookahead: kernel[i].lookahead });

      // While we cannot add more items...

      do {

        added = [];

        // For each item we have...

        for (i = 0; i < result.length; i++) {

          item = result[i];

          // Find the nonterminal symbol...

          // Find the stuff "after the dot" (taking into account the augmented grammar)

          if (item.production === -1)
            remaining = [start].slice(item.index);
          else
            remaining = grammar.productions[item.production].slice(item.index + 1);

          // Go to next item if this one is completed

          if (remaining.length == 0)
            continue;

          // the nonterminal symbol is the first thing after the dot

          symbol = remaining[0];

          // lookaheads
          // first(gamma a) where the item is [A -> alpha . B gamma, a]

          lookaheads = grammar.getFirst(remaining.slice(1).concat(item.lookahead));

          // Add items for matching productions/lookaheads (which are not already
          // used for the closure)

          for (j = 0; j < grammar.productions.length; j++) {

            if (grammar.productions[j][0] == symbol) {

              // Add an item for every lookahead...

              for (l in lookaheads) {

                if (!used[j][l]) {
                  added.push({ production: j, index: 0, lookahead: l });
                  used[j][l] = true;
                }

              }

            }

          }

        }

        for (i = 0; i < added.length; i++)
          result.push(added[i]);

      } while (added.length > 0);

      return result;

    },

    // this is basically identical to the LR0 version...
    // could have a "copy" function for items?

    transitions: function(grammar, closure) {

      var result = {};
      var i;
      var item, symbol;
      var start = grammar.calculate("grammar.start");

      // For each item...

      for (i = 0; i < closure.length; i++) {

        item = closure[i];

        // Calculate the leaving symbol by looking in the grammar's productions,
        // handling the augmented grammar production as above.

        if (item.production === -1)
          symbol = [start][item.index];
        else
          symbol = grammar.productions[item.production][item.index + 1];

        // If there is a leaving symbol, add the next item.

        if (typeof symbol != "undefined") {

          if (!result[symbol])
            result[symbol] = [];

          // copy it!

          result[symbol].push({ production: item.production, index: item.index + 1, lookahead: item.lookahead });

        }

      }

      return result;

    },

    same: function(a, b) {

      var i, j;

      if (a.length !== b.length)
        return false;

      for (i = 0; i < a.length; i++) {

        for (j = 0; j < b.length; j++) {

          if (a[i].production === b[j].production && a[i].index === b[j].index && a[i].lookahead === b[j].lookahead)
            break;

        }

        if (j === b.length)
          return false;

      }

      return true;

    }

  }

  module.exports["parsing.lr.lr0_classification"] = function(grammar) {

    var i, s;
    var table = grammar.calculate("parsing.lr.lr0_table");
    var terminals = grammar.calculate("grammar.terminals");

    for (i = 0; i < table.length; i++) {

      if (table[i].reduce.length > 1)
        return { member: false, reason: "it contains a reduce-reduce conflict" };

      if (table[i].reduce.length > 0) {
        for (s in table[i].shift) {
          if (terminals[s])
            return { member: false, reason: "it contains a shift-reduce conflict" };
        }
      }

    }

    return { member: true };

  }

  module.exports["parsing.lr.lr0_automaton"] = function(grammar) {

    return automaton(grammar, lr0);

  }

  module.exports["parsing.lr.lr0_table"] = function(grammar) {

    var i, j, s;
    var state, item, actions;
    var table = [];
    var automaton = grammar.calculate("parsing.lr.lr0_automaton");

    for (i = 0; i < automaton.length; i++) {

      state = automaton[i];
      actions = { shift: {}, reduce: [] };

      // add shift actions for transitions

      for (s in state.transitions)
        actions.shift[s] = state.transitions[s];

      // add reduce actions for completed items

      for (j = 0; j < state.items.length; j++) {

        item = state.items[j];

        if (item.production === -1) {
          if (item.index === 1)
            actions.reduce.push(item.production);
        } else {
          if (item.index == grammar.productions[item.production].length - 1)
            actions.reduce.push(item.production);
        }

      }

      table.push(actions);

    }

    return table;

  }

  function classifyLR1(table) {

    var i, s;

    for (i = 0; i < table.length; i++) {

      for (s in table[i]) {

        if (typeof table[i][s].reduce !== "undefined" && table[i][s].reduce.length > 1)
          return { member: false, reason: "it contains a reduce-reduce conflict" };

        if (typeof table[i][s].shift !== "undefined" && typeof table[i][s].reduce !== "undefined" && table[i][s].reduce.length > 0)
          return { member: false, reason: "it contains a shift-reduce conflict" };

      }

    }

    return { member: true };

  }

  function addReduceAction(actions, symbol, production) {

    if (typeof actions[symbol] === "undefined")
      actions[symbol] = { reduce: [] };

    if (typeof actions[symbol].reduce === "undefined")
      actions[symbol].reduce = [];

    actions[symbol].reduce.push(production);

  }

  module.exports["parsing.lr.slr1_classification"] = function(grammar) {

    return classifyLR1(grammar.calculate("parsing.lr.slr1_table"));

  }

  module.exports["parsing.lr.slr1_table"] = function(grammar) {

    var i, j, s;
    var state, actions, item;
    var table = [];
    var automaton = grammar.calculate("parsing.lr.lr0_automaton");
    var follow = grammar.calculate("grammar.follow");

    for (i = 0; i < automaton.length; i++) {

      state = automaton[i];
      actions = {};

      for (s in state.transitions)
        actions[s] = { shift: state.transitions[s] };

      for (j = 0; j < state.items.length; j++) {

        item = state.items[j];

        if (item.production === -1) {

          if (item.index === 1)
            addReduceAction(actions, END, item.production);

        } else {

          if (item.index == grammar.productions[item.production].length - 1) {

            for (s in follow[grammar.productions[item.production][0]])
              addReduceAction(actions, s, item.production);

          }

        }

      }

      table.push(actions);

    }

    return table;

  }

  module.exports["parsing.lr.lr1_automaton"] = function(grammar) {

    return automaton(grammar, lr1);

  }

  module.exports["parsing.lr.lr1_classification"] = function(grammar) {

    return classifyLR1(grammar.calculate("parsing.lr.lr1_table"));

  }

  module.exports["parsing.lr.lr1_table"] = function(grammar) {

    var i, j, s;
    var state, actions, item;
    var table = [];
    var automaton = grammar.calculate("parsing.lr.lr1_automaton");

    for (i = 0; i < automaton.length; i++) {

      state = automaton[i];
      actions = {};

      for (s in state.transitions)
        actions[s] = { shift: state.transitions[s] };

      for (j = 0; j < state.items.length; j++) {

        item = state.items[j];

        if (item.production === -1) {

          if (item.index === 1)
            addReduceAction(actions, END, item.production);

        } else {

          if (item.index == grammar.productions[item.production].length - 1)
            addReduceAction(actions, item.lookahead, item.production);

        }

      }

      table.push(actions);

    }

    return table;

  }

  // Collapse a list of LR1 items' lookaheads so that distinct
  // items' lookaheads are arrays.

  function collapseLookaheads(items) {

    var i, p, x, l;
    var table = {};

    for (i = 0; i < items.length; i++) {

      p = items[i].production;
      x = items[i].index;
      l = items[i].lookahead;

      if (!table[p])
        table[p] = [];

      if (!table[p][x])
        table[p][x] = [];

      table[p][x].push(l);

    }

    var result = [];

    for (p in table)
      for (x in table[p])
        result.push({ production: parseInt(p), index: parseInt(x), lookaheads: table[p][x] });

    return result;

  }

  // Return the union of the items in two LALR1 states.
  // For each item in the first state, add lookaheads from the second state's corresponding items.

  function mergeItems(a, b) {

    var result = [];
    var item;
    var i, j, k;

    for (i = 0; i < a.length; i++) {

      item = { production: a[i].production, index: a[i].index, lookaheads: [] };

      // Add lookaheads from a

      for (j = 0; j < a[i].lookaheads.length; j++)
        item.lookaheads.push(a[i].lookaheads[j]);

      // Find matching items in b and add their lookaheads if they aren't already present

      for (j = 0; j < b.length; j++) {

        if (b[j].production == a[i].production && b[j].index == a[i].index) {

          for (k = 0; k < b[j].lookaheads.length; k++) {
            if (item.lookaheads.indexOf(b[j].lookaheads[k]) === -1)
              item.lookaheads.push(b[j].lookaheads[k]);
          }

        }

      }

      result.push(item);

    }

    return result;

  }

  module.exports["parsing.lr.lalr1_classification"] = function(grammar) {

    return classifyLR1(grammar.calculate("parsing.lr.lalr1_table"));

  }

  module.exports["parsing.lr.lalr1_automaton"] = function(grammar) {

    var i, j;

    // Get the LR1 automaton.

    var automaton = grammar.calculate("parsing.lr.lr1_automaton");

    // Collapse lookaheads.

    for (i = 0; i < automaton.length; i++) {

      automaton[i].kernel = collapseLookaheads(automaton[i].kernel);
      automaton[i].items = collapseLookaheads(automaton[i].items);

    }

    // Find states to merge.
    //
    // Produce a list like this:
    //
    //   merge = [[0], [1, 2], [3, 5], [4]]
    //
    // where merge[i] is a list of indices in the dfa that can be merged.
    //
    // states can be merged if they have the same items, not considering lookaheads.

    var used = [];
    var merge = [];

    for (i = 0; i < automaton.length; i++) {

      // If this state has been used already for merging, skip it.

      if (used[i])
        continue;

      // Otherwise, find the states (including the current state) which can be merged with it.

      var m = [];

      for (j = 0; j < automaton.length; j++) {

        if (!used[j] && lr0.same(automaton[i].kernel, automaton[j].kernel)) {

          m.push(j);
          used[j] = true;

        }

      }

      merge.push(m);

    }

    // for fixing transitions. looks like:
    //
    //   transition = [0, 1, 1, 3, 4, 3]
    //
    // where transition[i] is the new index for the original state i.

    var transition = [];

    for (i = 0; i < merge.length; i++) {
      for (j = 0; j < merge[i].length; j++) {

        transition[merge[i][j]] = i;

      }
    }

    // Produce new states

    var states = [];

    for (i = 0; i < merge.length; i++) {

      var state = { kernel: [], items: [], transitions: {} };

      // Merge items

      for (j = 0; j < merge[i].length; j++) {

        state.kernel = mergeItems(automaton[merge[i][j]].kernel, state.kernel);
        state.items = mergeItems(automaton[merge[i][j]].items, state.items);

      }

      // Add transitions (just use the first merge index)

      var original = automaton[merge[i][0]].transitions;
      var s;

      for (s in original)
        state.transitions[s] = transition[original[s]];

      // Add the new state

      states.push(state);

    }

    return states;

  }

  module.exports["parsing.lr.lalr1_table"] = function(grammar) {

    var i, j, k, s;
    var state, actions, item;
    var table = [];
    var automaton = grammar.calculate("parsing.lr.lalr1_automaton");

    for (i = 0; i < automaton.length; i++) {

      state = automaton[i];
      actions = {};

      for (s in state.transitions)
        actions[s] = { shift: state.transitions[s] };

      for (j = 0; j < state.items.length; j++) {

        item = state.items[j];

        if (item.production === -1) {

          if (item.index === 1)
            addReduceAction(actions, END, item.production);

        } else {

          if (item.index == grammar.productions[item.production].length - 1) {

            for (k = 0; k < item.lookaheads.length; k++)
              addReduceAction(actions, item.lookaheads[k], item.production);

          }

        }

      }

      table.push(actions);

    }

    return table;

  }



},{"../../symbols":14}],9:[function(require,module,exports){



  function expand(grammar, production, symbol) {

    var changes = [];

    // Remove the existing production

    changes.push({ operation: "delete", index: production });

    // Add new productions

    var offset = 0;

    for (i = 0; i < grammar.productions.length; i++) {

      if (grammar.productions[i][0] === grammar.productions[production][symbol]) {

        var p = grammar.productions[production].slice();
        var b = grammar.productions[i].slice(1);
        Array.prototype.splice.apply(p, [symbol, 1].concat(b));

        changes.push({ production: p, operation: "insert", index: production + offset });
        offset++;

      }

    }

    return changes;

  }

  module.exports["transformations.expand"] = function(grammar) {

    var i, j;

    var nonterminals = grammar.calculate("grammar.nonterminals");
    var result = [];

    // Are there any nonterminals we can expand?

    for (i = 0; i < grammar.productions.length; i++) {
      for (j = 1; j < grammar.productions[i].length; j++) {

        if (nonterminals[grammar.productions[i][j]]) {

          result.push({
            name: "expand",
            production: i,
            symbol: j,
            changes: expand(grammar, i, j)
          });

        }

      }
    }

    return result;

  }

  function removeImmediateLeftRecursion(grammar, base, recursive) {

    var i, j;
    var nonterminals = grammar.calculate("grammar.nonterminals");

    // Find a new symbol for the right recursive production by adding primes
    // to the existing symbol.

    var symbol = grammar.productions[recursive[0]][0];

    do {
      symbol += "'";
    } while (typeof nonterminals[symbol] !== "undefined");

    // Copy productions to changes, marking those we're removing.

    var changes = [];
    var first;
    var offset = 0;

    for (i = 0; i < grammar.productions.length; i++) {

      if (base.indexOf(i) !== -1 || recursive.indexOf(i) !== -1) {

        changes.push({ index: i + offset, operation: "delete" });
        offset--;

        if (typeof first === "undefined")
          first = i;
      }

    }

    // Create the new productions...

    var offset = 0;

    // Base rules

    var added = [];

    for (i = 0; i < base.length; i++) {

      var production = [];

      for (j = 0; j < grammar.productions[base[i]].length; j++)
        production.push(grammar.productions[base[i]][j]);

      production.push(symbol);

      changes.push({ production: production, operation: "insert", index: first + offset });
      offset++;

    }

    // Recursive rules

    for (i = 0; i < recursive.length; i++) {

      var production = [];

      production.push(symbol);

      for (j = 2; j < grammar.productions[recursive[i]].length; j++)
        production.push(grammar.productions[recursive[i]][j]);

      production.push(symbol);

      changes.push({ production: production, operation: "insert", index: first + offset });
      offset++;

    }

    // Epsilon

    changes.push({ production: [symbol], operation: "insert", index: first + offset });

    return changes;

  }

  module.exports["transformations.removeImmediateLeftRecursion"] = function(grammar) {

    var i, j;

    var nonterminals = grammar.calculate("grammar.nonterminals");
    var result = [];

    var candidates = {};
    var nt;

    // Are there any rules of this form...
    //
    //   A -> A a_1 | A a_2 | ... | A a_m | b_1 | ... | b_n
    //
    // where m, n > 0?

    for (nt in nonterminals)
      candidates[nt] = { recursive: [], base: [] };

    for (i = 0; i < grammar.productions.length; i++) {
      nt = grammar.productions[i][0];

      if (nt == grammar.productions[i][1])
        candidates[nt].recursive.push(i);
      else
        candidates[nt].base.push(i);
    }

    for (nt in candidates) {

      if (candidates[nt].recursive.length > 0 && candidates[nt].base.length > 0) {

        result.push({
          name: "removeImmediateLeftRecursion",
          production: candidates[nt].recursive[0],
          symbol: 0,
          changes: removeImmediateLeftRecursion(grammar, candidates[nt].base, candidates[nt].recursive)
        });

      }

    }

    return result;

  }

  // Perform the left-factoring transformation. Group is an array of production
  // indices, and prefix is the number of symbols (not counting the head of
  // the production) to factor.

  function leftFactor(grammar, group, prefix) {

    var i, j;
    var nonterminals = grammar.calculate("grammar.nonterminals");

    // Find a new symbol...

    var symbol = grammar.productions[group[0]][0];

    do {
      symbol += "'";
    } while (typeof nonterminals[symbol] !== "undefined");

    // Copy productions to changes, marking those we're removing.

    var changes = [];
    var offset = 0;

    for (i = 0; i < grammar.productions.length; i++) {

      if (group.indexOf(i) !== -1) {
        changes.push({ index: i + offset, operation: "delete" });
        offset--;
      }

    }

    // Add the reference to the new symbol with the factored prefix

    changes.push({
      production: grammar.productions[group[0]].slice(0, prefix + 1).concat(symbol),
      operation: "insert",
      index: group[0]
    });

    // Add the productions in the group

    for (i = 0; i < group.length; i++) {
      changes.push({
        production: [symbol].concat(grammar.productions[group[i]].slice(prefix + 1)),
        operation: "insert",
        index: group[0] + i + 1
      });
    }

    return changes;

  }

  // Mini trie implementation for finding factorable prefixes.

  function Trie() {

    this.root = {
      children: {},
      values: []
    };

  }

  Trie.prototype.insert = function(production, value) {

    var node = this.root;
    var i, s;

    for (i = 0; i < production.length; i++) {
      s = production[i];
      if (typeof node.children[s] === "undefined")
        node.children[s] = { children: {}, values: [] };
      node = node.children[s];
    }

    node.values.push(value);

  }

  Trie.prototype.getFactorablePrefixes = function() {

    var groups = [];

    function _values(length, node) {

      var symbol;
      var values = [];

      values = values.concat(node.values);

      for (symbol in node.children)
        values = values.concat(_values(length + 1, node.children[symbol]));

      if (length > 0 && values.length >= 2)
        groups.push({ length: length, group: values });

      return values;

    }

    _values(0, this.root);

    return groups;

  }

  module.exports["transformations.leftFactor"] = function(grammar) {

    var i, j;
    var result = [];
    var nt;
    var prefix;

    // Build tries for each nonterminal's productions

    var productions = {};

    for (i = 0; i < grammar.productions.length; i++) {

      nt = grammar.productions[i][0];

      if (typeof productions[nt] === "undefined")
        productions[nt] = new Trie();

      productions[nt].insert(grammar.productions[i].slice(1), i);

    }

    // Get factorable prefixes and their corresponding productions

    var factorable;

    for (nt in productions) {

      factorable = productions[nt].getFactorablePrefixes();

      for (i = 0; i < factorable.length; i++) {

        var length = factorable[i].length;
        var group = factorable[i].group;
        group.sort();

        result.push({
          name: "leftFactor",
          production: group[0],
          symbol: 0,
          length: length,
          changes: leftFactor(grammar, group, length)
        });

      }

    }

    return result;

  }

  function epsilonSeparate(grammar, group, epsilon) {

    var i;
    var nonterminals = grammar.calculate("grammar.nonterminals");

    // Find a new symbol...

    var symbol = grammar.productions[group[0]][0];

    do {
      symbol += "*";
    } while (typeof nonterminals[symbol] !== "undefined");

    // Copy productions to changes, marking those we're removing.

    var changes = [];
    var offset = 0;

    for (i = 0; i < grammar.productions.length; i++) {

      if (group.indexOf(i) !== -1 || i === epsilon) {
        changes.push({ index: i + offset, operation: "delete" });
        offset--;
      }

    }

    // Add the separated version of the original rule

    changes.push({
      production: [grammar.productions[group[0]][0], symbol],
      operation: "insert",
      index: group[0]
    });

    changes.push({
      production: [grammar.productions[group[0]][0]],
      operation: "insert",
      index: group[0] + 1
    });

    // Add the non-epsilon production bodies with the new head

    for (i = 0; i < group.length; i++) {
      changes.push({
        production: [symbol].concat(grammar.productions[group[i]].slice(1)),
        operation: "insert",
        index: group[0] + i + 2
      });
    }

    return changes;

  }

  module.exports["transformations.epsilonSeparate"] = function(grammar) {

    var nt, i;
    var nonterminals = grammar.calculate("grammar.nonterminals");
    var nullable = grammar.calculate("grammar.nullable");
    var result = [];
    var group;
    var epsilon;

    // For each nonterminal, determine if it is unambiguously nullable,
    // while collecting its non-null productions and its null (epsilon)
    // production. If it is unambiguously nullable, add it to the result.

    for (nt in nonterminals) {

      group = [];
      epsilon = -1;

      for (i = 0; i < grammar.productions.length; i++) {

        if (grammar.productions[i][0] === nt) {

          if (grammar.productions[i].length === 1) {
            if (epsilon !== -1)
              break;
            epsilon = i;
          } else {
            group.push(i);
          }

        }

      }

      if (i === grammar.productions.length && epsilon !== -1) {

        result.push({
          name: "epsilonSeparate",
          production: group[0],
          symbol: 0,
          changes: epsilonSeparate(grammar, group, epsilon)
        });

      }

    }

    return result;

  }

  function removeUnreachable(grammar, group) {

    var i;

    var changes = [];
    var offset = 0;

    // Remove all productions in the group.

    for (i = 0; i < grammar.productions.length; i++) {

      if (group.indexOf(i) !== -1) {
        changes.push({ index: i + offset, operation: "delete" });
        offset--;
      }

    }

    return changes;

  }

  module.exports["transformations.removeUnreachable"] = function(grammar) {

    var unreachable = grammar.calculate("grammar.unreachable");
    var nt;
    var i;
    var result = [];
    var group;

    for (nt in unreachable) {

      group = [];

      for (i = 0; i < grammar.productions.length; i++) {

        if (grammar.productions[i][0] === nt)
          group.push(i);

      }

      if (group.length > 0) {

        result.push({
          name: "removeUnreachable",
          production: group[0],
          symbol: 0,
          changes: removeUnreachable(grammar, group)
        });

      }

    }

    return result;

  }

  module.exports["transformations"] = function(grammar) {

    return [].concat(grammar.calculate("transformations.expand"))
             .concat(grammar.calculate("transformations.removeImmediateLeftRecursion"))
             .concat(grammar.calculate("transformations.leftFactor"))
             .concat(grammar.calculate("transformations.epsilonSeparate"))
             .concat(grammar.calculate("transformations.removeUnreachable"));

  }



},{}],10:[function(require,module,exports){
const Calculations = require("./calculations");
const Parser = require("./parser");
const END = require("./symbols").END;


  // class

  function parse(spec) {

    var i, j;

    if (spec.match(/^\s*$/))
      return { spec: spec };

    try {

      // Parser gives us rules in the following form:
      //
      //   { nt: "A", p: [["a", "b"], []] }
      //
      // We want an array of productions in this form:
      //
      //   [["A", "a", "b"], ["A"]]
      //
      // Note that depending on the grammar specification, productions
      // for a particular nonterminal may be at different places in the
      // list. We want to preserve the order in the user's input.

      var rules = Parser.parse(spec);
      var productions = [];

      for (i = 0; i < rules.length; i++) {
        for (j = 0; j < rules[i].p.length; j++) {
          productions.push([rules[i].nt].concat(rules[i].p[j]));
        }
      }

      return { grammar: new klass(productions), spec: spec };

    } catch (e) {

      return { error: e, spec: spec };

    }

  }



  // instance

  function initialize(productions) {

    // Check for reserved and empty symbols

    var i, j;

    for (i = 0; i < productions.length; i++) {
      for (j = 0; j < productions[i].length; j++) {

        if (productions[i][j].match(/^Grammar\./))
          throw "Reserved symbol " + productions[i][j] + " may not be part of a production";

        if (productions[i][j] === "")
          throw "An empty symbol may not be part of a production";

      }
    }

    // Assign productions

    this.productions = productions;

    // Initialize calculations memoization

    this.calculations = {};

  }

  function calculate(name) {

    if (typeof Calculations[name] === "undefined")
      throw "Undefined grammar calculation " + name;

    if (typeof this.calculations[name] === "undefined")
      this.calculations[name] = Calculations[name](this);

    return this.calculations[name];

  }

  function transform(transformation) {

    var productions = this.productions.slice();

    transformation.changes.forEach(function(change) {

      if (change.operation === "delete")
        productions.splice(change.index, 1);
      else if (change.operation === "insert")
        productions.splice(change.index, 0, change.production);

    });

    return new Grammar(productions);

  }

  function getFirst(symbols) {

    var i, k;
    var s, t;
    var result;

    var first = this.calculate("grammar.first");
    var nullable = this.calculate("grammar.nullable");
    var terminals = this.calculate("grammar.terminals");
    var nonterminals = this.calculate("grammar.nonterminals");

    result = {};

    for (i = 0; i < symbols.length; i++) {

      s = symbols[i];

      if (s === END) {

        result[s] = true;
        break;

      } else if (terminals[s]) {

        result[s] = true;
        break;

      } else if (nonterminals[s]) {

        for (k in first[s])
          result[k] = true;

        if (!nullable[s])
          break;

      } else {

        throw "Unexpected symbol " + s;

      }

    }

    return result;

  }

  function isNullable(symbols) {

    var i;

    var nullable = this.calculate("grammar.nullable");
    var terminals = this.calculate("grammar.terminals");
    var nonterminals = this.calculate("grammar.nonterminals");

    for (i = 0; i < symbols.length; i++) {

      s = symbols[i];

      if (nonterminals[s]) {

        if (!nullable[s])
          return false;

      } else if (terminals[s]) {

        return false;

      } else {

        throw "Unexpected symbol " + s;

      }

    }

    return true;

  }

  function copyProductions() {

    var i, j;
    var result = [];

    for (i = 0; i < this.productions.length; i++) {
      result[i] = [];

      for (j = 0; j < this.productions[i].length; j++) {
        result[i][j] = this.productions[i][j];
      }
    }

    return result;

  }

  function toString() {

    var i, j;
    var result = "";

    for (i = 0; i < this.productions.length; i++) {

      result += this.productions[i][0];
      result += " ->";

      for (j = 1; j < this.productions[i].length; j++)
        result += " " + this.productions[i][j];

      result += " .\n";

    }

    return result;

  }

  // export

  var klass = initialize;

  klass.parse = parse;
  klass.END = END;

  klass.prototype.calculate = calculate;
  klass.prototype.transform = transform;
  klass.prototype.getFirst = getFirst;
  klass.prototype.isNullable = isNullable;
  klass.prototype.copyProductions = copyProductions;
  klass.prototype.toString = toString;

  module.exports = klass;



},{"./calculations":5,"./parser":11,"./symbols":14}],11:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,4],$V1=[6,11],$V2=[2,9],$V3=[1,10];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"spec":3,"rules":4,"rule":5,"STOP":6,"NAME":7,"ARROW":8,"productions":9,"tokens":10,"CHOICE":11,"$accept":0,"$end":1},
terminals_: {2:"error",6:"STOP",7:"NAME",8:"ARROW",11:"CHOICE"},
productions_: [0,[3,1],[3,0],[4,3],[4,2],[5,3],[9,1],[9,3],[10,2],[10,0]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return this.$ = $$[$0]; 
break;
case 2:
 return []; 
break;
case 3: case 7:
 this.$ = $$[$0]; $$[$0].unshift($$[$0-2]); 
break;
case 4:
 this.$ = [$$[$0-1]]; 
break;
case 5:
 this.$ = { nt: $$[$0-2], p: $$[$0] }; 
break;
case 6:
 this.$ = [$$[$0]]; 
break;
case 8:
 this.$ = $$[$0]; $$[$0].unshift($$[$0-1]); 
break;
case 9:
 this.$ = []; 
break;
}
},
table: [{1:[2,2],3:1,4:2,5:3,7:$V0},{1:[3]},{1:[2,1]},{6:[1,5]},{8:[1,6]},{1:[2,4],4:7,5:3,7:$V0},o($V1,$V2,{9:8,10:9,7:$V3}),{1:[2,3]},{6:[2,5]},{6:[2,6],11:[1,11]},o($V1,$V2,{10:12,7:$V3}),o($V1,$V2,{10:9,9:13,7:$V3}),o($V1,[2,8]),{6:[2,7]}],
defaultActions: {2:[2,1],7:[2,3],8:[2,5],13:[2,7]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0: this.begin("COMMENT"); 
break;
case 1: return "ARROW"; 
break;
case 2: return "CHOICE"; 
break;
case 3: return "STOP"; 
break;
case 4: 
break;
case 5: 
break;
case 6: this.begin("NAME"); name = yy_.yytext; 
break;
case 7: this.unput("->"); this.begin("INITIAL"); yy_.yytext = name; return "NAME"; 
break;
case 8: this.unput("|"); this.begin("INITIAL"); yy_.yytext = name; return "NAME"; 
break;
case 9: this.unput("."); this.begin("INITIAL"); yy_.yytext = name; return "NAME"; 
break;
case 10: yy_.yytext = name; return "NAME"; 
break;
case 11: this.begin("INITIAL"); yy_.yytext = name; return "NAME"; 
break;
case 12: name += yy_.yytext; 
break;
case 13: this.begin("INITIAL"); 
break;
case 14: 
break;
case 15: 
break;
}
},
rules: [/^(?:#)/,/^(?:->)/,/^(?:\|)/,/^(?:\.)/,/^(?:$)/,/^(?:[\s\n])/,/^(?:.)/,/^(?:->)/,/^(?:\|)/,/^(?:\.)/,/^(?:$)/,/^(?:[\s\n])/,/^(?:.)/,/^(?:[\n])/,/^(?:[\s])/,/^(?:.)/],
conditions: {"COMMENT":{"rules":[13,14,15],"inclusive":true},"NAME":{"rules":[7,8,9,10,11,12],"inclusive":true},"INITIAL":{"rules":[0,1,2,3,4,5,6],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this)}).call(this,require('_process'))
},{"_process":3,"fs":1,"path":2}],12:[function(require,module,exports){
var Relation = {

  create: function() {

    return {};

  },

  // Add to a relation.

  add: function(relation, s, t) {

    relation[s] = relation[s] || {};
    relation[s][t] = true;

  },

  // Given a relation, return its transitive closure as a new object.
  // (floyd-warshall)

  closure: function(relation) {

    var i, j, k;
    var result = {};
    var keys = {};

    // Copy the relation and build the set of keys

    for (i in relation) {
      keys[i] = true;

      for (j in relation[i]) {
        keys[j] = true;

        result[i] = result[i] || {};
        result[i][j] = relation[i][j];
      }
    }

    for (i in keys) {
      result[i] = result[i] || {};
    }

    // Perform transitive closure

    for (k in keys) {
      for (i in keys) {
        for (j in keys) {
          if (result[i][j] || (result[i][k] && result[k][j]))
            result[i][j] = true;
        }
      }
    }

    return result;

  },

  // Propagate the immediate relation using the (closure of the) propagation relation.

  propagate: function(immediate, propagation) {

    var k, l, s, t, u;

    var result = {};
    var closed = this.closure(propagation);

    for (k in immediate) {
      for (l in immediate[k]) {
        result[k] = result[k] || {};
        result[k][l] = immediate[k][l];
      }
    }

    for (s in closed) {
      for (t in closed[s]) {
        for (u in immediate[t]) {
          result[s] = result[s] || {};
          result[s][u] = immediate[t][u];
        }
      }
    }

    return result;

  },

  // If the graph of the relation has a cycle, return the first
  // cycle we find. Otherwise, return undefined.

  cycle: function(relation) {

    function dfs(k, v) {

      var w, l;

      for (l in relation[k]) {

        if (v.indexOf(l) != -1) {
          if (l == k)
            return v.concat(k);
          else
            return v.concat(k).concat(l);
        }

        if (w = dfs(l, v.concat(k)))
          return w;

      }

      return undefined;

    }

    var v, k;

    for (k in relation) {
      if (v = dfs(k, []))
        return v;
    }

    return undefined;

  }

};

module.exports = Relation;

},{}],13:[function(require,module,exports){
var Set = {

  count: function(set) {

    var n;
    var result = 0;

    for (n in set)
      result++;

    return result;

  },

  any: function(set) {

    var n;

    for (n in set)
      return true;

    return false;

  },

  intersection: function(a, b) {

    var result = {};
    var k;

    for (k in a) {
      if (b[k])
        result[k] = true;
    }

    return result;

  }

};

module.exports = Set;

},{}],14:[function(require,module,exports){
module.exports = {
  END: "Grammar.END"
};

},{}]},{},[10])(10)
});
