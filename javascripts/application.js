//= require analysis
//= require helpers
//= require set

var Grammar = {
  END: "Grammar.END"
};

var Application = function(element) {
  
  this._element = element;
  
  // set up analysis
  
  this._analysisElement = document.createElement("section");
  this._element.appendChild(this._analysisElement);
  
  this._analysis = new Analysis(this._analysisElement);
  this._analysis.setDelegate(this);
  this._analysis.reload();
  
}

Application.prototype.getPath = function() {
  
  return window.location.pathname;
  
}
