var failures, results;

function appendResult(className, message) {
  var result = document.createElement("article");
  result.className = className;
  result.innerHTML = message;
  results.appendChild(result);
}

function pass(message) {
  appendResult("pass", message);
}

function fail(message) {
  appendResult("fail", message);
  failures++;
}

function test(name, f) {
  
  failures = 0;
  
  results = document.createElement("section");
  
  var heading = document.createElement("h1");
  heading.innerHTML = name;
  results.appendChild(heading);
  
  var summary = document.createElement("article");
  results.appendChild(summary);
  
  document.body.appendChild(results);
  
  f();
  
  if (failures > 0) {
    summary.className = "fail";
    summary.innerHTML = failures + " " + (failures == 1 ? "failure" : "failures") + "!";
  }
  
}
