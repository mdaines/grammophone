//= require templates/edit

var EditView = function(element) {
  
  this._element = $(element);
  
}

EditView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

EditView.prototype.setup = function() {
  
  this._element.get(0).innerHTML = JST["templates/edit"]();
  
  this._element.find(".analyze").on("click", function() {
    this._delegate.specChanged(this._element.find(".spec").get(0).value);
  }.bind(this));
  
}

EditView.prototype.reload = function() {
  
  this._element.find(".spec").get(0).value = this._delegate.getSpec();
  
  var error = this._delegate.getError();
  
  if (error) {
    
    this._element.find(".errors").html("<pre>" + error + "</pre>").show();
    this._element.find(".errors").css({ top: this._element.find(".buttons").height() + "px" });
    this._element.find(".spec").css({ top: this._element.find(".buttons").height() + this._element.find(".errors").height() + "px" });
    
  } else {
    
    this._element.find(".errors").html("").hide();
    this._element.find(".spec").css({ top: this._element.find(".buttons").height() + "px" });
    
  }
  
}
