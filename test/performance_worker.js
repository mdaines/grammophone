importScripts("/assets/worker.js");

self.onmessage = function(event) {
  
  var grammar = Grammar.parse(event.data.spec).grammar;
  
  var start = new Date();
  grammar.calculate(event.data.calculation);
  var elapsed = new Date() - start;
  
  postMessage({ elapsed: elapsed });
  
}
