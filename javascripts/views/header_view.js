//= require templates/header

var HeaderView = function(element) {
  
  this._element = element;
  
}

HeaderView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

HeaderView.prototype.reload = function() {
  
  var path = this._delegate.getPathComponents();
  
  if (path.length > 0) {
    
    this._element.innerHTML = JST["templates/header"]({ path: path });
    this._element.style.display = "";
    
  } else {
    
    this._element.innerHTML = "";
    this._element.style.display = "none";
    
  }
  
}
