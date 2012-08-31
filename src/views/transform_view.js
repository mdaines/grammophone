//= require templates/transform

var TransformView = function(element) {
  
  this._element = $(element);
  
}

TransformView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

TransformView.prototype.setup = function() {
  
  this._element.on("click", "button", function(e) {
    
    if ($(e.target).data("action") === "transform") {
    
      var p = parseInt($(e.target).data("production"));
      var t = parseInt($(e.target).data("transformation"));
    
      this._delegate.transform(this._transformations[p][t]);
      
    } else if ($(e.target).data("action") === "undo") {
      
      this._delegate.undo();
      
    }
    
  }.bind(this));
  
}

TransformView.prototype.reload = function() {
  
  this._transformations = this._delegate.getTransformations();
  
  var diff = this._delegate.getDiff();
  var lines = [], line;
  var undo = false;
  var production = 0;
  var i, j;
  var previousInfo = this._delegate.getPreviousInfo();
  var currentInfo = this._delegate.getCurrentInfo();
  
  for (i = 0; i < diff.length; i++) {
    line = {};
    
    line.production = diff[i].production;
    line.change = diff[i].change;
    
    if (diff[i].change === "removed")
      line.info = previousInfo;
    else
      line.info = currentInfo;
    
    if (diff[i].change === "removed" && undo === false) {
      line.undo = "undo";
      undo = true;
    }
    
    line.transformations = [];
    
    if (diff[i].change !== "removed") {
      for (j = 0; j < this._transformations[production].length; j++) {
        line.transformations.push({
          production: production,
          transformation: j,
          label: this._transformations[production][j].name
        });
      }
      
      production++;
    }
    
    lines.push(line);
  }
  
  this._element.get(0).innerHTML = JST["templates/transform"]({ lines: lines });
  
}
