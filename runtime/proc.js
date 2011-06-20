var cProc;

/**
  Block passing - holds current block for runtime

  f: function
  p: proc
  y: yield error
*/
var block = Rt.P = {
  f: null,
  p: null,
  y: function() {
    throw new Error("LocalJumpError - no block given");
  }
};

block.y.$proc = [block.y];

/**
  Turns the given proc/function into a lambda. This is useful for the
  Proc#lambda method, but also for blocks that are turned into
  methods, in Module#define_method, for example. Lambdas and methods
  from blocks are the same thing. Lambdas basically wrap the passed
  block function and perform stricter arg checking to make sure the
  right number of args are passed. Procs are liberal in their arg
  checking, and simply turned ommited args into nil. Lambdas and
  methods MUST check args and throw an error if the wrong number are
  given. Also, lambdas/methods must catch return statements as lambdas
  capture returns.

  FIXME: wrap must detect if we are the receiver of a block, and fix
  the block to send it to the proc.

  FIXME: need to be strict on checking proc arity

  FIXME: need to catch return statements which may be thrown.

  @param {Function} proc The proc/function to lambdafy.
  @return {Function} Wrapped lambda function.
*/
Rt.lambda = function(proc) {
  if (proc.$lambda) return proc;

  var wrap = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    return proc.apply(null, args);
  };

  wrap.$lambda = true;
  wrap.$proc = proc.$proc;

  return wrap;
};

function proc_new(cls) {
  raise(eArgError, "tried to create Proc object without a block");
}

function proc_to_proc(proc) {
  return proc;
}

function proc_call(proc) {
  var args = [].slice.call(arguments, 1);
  return proc.apply(proc.$proc[0], args);
}

function proc_to_s(proc) {
  return "#<Proc:0x" + (proc.$hash() * 400487).toString(16)
    + (proc.$lambda ? ' (lambda)' : '') + ">";
}

function proc_lambda_p(proc) {
  return proc.$lmabda ? Qtrue : Qfalse;
}

function init_proc() {
  cProc = bridge_class(Function.prototype,
    T_OBJECT | T_PROC, 'Proc', cObject);

  Function.prototype.$hash = function() {
    return this.$id || (this.$id = yield_hash());
  };

  define_singleton_method(cProc, 'new', proc_new);
  define_method(cProc, 'to_proc', proc_to_proc);
  define_method(cProc, 'call', proc_call);
  define_method(cProc, 'to_s', proc_to_s);
  define_method(cProc, 'lambda?', proc_lambda_p);
}

