function Event(sender) {
  this._sender = sender;
  this._listeners = []; //this will store functions to be run
}

Event.prototype = {
  
  attach: function(listener) {
    this._listeners.push(listener);
  },
  
  notify: function(args) {
    
    
    let index;
    
    for (index=0; index < this._listeners.length; index++) {
      this._listeners[index](this._sender, args);
    }
    
  
  },
  
  
};
