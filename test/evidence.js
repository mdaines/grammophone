/*  evidence.js, version 0.6
 *
 *  Copyright (c) 2009 Tobie Langel (http://tobielangel.com)
 *
 *  evidence.js is freely distributable under the terms of an MIT-style license.
 *--------------------------------------------------------------------------*/

(function(global) {
  var originalEvidence = global.Evidence,
      originalOnload   = global.onload;

  function Evidence() {
    TestCase.extend.apply(TestCase, arguments);
  }

  function noConflict() {
    global.Evidence = originalEvidence;
    return Evidence;
  }

  Evidence.noConflict = noConflict;
  Evidence.VERSION    = '0.6';

var FILE_REGEXP = /.*?\/(\w+\.html)(.*)/;

function getNameFromFile() {
  return (global.location || '').toString().replace(FILE_REGEXP, '$1');
}

function chain(subclass, superclass) {
  function Subclass() {}
  Subclass.prototype = superclass.prototype;
  subclass.prototype = new Subclass();
  subclass.prototype.constructor = subclass;
  return subclass;
}

function defer(block, context) {
  if ('setTimeout' in global) {
    global.setTimeout(function() {
      block.call(context);
    }, 0);
  } else {
    block.call(context);
  }
}
function AssertionSkippedError(message) {
  this.message = message;
}

AssertionSkippedError.displayName = 'AssertionSkippedError';

(function(p) {
  p.name = 'AssertionSkippedError';
})(AssertionSkippedError.prototype);
Evidence.AssertionSkippedError = AssertionSkippedError;
function AssertionFailedError(message, template, args) {
  this.message = message;
  this.template = template || '';
  this.args = args;
}

AssertionFailedError.displayName = 'AssertionFailedError';

(function(p) {
  p.name = 'AssertionFailedError';
})(AssertionFailedError.prototype);
Evidence.AssertionFailedError = AssertionFailedError;
function AssertionMessage(message, template, args) {
  this.message = message.replace(/%/g, '%%');
  this.template = template || '';
  this.args = args;
}

AssertionMessage.displayName = 'AssertionMessage';

(function(p) {
  function toString() {
    return UI.printf(this.message + this.template, this.args);
  }
  p.toString = toString;
})(AssertionMessage.prototype);
Evidence.AssertionMessage = AssertionMessage;

var Assertions = (function() {
  function _assertExpression(expression, message, template) {
    if (expression) {
      this.addAssertion();
    } else {
      var args = Array.prototype.slice.call(arguments, 3);
      throw new AssertionFailedError(message, template, args);
    }
  }

  function skip(message) {
    throw new AssertionSkippedError(message || 'Skipped!');
  }

  function fail(message) {
    this._assertExpression(false, message || 'Flunked!');
  }

  function assert(test, message) {
    this._assertExpression(
      !!test,
      message || 'Failed assertion.',
      'Expected %o to evaluate to true.', test
    );
  }

  function refute(test, message) {
    this._assertExpression(
      !test,
      message || 'Failed refutation.',
      'Expected %o to evaluate to false.', test
    );
  }

  function assertTrue(test, message) {
    this._assertExpression(
      (test === true),
      message || 'Failed assertion.',
      'Expected %o to be true.', test
    );
  }

  function refuteTrue(test, message) {
    this._assertExpression(
      (test !== true),
      message || 'Failed refutation.',
      'Expected %o to not be true.', test
    );
  }

  function assertNull(test, message) {
    this._assertExpression(
      (test === null),
      message || 'Failed assertion.',
      'Expected %o to be null.', test
    );
  }

  function refuteNull(test, message) {
    this._assertExpression(
      (test !== null),
      message || 'Failed refutation.',
      'Expected %o to not be null.', test
    );
  }

  function assertUndefined(test, message) {
    this._assertExpression(
      (typeof test === 'undefined'),
      message || 'Failed assertion.',
      'Expected %o to be undefined.', test
    );
  }

  function refuteUndefined(test, message) {
    this._assertExpression(
      (typeof test !== 'undefined'),
      message || 'Failed refutation.',
      'Expected %o to not be undefined.', test
    );
  }

  function assertFalse(test, message) {
    this._assertExpression(
      (test === false),
      message || 'Failed assertion.',
      'Expected %o to be false.', test
    );
  }

  function refuteFalse(test, message) {
    this._assertExpression(
      (test !== false),
      message || 'Failed refutation.',
      'Expected %o to not be false.', test
    );
  }

  function assertEqual(expected, actual, message) {
    this._assertExpression(
      (expected == actual),
      message || 'Failed assertion.',
      'Expected %o to be == to %o.', actual, expected
    );
  }

  function refuteEqual(expected, actual, message) {
    this._assertExpression(
      (expected != actual),
      message || 'Failed refutation.',
      'Expected %o to be != to %o.', actual, expected
    );
  }

  function assertIdentical(expected, actual, message) {
    this._assertExpression(
      (expected === actual),
      message || 'Failed assertion.',
      'Expected %o to be === to %o.', actual, expected
    );
  }

  function refuteIdentical(expected, actual, message) {
    this._assertExpression(
      (expected !== actual),
      message || 'Failed refutation.',
      'Expected %o to be !== to %o.', actual, expected
    );
  }

  function assertIn(property, object, message) {
    this._assertExpression(
      (property in object),
      message || 'Failed assertion.',
      'Expected "%s" to be a property of %o.', property, object
    );
  }

  function refuteIn(property, object, message) {
    this._assertExpression(
      !(property in object),
      message || 'Failed refutation.',
      'Expected "%s" to not be a property of %o.', property, object
    );
  }

  return {
    _assertExpression: _assertExpression,
    skip: skip,
    assert: assert,
    refute: refute,
    assertNot: refute,
    assertTrue: assertTrue,
    assertNull: assertNull,
    assertUndefined: assertUndefined,
    assertFalse: assertFalse,
    assertIdentical: assertIdentical,
    refuteIdentical: refuteIdentical,
    assertEqual: assertEqual,
    refuteEqual: refuteEqual,
    assertIn: assertIn,
    refuteIn: refuteIn,
    fail: fail,
    flunk: fail
  };
})();
  Evidence.Assertions = Assertions;
function TestCase(methodName) {
  this._methodName = methodName;
  this.name = methodName;
}

(function() {
  function extend(name, methods) {
    function TestCaseSubclass(methodName) {
      TestCase.call(this, methodName);
    }

    if (!methods) {
      methods = name;
      name = getNameFromFile();
    }

    chain(TestCaseSubclass, this);
    TestCaseSubclass.displayName = name;
    TestCaseSubclass.extend = extend;

    for(var prop in methods) {
      TestCaseSubclass.prototype[prop] = methods[prop];
    }
    TestCase.subclasses.push(TestCaseSubclass);
    return TestCaseSubclass;
  }

  function AssertionsMixin() {}
  AssertionsMixin.prototype = Assertions;
  TestCase.prototype = new AssertionsMixin();
  TestCase.constructor = TestCase;

  TestCase.displayName = 'TestCase';
  TestCase.extend      = extend;
  TestCase.subclasses  = [];
  TestCase.defaultTimeout = 10000;
})();

(function(p) {
  function run(result) {
    this._result = result;
    defer(this._run, this);
  }
  function _run() {
    try {
      if (this._nextAssertions) {
        this._result.restartTest(this);
        this._nextAssertions(this);
      } else {
        /*this._globalProperties = objectKeys(global);*/
        this._result.startTest(this);
        this.setUp(this);
        this[this._methodName](this);
      }
    } catch(e) {
      this._filterException(e);
    } finally {
      if (this._paused) {
        this._result.pauseTest(this);
      } else {
        try {
          this.tearDown(this);
        } catch(e) {
          this._filterException(e);
        } finally {
          this._nextAssertions = null;
          this._result.stopTest(this);
          this.parent.next();
        }
      }
    }
  }

  function _filterException(e) {
    var name = e.name;
    switch(name) {
      case 'AssertionFailedError':
        this._result.addFailure(this, e);
        break;
      case 'AssertionSkippedError':
        this._result.addSkip(this, e);
        break;
      default:
        this._result.addError(this, e);
    }
  }

  function pause(assertions) {
    this._paused = true;
    var self = this;
    if (assertions) { this._nextAssertions = assertions; }
    self._timeoutId = global.setTimeout(function() {
      self.resume(function() {
        self.fail('Test timed out. Testing was not resumed after being paused.');
      });
    }, TestCase.defaultTimeout);
  }

  function resume(assertions) {
    if (this._paused) { // avoid race conditions
      this._paused = false;
      global.clearTimeout(this._timeoutId);
      if (assertions) { this._nextAssertions = assertions; }
      this._run();
    }
  }

  function size() {
    return 1;
  }

  function toString() {
    return this.constructor.displayName + '#' + this.name;
  }

  function addAssertion() {
    this._result.addAssertion();
  }

  p.run              = run;
  p._run             = _run;
  p.addAssertion     = addAssertion;
  p._filterException = _filterException;
  p.pause            = pause;
  p.resume           = resume;
  p.size             = size;
  p.toString         = toString;
  p.setUp            = function() {};
  p.tearDown         = function() {};
})(TestCase.prototype);
  Evidence.TestCase = TestCase;
function TestSuite(name, tests) {
  this.name = name;
  this._tests = [];
  if (tests) {
    this.push.apply(this, tests);
  }
}

TestSuite.displayName = 'TestSuite';

(function(p) {
  function run(result) {
    this._index = 0;
    this._result = result;
    result.startSuite(this);
    this.next();
    return result;
  }

  function next() {
    var next = this._tests[this._index];
    if (next) {
      this._index++;
      next.run(this._result);
    } else {
      this._result.stopSuite(this);
      if (this.parent) {
        this.parent.next();
      } else {
        this._result.stop(new Date());
      }
    }
  }

  function push() {
    for (var i = 0, length = arguments.length; i < length; i++) {
      var test = arguments[i];
      test.parent = this;
      this._tests.push(test);
    }
  }

  function addTest(test) {
    test.parent = this;
    this._tests.push(test);
  }

  function addTests(tests) {
    for (var i = 0, length = tests.length; i < length; i++) {
      this.addTest(tests[i]);
    }
  }

  function size() {
    var tests  = this._tests,
        length = tests.length,
        sum    = 0;

    for (var i = 0; i < length; i++) {
      sum += tests[i].size();
    }
    return sum;
  }

  function isEmpty() {
    return this.size() === 0;
  }

  function toString() {
    return this.name;
  }
  p.run  = run;
  p.next = next;
  p.push = push;
  p.size = size;
  p.isEmpty = isEmpty;
  p.toString = toString;
})(TestSuite.prototype);
  Evidence.TestSuite = TestSuite;
function TestRunner() {
}

TestRunner.displayName = 'TestRunner';

(function(p) {
  function run(suite) {
    suite.parent = null;
    var result = this._makeResult();
    result.start(new Date());
    suite.run(result);
    return result;
  }

  function _makeResult() {
    return new TestResult();
  }

  p.run = run;
  p._makeResult = _makeResult;
})(TestRunner.prototype);
  Evidence.TestRunner = TestRunner;
function TestLoader() {
}

TestLoader.displayName = 'TestLoader';

(function(p) {
  function loadTestsFromTestCase(testcaseClass) {
    var suite = new TestSuite(testcaseClass.displayName),
        props = this.getTestCaseNames(testcaseClass);
    for (var i=0; i < props.length; i++) {
      suite.push(new testcaseClass(props[i]));
    }
    return suite;
  }

  function loadTestsFromTestCases(testcases) {
    var suite = new TestSuite(getNameFromFile());
    for (var i = 0; i < testcases.length; i++) {
      var testcase = testcases[i];
      var subSuite = defaultLoader.loadTestsFromTestCase(testcase);
      if (!subSuite.isEmpty()) { suite.push(subSuite); }
    }
    return suite;
  }

  function getTestCaseNames(testcaseClass) {
    var results = [],
        proto = testcaseClass.prototype,
        prefix = this.testMethodPrefix;

    for (var property in proto) {
      if (property.indexOf(prefix) === 0) {
        results.push(property);
      }
    }
    return results.sort();
  }

  function loadRegisteredTestCases() {
    return loadTestsFromTestCases(TestCase.subclasses);
  }

  p.loadTestsFromTestCase = loadTestsFromTestCase;
  p.loadRegisteredTestCases = loadRegisteredTestCases;
  p.loadTestsFromTestCases = loadTestsFromTestCases;
  p.testMethodPrefix = 'test';
  p.getTestCaseNames = getTestCaseNames;

})(TestLoader.prototype);
  Evidence.TestLoader = TestLoader;
function AutoRunner() {
  if (global.console && global.console.log) {
    this.logger = Logger;
  } else if (Object.prototype.toString.call(global.environment) === '[object Environment]' && global.print) {
    this.logger = CommandLineLogger;
  } else {
    this.logger = PopupLogger;
  }
  this.autoRun   = true;
  this.verbosity = Logger.INFO;
  this.runner    = ConsoleTestRunner;
}

(function() {
  function run(options) {
    var autoRunner = new this();
    options = options || autoRunner.retrieveOptions();
    autoRunner.processOptions(options);
    if (autoRunner.autoRun) { autoRunner.run() };
  }

  AutoRunner.run = run;
  AutoRunner.displayName = 'AutoRunner';
  AutoRunner.LOGGERS = {
    console:      Logger,
    popup:        PopupLogger,
    command_line: CommandLineLogger
  };

  AutoRunner.RUNNERS = {
    console: ConsoleTestRunner
  };
})();

(function(p) {
  function run() {
    var logger = new this.logger(this.verbosity),
        runner = new this.runner(logger),
        suite = defaultLoader.loadRegisteredTestCases();
    if (suite._tests.length <= 1) {
      suite = suite._tests[0];
    }
    return runner.run(suite);
  }

  function processQueryString(str) {
    var results = {};
    str = (str + '').match(/^(?:[^?#]*\?)([^#]+?)(?:#.*)?$/);
    str = str && str[1];

    if (!str) { return results; }

    var pairs = str.split('&'),
        length = pairs.length;
    if (!length) { return results; }

    for (var i = 0; i < length; i++) {
      var pair  = pairs[i].split('='),
          key   = decodeURIComponent(pair[0]),
          value = pair[1];
      value = value ? decodeURIComponent(value) : true;
      results[key] = value;
    }
    return results;
  }

  function processArguments(args) { // RHINO
    var results = {};

    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      if (arg.indexOf('-') === 0) {
        var value = args[i + 1];
        if (value && value.indexOf('-') !== 0) {
          i++;
        } else {
          value = true;
        }
        results[arg.substr(1)] = value;
      }
    }
    return results;
  }

  function retrieveOptions() {
    if (global.location) {
      return this.processQueryString(global.location);
    }
    if (global.arguments) {
      return this.processArguments(global.arguments);
    }
    return {};
  }

  function processOptions(options) {
    for(var key in options) {
      var value = options[key];
      switch(key) {
        case 'timeout':
          TestCase.defaultTimeout = global.parseFloat(value) * 1000;
          break;
        case 'run':
          this.autoRun = value === 'false' ? false : true;
          break;
        case 'logger':
          this.logger = AutoRunner.LOGGERS[value];
          break;
        case 'verbosity':
          var i = global.parseInt(value);
          this.verbosity = global.isNaN(i) ? Logger[value] : i;
          break;
        case 'runner':
          this.runner = AutoRunner.RUNNERS[value];
          break;
      }
    }
  }

  p.run = run;
  p.processQueryString = processQueryString;
  p.processArguments = processArguments;
  p.retrieveOptions = retrieveOptions;
  p.processOptions = processOptions;
})(AutoRunner.prototype);
  Evidence.AutoRunner = AutoRunner;
function TestResult() {
  this.testCount      = 0;
  this.assertionCount = 0;
  this.skipCount      = 0;
  this.skips          = [];
  this.failureCount   = 0;
  this.failures       = [];
  this.errors         = [];
  this.errorCount     = 0;
  this.testCount      = 0;
}

TestResult.displayName = 'TestResult';

(function(p) {
  function addAssertion() {
    this.assertionCount++;
  }

  function addSkip(testcase, reason) {
    this.skipCount++;
    this.skips.push(reason);
  }

  function addFailure(testcase, reason) {
    this.failureCount++;
    this.failures.push(reason);
  }

  function addError(testcase, error) {
    this.errorCount++;
    this.errors.push(error);
  }

  function startTest(testcase) {
    this.testCount++;
  }

  function stopTest(testcase) {}

  function pauseTest(testcase) {}

  function restartTest(testcase) {}

  function startSuite(suite) {}

  function stopSuite(suite) {}

  function start(t0) {
    this.t0 = t0;
  }

  function stop(t1) {
    this.t1 = t1;
  }

  function toString() {
    return this.testCount      + ' tests, ' +
           this.assertionCount + ' assertions, ' +
           this.failureCount   + ' failures, ' +
           this.errorCount     + ' errors, ' +
           this.skipCount      + ' skips';
  }

  p.addAssertion  = addAssertion;
  p.addSkip       = addSkip;
  p.addFailure    = addFailure;
  p.addError      = addError;
  p.startTest     = startTest;
  p.stopTest      = stopTest;
  p.pauseTest     = pauseTest;
  p.restartTest   = restartTest;
  p.startSuite    = startSuite;
  p.stopSuite     = stopSuite;
  p.start         = start;
  p.stop          = stop;
  p.toString      = toString;
})(TestResult.prototype);
  Evidence.TestResult = TestResult;
function TestResultTree(name) {
  this.testCount      = 0;
  this.assertionCount = 0;
  this.skipCount      = 0;
  this.skips          = [];
  this.failureCount   = 0;
  this.failures       = [];
  this.errors         = [];
  this.errorCount     = 0;
  this.testCount      = 0;
  this.name = name;
}

TestResultTree.displayName = 'TestResultTree';

(function(p) {
  function addAssertion() {
    var node = this.currentNode;
    do {
      node.assertionCount++;
    } while (node = node.parent);
  }

  function addSkip(testcase, reason) {
    var node = this.currentNode;
    do {
      node.skipCount++;
      node.skips.push(reason);
    } while (node = node.parent);
  }

  function addFailure(testcase, reason) {
    var node = this.currentNode;
    do {
      node.failureCount++;
      node.failures.push(reason);
    } while (node = node.parent);
  }

  function addError(testcase, error) {
    var node = this.currentNode;
    do {
      node.errorCount++;
      node.errors.push(error);
    } while (node = node.parent);
  }

  function startTest(testcase) {
    var node = this.createChildNode(testcase.name);
    do {
      node.testCount++;
    } while (node = node.parent);
  }

  function stopTest(testcase) {
    this.currentNode = this.currentNode.parent || this;
  }

  function pauseTest(testcase) {}

  function restartTest(testcase) {}

  function startSuite(suite) {
    this.createChildNode(suite.name);
  }

  function stopSuite(suite) {
    this.currentNode = this.currentNode.parent || this;
  }

  function start(t0) {
    this.t0 = t0;
    this.currentNode = this;
  }

  function stop(t1) {
    this.t1 = t1;
    this.currentNode = null;
  }

  function toString() {
    var results = '';
    if (this.children) {
      results += this.testCount;
      results += ' tests, ';
    }
    return results +
           this.assertionCount + ' assertions, ' +
           this.failureCount   + ' failures, ' +
           this.errorCount     + ' errors, ' +
           this.skipCount      + ' skips';
  }

  function createChildNode(name) {
    var node = new this.constructor(name);
    this.currentNode.appendChild(node);
    this.currentNode = node;
    return node;
  }

  function appendChild(child) {
    this.children = this.children || [];
    this.children.push(child);
    child.parent = this;
  }

  function toASCIITree(prefix) {
    var str     = '',
        results = this.toString(),
        name    = this.name || 'Test results',
        childLength = this.children && this.children.length,
        rest,
        max;

    prefix = prefix || '';
    max = 100 - results.length - prefix.length;
    max = Math.max(max, 0);

    if (name.length > max) {
      name = '...' + name.substr(name.length - max + 3);
    }

    rest = (max - name.length);
    str += name;
    str += ' ';
    for (var i = 0; i < rest; i++) { str += '_'; }
    str += ' ';
    str += results;

    if (this.errorCount > 0) {
      str += ' E';
    } else if (this.failureCount > 0) {
      str += ' F';
    } else if (this.skipCount > 0) {
      str += ' S';
    }

    str += '\n';

    if (childLength) {
      for (var i = 0; i < childLength; i++) {
        str += prefix;
        if (i == childLength - 1) { // last
          str += '\'-- ';
          str += this.children[i].toASCIITree(prefix + '    ');
          str += prefix;
          str += '\n';
        } else {
          str += '|-- ';
          str += this.children[i].toASCIITree(prefix + '|   ');
        }
      }
    }
    return str;
  }

  p.toASCIITree   = toASCIITree;
  p.createChildNode = createChildNode;
  p.appendChild   = appendChild;
  p.addAssertion  = addAssertion;
  p.addSkip       = addSkip;
  p.addFailure    = addFailure;
  p.addError      = addError;
  p.startTest     = startTest;
  p.stopTest      = stopTest;
  p.pauseTest     = pauseTest;
  p.restartTest   = restartTest;
  p.startSuite    = startSuite;
  p.stopSuite     = stopSuite;
  p.start         = start;
  p.stop          = stop;
  p.toString      = toString;
})(TestResultTree.prototype);
  Evidence.TestResultTree = TestResultTree;
var Console = {};

function Logger(level) {
  if (typeof level !== 'undefined') {
    this.level = level;
  }
}

Logger.displayName = 'Logger';
Logger.LEVELS = ['NOTSET', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL'];
Logger.CRITICAL = 5;
Logger.ERROR    = 4;
Logger.WARN     = 3;
Logger.INFO     = 2;
Logger.DEBUG    = 1;
Logger.NOTSET   = 0;

(function(p) {
  function critical(template, params) {
    this.log(Logger.CRITICAL, template, params);
  }

  function error(template, params) {
    this.log(Logger.ERROR, template, params);
  }

  function warn(template, params) {
    this.log(Logger.WARN, template, params);
  }

  function info(template, params) {
    this.log(Logger.INFO, template, params);
  }

  function debug(template, params) {
    this.log(Logger.DEBUG, template, params);
  }

  function log(level, template, params) {
    level = level || Logger.NOTSET;
    var c = global.console;

    var method = Logger.LEVELS[level].toLowerCase();
    if (method === 'critical') { method = 'error'; }
    method = (method in c) ? method : 'log';

    if (level >= this.level) {
      if (params) {
        params = params.slice(0);
        params.unshift(template);
        c[method].apply(c, params);
      } else {
        c[method](template);
      }
    }
  }

  p.log      = log;
  p.critical = critical;
  p.error    = error;
  p.warn     = warn;
  p.info     = info;
  p.debug    = debug;
  p.level    = 0;
})(Logger.prototype);
Console.Logger = Logger;
function PopupLogger(level) {
  Logger.call(this, level);
}

chain(PopupLogger, Logger);
PopupLogger.displayName = 'PopupLogger';

(function(p) {
  var BASIC_STYLES = 'color: #333; background-color: #fff; font-family: monospace; border-bottom: 1px solid #ccc;';
  var STYLES = {
    WARN:     'color: #000; background-color: #fc6;',
    ERROR:    'color: #f00; background-color: #fcc;',
    CRITICAL: 'color: #fff; background-color: #000;'
  };

  function _cleanup(html) {
    return html.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/[\n\r]+/, '<br />');
  }

  function _makePopup() {
    var popup = global.open('','popup','height=400,width=400');
    var doc = popup.document;
    doc.write('<!doctype html>\
               <html lang="en">\
                 <head>\
                   <meta charset="utf-8">\
                   <title>Console</title>\
                 </head>\
                 <body><div id="evidence_console"></div></body>\
               </html>');
    doc.close();
    popup.focus();
    return popup;
  }

  function _appendLine(level, msg) {
    this.popup = this.popup || this._makePopup();
    var levelName = Logger.LEVELS[level];

    var html = '<div style="';
    html += BASIC_STYLES;
    html += STYLES[levelName] || '';
    html += '">';
    if (level > Logger.INFO) {
      html += '<span style="font-weight: bold;">';
      html += levelName;
      html += ':</span> ';
    }
    html += _cleanup(msg);
    html += '</div>';
    var doc = this.popup.document,
        div = doc.createElement('div');
    div.innerHTML = html;
    html = div.firstChild;
    div = null;
    doc.getElementById('evidence_console').appendChild(html);
  }

  function log(level, msg, params) {
    level = level || Logger.NOTSET;
    if (level >= this.level) {
      if (params) {
        msg = UI.printf(msg, params);
      }
      this._appendLine(level, msg);
    }
  }

  p.log = log;
  p._makePopup = _makePopup;
  p._appendLine = _appendLine;
})(PopupLogger.prototype);
Console.PopupLogger = PopupLogger;
function CommandLineLogger(level) {
  Logger.call(this, level);
}

chain(CommandLineLogger, Logger);
CommandLineLogger.displayName = 'CommandLineLogger';

(function(p) {

  function log(level, msg, params) {
    level = level || Logger.NOTSET;
    if (level >= this.level) {
      var prefix = '';
      if (level > Logger.INFO) {
        prefix = Logger.LEVELS[level]+ ': ';
      }
      if (params) {
        msg = UI.printf(msg, params);
      }
      global.print(prefix + msg);
    }
  }

  p.log = log;
})(CommandLineLogger.prototype);
Console.CommandLineLogger = CommandLineLogger;
function ConsoleTestRunner(logger) {
  TestRunner.call(this);
  this.logger = logger;
}

chain(ConsoleTestRunner, TestRunner);
ConsoleTestRunner.displayName = 'ConsoleTestRunner';

(function(p) {
  function _makeResult() {
    return new ConsoleTestResult(this.logger);
  }

  p._makeResult = _makeResult;
})(ConsoleTestRunner.prototype);
Console.TestRunner = ConsoleTestRunner;
function ConsoleTestResult(logger) {
  TestResult.call(this);
  this.logger = logger;
}

chain(ConsoleTestResult, TestResult);
ConsoleTestResult.displayName = 'ConsoleTestResult';

(function(p) {
  var _super = TestResult.prototype;

  function addAssertion() {
    this.assertionCount++;
  }

  function addSkip(testcase, msg) {
    _super.addSkip.call(this, testcase, msg);
    this.logger.warn('Skipping testcase ' + testcase + ': ' + msg.message);
  }

  function addFailure(testcase, msg) {
    _super.addFailure.call(this, testcase, msg);
    this.logger.error(testcase + ': ' + msg.message + ' ' + msg.template, msg.args);
  }

  function addError(testcase, error) {
    _super.addError.call(this, testcase, error);
    this.logger.error(testcase + ' threw an error. ' + error);
  }

  function startTest(testcase) {
    _super.startTest.call(this, testcase);
    this.logger.debug('Started testcase ' + testcase + '.');
  }

  function stopTest(testcase) {
    this.logger.debug('Completed testcase ' + testcase + '.');
  }

  function pauseTest(testcase) {
    this.logger.info('Paused testcase ' + testcase + '.');
  }

  function restartTest(testcase) {
    this.logger.info('Restarted testcase ' + testcase + '.');
  }

  function startSuite(suite) {
    this.logger.info('Started suite ' + suite + '.');
  }

  function stopSuite(suite) {
    this.logger.info('Completed suite ' + suite + '.');
  }

  function start(t0) {
    _super.start.call(this, t0);
    this.logger.info('Started tests.');
  }

  function stop(t1) {
    _super.stop.call(this, t1);
    this.logger.info('Completed tests in ' + ((t1 - this.t0)/1000) + 's.');
    this.logger.info(this.toString() + '.');
  }

  p.addAssertion  = addAssertion;
  p.addSkip       = addSkip;
  p.addFailure    = addFailure;
  p.addError      = addError;
  p.startTest     = startTest;
  p.stopTest      = stopTest;
  p.pauseTest     = pauseTest;
  p.restartTest   = restartTest;
  p.startSuite    = startSuite;
  p.stopSuite     = stopSuite;
  p.start         = start;
  p.stop          = stop;
})(ConsoleTestResult.prototype);


Console.TestResult = ConsoleTestResult;
var Web = {};
function AbstractWidget(doc) {
  this.doc = doc || document;
}

AbstractWidget.displayName = 'Widget';

(function(p) {
  function escapeHTML(html) {
    return (html + '').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
  }

  function toElement() {
    return this.element;
  }

  function appendChild(child) {
    var element = child && child.toElement ? child.toElement() : child;
    this.element.appendChild(element);
    return child;
  }

  p.appendChild = appendChild;
  p.escapeHTML = escapeHTML;
  p.toElement = toElement;
})(AbstractWidget.prototype);
Web.AbstractWidget = AbstractWidget;
function LabelledText(label, doc) {
  AbstractWidget.call(this, doc)
  this.label = label;
  this.element = this.doc.createElement('p');
}

chain(LabelledText, AbstractWidget);
LabelledText.displayName = 'LabelledText';

(function(p) {
  function update(content) {
    content = this.escapeHTML(content);
    content = TEMPLATE.replace('{{ label }}', this.label).replace('{{ content }}', content);
    defer(function() { this.element.innerHTML = content; }, this);
    return this;
  }

  var TEMPLATE =  '<strong>{{ label }}:</strong> {{ content }}';

  p.update = update;
})(LabelledText.prototype);
Web.LabelledText = LabelledText;
function ProgressBar(width, doc) {
  this.width = width;
  this.level = 0;
  AbstractWidget.call(this, doc);
  this.build();
}

chain(ProgressBar, AbstractWidget);
ProgressBar.displayName = 'ProgressBar';

(function(p) {
  function build() {
    this.element = this.createDiv(this.width);
    this.element.id = 'evidence_progress_bar_container';
    this.progressBar = this.createDiv(0);
    this.progressBar.id = 'evidence_progress_bar';
    this.element.appendChild(this.progressBar);
    return this;
  }

  function createDiv(width) {
    var element = this.doc.createElement('div');
    element.style.width = width + 'px';
    return element;
  }

  function update(ratio) {
    var value = Math.floor(ratio * this.width);
    defer(function() {
      this.progressBar.style.width = value + 'px';
    }, this);
    return this;
  }

  function setLevel(level) {
    if (level > this.level) {
      this.level = level;
      this.progressBar.className = (Logger.LEVELS[level] || '').toLowerCase();
    }
    return this;
  }

  p.build = build;
  p.createDiv = createDiv;
  p.update = update;
  p.setLevel = setLevel;
})(ProgressBar.prototype);
Web.ProgressBar = ProgressBar;
function WebGUI(doc) {
  AbstractWidget.call(this, doc);
}

chain(WebGUI, AbstractWidget);
WebGUI.displayName = 'WebGUI';

(function(p) {
  function build() {
    this.element = this.doc.createElement('div');
    this.element.id = 'evidence';
    this.appendChild(new LabelledText('User agent string').update(global.navigator.userAgent))
    this.status      = this.appendChild(new LabelledText('Status').update('Idle.'));
    this.progressBar = this.appendChild(new ProgressBar(300));
    this.results     = this.appendChild(new LabelledText('Results'));
    return this;
  }


  function updateResults(txt) {
    txt = this.appendFullStop(txt);
    this.results.update(txt);
    return this;
  }

  function updateStatus(txt) {
    txt = this.appendFullStop(txt);
    this.status.update(txt);
    return this;
  }

  function updateProgressBar(ratio) {
    this.progressBar.update(ratio);
    return this;
  }

  function setLevel(level) {
    this.progressBar.setLevel(level);
    return this;
  }

  function appendFullStop(txt) {
    return (txt + '').replace(/\.?\s*$/, '.');
  }

  p.build = build;
  p.updateResults = updateResults;
  p.updateStatus = updateStatus;
  p.updateProgressBar = updateProgressBar;
  p.setLevel = setLevel;
  p.appendFullStop = appendFullStop;
})(WebGUI.prototype);
Web.GUI = WebGUI;
function WebTestRunner(logger) {
  TestRunner.call(this);
  this.logger = logger;
}

chain(WebTestRunner, TestRunner);
WebTestRunner.displayName = 'WebTestRunner';

(function(p) {
  function _makeResult() {
    return new WebTestResult();
  }

  p._makeResult = _makeResult;
})(WebTestRunner.prototype);
Web.TestRunner = WebTestRunner;
function WebTestResult(name) {
  TestResultTree.call(this, name);
}

chain(WebTestResult, TestResultTree);
WebTestResult.displayName = 'WebTestResult';

(function(p) {
  var _super = TestResultTree.prototype;

  function addAssertion() {
    _super.addAssertion.call(this);
    this.gui.updateResults(this);
  }

  function addSkip(testcase, msg) {
    _super.addSkip.call(this, testcase, msg);
    var gui = this.gui;
    gui.updateResults(this);
    gui.setLevel(Logger.WARN);
    gui.updateStatus('Skipping testcase ' + testcase + ': ' + msg.message);
  }

  function addFailure(testcase, msg) {
    _super.addFailure.call(this, testcase, msg);
    var gui = this.gui;
    gui.updateResults(this);
    gui.setLevel(Logger.ERROR);
    gui.updateStatus(testcase + ': ' + msg.message + ' ' + msg.template, msg.args);
  }

  function addError(testcase, error) {
    _super.addError.call(this, testcase, error);
    var gui = this.gui;
    gui.updateResults(this);
    gui.setLevel(Logger.ERROR);
    gui.updateStatus(testcase + ' threw an error. ' + error);
  }

  function startTest(testcase) {
    _super.startTest.call(this, testcase);
    this.gui.updateStatus('Started testcase ' + testcase);
  }

  function stopTest(testcase) {
    _super.stopTest.call(this, testcase);
    var gui = this.gui;
    gui.updateProgressBar(this.testCount / this.size);
    gui.updateStatus('Completed testcase ' + testcase);
  }

  function pauseTest(testcase) {
    this.gui.updateStatus('Paused testcase ' + testcase + '...');
  }

  function restartTest(testcase) {
    this.gui.updateStatus('Restarted testcase ' + testcase);
  }

  function startSuite(suite) {
    _super.startSuite.call(this, suite);
    if (!this.size) { this.size = suite.size(); }
    this.gui.updateStatus('Started suite ' + suite);
  }

  function stopSuite(suite) {
    _super.stopSuite.call(this, suite);
    this.gui.updateStatus('Completed suite ' + suite);
  }

  function start(t0) {
    _super.start.call(this, t0);
    var gui = new WebGUI(document);
    this.gui = gui;
    document.body.appendChild(gui.build().toElement());
    gui.updateResults(this);
  }

  function stop(t1) {
    _super.stop.call(this, t1);
    this.gui.updateStatus('Completed tests in ' + ((t1 - this.t0)/1000) + 's');
  }

  p.addAssertion  = addAssertion;
  p.addSkip       = addSkip;
  p.addFailure    = addFailure;
  p.addError      = addError;
  p.startTest     = startTest;
  p.stopTest      = stopTest;
  p.pauseTest     = pauseTest;
  p.restartTest   = restartTest;
  p.startSuite    = startSuite;
  p.stopSuite     = stopSuite;
  p.start         = start;
  p.stop          = stop;
})(WebTestResult.prototype);


Web.TestResult = WebTestResult;
var UI = (function() {
  function printf(template, args, inspector) {
    var parts = [],
        regexp = /(^%|.%)([a-zA-Z])/,
        args = args.splice(0); // clone args

    inspector = inspector || String;

    if (template.length <= 0) {
      return '';
    }
    while (m = regexp.exec(template)) {
      var match = m[0], index = m.index, type, arg;

      if (match.indexOf('%%') === 0) {
        parts.push(template.substr(0, index));
        parts.push(match.substr(1));
      } else {
        parts.push(template.substr(0, match.indexOf('%' === 0) ? index + 1 : index));
        type = m[2];
        arg = args.shift();
        arg = inspector(arg, type);
        parts.push(arg);
      }
      template = template.substr(index + match.length);
    }
    parts.push(template);
    return parts.join('');
  }

   return {
     printf: printf,
     Console: Console,
     Web: Web
   };
})();
  Evidence.UI = UI;

  var defaultLoader = new TestLoader();
  Evidence.defaultLoader = defaultLoader;

  global.Evidence = Evidence;

  if (global.location) {
    global.onload = function() {
      if (typeof originalOnload === 'function') {
        originalOnload.call(global);
      }
      AutoRunner.run();
    };
  } else if (global.arguments) {
    var runtime = java.lang.Runtime.getRuntime();
    var thread = new java.lang.Thread(function() {
      AutoRunner.run();
    });
    runtime.addShutdownHook(thread);
  }

})(this);