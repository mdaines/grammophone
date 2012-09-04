//= require templates/transform

var TransformView = function(element) {
  
  this._element = $(element);
  
}

TransformView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

TransformView.prototype.setup = function() {
  
  this._element.on("click", "button", function(e) {
    
    if ($(e.target).data("action") === "undo")
      this._delegate.undo();
    
  }.bind(this));
  
  this._element.on("change", function(e) {
    
    var index = parseInt(e.target.value);
    this._delegate.transform(this._transformations[index]);
    
  }.bind(this));
  
}

TransformView.prototype.reload = function() {
  
  var productions = this._delegate.getProductions();
  var info = this._delegate.getSymbolInfo();
  
  this._transformations = this._delegate.getTransformations();
  
  
  var transformations = [];
  var i, j;
  
  for (i = 0; i < productions.length; i++) {
    transformations[i] = [];
    for (j = 0; j < productions[i].length; j++) {
      transformations[i][j] = [];
    }
  }
  
  var transformation;
  
  for (i = 0; i < this._transformations.length; i++) {
    transformation = this._transformations[i];
    transformations[transformation.production][transformation.symbol].push({
      name: transformation.name,
      index: i
    });
  }
  
  this._element.get(0).innerHTML = JST["templates/transform"]({
    productions: productions,
    info: info,
    transformations: transformations
  });
  
  
  // this._transformations = this._delegate.getTransformations();
  // 
  // var diff = this._delegate.getDiff();
  // var lines = [], line;
  // var undo = false;
  // var production = 0;
  // var i, j;
  // var previousInfo = this._delegate.getPreviousInfo();
  // var currentInfo = this._delegate.getCurrentInfo();
  // 
  // for (i = 0; i < diff.length; i++) {
  //   line = {};
  //   
  //   line.production = diff[i].production;
  //   line.change = diff[i].change;
  //   
  //   if (diff[i].change === "removed")
  //     line.info = previousInfo;
  //   else
  //     line.info = currentInfo;
  //   
  //   if (diff[i].change === "removed" && undo === false) {
  //     line.undo = "undo";
  //     undo = true;
  //   }
  //   
  //   line.transformations = [];
  //   
  //   if (diff[i].change !== "removed") {
  //     for (j = 0; j < this._transformations[production].length; j++) {
  //       line.transformations.push({
  //         production: production,
  //         transformation: j,
  //         label: this._transformations[production][j].name
  //       });
  //     }
  //     
  //     production++;
  //   }
  //   
  //   lines.push(line);
  // }
  // 
  // this._element.get(0).innerHTML = JST["templates/transform"]({ lines: lines });
  
}
