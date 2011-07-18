// ..........................................................
// Debug Mode
//

var Db = {};

function init_debug() {
  // replace define method with our wrapped version
  var old_dm = Rt.dm;

  Rt.dm = function(klass, name, public_body, arity) {
    var debug_body = function() {
      var res, len = arguments.length, arity = debug_body.$rbArity;

      if (arity >= 0) {
        if (arity != len) {
          raise(eArgError, "wrong number of arguments(" + len + " for " + arity + ")");
        }
      }
      else {
        if ((-arity - 1) > len) {
          raise(eArgError, "wrong number of arguments(" + len + " for " + arity + ")");
        }
      }

      // push call onto stack
      Db.stack.push({ klass: klass, object: this, method: name });

      // check for block and pass it on
      if (block.f == arguments.callee) {
        block.f = public_body
      }

      res = public_body.apply(this, [].slice.call(arguments));

      Db.stack.pop();

      return res;
    };

    public_body.$rbWrap = debug_body;

    return old_dm(klass, name, debug_body, arity);
  };

  // replace super handler with wrapped version
  var old_super = Rt.S;

  Rt.S = function(callee, self, args) {
    return old_super(callee.$rbWrap, self, args);
  };

  // stack trace - chrome/v8/gem/node support
  if (Error.prepareStackTrace) {

  }
  else {

  }
};


// holds stack trace
Db.stack = [];

// Returns string
Db.backtrace = function() {
  var trace = [], stack = this.stack, frame;

  for (var i = stack.length - 1; i >= 0; i--) {
    frame = stack[i];
    trace.push("\tfrom " + frame.klass.m$inspect() + '#' + frame.method);
  }

  return trace.join("\n");
};

