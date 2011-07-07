/*!
 * opal v0.3.5
 * http://opalscript.org
 *
 * Copyright 2011, Adam Beynon
 * Released under the MIT license
 */
opal = {};

(function() {

// So we can minimize
var Op = opal;

/**
  All methods and properties available to ruby/js sources at runtime. These
  are kept in their own namespace to keep the opal namespace clean.
*/
Op.runtime = {};

// for minimizng
var Rt = Op.runtime;
Rt.opal = Op;

/**
  Opal platform - this is overriden in gem context and nodejs context. These
  are the default values used in the browser, `opal-browser'.
*/
Op.platform = {
  platform: "opal",
  engine: "opal-browser",
  version: "1.9.2",
  argv: []
};

/**
  Core runtime classes, objects and literals.
*/
var cBasicObject,     cObject,          cModule,          cClass,
    mKernel,          cNilClass,        cTrueClass,       cFalseClass,
    cArray,
    cRegexp,          cMatch,           top_self,            Qnil,
    Qfalse,           Qtrue,

    cDir;

/**
  Core object type flags. Added as local variables, and onto runtime.
*/
var T_CLASS       = Rt.T_CLASS       = 1,
    T_MODULE      = Rt.T_MODULE      = 2,
    T_OBJECT      = Rt.T_OBJECT      = 4,
    T_BOOLEAN     = Rt.T_BOOLEAN     = 8,
    T_STRING      = Rt.T_STRING      = 16,
    T_ARRAY       = Rt.T_ARRAY       = 32,
    T_NUMBER      = Rt.T_NUMBER      = 64,
    T_PROC        = Rt.T_PROC        = 128,
    T_SYMBOL      = Rt.T_SYMBOL      = 256,
    T_HASH        = Rt.T_HASH        = 512,
    T_RANGE       = Rt.T_RANGE       = 1024,
    T_ICLASS      = Rt.T_ICLASS      = 2056,
    FL_SINGLETON  = Rt.FL_SINGLETON  = 4112;

/**
  Method visibility modes
 */
var FL_PUBLIC  = 0,
    FL_PRIVATE = 1;

/**
  Define classes. This is the public API for defining classes, shift classes
  and modules.

  @param {RubyObject} base
  @param {RClass} super_class
  @param {String} id
  @param {Function} body
  @param {Number} flag
*/
Rt.dc = function(base, super_class, id, body, flag) {
  var klass;

  switch (flag) {
    case 0:
      if (base.$flags & T_OBJECT) {
        base = class_real(base.$klass);
      }

      if (super_class == Qnil) {
        super_class = cObject;
      }

      klass = define_class_under(base, id, super_class);
      break;

    case 1:
      klass = singleton_class(base);
      break;

    case 2:
      if (base.$flags & T_OBJECT) {
        base = class_real(base.$klass);
      }
      klass = define_module_under(base, id);
      break;

    default:
      raise(eException, "define_class got a unknown flag " + flag);
  }

  // when reopening a class always set it back to public
  klass.$mode = FL_PUBLIC;

  var res = body(klass);

  return res;
};

/**
  Regexp object. This holds the results of last regexp match.
  X for regeXp.
*/
Rt.X = null;

/**
  Undefine methods
*/
Rt.um = function(kls) {
  var args = [].slice.call(arguments, 1);

  for (var i = 0, ii = args.length; i < ii; i++) {
    (function(mid) {
      var func = function() {
        raise(eNoMethodError, "undefined method `" + mid + "' for " + this.m$inspect());
      };

      kls.allocator.prototype['m$' + mid] = func;

      if (kls.$bridge_prototype) {
        kls.$bridge_prototype['m$' + mid] = func;
      }
    })(args[i].m$to_s());
  }

  return Qnil;
};

/**
  Method missing support - used in debug mode (opt in).
*/
Rt.mm = function(method_ids) {
  var prototype = cBasicObject.$m_tbl;

  for (var i = 0, ii = method_ids.length; i < ii; i++) {
    var mid = method_ids[i];

    if (!prototype[mid]) {
      var imp = (function(mid, method_id) {
        return function(self) {
          var args = [].slice.call(arguments, 0);
          args.unshift(intern(method_id));
          args.unshift(self);
          return self.$m.method_missing.apply(null, args);
        };
      })(mid, method_ids[i]);

      imp.$rbMM = true;

      prototype[mid] = prototype['$' + mid] = imp;
    }
  }
};

/**
  Define methods. Public method for defining a method on the given base.

  @param {Object} klass The base to define method on
  @param {String} name Ruby mid
  @param {Function} public_body The method implementation
  @param {Number} arity Method arity
  @return {Qnil}
*/
Rt.dm = function(klass, name, public_body, arity) {
  if (klass.$flags & T_OBJECT) {
    klass = klass.$klass;
  }

  var mode = klass.$mode;
  var private_body = public_body;

  if (mode == FL_PRIVATE) {
    public_body = function() {
      raise(eNoMethodError, "private method `" + name +
        "' called for " + this.$m$inspect());
    };
    public_body.$arity = -1;
  }

  if (!private_body.$rbName) {
    private_body.$rbName = name;
    private_body.$rbArity = arity;
  }

  // FIXME: add to private/public methods
  // klass.$methods.push(intern(name));
  define_raw_method(klass, name, private_body, public_body);

  return Qnil;
};

/**
  Define singleton method.

  @param {Object} base The base to define method on
  @param {String} method_id Method id
  @param {Function} body Method implementation
  @param {Number} arity Method arity
  @return {Qnil}
*/
Rt.ds = function(base, method_id, body, arity) {
  return Rt.dm(singleton_class(base), method_id, body);
};

/**
  Call a super method.

  callee is the function that actually called super(). We use this to find
  the right place in the tree to find the method that actually called super.
  This is actually done in super_find.
*/
Rt.S = function(callee, self, args) {
  var mid = callee.$rbName;
  var func = super_find(self.$klass, callee, mid);

  if (!func) {
    raise(eNoMethodError, "super: no super class method `" + mid + "`" +
      " for " + self.m$inspect());
  }

  var args_to_send = [self].concat(args);
  return func.apply(self, args_to_send);
};

/**
  Actually find super impl to call.  Returns null if cannot find it.
*/
function super_find(klass, callee, mid) {
  var cur_method;

  while (klass) {
    if (klass.$m_tbl[mid]) {
      if (klass.$m_tbl[mid] == callee) {
        cur_method = klass.$m_tbl[mid];
        break;
      }
    }
    klass = klass.$super;
  }

  if (!(klass && cur_method)) { return null; }

  klass = klass.$super;

  while (klass) {
    if (klass.$m_tbl[mid]) {
      return klass.$m_tbl[mid];
    }

    klass = klass.$super;
  }

  return null;
};

/**
  Exception classes. Some of these are used by runtime so they are here for
  convenience.
*/
var eException,       eStandardError,   eLocalJumpError,  eNameError,
    eNoMethodError,   eArgError,        eScriptError,     eLoadError,
    eRuntimeError,    eTypeError,       eIndexError,      eKeyError,
    eRangeError;

var eExceptionInstance;

/**
  Standard jump exceptions to save re-creating them everytime they are needed
*/
var eReturnInstance,
    eBreakInstance,
    eNextInstance;

/**
  Ruby break statement with the given value. When no break value is needed, nil
  should be passed here. An undefined/null value is not valid and will cause an
  internal error.

  @param {RubyObject} value The break value.
*/
Rt.B = function(value) {
  eBreakInstance.$value = value;
  raise_exc(eBreakInstance);
};

/**
  Ruby return, with the given value. The func is the reference function which
  represents the method that this statement must return from.
*/
Rt.R = function(value, func) {
  eReturnInstance.$value = value;
  eReturnInstance.$func = func;
  throw eReturnInstance;
};

/**
  Get the given constant name from the given base
*/
Rt.cg = function(base, id) {
  if (base.$flags & T_OBJECT) {
    base = class_real(base.$klass);
  }
  return const_get(base, id);
};

/**
  Set constant from runtime
*/
Rt.cs = function(base, id, val) {
  if (base.$flags & T_OBJECT) {
    base = class_real(base.$klass);
  }
  return const_set(base, id, val);
};

/**
  Get global by id
*/
Rt.gg = function(id) {
  return gvar_get(id);
};

/**
  Set global by id
*/
Rt.gs = function(id, value) {
  return gvar_set(id, value);
};

function regexp_match_getter(id) {
  var matched = Rt.X;

  if (matched) {
    if (matched.$md) {
      return matched.$md;
    } else {
      var res = new cMatch.allocator();
      res.$data = matched;
      matched.$md = res;
      return res;
    }
  } else {
    return Qnil;
  }
}


/**
  Sets the constant value `val` on the given `klass` as `id`.

  @param {RClass} klass
  @param {String} id
  @param {Object} val
  @return {Object} returns the set value
*/
function const_set(klass, id, val) {
  klass.$c_prototype[id] = val;
  klass.$const_table[id] = val;
  return val;
}

/**
  Lookup a constant named `id` on the `klass`. This will throw an error if
  the constant cannot be found.

  @param {RClass} klass
  @param {String} id
*/
function const_get(klass, id) {
  if (klass.$c[id]) {
    return (klass.$c[id]);
  }

  var parent = klass.$parent;

  while (parent && parent != cObject) {
  // while (parent) {
    if (parent.$c[id] !== undefined) {
      return parent.$c[id];
    }

    parent = parent.$parent;
  }

  raise(eNameError, 'uninitialized constant ' + id);
};

Rt.const_get = const_get;

/**
  Returns true or false depending whether a constant named `id` is defined
  on the receiver `klass`.

  @param {RClass} klass
  @param {String} id
  @return {true, false}
*/
function const_defined(klass, id) {
  if (klass.$c[id]) {
    return true;
  }

  return false;
};

/**
  This table holds all the global variables accessible from ruby.

  Entries are mapped by their global id => an object that contains the
  given keys:

    - name
    - value
    - getter
    - setter
*/
var global_tbl = {};

/**
  Defines a hooked/global variable.

  @param {String} name The global name (e.g. '$:')
  @param {Function} getter The getter function to return the variable
  @param {Function} setter The setter function used for setting the var
  @return {null}
*/
function define_hooked_variable(name, getter, setter) {
  var entry = {
    "name": name,
    "value": Qnil,
    "getter": getter,
    "setter": setter
  };

  global_tbl[name] = entry;
};

/**
  A default read only getter for a global variable. This will simply throw a
  name error with the given id. This can be used for variables that should
  not be altered.
*/
function gvar_readonly_setter(id, value) {
  raise(eNameError, id + " is a read-only variable");
};

/**
  Retrieve a global variable. This will use the assigned getter.
*/
function gvar_get(id) {
  var entry = global_tbl[id];
  if (!entry) { return Qnil; }
  return entry.getter(id);
};

/**
  Set a global. If not already set, then we assign basic getters and setters.
*/
function gvar_set(id, value) {
  var entry = global_tbl[id];
  if (entry)  { return entry.setter(id, value); }

  define_hooked_variable(id,

    function(id) {
      return global_tbl[id].value;
    },

    function(id, value) {
      return (global_tbl[id].value = value);
    }
  );

  return gvar_set(id, value);
};

/**
  Every object has a unique id. This count is used as the next id for the
  next created object. Therefore, first ruby object has id 0, next has 1 etc.
*/
var hash_yield = 0;

/**
  Yield the next object id, updating the count, and returning it.
*/
function yield_hash() {
  return hash_yield++;
};

var cHash;

/**
  Returns a new hash with values passed from the runtime.
*/
Rt.H = function() {
  var hash = new RObject(cHash), k, v, args = [].slice.call(arguments);
  hash.$keys = [];
  hash.$assocs = {};
  hash.$default = Qnil;

  for (var i = 0, ii = args.length; i < ii; i++) {
    k = args[i];
    v = args[i + 1];
    i++;
    hash.$keys.push(k);
    hash.$assocs[k.$hash()] = v;
  }

  return hash;
};

var alias_method = Rt.alias_method = function(klass, new_name, old_name) {
  var body = klass.$m_tbl[old_name];

  if (!body) {
    throw new Error("NameError: undefined method `" + old_name + "' for class `" + klass.__classid__ + "'");
  }

  define_raw_method(klass, new_name, body, body);
  return Qnil;
};

/**
  This does the main work, but does not call runtime methods like
  singleton_method_added etc. define_method does that.

*/
function define_raw_method(klass, private_name, private_body, public_body) {
  var public_name = '$' + private_name;

  klass.$m_tbl[private_name] = private_body;
  klass.$m_tbl[public_name] = public_body;

  klass.$method_table[private_name] = private_body;

  var included_in = klass.$included_in, includee;

  if (included_in) {
    for (var i = 0, ii = included_in.length; i < ii; i++) {
      includee = included_in[i];

      define_raw_method(includee, private_name, private_body, public_body);
    }
  }
};

Rt.private_methods = function(klass, args) {
  return;

  if (args.length) {
    var proto = klass.allocator.prototype;

    for (var i = 0, ii = args.length; i < ii; i++) {
      var arg = args[i].$m$to_s(), mid = 'm$' + arg;

      // If method doesn't exist throw an error. Also check that if it
      // does exist that it isnt just a method missing implementation.
      if (!proto[mid] || proto[mid].$rbMM) {
        raise(eNameError, "undefined method `" + arg +
              "' for class `" + klass.__classid__ + "'");
      }

      // Set the public implementation to a function that just throws
      // and error when called
      klass.allocator.prototype[mid] = function() {
        raise(eNoMethodError, "private method `" + arg + "' called for " +
              this.$m$inspect());
      }

      // If this method is in the method_table then we must also set that.
      // If not then we inherited this method from further up the chain,
      // so we do not set it in our method table.
      if (klass.$method_table[mid]) {
        // set
      }
    }
  }
  else {
    // no args - set klass mode to private
    klass.$mode = FL_PRIVATE;
  }
};

function define_alias(base, new_name, old_name) {
  define_method(base, new_name, base.$m_tbl[old_name]);
  return Qnil;
};

function obj_alloc(klass) {
  var result = new RObject(klass);
  return result;
};

/**
  Raise the exception class with the given string message.
*/
function raise(exc, str) {
  if (str === undefined) {
    str = exc;
    exc = eException;
  }

  var exception = exc.$m['new'](exc, str);
  raise_exc(exception);
};

Rt.raise = raise;

/**
  Raise an exception instance (DO NOT pass strings to this)
*/
function raise_exc(exc) {
  throw exc;
};

Rt.raise_exc = raise_exc;

var cString, cSymbol;

/**
  Returns a new ruby symbol with the given intern value. Symbols are made
  using the new String() constructor, and just have its klass and method
  table reassigned. This makes dealing with strings/symbols internally
  easier as both can be used as a string within opal.

  @param {String} intern Symbol value
  @return {RSymbol} symbol
*/
var intern = Rt.Y = function(intern) {
  if (symbol_table.hasOwnProperty(intern)) {
    return symbol_table[intern];
  }

  var res = new String(intern);
  res.$klass = cSymbol;
  res.$m = cSymbol.$m_tbl;
  res.$flags = T_OBJECT | T_SYMBOL;
  symbol_table[intern] = res;
  return res;
};


var cIO, stdin, stdout, stderr;

function stdio_getter(id) {
  switch (id) {
    case "$stdout":
      return stdout;
    case "$stdin":
      return stdin;
    case "$stderr":
      return stderr;
    default:
      raise(eRuntimeError, "stdout_setter being used for bad variable");
  }
};

function stdio_setter(id, value) {
  raise(eException, "stdio_setter cannot currently set stdio variables");

  switch (id) {
    case "$stdout":
      return stdout = value;
    case "$stdin":
      return stdin = value;
    case "$stderr":
      return stderr = value;
    default:
      raise(eRuntimeError, "stdout_setter being used for bad variable: " + id);
  }
};

Rt.re = function(re) {
  var regexp = new cRegexp.allocator();
  regexp.$re = re;
  return regexp;
};

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

  return Rt.proc(wrap);
};

var cRange;

/**
  Returns a new ruby range. G for ranGe.
*/
Rt.G = function(beg, end, exc) {
  var range = new RObject(cRange, T_OBJECT);
  range.$beg = beg;
  range.$end = end;
  range.$exc = exc;
  return range;
};

Rt.A = function(objs) {
  var arr = new cArray.allocator();
  arr.splice.apply(arr, [0, 0].concat(objs));
  return arr;
};

var puts = function(str) {
  console.log(str);
};

/**
  Main init method. This is called once this file has fully loaded. It setups
  all the core objects and classes and required runtime features.
*/
function init() {
  if (typeof OPAL_DEBUG != "undefined" && OPAL_DEBUG) {
    init_debug();
  }

  var metaclass;

  Rt.BasicObject = cBasicObject = boot_defrootclass('BasicObject');
  Rt.Object = cObject = boot_defclass('Object', cBasicObject);
  Rt.Module = cModule = boot_defclass('Module', cObject);
  Rt.Class = cClass = boot_defclass('Class', cModule);

  const_set(cObject, 'BasicObject', cBasicObject);

  metaclass = make_metaclass(cBasicObject, cClass);
  metaclass = make_metaclass(cObject, metaclass);
  metaclass = make_metaclass(cModule, metaclass);
  metaclass = make_metaclass(cClass, metaclass);

  boot_defmetametaclass(cModule, metaclass);
  boot_defmetametaclass(cObject, metaclass);
  boot_defmetametaclass(cBasicObject, metaclass);

  mKernel = Rt.Kernel = define_module('Kernel');

  top_self = obj_alloc(cObject);
  Rt.top = top_self;

  cNilClass = define_class('NilClass', cObject);
  Rt.Qnil = Qnil = obj_alloc(cNilClass);
  Qnil.$r = false;

  cTrueClass = define_class('TrueClass', cObject);
  Rt.Qtrue = Qtrue = obj_alloc(cTrueClass);

  cFalseClass = define_class('FalseClass', cObject);
  Rt.Qfalse = Qfalse = obj_alloc(cFalseClass);
  Qfalse.$r = false;

  cArray = bridge_class(Array.prototype,
    T_OBJECT | T_ARRAY, 'Array', cObject);

  Function.prototype.$hash = function() {
    return this.$id || (this.$id = yield_hash());
  };

  cHash = define_class('Hash', cObject);

  cNumeric = bridge_class(Number.prototype,
    T_OBJECT | T_NUMBER, 'Numeric', cObject);

  cString = bridge_class(String.prototype,
    T_OBJECT | T_STRING, 'String', cObject);

  cSymbol = define_class('Symbol', cObject);

  cProc = bridge_class(Function.prototype,
    T_OBJECT | T_PROC, 'Proc', cObject);

  Function.prototype.$hash = function() {
    return this.$id || (this.$id = yield_hash());
  };

  cRange = define_class('Range', cObject);

  cRegexp = bridge_class(RegExp.prototype,
    T_OBJECT, 'Regexp', cObject);

  cMatch = define_class('MatchData', cObject);
  define_hooked_variable('$~', regexp_match_getter, gvar_readonly_setter);

  eException = bridge_class(Error.prototype, T_OBJECT, 'Exception', cObject);

  eStandardError = define_class("StandardError", eException);
  eRuntimeError = define_class("RuntimeError", eException);
  eLocalJumpError = define_class("LocalJumpError", eStandardError);
  Rt.TypeError = eTypeError = define_class("TypeError", eStandardError);

  eNameError = define_class("NameError", eStandardError);
  eNoMethodError = define_class('NoMethodError', eNameError);
  eArgError = define_class('ArgumentError', eStandardError);

  eScriptError = define_class('ScriptError', eException);
  eLoadError = define_class('LoadError', eScriptError);

  eIndexError = define_class("IndexError", eStandardError);
  eKeyError = define_class("KeyError", eIndexError);
  eRangeError = define_class("RangeError", eStandardError);

  eBreakInstance = new Error();
  eBreakInstance['@message'] = "unexpected break";
  block.b = eBreakInstance;
  // dont need this anymore???
  eBreakInstance.$keyword = 2;

  eReturnInstance = new Error();
  eReturnInstance.$klass = eLocalJumpError;
  eReturnInstance.$keyword = 1;

  eNextInstance = new Error();
  eNextInstance.$klass = eLocalJumpError;
  eNextInstance.$keyword = 3;

  // need to do this after we make symbol
  Rt.ds(cClass, 'new', class_s_new);

  cIO = define_class('IO', cObject);
  stdin = obj_alloc(cIO);
  stdout = obj_alloc(cIO);
  stderr = obj_alloc(cIO);

  const_set(cObject, 'STDIN', stdin);
  const_set(cObject, 'STDOUT', stdout);
  const_set(cObject, 'STDERR', stderr);

  define_hooked_variable('$stdin', stdio_getter, stdio_setter);
  define_hooked_variable('$stdout', stdio_getter, stdio_setter);
  define_hooked_variable('$stderr', stdio_getter, stdio_setter);

  define_hooked_variable('$:', load_path_getter, gvar_readonly_setter);
  define_hooked_variable('$LOAD_PATH', load_path_getter, gvar_readonly_setter);

  Op.loader = new Loader(Op);
  Op.cache = {};

  // const_set(cObject, 'RUBY_ENGINE', Op.platform.engine);
  const_set(cObject, 'RUBY_ENGINE', 'opal-gem');

  puts = function(str) {
    top_self.$m.puts(top_self, str);
  };

};

/**
  Symbol table. All symbols are stored here.
*/
var symbol_table = { };

function class_s_new(cls, sup) {
  var klass = define_class_id("AnonClass", sup || cObject);
  return klass;
};

/**
  Every class in opal is an instance of RClass

  @param {RClass} klass
  @param {RClass} superklass
*/
var RClass = Rt.RClass = function(klass, superklass) {
  this.$id = yield_hash();
  this.$super = superklass;

  if (superklass) {
    var mtor = function() {};
    mtor.prototype = new superklass.$m_tor();
    this.$m_tbl = mtor.prototype;
    this.$m_tor = mtor;

    var cctor = function() {};
    cctor.prototype = superklass.$c_prototype;

    var c_tor = function(){};
    c_tor.prototype = new cctor();

    this.$c = new c_tor();
    this.$c_prototype = c_tor.prototype;
  }
  else {
    var mtor = function() {};
    this.$m_tbl = mtor.prototype;
    this.$m_tor = mtor;

    var ctor = function() {};
    this.$c = new ctor();
    this.$c_prototype = ctor.prototype;
  }

  this.$method_table = {};
  this.$const_table = {};

  return this;
};

// RClass prototype for minimizing
var Rp = RClass.prototype;

/**
  Every RClass instance is just a T_CLASS.
*/
Rp.$flags = T_CLASS;

/**
  RClass truthiness
*/
Rp.$r = true;

/**
  Every object in opal (except toll free objects) are instances of RObject

  @param {RClass} klass
*/
var RObject = Rt.RObject = function(klass) {
  this.$id = yield_hash();
  this.$klass = klass;
  this.$m = klass.$m_tbl;
  return this;
};

// For minimizing
var Bp = RObject.prototype;

/**
  Every RObject is a T_OBJECT
*/
Bp.$flags = T_OBJECT;

/**
  RObject truthiness
*/
Bp.$r = true;

/**
  The hash of all objects and classes is sinple its id
*/
Bp.$hash = Rp.$hash = function() {
  return this.$id;
};

/**
  Like boot_defclass but for root object only (i.e. BasicObject)
*/
function boot_defrootclass(id) {
  var cls = new RClass(null, null);
  cls.$flags = T_CLASS;
  name_class(cls, id);
  const_set((cObject || cls), id, cls);
  return cls;
}

/**
  Boots core classes - Object, Module and Class
*/
function boot_defclass(id, superklass) {
  var cls = class_boot(superklass);
  name_class(cls, id);
  const_set((cObject || cls), id, cls);
  return cls;
}

function class_boot(superklass) {
  if (superklass) {
    var ctor = function() {};
    ctor.prototype = superklass.constructor.prototype;

    var result = function() {
      RClass.call(this, null, superklass);
      return this;
    };
    result.prototype = new ctor();

    var klass = new result();
    klass.$klass = cClass;
    return klass;
  }
  else {
    var result = new RClass(null, null);
    return result;
  }
}

function class_real(klass) {
  while (klass.$flags & FL_SINGLETON) { klass = klass.$super; }
  return klass;
};

Rt.class_real = class_real;

/**
  Name the class with the given id.
*/
function name_class(klass, id) {
  klass.__classid__ = id;
};

/**
  Make metaclass for the given class
*/
function make_metaclass(klass, super_class) {
  if (klass.$flags & T_CLASS) {
    if ((klass.$flags & T_CLASS) && (klass.$flags & FL_SINGLETON)) {
      return make_metametaclass(klass);
    }
    else {
      // FIXME this needs fixinfg to remove hacked stuff now in make_singleton_class
      var meta = class_boot(super_class);
      // remove this??!
      meta.$m = meta.$klass.$m_tbl;
      meta.$c = meta.$klass.$c_prototype;
      meta.$flags |= FL_SINGLETON;
      meta.__classid__ = "#<Class:" + klass.__classid__ + ">";
      klass.$klass = meta;
      klass.$m = meta.$m_tbl;
      meta.$c = klass.$c;
      singleton_class_attached(meta, klass);
      // console.log("meta id: " + klass.__classid__);
      return meta;
    }
  } else {
    // if we want metaclass of an object, do this
    return make_singleton_class(klass);
  }
};

function make_singleton_class(obj) {
  var orig_class = obj.$klass;
  var klass = class_boot(orig_class);

  klass.$flags |= FL_SINGLETON;

  obj.$klass = klass;
  obj.$m = klass.$m_tbl;

  // make methods we define here actually point to instance
  // FIXME: we could just take advantage of $bridge_prototype like we
  // use for bridged classes?? means we can make more instances...
  klass.$bridge_prototype = obj;

  singleton_class_attached(klass, obj);

  klass.$klass = class_real(orig_class).$klass;
  klass.$m = klass.$klass.$m_tbl;
  klass.__classid__ = "#<Class:#<" + orig_class.__classid__ + ":" + klass.$id + ">>";

  return klass;
};

function singleton_class_attached(klass, obj) {
  if (klass.$flags & FL_SINGLETON) {
    klass.__attached__ = obj;
  }
};

function make_metametaclass(metaclass) {
  var metametaclass, super_of_metaclass;

  if (metaclass.$klass == metaclass) {
    metametaclass = class_boot(null);
    metametaclass.$klass = metametaclass;
  }
  else {
    metametaclass = class_boot(null);
    metametaclass.$klass = metaclass.$klass.$klass == metaclass.$klass
      ? make_metametaclass(metaclass.$klass)
      : metaclass.$klass.$klass;
  }

  metametaclass.$flags |= FL_SINGLETON;

  singleton_class_attached(metametaclass, metaclass);
  metaclass.$klass = metametaclass;
  metaclsss.$m = metametaclass.$m_tbl;
  super_of_metaclass = metaclass.$super;

  metametaclass.$super = super_of_metaclass.$klass.__attached__
    == super_of_metaclass
    ? super_of_metaclass.$klass
    : make_metametaclass(super_of_metaclass);

  return metametaclass;
};

function boot_defmetametaclass(klass, metametaclass) {
  klass.$klass.$klass = metametaclass;
};

// Holds an array of all prototypes that are bridged. Any method defined on
// Object in ruby will also be added to the bridge classes.
var bridged_classes = [];

/**
  Define toll free bridged class
*/
function bridge_class(prototype, flags, id, super_class) {
  var klass = define_class(id, super_class);

  prototype.$klass = klass;
  prototype.$m = klass.$m_tbl;
  prototype.$flags = flags;
  prototype.$r = true;

  prototype.$hash = function() { return flags + '_' + this; };

  return klass;
};

Rt.native_prototype = function(cls, proto) {
  proto.$klass = cls;
  proto.$m = cls.$m_tbl;
  proto.$flags = T_OBJECT;
  proto.$r = true;

  proto.$hash = function() {
    return this.$id || (this.$id = yield_hash());
  };

  return cls;
};

/**
  Define a new class (normal way), with the given id and superclass. Will be
  top level.
*/
function define_class(id, super_klass) {
  return define_class_under(cObject, id, super_klass);
};

function define_class_under(base, id, super_klass) {
  var klass;

  if (const_defined(base, id)) {
    klass = const_get(base, id);

    if (!(klass.$flags & T_CLASS)) {
      throw new Error(id + " is not a class!");
    }

    if (klass.$super != super_klass && super_klass != cObject) {
      throw new Error("Wrong superclass given for " + id);
    }

    return klass;
  }

  klass = define_class_id(id, super_klass);

  if (base == cObject) {
    name_class(klass, id);
  } else {
    name_class(klass, base.__classid__ + '::' + id);
  }

  const_set(base, id, klass);
  klass.$parent = base;

  // Class#inherited hook - here is a good place to call. We check method
  // is actually defined first (incase we are calling it during boot). We
  // can't do this earlier as an error will cause constant names not to be
  // set etc (this is the last place before returning back to scope).
  if (super_klass.m$inherited) {
    super_klass.m$inherited(klass);
  }

  return klass;
};

Rt.define_class_under = define_class_under;

/**
  Actually create class
*/
function define_class_id(id, super_klass) {
  var klass;

  if (!super_klass) {
    super_klass = cObject;
  }
  klass = class_create(super_klass);
  name_class(klass, id);
  make_metaclass(klass, super_klass.$klass);

  return klass;
};

function class_create(super_klass) {
  return class_boot(super_klass);
};

/**
  Get singleton class of obj
*/
function singleton_class(obj) {
  var klass;

  if (obj.$flags & T_OBJECT) {
    if ((obj.$flags & T_NUMBER) || (obj.$flags & T_SYMBOL)) {
      raise(eTypeError, "can't define singleton");
    }
  }

  if ((obj.$klass.$flags & FL_SINGLETON) && obj.$klass.__attached__ == obj) {
    klass = obj.$klass;
  }
  else {
    var class_id = obj.$klass.__classid__;
    klass = make_metaclass(obj, obj.$klass);
  }

  return klass;
};

Rt.singleton_class = singleton_class;

/**
  Define a top level module with the given id
*/
function define_module(id) {
  return define_module_under(cObject, id);
};

function define_module_under(base, id) {
  var module;

  if (const_defined(base, id)) {
    module = const_get(base, id);
    if (module.$flags & T_MODULE) {
      return module;
    }

    throw new Error(id + " is not a module.");
  }

  module = define_module_id(id);

  if (base == cObject) {
    name_class(module, id);
  } else {
    name_class(module, base.__classid__ + '::' + id);
  }

  const_set(base, id, module);
  module.$parent = base;
  return module;
};

function define_module_id(id) {
  var module = class_create(cModule);
  make_metaclass(module, cModule);

  module.$flags = T_MODULE;
  module.$included_in = [];
  return module;
};

function mod_create() {
  return class_boot(cModule);
};

function include_module(klass, module) {

  if (!klass.$included_modules) {
    klass.$included_modules = [];
  }

  if (klass.$included_modules.indexOf(module) != -1) {
    return;
  }
  klass.$included_modules.push(module);

  if (!module.$included_in) {
    module.$included_in = [];
  }

  module.$included_in.push(klass);

  for (var method in module.$method_table) {
    if (module.$method_table.hasOwnProperty(method)) {
      define_raw_method(klass, method,
                        module.$m_tbl[method],
                        module.$m_tbl['$' + method]);
    }
  }

  for (var constant in module.$c) {
    if (module.$c.hasOwnProperty(constant)) {
      const_set(klass, constant, module.$c[constant]);
    }
  }
};

Rt.include_module = include_module;

function extend_module(klass, module) {
  if (!klass.$extended_modules) {
    klass.$extended_modules = [];
  }

  if (klass.$extended_modules.indexOf(module) != -1) {
    return;
  }
  klass.$extended_modules.push(module);

  if (!module.$extended_in) {
    module.$extended_in = [];
  }

  module.$extended_in.push(klass);

  var meta = klass.$klass;

  for (var method in module.$method_table) {
    if (module.$method_table.hasOwnProperty(method)) {
      define_raw_method(meta, method,
                        module.$m_tbl[method],
                        module.$m_tbl['$' + method]);
    }
  }
};

Rt.extend_module = extend_module;

// ..........................................................
// FILE SYSTEM
//

/**
  FileSystem namespace. Overiden in gem and node.js contexts
*/
var Fs = Op.fs = {};

/**
 RegExp for splitting filenames into their dirname, basename and ext.
 This currently only supports unix style filenames as this is what is
 used internally when running in the browser.
*/
var PATH_RE = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

/**
  Holds the current cwd for the application.

  @type {String}
*/
Fs.cwd = '/';

/**
  Join the given args using the default separator. The returned path
  is not expanded.

  @param {String} parts
  @return {String}
*/
function fs_join(parts) {
  parts = [].slice.call(arguments, 0);
  return parts.join('/');
}

/**
  Normalize the given path by removing '..' and '.' parts etc.

  @param {String} path Path to normalize
  @param {String} base Optional base to normalize with
  @return {String}
*/
function fs_expand_path(path, base) {
  if (!base) {
    if (path.charAt(0) !== '/') {
      base = Fs.cwd;
    }
    else {
      base = '';
    }
  }

  path = fs_join(base, path);

  var parts = path.split('/'), result = [], part;

  // initial /
  if (parts[0] === '') result.push('');

  for (var i = 0, ii = parts.length; i < ii; i++) {
    part = parts[i];

    if (part == '..') {
      result.pop();
    }
    else if (part == '.' || part == '') {

    }
    else {
      result.push(part);
    }
  }

  return result.join('/');
}

/**
  Return all of the path components except the last one.

  @param {String} path
  @return {String}
*/
var fs_dirname = Fs.dirname = function(path) {
  var dirname = PATH_RE.exec(path)[1];

  if (!dirname) return '.';
  else if (dirname === '/') return dirname;
  else return dirname.substring(0, dirname.length - 1);
};

/**
  Returns the file extension of the given `file_name`.

  @param {String} file_name
  @return {String}
*/
Fs.extname = function(file_name) {
  var extname = PATH_RE.exec(file_name)[3];

  if (!extname || extname === '.') return '';
  else return extname;
};

Fs.exist_p = function(path) {
  return opal.loader.factories[file_expand_path(path)] ? true : false;
};

/**
  Glob
*/
Fs.glob = function() {
  var globs = [].slice.call(arguments);

  var result = [], files = opal.loader.factories;

  for (var i = 0, ii = globs.length; i < ii; i++) {
    var glob = globs[i];

    var re = fs_glob_to_regexp(glob);
    // console.log("glob: " + glob);
    // console.log("re  : " + re);

    for (var file in files) {
      if (re.exec(file)) {
        result.push(file);
      }
    }
  }

  return result;
};

/**
  Turns a glob string into a regexp
*/
function fs_glob_to_regexp(glob) {
  if (typeof glob !== 'string') {
    throw new Error("file_glob_to_regexp: glob must be a string");
  }

  // make sure absolute
  glob = fs_expand_path(glob);
  // console.log("full glob is: " + glob);
  
  var parts = glob.split(''), length = parts.length, result = '';

  var opt_group_stack = 0;

  for (var i = 0; i < length; i++) {
    var cur = parts[i];

    switch (cur) {
      case '*':
        if (parts[i + 1] == '*') {
          result += '.*';
          i++;
        }
        else {
          result += '[^/]*';
        }
        break;

      case '.':
        result += '\\';
        result += cur;
        break;

      case ',':
        if (opt_group_stack) {
          result += '|';
        }
        else {
          result += ',';
        }
        break;

      case '{':
        result += '(';
        opt_group_stack++;
        break;

      case '}':
        if (opt_group_stack) {
          result += ')';
          opt_group_stack--;
        }
        else {
          result += '}'
        }
        break;

      default:
        result += cur;
    }
  }

  return new RegExp('^' + result + '$');
};


/**
  Valid file extensions opal can load/run
*/
var load_extensions = {};

load_extensions['.js'] = function(loader, path) {
  var source = loader.file_contents(path);
  return load_execute_file(loader, source, path);
};

load_extensions['.rb'] = function(loader, path) {
  var source = loader.ruby_file_contents(path);
  return load_execute_file(loader, source, path);
};

/**
  Require a file by its given lib path/id, or a full path.

  @param {String} id lib path/name
  @return {Boolean}
*/
var load_require = Op.require = Rt.require = function(lib) {
  var resolved = Op.loader.resolve_lib(lib);
  var cached = Op.cache[resolved];

  // If we have a cache for this require then it has already been
  // required. We return false to indicate this.
  if (cached) return false;

  Op.cache[resolved] = true;

  // try/catch wrap entire file load?
  load_file(Op.loader, resolved);

  return true;
};

/**
  Sets the primary 'gem', by name, so we know which cwd to use etc.
  This can be changed at anytime, but it is only really recomended
  before the application is run.

  Also, if a gem with the given name cannot be found, then an error
  will/should be thrown.

  @param {String} name The root gem name to use
*/
Op.primary = function(name) {
  Fs.cwd = '/' + name;
};

/**
  Just go ahead and run the given block of code. The passed function
  should rake the usual runtime, self and file variables which it will
  be passed.

  @param {Function} body
*/
Op.run = function(body) {
  var res = Qnil;

  if (typeof body != 'function') {
    throw new Error("Expected body to be a function");
  }

  try {
    res = body(Rt, Rt.top, "(opal)");
  }
  catch (exc) {
    var exc, stack;

    if (exc && exc['@message']) {
      puts(exc.$klass.__classid__ + ': ' + exc['@message']);
    }
    else {
      puts('NativeError: ' + exc.message);
    }

    // first try (if in debug mode...)
    if (typeof OPAL_DEBUG != 'undefined') {
      puts(stack);
      Db.stack = [];
    }
    else if (stack = exc.stack) {
      puts(stack);
    }
  }
  return res;
};

/**
  Register a lib or gem with the given info. If info is an object then
  a gem will be registered with the object represented a JSON version
  of the gemspec for the gem. If the info is simply a function (or
  string?) then a singular lib will be registerd with the function as
  its body.

  @param {String} name The lib/gem name
  @param {Object, Function} info
*/
Op.register = function(name, info) {
  // make sure name is useful
  if (typeof name !== 'string') {
    throw new Error("Cannot register a lib without a proper name");
  }

  // registering a lib/file?
  if (typeof info === 'string' || typeof info === 'function') {
    load_register_lib(name, info);
  }
  // registering a gem?
  else if (typeof info === 'object') {
    load_register_gem(name, info);
  }
  // something has gone wrong..
  else {
    throw new Error("Invalid gem/lib data for '" + name + "'");
  }
};

/**
  Actually register a predefined gem. This is for the browser context
  where gems can be serialized into JSON and defined before hand.

  @param {String} name Gem name
  @param {Object} info Serialized gemspec
*/
function load_register_gem(name, info) {
  var factories = Op.loader.factories,
      paths     = Op.loader.paths;

  // register all lib files
  var files = info.files || {};

  // root dir for gem is '/gem_name'
  var root_dir = '/' + name;

  // for now assume './lib' as dir for all libs (should be dynamic..)
  var lib_dir = './lib';

  // add lib dir to paths
  paths.unshift(fs_expand_path(fs_join(root_dir, lib_dir)));

  for (var file in files) {
    if (files.hasOwnProperty(file)) {
      var file_path = fs_expand_path(fs_join(root_dir, file));
      factories[file_path] = files[file];
    }
  }

  // register other info? (version etc??)
}

/**
  Register a single lib/file in browser before its needed. These libs
  are added to top level dir '/lib_name.rb'

  @param {String} name Lib name
  @param {Function, String} factory
*/
function load_register_lib(name, factory) {
  var path = '/' + name;
  Op.loader.factories[path] = factory;
}

/**
  The loader is the core machinery used for loading and executing libs
  within opal. An instance of opal will have a `.loader` property which
  is an instance of this Loader class. A Loader is responsible for
  finding, opening and reading contents of libs on disk. Within the
  browser a loader may use XHR requests or cached libs defined by JSON
  to load required libs/gems.

  @constructor
  @param {opal} opal Opal instance to use
*/
function Loader(opal) {
  this.opal = opal;
  this.paths = ['', '/lib'];
  this.factories = {};
  return this;
}

// For minimizing
var Lp = Loader.prototype;

/**
  The paths property is an array of disk paths in which to search for
  required modules. In the browser this functionality isn't really used.

  This array is created within the constructor method for uniqueness
  between instances for correct sandboxing.
*/
Lp.paths = null;

/**
  factories of registered packages, paths => function/string. This is
  generic, but in reality only the browser uses this, and it is treated
  as the mini filesystem. Not just factories can go here, anything can!
  Images, text, json, whatever.
*/
Lp.factories = {};

/**
  Resolves the path to the lib, which can then be used to load. This
  will throw an error if the module cannot be found. If this method
  returns a successful path, then subsequent methods can assume that
  the path exists.

  @param {String} lib The lib name/path to look for
  @return {String}
*/
Lp.resolve_lib = function(lib) {
  var resolved = this.find_lib(lib, this.paths);

  if (!resolved) {
    throw new Error("LoadError: no such file to load -- " + lib);
  }

  return resolved;
};

/**
  Locates the lib/file using the given paths.

  @param {String} lib The lib path/file to look for
  @param {Array} paths Load paths to use
  @return {String} Located path
*/
Lp.find_lib = function(id, paths) {
  var extensions = this.valid_extensions, factories = this.factories, candidate;

  for (var i = 0, ii = extensions.length; i < ii; i++) {
    for (var j = 0, jj = paths.length; j < jj; j++) {
      candidate = fs_join(paths[j], id + extensions[i]);

      if (factories[candidate]) {
        return candidate;
      }
    }
  }

  // try full path (we try to load absolute path!)
  if (factories[id]) {
    return id;
  }

  // try full path with each extension
  for (var i = 0; i < extensions.length; i++) {
    candidate = id + extensions[i];
    if (factories[candidate]) {
      return candidate;
    }
  }

  // try each path with no extension (if id already has extension)
  for (var i = 0; i < paths.length; i++) {
    candidate = fs_join(paths[j], id);

    if (factories[candidate]) {
      return candidate;
    }
  }

  return null;
};

/**
  Valid factory format for use in require();
*/
Lp.valid_extensions = ['.js', '.rb'];

/**
  Get lib contents for js files
*/
Lp.file_contents = function(path) {
  return this.factories[path];
};

Lp.ruby_file_contents = function(path) {
  return this.factories[path];
};

/**
  Actually run file with resolved name.

  @param {Loader} loader
  @param {String} path
*/
function load_file(loader, path) {
  var ext = load_extensions[PATH_RE.exec(path)[3] || '.js'];

  if (!ext) {
    throw new Error("load_run_file - Bad extension for resolved path");
  }

  ext(loader, path);
}

/**
  Run content which must now be javascript. Arguments we pass to func
  are:

    $rb
    top_self
    filename

  @param {String, Function} content
  @param {String} path
*/
function load_execute_file(loader, content, path) {
  var args = [Rt, top_self, path];

  if (typeof content === 'function') {
    return content.apply(Op, args);

  } else if (typeof content === 'string') {
    var func = loader.wrap(content, path);
    return func.apply(Op, args);

  } else {
    throw new Error(
      "Loader.execute - bad content sent for '" + path + "'");
  }
}

/**
  Getter method for getting the load path for opal.

  @param {String} id The globals id being retrieved.
  @return {Array} Load paths
*/
function load_path_getter(id) {
  return Rt.A(opal.loader.paths);
}

/**
  Getter method to get all loaded features.

  @param {String} id Feature global id
  @return {Array} Loaded features
*/
function loaded_feature_getter(id) {
  return loaded_features;
}

function obj_require(obj, path) {
  return Rt.require(path) ? Qtrue : Qfalse;
}

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
        if (arity != len - 1) {
          raise(eArgError, "wrong number of arguments(" + (len - 1) + " for " + arity + ")");
        }
      }
      else {
        if ((-arity - 1) > len) {
          console.log("raising for " + name + " " + len + " for " + arity);
          raise(eArgError, "wrong number of arguments(" + len + " for " + arity + ")");
        }
      }

      // push call onto stack
      Db.push(klass, arguments[0], name, Array.prototype.slice.call(arguments, 1));

      // check for block and pass it on
      if (block.f == arguments.callee) {
        block.f = public_body
      }

      res = public_body.apply(this, [].slice.call(arguments));

      Db.pop();

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


Db.stack = [];

Db.push = function(klass, object, method) {
  this.stack.push({ klass: klass, object: object, method: method });
};

Db.pop = function() {
  this.stack.pop();
};

// Returns string
Db.backtrace = function() {
  var trace = [], stack = this.stack, frame;

  for (var i = stack.length - 1; i >= 0; i--) {
    frame = stack[i];
    trace.push("\tfrom " + frame.klass.$m.inspect(frame.klass) + '#' + frame.method);
  }

  return trace.join("\n");
};

init();

})();

// if in a commonjs system already (node etc), exports become our opal
// object. Otherwise, in the browser, we just get a top level opal var
if ((typeof require !== 'undefined') && (typeof module !== 'undefined')) {
  module.exports = opal;
}
opal.register('core.rb', function($rb, self, __FILE__) { function $$(){$class(self, nil, 'Module', function(self) {

  $defn(self, 'private', function(self, args) {args = [].slice.call(arguments, 1);
    $rb.private_methods(self, args);
    return self;
  }, -1);

  $defn(self, 'public', function(self, args) {args = [].slice.call(arguments, 1);
    $rb.public_methods(self, args);
    return self;
  }, -1);

  $defn(self, 'include', function(self, mods) {var __a;mods = [].slice.call(arguments, 1);
    var i = mods.length - 1, mod;
    while (i >= 0) {
      mod = mods[i];
      (__a = mod).$m.append_features(__a, self);
      (__a = mod).$m.included(__a, self);
      i--;
    }
    return self;
  }, -1);

  $defn(self, 'append_features', function(self, mod) {
    $rb.include_module(mod, self);
    return self;
  }, 1);

  return $defn(self, 'included', function(self, mod) {
    return nil;
  }, 1);
}, 0);

$class(self, nil, 'Kernel', function(self) {var __a;
  self.$m.$private(self);






  $defn(self, 'require', function(self, path) {
    $rb.require(path) ? Qtrue : Qfalse;
    return Qtrue;
  }, 1);





  return $defn(self, 'puts', function(self, a) {var __a;a = [].slice.call(arguments, 1);
    (__a = $rb.gg('$stdout')).$m.puts.apply(nil, [__a].concat(a));
    return nil;
  }, -1);
}, 2);

$class($rb.gg('$stdout'), nil, nil, function(self) {



  return $defn(self, 'puts', function(self, a) {var __a;a = [].slice.call(arguments, 1);
    for (var i = 0, ii = a.length; i < ii; i++) {
      console.log((__a = a[i]).$m.to_s(__a).toString());
    }
    return nil;
  }, -1);
}, 1);

$class(self, nil, 'Object', function(self) { var __a;
  return self.$m.$include(self, $cg(self, 'Kernel'));
}, 0);

$class(self, nil, 'Symbol', function(self) {
  return $defn(self, 'to_s', function(self) {
    return self.toString();
  }, 0);
}, 0);

$class(self, nil, 'String', function(self) {
  return $defn(self, 'to_s', function(self) {
    return self.toString();
  }, 0);
}, 0);

self.$m.$require(self, 'core/basic_object');
self.$m.$require(self, 'core/object');
self.$m.$require(self, 'core/module');
self.$m.$require(self, 'core/class');
self.$m.$require(self, 'core/kernel');
self.$m.$require(self, 'core/top_self');
self.$m.$require(self, 'core/nil_class');
self.$m.$require(self, 'core/true_class');
self.$m.$require(self, 'core/false_class');
self.$m.$require(self, 'core/enumerable');
self.$m.$require(self, 'core/array');
self.$m.$require(self, 'core/numeric');
self.$m.$require(self, 'core/hash');
self.$m.$require(self, 'core/error');
self.$m.$require(self, 'core/string');
self.$m.$require(self, 'core/symbol');
self.$m.$require(self, 'core/proc');
self.$m.$require(self, 'core/range');
self.$m.$require(self, 'core/regexp');
self.$m.$require(self, 'core/match_data');
self.$m.$require(self, 'core/file');
self.$m.$require(self, 'core/dir');

var platform = opal.platform;
$rb.cs(self, 'RUBY_PLATFORM', platform.platform);
$rb.cs(self, 'RUBY_ENGINE', platform.engine);
$rb.cs(self, 'RUBY_VERSION', platform.version);

return $rb.cs(self, 'ARGV', platform.argv);
}
var __a;var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;$rb.mm(['append_features', 'included', 'private', 'puts', 'to_s', 'include', 'require']);return $$();
 });
opal.register('core/array.rb', function($rb, self, __FILE__) { function $$(){return $class(self, nil, 'Array', function(self) { var __a;










  $defs(self, '[]', function(self, objs) {var __a;objs = [].slice.call(arguments, 1);
    var ary = self.$m.$allocate(self);
    ary.splice.apply(ary, [0, 0].concat(objs));
    return ary;
  }, -1);

  $defs(self, 'allocate', function(self) {
    var arr = [];
    arr.$klass = self;
    arr.$m = self.$m_tbl;
    return arr;
  }, 0);

  $defn(self, 'initialize', function(self, len, fill) {if (fill == undefined) {fill = nil;}
    var ary = self;

    for (var i = 0; i < len; i++) {
      ary[i] = fill;
    }

    ary.length = len;

    return self;
  }, -2);





  $defn(self, 'inspect', function(self) {var __a;
    var description = [];

    for (var i = 0, length = self.length; i < length; i++) {
      description.push((__a = self[i]).$m.inspect(__a));
    }

    return '[' + description.join(', ') + ']';
  }, 0);



  $defn(self, 'to_s', function(self) {var __a;
    var description = [];

    for (var i = 0, length = self.length; i < length; i++) {
      description.push((__a = self[i]).$m.to_s(__a));
    }

    return description.join('');
  }, 0);












  $defn(self, '<<', function(self, obj) {
    self.push(obj);
    return self;
  }, 1);









  $defn(self, 'length', function(self) {
    return self.length;
  }, 0);

  self.$m.$alias_method(self, $symbol_1, $symbol_2);

















  $defn(self, 'each', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    if(!(($yy == $y.y ? Qfalse : Qtrue)).$r) {self.$m.$raise(self, "Array#each no block given")};

    for (var i = 0, len = self.length; i < len; i++) {
    if ($yy($ys, self[i]) == $yb) { return $yb.$value; };
    }
    return self;
  }, 0);



  $defn(self, 'each_with_index', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    if(!(($yy == $y.y ? Qfalse : Qtrue)).$r) {self.$m.$raise(self, "Array#each_with_index no block given")};

    for (var i = 0, len = self.length; i < len; i++) {
      ((__a = $yy($ys, self[i], i)) == $yb ? $break() : __a);
    }
    return self;
  }, 0);

















  $defn(self, 'each_index', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    if(!(($yy == $y.y ? Qfalse : Qtrue)).$r) {self.$m.$raise(self, "Array#each_index no block given")};

    for (var i = 0, len = self.length; i < len; i++) {
    if ($yy($ys, i) == $yb) { return $yb.$value; };
    }
    return self;
  }, 0);













  $defn(self, 'push', function(self, objs) {objs = [].slice.call(arguments, 1);
    for (var i = 0, ii = objs.length; i < ii; i++) {
      self.push(objs[i]);
    }
    return self;
  }, -1);















  $defn(self, 'index', function(self, obj) {var __a;
    for (var i = 0, len = self.length; i < len; i++) {
      if ((__a = self[i]).$m['=='](__a, obj).$r) {
        return i;
      }
    }

    return nil;
  }, 1);











  $defn(self, '+', function(self, other) {
    return self.slice(0).concat(other.slice());
  }, 1);











  $defn(self, '-', function(self, other) {var __a;
    return self.$m.$raise(self, "Array#- not yet implemented");
  }, 1);













  $defn(self, '==', function(self, other) {var __a;
    if (self.$hash() == other.$hash()) return Qtrue;
    if (self.length != other.length) return Qfalse;

    for (var i = 0; i < self.length; i++) {
      if (!(__a = self[i]).$m['=='](__a, other[i]).$r) {
        return Qfalse;
      }
    }

    return Qtrue;
  }, 1);















  $defn(self, 'assoc', function(self, obj) {var __a;
    var arg;

    for (var i = 0; i < self.length; i++) {
      arg = self[i];

      if (arg.length && (__a = arg[0]).$m['=='](__a, obj).$r) {
        return arg;
      }
    }

    return nil;
  }, 1);













  $defn(self, 'at', function(self, idx) {
    if (idx < 0) idx += self.length;

    if (idx < 0 || idx >= self.length) return nil;
    return self[idx];
  }, 1);









  $defn(self, 'clear', function(self) {
    self.splice(0);
    return self;
  }, 0);












  $defn(self, 'select', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    var result = [], arg;

    for (var i = 0, ii = self.length; i < ii; i++) {
      arg = self[i];

      if (((__a = $yy($ys, arg)) == $yb ? $break() : __a).$r) {
        result.push(arg);
      }
    }

    return result;
  }, 0);











  $defn(self, 'collect', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    if(!(($yy == $y.y ? Qfalse : Qtrue)).$r) {self.$m.$raise(self, "Array#collect no block given")};

    var result = [];

    for (var i = 0, ii = self.length; i < ii; i++) {
      result.push(((__a = $yy($ys, self[i])) == $yb ? $break() : __a));
    }

    return result;
  }, 0);

  self.$m.$alias_method(self, $symbol_3, $symbol_4);













  $defn(self, 'collect!', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    for (var i = 0, ii = self.length; i < ii; i++) {
      self[i] = ((__a = $yy($ys, self[i])) == $yb ? $break() : __a);
    }

    return self;
  }, 0);


  $defn(self, 'dup', function(self) {
    return self.slice(0);
  }, 0);









  $defn(self, 'compact', function(self) {
    var result = [], length = self.length;

    for (var i = 0; i < length; i++) {
      if (self[i] != nil) {
        result.push(self[i]);
      }
    }

    return result;
  }, 0);













  $defn(self, 'compact!', function(self) {
    var length = self.length;

    for (var i = 0; i < length; i++) {
      if (self[i] == nil) {
        self.splice(i, 1);
        i--;
      }
    }

    return length == self.length ? nil : self;
  }, 0);










  $defn(self, 'concat', function(self, other) {
    var length = other.length;

    for (var i = 0; i < length; i++) {
      self.push(other[i]);
    }

    return self;
  }, 1);













  $defn(self, 'count', function(self, obj) {var __a;
    if (obj != undefined) {
      var total = 0;

      for (var i = 0; i < self.length; i++) {
        if ((__a = self[i]).$m['=='](__a, obj).$r) {
          total++;
        }
      }

      return total;
    } else {
      return self.length;
    }
  }, 1);



















  $defn(self, 'delete', function(self, obj) {var __a;
    var length = self.length;

    for (var i = 0; i < self.length; i++) {
      if ((__a = self[i]).$m['=='](__a, obj).$r) {
        self.splice(i, 1);
        i--;
      }
    }

    return length == self.length ? nil : obj;
  }, 1);
















  $defn(self, 'delete_at', function(self, idx) {
    if (idx < 0) idx += self.length;
    if (idx < 0 || idx >= self.length) return nil;
    var res = self[idx];
    self.splice(idx, 1);
    return self;
  }, 1);










  $defn(self, 'delete_if', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    for (var i = 0, ii = self.length; i < ii; i++) {
      if (((__a = $yy($ys, self[i])) == $yb ? $break() : __a).$r) {
        self.splice(i, 1);
        i--;
        ii = self.length;
      }
    }
    return self;
  }, 0);













  $defn(self, 'drop', function(self, n) {
    if (n > self.length) return [];
    return self.slice(n);
  }, 1);












  $defn(self, 'drop_while', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    for (var i = 0; i < self.length; i++) {
      if (!((__a = $yy($ys, self[i])) == $yb ? $break() : __a).$r) {
        return self.slice(i);
      }
    }

    return [];
  }, 0);









  $defn(self, 'empty?', function(self) {
    return self.length == 0 ? Qtrue : Qfalse;
  }, 0);




























  $defn(self, 'fetch', function(self, idx, defaults) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    var original = idx;

    if (idx < 0) idx += self.length;
    if (idx < 0 || idx >= self.length) {
      if (defaults == undefined)
        return rb_raise("Index Error: Array#fetch");
      else if (__block__)
        return ((__a = $yy($ys, original)) == $yb ? $break() : __a);
      else
        return defaults;
    }

    return self[idx];
  }, 2);















  $defn(self, 'first', function(self, count) {if (count == undefined) {count = nil;}
    if (count == nil) {
      if (self.length == 0) return nil;
      return self[0];
    }
    return self.slice(0, count);
  }, -1);






















  $defn(self, 'flatten', function(self, level) {var __a;if (level == undefined) {level = nil;}
    var result = [], item;

    for (var i = 0; i < self.length; i++) {
      item = self[i];

      if (item.hasOwnProperty('length')) {
        if (level == nil)
          result = result.concat((__a = item).$m.flatten(__a));
        else if (level == 0)
          result.push(item);
        else
          result = result.concat((__a = item).$m.flatten(__a, level - 1));
      } else {
        result.push(item);
      }
    }

    return result;
  }, -1);
















  $defn(self, 'flatten!', function(self, level) {var __a;if (level == undefined) {level = nil;}
    var length = self.length;
    var result = self.$m.flatten(self, level);
    self.splice(0);

    for (var i = 0; i < result.length; i++) {
      self.push(result[i]);
    }

    if (self.length == length)
      return nil;

    return self;
  }, -1);










  $defn(self, 'include?', function(self, member) {var __a;
    for (var i = 0; i < self.length; i++) {
      if ((__a = self[i]).$m['=='](__a, member).$r) {
        return Qtrue;
      }
    }

    return Qfalse;
  }, 1);














  $defn(self, 'replace', function(self, other) {
    self.splice(0);

    for (var i = 0; i < other.length; i++) {
      self.push(other[i]);
    }

    return self;
  }, 1);















  $defn(self, 'insert', function(self, idx, objs) {objs = [].slice.call(arguments, 2);
    if (idx < 0) idx += self.length;

    if (idx < 0 || idx >= self.length)
      rb_raise("IndexError: out of range");

    self.splice.apply(self, [idx, 0].concat(objs));
    return self;
  }, -2);













  $defn(self, 'join', function(self, sep) {var __a;if (sep == undefined) {sep = '';}
    var result = [];

    for (var i = 0; i < self.length; i++) {
      result.push((__a = self[i]).$m.to_s(__a));
    }

    return result.join(sep);
  }, -1);










  $defn(self, 'keep_if', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    for (var i = 0; i < self.length; i++) {
      if (!((__a = $yy($ys, self[i])) == $yb ? $break() : __a).$r) {
        self.splice(i, 1);
        i--;
      }
    }

    return self;
  }, 0);














  $defn(self, 'last', function(self, count) {if (count == undefined) {count = nil;}
    if (count == nil) {
      if (self.length == 0) return nil;
      return self[self.length - 1];
    } else {
      if (count > self.length) count = self.length;
      return self.slice(self.length - count, self.length);
    }
  }, -1);

















  $defn(self, 'pop', function(self, count) {if (count == undefined) {count = nil;}
    if (count == nil) {
      if (self.length) return self.pop();
      return nil;
    } else {
      return self.splice(self.length - count, self.length);
    }
  }, -1);















  $defn(self, 'rassoc', function(self, obj) {var __a;
    var test;

    for (var i = 0; i < self.length; i++) {
      test = self[i];
      if (test.hasOwnProperty('length') && test[1] != undefined) {
        if ((__a = test[1]).$m['=='](__a, obj).$r) return test;
      }
    }

    return nil;
  }, 1);













  $defn(self, 'reject', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    var result = [];

    for (var i = 0; i < self.length; i++) {
      if (!((__a = $yy($ys, self[i])) == $yb ? $break() : __a).$r) {
        result.push(self[i]);
      }
    }

    return result;
  }, 0);















  $defn(self, 'reject!', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    var length = self.length;

    for (var i = 0; i < self.length; i++) {
      if (((__a = $yy($ys, self[i])) == $yb ? $break() : __a).$r) {
        self.splice(i, 1);
        i--;
      }
    }

    return self.length == length ? nil : self;
  }, 0);











  $defn(self, 'reverse', function(self) {
    var result = [];

    for (var i = self.length - 1; i >= 0; i--) {
      result.push(self[i]);
    }

    return result;
  }, 0);












  $defn(self, 'reverse!', function(self) {
    var length = self.length / 2, tmp;

    for (var i = 0; i < length; i++) {
      tmp = self[i];
      self[i] = self[self.length - (i + 1)];
      self[self.length - (i + 1)] = tmp;
    }

    return self;
  }, 0);












  $defn(self, 'reverse_each', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    var ary = self, len = ary.length;

    for (var i = len - 1; i >= 0; i--) {
      ((__a = $yy($ys, ary[i])) == $yb ? $break() : __a);
    }

    return self;
  }, 0);

















  $defn(self, 'rindex', function(self, obj) {var __a;if (obj == undefined) {obj = undefined;}
    if (obj != undefined) {
      for (var i = self.length - 1; i >=0; i--) {
        if ((__a = self[i]).$m['=='](__a, obj).$r) {
          return i;
        }
      }
    } else if (true || __block__) {
      rb_raise("array#rindex needs to do block action");
    }

    return nil;
  }, -1);
















  $defn(self, 'select!', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    var length = self.length;

    for (var i = 0; i < self.length; i++) {
      if (!((__a = $yy($ys, self[i])) == $yb ? $break() : __a).$r) {
        self.splice(i, 1);
        i--;
      }
    }

    return self.length == length ? nil : self;
  }, 0);






















  $defn(self, 'shift', function(self, count) {if (count == undefined) {count = nil;}
    if (count != nil)
      return self.splice(0, count);

    if (self.length) 
      return self.shift();

    return nil;
  }, -1);
























  $defn(self, 'slice!', function(self, index, length) {if (length == undefined) {length = nil;}
    var size = self.length;

    if (index < 0) index += size;

    if (index >= size || index < 0) return nil;

    if (length != nil) {
      if (length <= 0 || length > self.length) return nil;
      return self.splice(index, index + length);
    } else {
      return self.splice(index, 1)[0];
    }
  }, -2);










  $defn(self, 'take', function(self, count) {
    return self.slice(0, count);
  }, 1);












  $defn(self, 'take_while', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    var result = [], arg;

    for (var i = 0, ii = self.length; i < ii; i++) {
      arg = self[i];
      if (((__a = $yy($ys, arg)) == $yb ? $break() : __a).$r) {
        result.push(self[i]);
      } else {
        break;
      }
    }

    return result;
  }, 0);










  $defn(self, 'to_a', function(self) {
    return self;
  }, 0);












  $defn(self, 'uniq', function(self) {
    var result = [], seen = [];

    for (var i = 0; i < self.length; i++) {
      var test = self[i], hash = test.$hash();
      if (seen.indexOf(hash) == -1) {
        seen.push(hash);
        result.push(test);
      }
    }

    return result;
  }, 0);













  $defn(self, 'uniq!', function(self) {
    var seen = [], length = self.length;

    for (var i = 0; i < self.length; i++) {
      var test = self[i], hash = test.$hash();
      if (seen.indexOf(hash) == -1) {
        seen.push(hash);
      } else {
        self.splice(i, 1);
        i--;
      }
    }

    return self.length == length ? nil : self;
  }, 0);













  $defn(self, 'unshift', function(self, objs) {objs = [].slice.call(arguments, 1);
    for (var i = objs.length - 1; i >= 0; i--) {
      self.unshift(objs[i]);
    }

    return self;
  }, -1);











  $defn(self, '&', function(self, other) {
    var result = [], seen = [];

    for (var i = 0; i < self.length; i++) {
      var test = self[i], hash = test.$hash();

      if (seen.indexOf(hash) == -1) {
        for (var j = 0; j < other.length; j++) {
          var test_b = other[j], hash_b = test_b.$hash();

          if ((hash == hash_b) && seen.indexOf(hash) == -1) {
            seen.push(hash);
            result.push(test);
          }
        }
      }
    }

    return result;
  }, 1);

















  $defn(self, '*', function(self, arg) {var __a;
    if (typeof arg == 'string') {
      return self.$m.join(self, arg);
    } else {
      var result = [];
      for (var i = 0; i < parseInt(arg); i++) {
        result = result.concat(self);
      }

      return result;
    }
  }, 1);


























  $defn(self, '[]', function(self, index, length) {if (length == undefined) {length = undefined;}
    var ary = self, size = ary.length;

    if (index < 0) index += size;

    if (index >= size || index < 0) return nil;

    if (length != undefined) {
      if (length <= 0) return [];
      return ary.slice(index, index + length);
    } else {
      return ary[index];
    }
  }, -2);




  return $defn(self, '[]=', function(self, index, value) {
    if (index < 0) index += self.length;
    return self[index] = value;
  }, 2);
}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G, $symbol_1 = $symbol('size'), $symbol_2 = $symbol('length'), $symbol_3 = $symbol('map'), $symbol_4 = $symbol('collect');$rb.mm(['allocate', 'inspect', 'to_s', 'alias_method', 'raise', '==', 'flatten', 'join']);return $$();
 });
opal.register('core/basic_object.rb', function($rb, self, __FILE__) { function $$(){




return $class(self, nil, 'BasicObject', function(self) {

  $defn(self, 'initialize', function(self, a) {a = [].slice.call(arguments, 1);    return nil;

  }, -1);

  $defn(self, '==', function(self, other) {
    if (self == other) return Qtrue;
    return Qfalse;
  }, 1);

  $defn(self, 'equal?', function(self, other) {var __a;
    return self.$m['=='](self, other);
  }, 1);

  $defn(self, '!', function(self) {
    return (self.$r ? Qfalse : Qtrue);
  }, 0);

  $defn(self, '!=', function(self, obj) {var __a;
    return (self.$m['=='](self, obj).$r ? Qfalse : Qtrue);
  }, 1);

  $defn(self, '__send__', function(self, method_id, args) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;args = [].slice.call(arguments, 2);var block = (($yy == $y.y) ? nil: $yy);
    var method = self.$m[method_id.$m.to_s(method_id)];

    if ($B.f == arguments.callee) {
      $B.f = method;
    }

    args.unshift(self);

    return method.apply(self, args);
  }, -2);

  $defn(self, 'instance_eval', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;var block = (($yy == $y.y) ? nil: $yy);
    if(!(($yy == $y.y ? Qfalse : Qtrue)).$r) {self.$m.$raise(self, $cg(self, 'ArgumentError'), "block not supplied")};
    block(self);
    return self;
  }, 0);

  return $defn(self, 'method_missing', function(self, sym, args) {var __a, __b, __c;args = [].slice.call(arguments, 2);
    return self.$m.$raise(self, $cg(self, 'NoMethodError'), ("undefined method `" + (__b = sym).$m.to_s(__b) + "` for " + (__b = self.$m.inspect(self)).$m.to_s(__b)));
  }, -2);
}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;$rb.mm(['==', 'to_s', 'raise', 'inspect']);return $$();
 });
opal.register('core/class.rb', function($rb, self, __FILE__) { function $$(){return $class(self, $cg(self, 'Module'), 'Class', function(self) {

  $defn(self, 'allocate', function(self) {
    return new $rb.RObject(self);
  }, 0);

  $defn(self, 'new', function(self, args) {var obj, __a;args = [].slice.call(arguments, 1);
    obj = self.$m.$allocate(self);

    if ($B.f == arguments.callee) {
      $B.f = obj.$m.initialize;
    }

    obj.$m.initialize.apply(nil, [obj].concat(args));
    return obj;
  }, -1);

  $defn(self, 'inherited', function(self, cls) {
    return nil;
  }, 1);

  $defn(self, 'superclass', function(self) {
    var sup = self.$super;

    if (!sup) {
      if (self == $rb.BasicObject) return nil;
      throw new Error('RuntimeError: uninitialized class');
    }

    return sup;
  }, 0);

  return $defn(self, 'native_prototype', function(self, proto) {
    $rb.native_prototype(self, proto);
    return nil;
  }, 1);
}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;$rb.mm(['allocate', 'initialize']);return $$();
 });
opal.register('core/dir.rb', function($rb, self, __FILE__) { function $$(){
return $class(self, nil, 'Dir', function(self) {



  var OPAL_FS = $rb.opal.fs;




  $defs(self, 'getwd', function(self) {
    return OPAL_FS.cwd;
  }, 0);




  $defs(self, 'pwd', function(self) {
    return OPAL_FS.cwd;
  }, 0);

  return $defs(self, '[]', function(self, a) {a = [].slice.call(arguments, 1);
    return OPAL_FS.glob.apply(OPAL_FS, a);
  }, -1);
}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;return $$();
 });
opal.register('core/enumerable.rb', function($rb, self, __FILE__) { function $$(){
return $class(self, nil, 'Enumerable', function(self) {var __a;









  $defn(self, 'to_a', function(self) {var ary, __a, __b;
    ary = [];
    ($B.f = self.$m.$each, ($B.p =function(self, arg) {if (arg === undefined) { arg = nil; }      ary.push(arg);}).$proc =[self], $B.f)(self);
    return ary;
  }, 0);

  self.$m.$alias_method(self, $symbol_1, $symbol_2);

  $defn(self, 'collect', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a, __b;var block = (($yy == $y.y) ? nil: $yy);
    if(!(($yy == $y.y ? Qfalse : Qtrue)).$r) {self.$m.$raise(self, "Enumerable#collect no block given")};
    var result = [];

    ($B.f = self.$m.$each, ($B.p =function(self, args) { var __a;args = [].slice.call($A, 1);
      result.push(block.$m.call.apply(nil, [block].concat(args)));
    }).$proc =[self], $B.f)(self);

    return result;
  }, 0);

  return self.$m.$alias_method(self, $symbol_3, $symbol_4);
}, 2);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G, $symbol_1 = $symbol('entries'), $symbol_2 = $symbol('to_a'), $symbol_3 = $symbol('map'), $symbol_4 = $symbol('collect');$rb.mm(['each', 'alias_method', 'raise', 'call']);return $$();
 });
opal.register('core/error.rb', function($rb, self, __FILE__) { function $$(){
































$class(self, nil, 'Exception', function(self) {

  $defs(self, 'allocate', function(self) {
    var err = new Error();
    err.$klass = self;
    err.$m = self.$m_tbl;
    return err;
  }, 0);

  $defn(self, 'initialize', function(self, message) {if (message == undefined) {message = '';}
    return self['@message'] = message;
  }, -1);

  $defn(self, 'message', function(self) {var __a;self['@message']==undefined&&(self['@message']=nil);
    return ((__a = self['@message']).$r ? __a : self.message);
  }, 0);

  $defn(self, 'inspect', function(self) {self['@message']==undefined&&(self['@message']=nil);
    return "#<" + self.$klass.__classid__ + ": '" + self['@message'] + "'>";
  }, 0);

  return $defn(self, 'to_s', function(self) {self['@message']==undefined&&(self['@message']=nil);
    return self['@message'];
  }, 0);
}, 0);

$class(self, $cg(self, 'Exception'), 'StandardError', function(self) {  return nil;}, 0);
$class(self, $cg(self, 'Exception'), 'RuntimeError', function(self) {  return nil;}, 0);
$class(self, $cg(self, 'StandardError'), 'LocalJumpError', function(self) {  return nil;}, 0);
$class(self, $cg(self, 'StandardError'), 'TypeError', function(self) {  return nil;}, 0);

$class(self, $cg(self, 'StandardError'), 'NameError', function(self) {  return nil;}, 0);
$class(self, $cg(self, 'NameError'), 'NoMethodError', function(self) {  return nil;}, 0);
$class(self, $cg(self, 'StandardError'), 'ArgumentError', function(self) {  return nil;}, 0);

$class(self, $cg(self, 'Exception'), 'ScriptError', function(self) {  return nil;}, 0);
$class(self, $cg(self, 'ScriptError'), 'LoadError', function(self) {  return nil;}, 0);

$class(self, $cg(self, 'StandardError'), 'IndexError', function(self) {  return nil;}, 0);
$class(self, $cg(self, 'IndexError'), 'KeyError', function(self) {  return nil;}, 0);
return $class(self, $cg(self, 'StandardError'), 'RangeError', function(self) {  return nil;}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;return $$();
 });
opal.register('core/false_class.rb', function($rb, self, __FILE__) { function $$(){




















$class(self, nil, 'FalseClass', function(self) {









  $defn(self, 'to_s', function(self) {
    return "false";
  }, 0);










  $defn(self, '&', function(self, other) {
    return Qfalse;
  }, 1);












  $defn(self, '|', function(self, other) {
    return other.$r ? Qtrue : Qfalse;
  }, 1);












  return $defn(self, '^', function(self, other) {
    return other.$r ? Qtrue : Qfalse;
  }, 1);
}, 0);

return $rb.cs(self, 'FALSE', Qfalse);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;return $$();
 });
opal.register('core/file.rb', function($rb, self, __FILE__) { function $$(){
return $class(self, nil, 'File', function(self) {

  var OPAL_FS = $rb.opal.fs;








  $defs(self, 'expand_path', function(self, file_name, dir_string) {if (dir_string == undefined) {dir_string = nil;}
    if (dir_string.$r) {
      return OPAL_FS.expand_path(file_name, dir_string);
    } else {
      return OPAL_FS.expand_path(file_name);
    }
  }, -2);






  $defs(self, 'join', function(self, str) {str = [].slice.call(arguments, 1);
    return OPAL_FS.join.apply(OPAL_FS, str);
  }, -1);






  $defs(self, 'dirname', function(self, file_name) {
    return OPAL_FS.dirname(file_name);
  }, 1);





  $defs(self, 'extname', function(self, file_name) {
    return OPAL_FS.extname(file_name);
  }, 1);








  $defs(self, 'basename', function(self, file_name, suffix) {
    return OPAL_FS.basename(file_name, suffix);
  }, 2);

  return $defs(self, 'exist?', function(self, path) {
    return OPAL_FS.exist_p(path) ? Qtrue : Qfalse;
  }, 1);
}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;return $$();
 });
opal.register('core/hash.rb', function($rb, self, __FILE__) { function $$(){






































return $class(self, nil, 'Hash', function(self) {




  $defs(self, '[]', function(self, args) {args = [].slice.call(arguments, 1);
    return $rb.H.apply(null, args);
  }, -1);

  $defs(self, 'allocate', function(self) {
    return $rb.H();
  }, 0);









  $defn(self, 'values', function(self) {
    var result = [], length = self.$keys.length;

    for (var i = 0; i < length; i++) {
      result.push(self.$assocs[self.$keys[i].$hash()]);
    }

    return result;
  }, 0);









  $defn(self, 'inspect', function(self) {var __a;
    var description = [], key, value;

    for (var i = 0; i < self.$keys.length; i++) {
      key = self.$keys[i];
      value = self.$assocs[key.$hash()];
      description.push((__a = key).$m.inspect(__a) + '=>' + (__a = value).$m.inspect(__a));
    }

    return '{' + description.join(', ') + '}';
  }, 0);




  $defn(self, 'to_s', function(self) {var __a;
    var description = [], key, value;

    for (var i = 0; i < self.$keys.length; i++) {
      key = self.$keys[i];
      value = self.$assocs[key.$hash()];
      description.push((__a = key).$m.inspect(__a) + (__a = value).$m.inspect(__a));
    }

    return description.join('');
  }, 0);











  $defn(self, 'each', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    var keys = self.$keys, values = self.$assocs, length = keys.length, key;

    for (var i = 0; i < length; i++) {
      try {
        key = keys[i];
        ((__a = $yy($ys, key, values[key.$hash()])) == $yb ? $break() : __a);
      } catch (e) {
        switch (e.$keyword) {
          case 2:
            return e['@exit_value'];
          default:
            throw e;
        }
      }
    }

    return self;
  }, 0);














  $defn(self, 'assoc', function(self, obj) {var __a;
    var key, keys = self.$keys, length = keys.length;

    for (var i = 0; i < length; i++) {
      key = keys[i];
      if ((__a = key).$m['=='](__a, obj).$r) {
        return [key, self.$assocs[key.$hash()]];
      }
    }

    return nil;
  }, 1);


















  $defn(self, '==', function(self, other) {var __a;
    if (self === other) return Qtrue;
    if (!other.$keys || !other.$assocs) return Qfalse;
    if (self.$keys.length != other.$keys.length) return Qfalse;

    for (var i = 0; i < self.$keys.length; i++) {
      var key1 = self.$keys[i], assoc1 = key1.$hash();

      if (!other.$assocs.hasOwnProperty(assoc1))
        return Qfalse;

      var assoc2 = other.$assocs[assoc1];

      if (!(__a = self.$assocs[assoc1]).$m['=='](__a, assoc2).$r)
        return Qfalse;
    }

    return Qtrue;
  }, 1);














  $defn(self, '[]', function(self, key) {
    var assoc = key.$hash();

    if (self.$assocs.hasOwnProperty(assoc))
      return self.$assocs[assoc];

    return self.$default;
  }, 1);
















  $defn(self, '[]=', function(self, key, value) {
    var assoc = key.$hash();

    if (!self.$assocs.hasOwnProperty(assoc))
      self.$keys.push(key);

    return self.$assocs[assoc] = value;
  }, 2);










  $defn(self, 'clear', function(self) {
    self.$keys = [];
    self.$assocs = {};

    return self;
  }, 0);


  $defn(self, 'default', function(self) {
    return self.$default;
  }, 0);





  $defn(self, 'default=', function(self, obj) {
    return self.$default = obj;
  }, 1);
















  $defn(self, 'delete', function(self, key) {
    var assoc = key.$hash();

    if (self.$assocs.hasOwnProperty(assoc)) {
      var ret = self.$assocs[assoc];
      delete self.$assocs[assoc];
      self.$keys.splice(self.$keys.indexOf(key), 1);
      return ret;
    }

    return self.$default;
  }, 1);











  $defn(self, 'delete_if', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    var key, value;

    for (var i = 0; i < self.$keys.length; i++) {
      try {
        key = self.$keys[i];
        value = self.$assocs[key.$hash()];

        if (((__a = $yy($ys, key, value)) == $yb ? $break() : __a).$r) {
          delete self.$assocs[key.$hash()];
          self.$keys.splice(i, 1);
          i--;
        }
      } catch (e) {
        switch (e.$keyword) {
          case 2:
            return e['@exit_value'];
          default:
            throw e;
        }
      }
    }

    return self;
  }, 0);












  $defn(self, 'each_key', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    var key;

    for (var i = 0; i < self.$keys.length; i++) {
      try {
        key = self.$keys[i];
        ((__a = $yy($ys, key)) == $yb ? $break() : __a);
      } catch (e) {
        switch (e.$keyword) {
          case 2:
            return e['@exit_value'];
          default:
            throw e;
        }
      }
    }

    return self;
  }, 0);












  $defn(self, 'each_value', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    var val;

    for (var i = 0; i < self.$keys.length; i++) {
      try {
        val = self.$assocs[self.$keys[i].$hash()];
        ((__a = $yy($ys, val)) == $yb ? $break() : __a);
      } catch (e) {
        switch (e.$keyword) {
          case 2:
            return e['@exit_value'];
          default:
            throw e;
        }
      }
    }

    return self;
  }, 0);









  $defn(self, 'empty?', function(self) {
    return self.$keys.length == 0 ? Qtrue : Qfalse;
  }, 0);

















  $defn(self, 'fetch', function(self, key, defaults) {if (defaults == undefined) {defaults = undefined;}
    var value = self.$assocs[key.$hash()];

    if (value != undefined)
      return value;
    else if (defaults == undefined)
      rb_raise('KeyError: key not found');
    else
      return defaults;
  }, -2);

















  $defn(self, 'flatten', function(self, level) {var __a;if (level == undefined) {level = 1;}
    var result = [], key, value;

    for (var i = 0; i < self.$keys.length; i++) {
      key = self.$keys[i];
      value = self.$assocs[key.$hash()];
      result.push(key);

      if (value instanceof Array) {
        if (level == 1) {
          result.push(value);
        } else {
          var tmp = (__a = value).$m.flatten(__a, level - 1);
          result = result.concat(tmp);
        }
      } else {
        result.push(value);
      }
    }

    return result;
  }, -1);













  $defn(self, 'has_key?', function(self, key) {
    if (self.$assocs.hasOwnProperty(key.$hash()))
      return Qtrue;

    return Qfalse;
  }, 1);













  $defn(self, 'has_value?', function(self, value) {var __a;
    var key, value;

    for (var i = 0; i < self.$keys.length; i++) {
      key = self.$keys[i];
      val = self.$assocs[key.$hash()];

      if ((__a = value).$m['=='](__a, val).$r)
        return Qtrue;
    }

    return Qfalse;
  }, 1);











  $defn(self, 'replace', function(self, other) {
    self.$keys = []; self.$assocs = {};

    for (var i = 0; i < other.$keys.length; i++) {
      var key = other.$keys[i];
      var val = other.$assocs[key.$hash()];
      self.$keys.push(key);
      self.$assocs[key.$hash()] = val;
    }

    return self;
  }, 1);











  $defn(self, 'invert', function(self) {    return nil;

  }, 0);













  $defn(self, 'key', function(self, value) {var __a;
    var key, val;

    for (var i = 0; i < self.$keys.length; i++) {
      key = self.$keys[i];
      val = self.$assocs[key.$hash()];

      if ((__a = value).$m['=='](__a, val).$r) {
        return key;
      }
    }

    return nil;
  }, 1);











  $defn(self, 'keys', function(self) {
    return self.$keys.slice(0);
  }, 0);










  $defn(self, 'length', function(self) {
    return self.$keys.length;
  }, 0);


















  $defn(self, 'merge', function(self, other) {
    var result = $opal.H() , key, val;

    for (var i = 0; i < self.$keys.length; i++) {
      key = self.$keys[i], val = self.$assocs[key.$hash()];

      result.$keys.push(key);
      result.$assocs[key.$hash()] = val;
    }

    for (var i = 0; i < other.$keys.length; i++) {
      key = other.$keys[i], val = other.$assocs[key.$hash()];

      if (!result.$assocs.hasOwnProperty(key.$hash())) {
        result.$keys.push(key);
      }

      result.$assocs[key.$hash()] = val;
    }

    return result;
  }, 1);















  $defn(self, 'merge!', function(self, other) {
    var key, val;

    for (var i = 0; i < other.$keys.length; i++) {
      key = other.$keys[i];
      val = other.$assocs[key.$hash()];

      if (!self.$assocs.hasOwnProperty(key.$hash())) {
        self.$keys.push(key);
      }

      self.$assocs[key.$hash()] = val;
    }

    return self;
  }, 1);














  $defn(self, 'rassoc', function(self, obj) {var __a;
    var key, val;

    for (var i = 0; i < self.$keys.length; i++) {
      key = self.$keys[i];
      val = self.$assocs[key.$hash()];

      if ((__a = val).$m['=='](__a, obj).$r)
        return [key, val];
    }

    return nil;
  }, 1);















  $defn(self, 'shift', function(self) {
    var key, val;

    if (self.$keys.length > 0) {
      key = self.$keys[0];
      val = self.$assocs[key.$hash()];

      self.$keys.shift();
      delete self.$assocs[key.$hash()];
      return [key, val];
    }

    return self.$default;
  }, 0);










  $defn(self, 'to_a', function(self) {
    var result = [], key, value;

    for (var i = 0; i < self.$keys.length; i++) {
      key = self.$keys[i];
      value = self.$assocs[key.$hash()];
      result.push([key, value]);
    }

    return result;
  }, 0);




  return $defn(self, 'to_hash', function(self) {
    return self;
  }, 0);
}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;$rb.mm(['inspect', '==', 'flatten']);return $$();
 });
opal.register('core/kernel.rb', function($rb, self, __FILE__) { function $$(){


return $class(self, nil, 'Kernel', function(self) {var __a;


  $defn(self, 'instance_variable_defined?', function(self, name) {var __a;
    name = name.$m.to_s(name);
    return self[name] == undefined ? Qfalse : Qtrue;
  }, 1);

  $defn(self, 'instance_variable_get', function(self, name) {var __a;
    name = name.$m.to_s(name);
    return self[name] == undefined ? nil : self[name];
  }, 1);

  $defn(self, 'instance_variable_set', function(self, name, value) {var __a;
    name = name.$m.to_s(name);
    return self[name] = value;
  }, 2);








  $defn(self, 'block_given?', function(self) {
    return Qfalse;
  }, 0);


  $defn(self, '__flags__', function(self) {
    return self.$flags;
  }, 0);

  $defn(self, 'to_a', function(self) {
    return [self];
  }, 0);

  $defn(self, 'tap', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    if(!(($yy == $y.y ? Qfalse : Qtrue)).$r) {self.$m.$raise(self, $cg(self, 'LocalJumpError'), "no block given")};
    if ($yy($ys, self) == $yb) { return $yb.$value; };
    return self;
  }, 0);

  $defn(self, 'kind_of?', function(self, klass) {
    var search = self.$klass;

    while (search) {
      if (search == klass) {
        return Qtrue;
      }

      search = search.$super;
    }

    return Qfalse;
  }, 1);

  $defn(self, 'is_a?', function(self, klass) {var __a;
    return self.$m['$kind_of?'](self, klass);
  }, 1);

  $defn(self, 'nil?', function(self) {
    return Qfalse;
  }, 0);















  $defn(self, 'respond_to?', function(self, method_id) {var __a;
    var method = self['m$' + (__a = method_id).$m.to_s(__a)];

    if (method && !method.$rbMM) {
      return Qtrue;
    }

    return Qfalse;
  }, 1);

  $defn(self, '===', function(self, other) {var __a;
    return self.$m['=='](self, other);
  }, 1);

  $defn(self, 'send', function(self, method_id, args) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;args = [].slice.call(arguments, 2);var block = (($yy == $y.y) ? nil: $yy);
    var method = self.$m[method_id.$m.to_s(method_id)];

    if ($B.f == arguments.callee) {
      $B.f = method;
    }

    args.unshift(self);

    return method.apply(self, args);
  }, -2);

  $defn(self, 'class', function(self) {
    return $rb.class_real(self.$klass);
  }, 0);

  $defn(self, 'singleton_class', function(self) {
    return $rb.singleton_class(self);
  }, 0);

  $defn(self, 'methods', function(self) {
    return self.$klass.$methods;
  }, 0);













  $defn(self, 'rand', function(self, max) {if (max == undefined) {max = undefined;}
    if (max != undefined)
        return Math.floor(Math.random() * max);
    else
      return Math.random();
  }, -1);

  $defn(self, '__id__', function(self) {
    return self.$hash();
  }, 0);

  $defn(self, 'object_id', function(self) {
    return self.$hash();
  }, 0);






  $defn(self, 'to_s', function(self) {var __a;
    return ("#<" + (__a = $rb.class_real(self.$klass)).$m.to_s(__a) + ":0x" + (__a = (self.$hash() * 400487).toString(16)).$m.to_s(__a) + ">");
  }, 0);

  $defn(self, 'inspect', function(self) {var __a;
    return self.$m.$to_s(self);
  }, 0);

  $defn(self, 'const_set', function(self, name, value) {
    return rb_const_set($rb.class_real(self.$klass), name, value);
  }, 2);

  $defn(self, 'const_defined?', function(self, name) {
    return Qfalse;
  }, 1);

  $defn(self, '=~', function(self, obj) {
    return nil;
  }, 1);

  $defn(self, 'extend', function(self, mod) {
    $rb.extend_module($rb.singleton_class(self), mod);
    return nil;
  }, 1);


  self.$m.$private(self);




















  $defn(self, 'raise', function(self, exception, string) {var __a;if (string == undefined) {string = nil;}
    var msg = nil, exc;

    if (typeof exception == 'string') {
      msg = exception;
      exc = (__a = $cg(self, 'RuntimeError')).$m['new'](__a, msg);
    } else if ((__a = exception).$m['kind_of?'](__a, $cg(self, 'Exception')).$r) {
      exc = exception;
    } else {
      if (string != nil) msg = string;
      exc = (__a = exception).$m['new'](__a, msg);
    }
    $rb.raise_exc(exc);
  }, -2);

  self.$m.$alias_method(self, $symbol_1, $symbol_2);










  $defn(self, 'loop', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    while (true) {
      ((__a = $yy($ys)) == $yb ? $break() : __a);
    }

    return self;
  }, 0);









  $defn(self, 'proc', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;var block = (($yy == $y.y) ? nil: $yy);

    if(!(($yy == $y.y ? Qfalse : Qtrue)).$r) {self.$m.$raise(self, $cg(self, 'ArgumentError'), "tried to create Proc object without a block")};
    return block;
  }, 0);

  return $defn(self, 'lambda', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;var block = (($yy == $y.y) ? nil: $yy);

    if(!(($yy == $y.y ? Qfalse : Qtrue)).$r) {self.$m.$raise(self, $cg(self, 'ArgumentError'), "tried to create Proc object without a block")};
    return $rb.lambda(block);
  }, 0);


}, 2);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G, $symbol_1 = $symbol('fail'), $symbol_2 = $symbol('raise');$rb.mm(['to_s', 'raise', 'kind_of?', '==', 'private', 'new', 'alias_method']);return $$();
 });
opal.register('core/match_data.rb', function($rb, self, __FILE__) { function $$(){return $class(self, nil, 'MatchData', function(self) {

  $defn(self, 'inspect', function(self) {var __a, __b;
    return ("#<MatchData " + (__a = (__b = self.$data[0]).$m.inspect(__b)).$m.to_s(__a) + ">");
  }, 0);

  $defn(self, 'to_s', function(self) {
    return self.$data[0];
  }, 0);

  $defn(self, 'length', function(self) {
    return self.$data.length;
  }, 0);

  $defn(self, 'size', function(self) {
    return self.$data.length;
  }, 0);

  $defn(self, 'to_a', function(self) {
    return [].slice.call(self.$data, 0);
  }, 0);

  return $defn(self, '[]', function(self, index) {
    var length = self.$data.length;

    if (index < 0) index += length;

    if (index >= length || index < 0) return nil;

    return self.$data[index];
  }, 1);
}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;$rb.mm(['to_s', 'inspect']);return $$();
 });
opal.register('core/module.rb', function($rb, self, __FILE__) { function $$(){


return $class(self, nil, 'Module', function(self) {

  $defn(self, 'name', function(self) {
    return self.__classid__;
  }, 0);

  $defn(self, '===', function(self, obj) {var __a;
    return obj.$m['kind_of?'](obj, self);
  }, 1);

  $defn(self, 'define_method', function(self, method_id) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;var block = (($yy == $y.y) ? nil: $yy);
    if(!(($yy == $y.y ? Qfalse : Qtrue)).$r) {self.$m.$raise(self, $cg(self, 'LocalJumpError'), "no block given")};
    $rb.dm(self, method_id.$m.to_s(method_id).toString(), block)
    return nil;
  }, 1);

  $defn(self, 'attr_accessor', function(self, attrs) {var __a;attrs = [].slice.call(arguments, 1);
    self.$m.$attr_reader.apply(nil, [self].concat(attrs));
    return self.$m.$attr_writer.apply(nil, [self].concat(attrs));
  }, -1);

  $defn(self, 'attr_reader', function(self, attrs) {var __a, __b;attrs = [].slice.call(arguments, 1);
    ($B.f = attrs.$m.each, ($B.p =function(self, a) { var method_id, __a;if (a === undefined) { a = nil; }
      method_id = a.$m.to_s(a);
      $rb.dm(self, method_id, function(self) {
        var iv = self['@' + method_id];
        return iv == undefined ? nil : iv;
      });
    }).$proc =[self], $B.f)(attrs);
    return nil;
  }, -1);

  $defn(self, 'attr_writer', function(self, attrs) {var __a, __b;attrs = [].slice.call(arguments, 1);
    ($B.f = attrs.$m.each, ($B.p =function(self, a) { var method_id, __a;if (a === undefined) { a = nil; }
      method_id = a.$m.to_s(a);
      $rb.dm(self, method_id + '=', function(self, val) {
        return self['@' + method_id] = val;
      });
    }).$proc =[self], $B.f)(attrs);
    return nil;
  }, -1);

  $defn(self, 'alias_method', function(self, new_name, old_name) {var __a;
    $rb.alias_method(self, new_name.$m.to_s(new_name), old_name.$m.to_s(old_name));
    return self;
  }, 2);

  $defn(self, 'instance_methods', function(self) {
    return self.$methods;
  }, 0);

  $defn(self, 'ancestors', function(self) {
    var ary = [], parent = self;

    while (parent) {
      if (parent.$flags & $rb.FL_SINGLETON) {
        // nothing?
      }
      else {
        ary.push(parent);
      }

      parent = parent.$super;
    }

    return ary;
  }, 0);

  $defn(self, 'to_s', function(self) {
    return self.__classid__;
  }, 0);

  $defn(self, 'const_set', function(self, id, value) {var __a;
    return $rb.cs(self, id.$m.to_s(id), value);
  }, 2);

  $defn(self, 'class_eval', function(self, str) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;if (str == undefined) {str = nil;}var block = (($yy == $y.y) ? nil: $yy);
    if (($yy == $y.y ? Qfalse : Qtrue).$r) {
      block(self)
    } else {
      return self.$m.$raise(self, "need to compile str");
    }
  }, -1);

  $defn(self, 'module_eval', function(self, str) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;if (str == undefined) {str = nil;}var block = (($yy == $y.y) ? nil: $yy);
    return ($B.p = block, $B.f = self.$m.$class_eval)(self, str);
  }, -1);

  return $defn(self, 'extend', function(self, mod) {
    $rb.extend_module(self, mod)
    return nil;
  }, 1);
}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;$rb.mm(['kind_of?', 'raise', 'to_s', 'attr_reader', 'attr_writer', 'each', 'class_eval']);return $$();
 });
opal.register('core/nil_class.rb', function($rb, self, __FILE__) { function $$(){












$class(self, nil, 'NilClass', function(self) {

  $defn(self, 'to_i', function(self) {
    return 0;
  }, 0);

  $defn(self, 'to_f', function(self) {
    return 0.0;
  }, 0);

  $defn(self, 'to_s', function(self) {
    return '';
  }, 0);

  $defn(self, 'to_a', function(self) {
    return [];
  }, 0);

  $defn(self, 'inspect', function(self) {
    return "nil";
  }, 0);

  $defn(self, 'nil?', function(self) {
    return Qtrue;
  }, 0);

  $defn(self, '&', function(self, other) {
    return Qfalse;
  }, 1);

  $defn(self, '|', function(self, other) {
    return other.$r ? Qtrue : Qfalse;
  }, 1);

  return $defn(self, '^', function(self, other) {
    return other.$r ? Qtrue : Qfalse;
  }, 1);
}, 0);

return $rb.cs(self, 'NIL', nil);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;return $$();
 });
opal.register('core/numeric.rb', function($rb, self, __FILE__) { function $$(){







































return $class(self, nil, 'Numeric', function(self) {








  $defn(self, '+@', function(self) {
    return self;
  }, 0);









  $defn(self, '-@', function(self) {
    return -self;
  }, 0);





  $defn(self, '%', function(self, other) {
    return self % other;
  }, 1);

  $defn(self, 'modulo', function(self, other) {
    return self % other;
  }, 1);





  $defn(self, '&', function(self, num2) {
    return self & num2;
  }, 1);





  $defn(self, '*', function(self, other) {
    return self * other;
  }, 1);





  $defn(self, '**', function(self, other) {
    return Math.pow(self, other);
  }, 1);





  $defn(self, '+', function(self, other) {
    return self + other;
  }, 1);





  $defn(self, '-', function(self, other) {
    return self - other;
  }, 1);





  $defn(self, '/', function(self, other) {
    return self / other;
  }, 1);






  $defn(self, '<', function(self, other) {
    return self < other ? Qtrue : Qfalse;
  }, 1);






  $defn(self, '<=', function(self, other) {
    return self <= other ? Qtrue : Qfalse;
  }, 1);






  $defn(self, '>', function(self, other) {
    return self > other ? Qtrue : Qfalse;
  }, 1);






  $defn(self, '>=', function(self, other) {
    return self >= other ? Qtrue : Qfalse;
  }, 1);





  $defn(self, '<<', function(self, count) {
    return self << count;
  }, 1);





  $defn(self, '>>', function(self, count) {
    return self >> count;
  }, 1);






  $defn(self, '<=>', function(self, other) {
    if (typeof other != 'number') return nil;
    else if (self < other) return -1;
    else if (self > other) return 1;
    return 0;
  }, 1);





  $defn(self, '==', function(self, other) {
    return self.valueOf() === other.valueOf() ? Qtrue : Qfalse;
  }, 1);





  $defn(self, '^', function(self, other) {
    return self ^ other;
  }, 1);











  $defn(self, 'abs', function(self) {
    return Math.abs(self);
  }, 0);

  $defn(self, 'magnitude', function(self) {
    return Math.abs(self);
  }, 0);




  $defn(self, 'even?', function(self) {
    return (self % 2 == 0) ? Qtrue : Qfalse;
  }, 0);




  $defn(self, 'odd?', function(self) {
    return (self % 2 == 0) ? Qfalse : Qtrue;
  }, 0);











  $defn(self, 'succ', function(self) {
    return self + 1;
  }, 0);

  $defn(self, 'next', function(self) {
    return self + 1;
  }, 0);











  $defn(self, 'pred', function(self) {
    return self - 1;
  }, 0);
















  $defn(self, 'upto', function(self, finish) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    for (var i = self; i <= finish; i++) {
      ((__a = $yy($ys, i)) == $yb ? $break() : __a);
    }

    return self;
  }, 1);















  $defn(self, 'downto', function(self, finish) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    for (var i = self; i >= finish; i--) {
      ((__a = $yy($ys, i)) == $yb ? $break() : __a);
    }

    return self;
  }, 1);














  $defn(self, 'times', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    if(!(($yy == $y.y ? Qfalse : Qtrue)).$r) {self.$m.$raise(self, "no block given")};
    for (var i = 0; i < self; i++) {
      ((__a = $yy($ys, i)) == $yb ? $break() : __a);
    }

    return self;
  }, 0);





  $defn(self, '|', function(self, other) {
    return self | other;
  }, 1);




  $defn(self, 'zero?', function(self) {
    return self == 0 ? Qtrue : Qfalse;
  }, 0);




  $defn(self, 'nonzero?', function(self) {
    return self == 0 ? nil : self;
  }, 0);




  $defn(self, '~', function(self) {
    return ~self;
  }, 0);











  $defn(self, 'ceil', function(self) {
    return Math.ceil(self);
  }, 0);









  $defn(self, 'floor', function(self) {
    return Math.floor(self);
  }, 0);




  $defn(self, 'integer?', function(self) {
    return self % 1 == 0 ? Qtrue : Qfalse;
  }, 0);

  $defn(self, 'inspect', function(self) {
    return self.toString();
  }, 0);

  $defn(self, 'to_s', function(self) {
    return self.toString();
  }, 0);

  $defn(self, 'to_i', function(self) {
    return parseInt(self);
  }, 0);

  return $defs(self, 'allocate', function(self) {var __a;
    return self.$m.$raise(self, $cg(self, 'RuntimeError'), "cannot instantiate instance of Numeric class");
  }, 0);
}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;$rb.mm(['raise']);return $$();
 });
opal.register('core/object.rb', function($rb, self, __FILE__) { function $$(){

return $class(self, $cg(self, 'BasicObject'), 'Object', function(self) {  return nil;

}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;return $$();
 });
opal.register('core/proc.rb', function($rb, self, __FILE__) { function $$(){




























return $class(self, nil, 'Proc', function(self) {

  $defs(self, 'new', function(self) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;var block = (($yy == $y.y) ? nil: $yy);

    if(!(($yy == $y.y ? Qfalse : Qtrue)).$r) {self.$m.$raise(self, $cg(self, 'ArgumentError'), "tried to create Proc object without a block")};

    return block;
  }, 0);

  $defn(self, 'to_proc', function(self) {
    return self;
  }, 0);

  $defn(self, 'call', function(self, args) {args = [].slice.call(arguments, 1);
    args.unshift(self.$proc[0]); return self.apply(null, args);
  }, -1);

  $defn(self, 'to_s', function(self) {
    return "#<Proc:0x" + (self.$hash() * 400487).toString(16) + (self.$lambda ? ' (lambda)' : '') + ">";
  }, 0);

  return $defn(self, 'lambda?', function(self) {
    return self.$fn.$lambda ? Qtrue : Qfalse;
  }, 0);
}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;$rb.mm(['raise']);return $$();
 });
opal.register('core/range.rb', function($rb, self, __FILE__) { function $$(){return $class(self, nil, 'Range', function(self) { var __a;

  $defn(self, 'begin', function(self) {
    return self.$beg;
  }, 0);

  self.$m.$alias_method(self, $symbol_1, $symbol_2);

  $defn(self, 'end', function(self) {
    return self.$end;
  }, 0);

  $defn(self, 'to_s', function(self) {var __a;
    var str = (__a = self.$beg).$m.to_s(__a);
    var str2 = (__a = self.$end).$m.to_s(__a);
    var join = self.$exc ? '...' : '..';
    return str + join + str2;
  }, 0);

  return $defn(self, 'inspect', function(self) {var __a;
    var str = (__a = self.$beg).$m.inspect(__a);
    var str2 = (__a = self.$end).$m.inspect(__a);
    var join = self.$exc ? '...' : '..';
    return str + join + str2;
  }, 0);
}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G, $symbol_1 = $symbol('first'), $symbol_2 = $symbol('begin');$rb.mm(['alias_method', 'to_s', 'inspect']);return $$();
 });
opal.register('core/regexp.rb', function($rb, self, __FILE__) { function $$(){


















return $class(self, nil, 'Regexp', function(self) {

  $defs(self, 'escape', function(self, s) {
    return s;
  }, 1);

  $defs(self, 'new', function(self, s) {
    return new RegExp(s);
  }, 1);

  $defn(self, 'inspect', function(self) {
    return self.toString();
  }, 0);

  $defn(self, 'to_s', function(self) {
    return self.source;
  }, 0);

  $defn(self, '==', function(self, other) {
    return self.toString() === other.toString() ? Qtrue : Qfalse;
  }, 1);

  $defn(self, 'eql?', function(self, other) {var __a;
    return self.$m['=='](self, other);
  }, 1);







  $defn(self, '=~', function(self, str) {
    var result = self.exec(str);
    $rb.X = result;

    if (result) {
      return result.index;
    }
    else {
      return nil;
    }
  }, 1);

  return $defn(self, 'match', function(self, pattern) {var __a;
    self.$m['=~'](self, pattern);
    return $rb.gg('$~');
  }, 1);
}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;$rb.mm(['==', '=~']);return $$();
 });
opal.register('core/string.rb', function($rb, self, __FILE__) { function $$(){























































return $class(self, nil, 'String', function(self) {

  $defs(self, 'new', function(self, str) {if (str == undefined) {str = '';}
    var result = new String(str);
    result.$klass = self;
    result.$m = self.$m_tbl;
    return result;
  }, -1);










  $defn(self, '*', function(self, count) {
    var result = [];

    for (var i = 0; i < count; i++) {
      result.push(self);
    }

    return result.join('');
  }, 1);











  $defn(self, '+', function(self, other) {
    return self + other;
  }, 1);














  $defn(self, 'capitalize', function(self) {
    return self.charAt(0).toUpperCase() + self.substr(1).toLowerCase();
  }, 0);










  $defn(self, 'downcase', function(self) {
    return self.toLowerCase();
  }, 0);

  $defn(self, 'upcase', function(self) {
    return self.toUpperCase();
  }, 0);











  $defn(self, 'inspect', function(self) {
    /* borrowed from json2.js, see file for license */
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

    meta = {
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"' : '\\"',
      '\\': '\\\\'
    };

    escapable.lastIndex = 0;

    return escapable.test(self) ? '"' + self.replace(escapable, function (a) {
      var c = meta[a];
      return typeof c === 'string' ? c :
        '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
      }) + '"' : '"' + self + '"';
  }, 0);




  $defn(self, 'length', function(self) {
    return self.length;
  }, 0);

  $defn(self, 'to_i', function(self) {
    return parseInt(self);
  }, 0);













  $defn(self, 'to_sym', function(self) {
    return $rb.Y(self);
  }, 0);

  $defn(self, 'intern', function(self) {
    return $rb.Y(self);
  }, 0);









  $defn(self, 'reverse', function(self) {
    return self.split('').reverse().join('');
  }, 0);

  $defn(self, 'succ', function(self) {
    return String.fromCharCode(self.charCodeAt(0));
  }, 0);

  $defn(self, '[]', function(self, idx) {
    return self.substr(idx, idx + 1);
  }, 1);

  $defn(self, 'sub', function(self, pattern) {var $y = $B, $yy, $ys, $yb = $y.b;if ($y.f == arguments.callee) { $yy = $y.p; }else { $yy = $y.y; }$y.f = nil ;$ys = $yy.$proc[0];var __a;
    return self.replace(pattern, function(str) {
      return ((__a = $yy($ys, str)) == $yb ? $break() : __a);
    });
  }, 1);

  $defn(self, 'gsub', function(self, pattern, replace) {
    var r = pattern.toString();
    r = r.substr(1, r.lastIndexOf('/') - 1);
    r = new RegExp(r, 'g');
    return self.replace(pattern, function(str) {
      return replace;
    });
  }, 2);

  $defn(self, 'slice', function(self, start, finish) {if (finish == undefined) {finish = nil;}
    return self.substr(start, finish);
  }, -2);

  $defn(self, 'split', function(self, split, limit) {if (limit == undefined) {limit = nil;}
    return self.split(split);
  }, -2);













  $defn(self, '<=>', function(self, other) {
    if (typeof other != 'string') return nil;
    else if (self > other) return 1;
    else if (self < other) return -1;
    return 0;
  }, 1);






  $defn(self, '==', function(self, other) {
    return self.valueOf() === other.valueOf() ? Qtrue : Qfalse;
  }, 1);










  $defn(self, '=~', function(self, obj) {var __a;
    if (obj.$flags & $rb.T_STRING) {
      $rb.raise(VM.TypeError, "type mismatch: String given");
    }

    return obj.$m['=~'](obj, self);
  }, 1);











  $defn(self, 'casecmp', function(self, other) {
    if (typeof other != 'string') return nil;
    var a = self.toLowerCase(), b = other.toLowerCase();
    if (a > b) return 1;
    else if (a < b) return -1;
    return 0;
  }, 1);











  $defn(self, 'empty?', function(self) {
    return self.length == 0 ? Qtrue : Qfalse;
  }, 0);










  $defn(self, 'end_with?', function(self, suffix) {
    if (self.lastIndexOf(suffix) == self.length - suffix.length) {
      return Qtrue;
    }

    return Qfalse;
  }, 1);





  $defn(self, 'eql?', function(self, other) {
    return self == other ? Qtrue : Qfalse;
  }, 1);










  $defn(self, 'include?', function(self, other) {
    return self.indexOf(other) == -1 ? Qfalse : Qtrue;
  }, 1);















  $defn(self, 'index', function(self, substr) {
    var res = self.indexOf(substr);

    return res == -1 ? nil : res;
  }, 1);











  return $defn(self, 'lstrip', function(self) {
    return self.replace(/^\s*/, '');
  }, 0);
}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;$rb.mm(['=~']);return $$();
 });
opal.register('core/symbol.rb', function($rb, self, __FILE__) { function $$(){


























return $class(self, nil, 'Symbol', function(self) {

  $defn(self, 'inspect', function(self) {
    return ':' + self.toString();
  }, 0);

  $defn(self, 'to_sym', function(self) {
    return self;
  }, 0);

  return $defn(self, 'intern', function(self) {
    return self;
  }, 0);
}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;return $$();
 });
opal.register('core/top_self.rb', function($rb, self, __FILE__) { function $$(){$defs(self, 'to_s', function(self) {
  return "main";
}, 0);

return $defs(self, 'include', function(self, mod) {var __a;
  return (__a = $cg(self, 'Object')).$m.include(__a, mod);
}, 1);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;$rb.mm(['include']);return $$();
 });
opal.register('core/true_class.rb', function($rb, self, __FILE__) { function $$(){




















$class(self, nil, 'TrueClass', function(self) {
  $defn(self, 'to_s', function(self) {
    return "true";
  }, 0);

  $defn(self, '&', function(self, other) {
    return other.$r ? Qtrue : Qfalse;
  }, 1);

  $defn(self, '|', function(self, other) {
    return Qtrue;
  }, 1);

  return $defn(self, '^', function(self, other) {
    return other.$r ? Qfalse : Qtrue;
  }, 1);
}, 0);

return $rb.cs(self, 'TRUE', Qtrue);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;return $$();
 });
opal.require('core');