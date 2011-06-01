opal = {};

(function() {

  // So we can minimize
  var Op = opal;

  /**
    Opal platform - this is overriden in gem context
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
      cFile,            cProc,            cNumeric,         cArray,
      cHash,            cString,          cSymbol,          cRange,
      cRegexp,          cMatch,           Qself,            Qnil,
      Qfalse,           Qtrue;

  /**
    Exception classes. Some of these are used by runtime so they are here for
    convenience.
  */
  var eException,       eStandardError,   eLocalJumpError,  eNameError,
      eNoMethodError,   eArgError,        eScriptError,     eLoadError,
      eRuntimeError,    eTypeError,       eIndexError,      eKeyError,
      eRangeError;

  /**
    Standard jump exceptions to save re-creating them everytime they are needed
  */
  var rb_vm_return_instance,
      rb_vm_loop_return_instance,
      rb_vm_next_instance,
      rb_vm_break_instance;

  // ..........................................................
  // RUNTIME
  //

  /**
    All methods and properties available to ruby/js sources at runtime. These
    are kept in their own namespace to keep the opal namespace clean.
  */
  Op.runtime = {};

  // for minimizng
  var Rt = Op.runtime;
  Rt.opal = Op;

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
      T_JS_STR      = Rt.T_JS_STR      = 2056
      T_ICLASS      = Rt.T_ICLASS      = 4112,
      FL_SINGLETON  = Rt.FL_SINGLETON  = 8224;

  /**
    Method privacy modes
  */
  var FL_PUBLIC   = 0,
      FL_PRIVATE  = 1;

  /**
    For setting up method_missing methods. Each ruby file that has been compiled
    with call this method with an array of all method_ids that it makes use of.
    These only need to be from method calls. This allows us to make sure this
    method exists on the base prototype, and is set to simply call method_missing
    for the receiver. This adds overhead to the beginning of each file being
    loaded, but is more more efficient than having to check for method_missing on
    every method call in the file for the entirety of its lifetime.

    @param {Array<String>} method_ids An array of method_ids to register
  */
  Rt.mm = function(method_ids) {
    var prototype = cBasicObject.$m_prototype_tbl;

    for (var i = 0, ii = method_ids.length; i < ii; i++) {
      var method_id = method_ids[i];
      // only add fake method if not already defined
      if (!prototype.hasOwnProperty(method_id)) {
        // our fake method implementation
        var imp = (function(method_id) {
          return function(self) {
            // console.log("method missing: " + method_id);
            var args = [].slice.call(arguments, 1);
            args.unshift(Rt.Y(method_id));
            args.unshift(self);
            return self.$m.method_missing.apply(null, args);
          };
        })(method_id);
        // mark as a fake method to help respond_to? and send, etc.
        imp.$rbMM = true;
        prototype[method_id] = imp;
        prototype['$' + method_id] = imp;
      }
    }
  };

  /**
    Define methods. Public method for defining a method on the given base.

    @param {RObject} base The base to define method on
    @param {String} method_id Ruby mid
    @param {Function} body The method implementation
    @param {Boolean} singleton Singleton or Normal method. true for singleton
  */

  Rt.dm = function(base, method_id, body, singleton) {
    if (singleton) {
      define_singleton_method(base, method_id, body);
    } else {
      // should this instead do a rb_singleton_method?? probably..
      if (base.$flags & T_OBJECT) {
        base = base.$klass;
      }

      define_method(base, method_id, body);
    }

    return Qnil;
  };

  /**
    Define classes. This is the public API for defining classes, shift classes
    and modules.

    @param {RObject} base
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

    // When reopening a class, always set it back to public
    klass.$mode = FL_PUBLIC;

    var res = body(klass);

    // after evaluating class body, always set it back to public (if it changed)
    klass.$mode = FL_PUBLIC;

    return res;
  };

  /**
    Returns a new RHash instance constructed from the given arguments of
    alternate key, value pairs.
  */
  Rt.H = function() {
    return new RHash(Array.prototype.slice.call(arguments));
  };

  /**
    Returns a new ruby symbol with the given intern value. Symbols are made
    using the new String() constructor, and just have its klass and method
    table reassigned. This makes dealing with strings/symbols internally
    easier as both can be used as a string within opal.

    @param {String} intern Symbol value
    @return {RSymbol} symbol
  */
  Rt.Y = function(intern) {
    if (symbol_table.hasOwnProperty(intern)) {
      return symbol_table[intern];
    }

    var res = new String(intern);
    res.$klass = cSymbol;
    res.$m = cSymbol.$m_tbl;
    res.$flags = T_OBJECT | T_JS_STR | T_SYMBOL;
    symbol_table[intern] = res;
    return res;
  };

  /**
    Returns a new ruby range. 'G' for range... yeah.

    @param {RObject} beg The start item for the range
    @param {RObject} end The finish item for the range
    @param {true, false} exclude_end Whether or not the range excludes the last item
    @return {RRange} Returns the new range instance
  */
  Rt.G = function(beg, end, exclude_end) {
    return new RRange(beg, end, exclude_end);
  };

  /**
    Ruby break statement with the given value. When no break value is needed, nil
    should be passed here. An undefined/null value is not valid and will cause an
    internal error.

    @param {RObject} value The break value.
  */
  Rt.B = function(value) {
    rb_vm_break_instance.$value = value;
    throw rb_vm_break_instance;
  };

  /**
    Ruby return, with the given value. The func is the reference function which
    represents the method that this statement must return from.
  */
  Rt.R = function(value, func) {
    rb_vm_return_instance.$value = value;
    rb_vm_return_instance.$func = func;
    throw rb_vm_return_instance;
  };

  /**
    Block passing. This holds the current block info for the runtime.

      f: function
      p: block
      y: yield error

  */
  Rt.P = {
    f: null,
    p: null,
    y: function() {
      throw new Error("LocalJumpError - no block given");
    }
  };

  Rt.P.y.$proc = [Rt.P.y];

  /**
    Regexp object. This holds the results of last regexp match.
    X for regeXp.
  */
  Rt.X = null;

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

  Rt.native_prototype = function(prototype, klass) {
    prototype.$klass = klass;
    prototype.$m = klass.$m_tbl;
    prototype.$flags = T_OBJECT;
    prototype.$r = true;

    prototype.$hash = function() {
      return (this.$id || (this.$id = yield_hash()));
    };

    return klass;
  };

  /**
    Define a toll free bridged class.

    @param {Object} prototype Native prototype to extend
    @param {Number} flags The flags for instances of class
    @param {String} id Class id
    @param {RClass} super_klass
  */
  Rt.bridged_class = function(prototype, flags, id, super_klass) {
    return bridge_class(prototype, flags || T_OBJECT, id, super_klass);
  };

  /**
    Generated def methods in ruby will call this method when they
    received a different number of arguments than expected.

    @param {Number} expected The expected number of args
    @param {Number} actual The actual number of args given
  */
  Rt.ac = function(expected, actual) {
    throw new Error("ArgumentError - wrong number of arguments(" + actual + " for " + expected + ")");
  };

  /**
    Enter private mode for the class with the optional given args - methods.

    We make a method private by making its public implementation raise an
    error if called
    @param {Array<String>} args
  */
  Rt.private_methods = function(klass, args) {
    if (args.length) {
      // set given methods as private

      var m_tbl = klass.$m_tbl;

      for (var i = 0, ii = args.length; i < ii; i++) {
        var arg = args[i];

        // if method doesnt exist, throw an error. Also check if it does exist
        // that it isnt just the method missing arg.
        if (!m_tbl[arg] || m_tbl[arg].$rbMM) {
          throw new Error("NameError: undefined method `" + arg +
                          "' for class `" + klass.__classid__ + "'");
        }

        // Set the public implementation to be a function that just throws an
        // error when called.
        klass.$m_prototype_tbl[arg] = function(self) {
          throw new Error("NoMethodError: private method `" + arg + "' called for " + self.$m.inspect(self));
        };

        // if this method is in the $method_table of this class, then we must
        // also set that. If it isnt, then we inherited this method from further
        // up the chain, so we should not set it in our method_table!!!
        if (klass.$method_table[arg]) {
          // set
        }
      }

    } else {
      // set class mode to private
      klass.$mode = FL_PRIVATE;
    }
  };

  /**
    Enter public mode for the class with the optional given args

    When we make a method public, we take the private implementation (which
    starts with '$'), and copy it, removing the old private version.
  */
  Rt.public_methods = function(klass, args) {
    if (args.length) {
      // set given methods as public
      var m_tbl = klass.$m_tbl;

      for (var i = 0, ii = args.length; i < ii; i++) {
        var arg = args[i];

        if (!m_tbl[arg] || m_tbl[arg].$rbMM) {
          throw new Error("NameError: undefined method `" + arg +
                          "' for class `" + klass.__classid__ + "'");
        }

        klass.$m_prototype_tbl[arg] = klass.$m_prototype_tbl['$' + arg];

        if (klass.$method_table[arg]) {
          // ..
        }
      }
    } else {
      // set class mode to public
      klass.$mode = FL_PUBLIC;
    }
  };

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
      if (parent.$c[id] !== undefined) {
        return parent.$c[id];
      }

      parent = parent.$parent;
    }

    raise(eNameError, 'uninitialized constant ' + id);
  };

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
    Set an instance variable on the receiver.
  */
  function ivar_set(obj, id, val) {
    obj[id] = val;
    return val;
  };

  /**
    Return an instance variable set on the receiver, or nil if one does not
    exist.
  */
  function ivar_get(obj, id) {
    return obj.hasOwnProperty(id) ? obj[id] : Qnil;
  };

  /**
    Determines whether and instance variable has been set on the receiver.
  */
  function ivar_defined(obj, id) {
    return obj.hasOwnProperty(id) ? true : false;
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

  /**
    The root class. Every class in opal is an instance of RClass.

    @constructor
    @param {RClass} klass
    @param {RClass} super_klass
  */
  var RClass = Rt.RClass = function(klass, super_klass) {
    this.$id = yield_hash();
    this.$super = super_klass;

    if (super_klass) {
      var ctor = function() {};
      ctor.prototype = super_klass.$m_prototype_tbl;

      var m_ctor = function() {};
      m_ctor.prototype = new ctor();

      this.$m_tbl = new m_ctor();
      this.$m_prototype_tbl = m_ctor.prototype;

      var cctor = function() {};
      cctor.prototype = super_klass.$c_prototype;

      var c_ctor = function() {};
      c_ctor.prototype = new cctor();

      this.$c = new c_ctor();
      this.$c_prototype = c_ctor.prototype;
    }
    else {
      var m_ctor = function() {};
      this.$m_tbl = new m_ctor();
      this.$m_prototype_tbl = m_ctor.prototype;

      var c_ctor = function() {};
      this.$c = new c_ctor();
      this.$c_prototype = c_ctor.prototype;
    }

    this.$method_table = {};
    this.$const_table  = {};

    return this;
  };

  // RClass protoype for minimizing
  var Rp = RClass.prototype;

  /**
    Method def mode. Default is FL_PUBLIC but may also be FL_PRIVATE. Reset on
    each class eval.
  */
  Rp.$mode = FL_PUBLIC;

  /**
    Flags. Every RClass instance is simply a T_CLASS, so mark as so.
  */
  Rp.$flags = T_CLASS;

  /**
    RTest/truthiness - every RClass instance is true.
  */
  Rp.$r = true;

  /**
    The root object. Every object in opal (apart from toll free bridged classes
    like array, string etc) are an instance of RObject.

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
    Flags - every RObject instance is simply a T_OBJECT
  */
  Bp.$flags = T_OBJECT;

  /**
    RTest - every RObject instance is true.
  */
  Bp.$r = true;

  /**
    The hash of a class or object in ruby is simply it's id, as all objects and
    classes have unique ids.
  */
  Bp.$hash = Rp.$hash = function() {
    return this.$id;
  };

  /**
    Internal method for defining a method.

    @param {RClass} klass The klass to define the method on
    @param {String} name The method id
    @param {Function} body Method implementation
    @return {Qnil}
  */
  function define_method(klass, name, public_body) {
    var mode = klass.$mode;
    var private_body = public_body;

    if (mode == FL_PRIVATE) {
      // console.log("defining private method: " + name);
      public_body = function(self) {
        throw new Error("NoMethodError: private method `" + name + "' called for " + self.$m.inspect(self));
      };
    }

    if (!private_body.$rbName) {
      private_body.$rbName = name;
    }

    define_raw_method(klass, name, private_body, public_body);

    return Qnil;
  };

  Rt.define_method = define_method;

  Rt.alias_method = function(klass, new_name, old_name) {
    // console.log("aliasing " + new_name + " to " + old_name);
    var public_body = klass.$m_prototype_tbl[old_name];
    var private_body = klass.$m_prototype_tbl['$' + old_name];

    if (!public_body) {
      throw new Error("NameError: undefined method `" + old_name + "' for class `" + klass.__classid__ + "'");
    }

    define_raw_method(klass, new_name, private_body, public_body);
    return Qnil;
  };

  /**
    This actually defines a method. This method takes the receiver
    and the method name, and also takes the private_method and the
    public_method, for respective call types.

    This does the main work, but does not call runtime methods like
    singleton_method_added etc. define_method does that.

  */
  function define_raw_method(klass, public_name, private_body, public_body) {
    var private_name = '$' + public_name;

    klass.$m_prototype_tbl[public_name] = public_body;

    klass.$m_prototype_tbl[private_name] = private_body;
    klass.$method_table[public_name] = private_body;

    var included_in = klass.$included_in, includee;

    if (included_in) {
      for (var i = 0, ii = included_in.length; i < ii; i++) {
        includee = included_in[i];

        define_raw_method(includee, public_name, private_body, public_body);
      }
    }
  };

  function define_singleton_method(klass, name, body) {
    define_method(singleton_class(klass), name, body);
  };

  function define_alias(base, new_name, old_name) {
    define_method(base, new_name, base.$m_tbl[old_name]);
    return Qnil;
  };

  /**
    Implementation for Class#allocate
  */
  function obj_alloc(klass) {
    var result = new RObject(klass, T_OBJECT);
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
    vm_raise(exception);
  };

  Rt.raise = raise;

  /**
    Raise an exception instance (DO NOT pass strings to this)
  */
  function vm_raise(exc) {
    throw exc;
  };

  Rt.raise_exc = vm_raise;

  /**
    Throw an argument error when the wrong number of arguments were given to a
    method.

    @param {Number} given The number of arguments actually given
    @param {Number} expected The number of arguments we expected to have
  */
  function arg_error(given, expected) {
    raise(eArgError,
      "wrong number of arguments(" + given + " for " + expected + ")");
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
        " for " + self.$m.inspect(self));
    }

    var args_to_send = [self].concat(args);
    return func.apply(null, args_to_send);
  };

  /**
    Actually find super impl to call.  Returns null if cannot find it.
  */
  function super_find(klass, callee, mid) {
    var cur_method;

    while (klass) {
      if (klass.$method_table[mid]) {
        if (klass.$method_table[mid] == callee) {
          break;
        }
      }
      klass = klass.$super;
    }

    if (!klass) { return null; }

    klass = klass.$super;

    while (klass) {
      if (klass.$method_table[mid]) {
        return klass.$method_table[mid];
      }

      klass = klass.$super;
    }

    return null;
  };

  /**
    VM method to get a contant from the given base.

    @global
  */
  rb_vm_cg = function(base, id) {
    if (base.$flags & T_OBJECT) {
      base = class_real(base.$klass);
    }
    return const_get(base, id);
  };

  /**
    VM method to set a contant in base.

    @global
  */
  rb_vm_cs = function(base, id, val) {
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

  /**
  */
  function regexp_match_getter(id) {
    var matched = Rt.X;

    if (matched) {
      if (matched.$md) {
        return matched.$md;
      } else {
        var res = new RObject(cMatch);
        res.$data = matched;
        matched.$md = res;
        return res;
      }
    } else {
      return Qnil;
    }
  };

  /**
    Getter method for getting the load path for opal.

    @param {String} id The globals id being retrieved.
    @return {Array} Load paths
  */
  function load_path_getter(id) {
    return opal.loader.paths;
  };

  /**
    Getter method to get all loaded features.

    @param {String} id Feature global id
    @return {Array} Loaded features
  */
  function loaded_feature_getter(id) {
    return loaded_features;
  };

  /**
    Main init method. This is called once this file has fully loaded. It setups
    all the core objects and classes and required runtime features.
  */
  function init() {

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

    define_method(cBasicObject, "!", obj_not);
    define_method(cBasicObject, "!=", obj_not_equal);

    mKernel = define_module('Kernel');

    define_singleton_method(cClass, "new", class_s_new);

    Qself = obj_alloc(cObject);
    Rt.top = Qself;

    cNilClass = define_class('NilClass', cObject);
    Rt.Qnil = Qnil = obj_alloc(cNilClass);
    Qnil.$r = false;
    cNilClass.$flags = cNilClass.$flags | FL_SINGLETON;
    cNilClass.__attached__ = Qnil;

    cTrueClass = define_class('TrueClass', cObject);
    cTrueClass.$flags = cTrueClass.$flags | FL_SINGLETON;
    Rt.Qtrue = Qtrue = obj_alloc(cTrueClass);
    cTrueClass.__attached__ = Qtrue;

    cFalseClass = define_class('FalseClass', cObject);
    Rt.Qfalse = Qfalse = obj_alloc(cFalseClass);
    Qfalse.$r = false;
    cFalseClass.$flags = cFalseClass.$flags | FL_SINGLETON;
    cFalseClass.__attached__ = Qfalse;

    cArray = bridge_class(Array.prototype,
      T_OBJECT | T_ARRAY, 'Array', cObject);

    Array.prototype.$hash = function() {
      return (this.$id || (this.$id = yield_hash()));
    };

    cNumeric = bridge_class(Number.prototype,
      T_OBJECT | T_NUMBER, 'Numeric', cObject);

    cHash = bridge_class(RHash.prototype,
      T_OBJECT | T_HASH, 'Hash', cObject);

    RHash.prototype.$hash = function() {
      return (this.$id || (this.$id = yield_hash()));
    };

    cRegexp = bridge_class(RegExp.prototype, T_OBJECT,
      'Regexp', cObject);

    cMatch = define_class('MatchData', cObject);

    define_hooked_variable('$:', load_path_getter, gvar_readonly_setter);
    define_hooked_variable('$LOAD_PATH', load_path_getter, gvar_readonly_setter);
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

    rb_vm_break_instance = new Error('unexpected break');
    rb_vm_break_instance.$klass = eLocalJumpError;
    rb_vm_break_instance.$keyword = 2;

    rb_vm_return_instance = new Error('unexpected return');
    rb_vm_return_instance.$klass = eLocalJumpError;
    rb_vm_return_instance.$keyword = 1;

    rb_vm_next_instance = new Error('unexpected next');
    rb_vm_next_instance.$klass = eLocalJumpError;
    rb_vm_next_instance.$keyword = 3;

    cString = bridge_class(String.prototype,
      T_OBJECT | T_STRING | T_JS_STR, 'String', cObject);

    cSymbol = define_class('Symbol', cObject);

    cProc = bridge_class(Function.prototype,
      T_OBJECT | T_PROC, 'Proc', cObject);

    Function.prototype.$hash = function() {
      return (this.$id || (this.$id = yield_hash()));
    };

    cRange = bridge_class(RRange.prototype, T_OBJECT | T_RANGE,
      'Range', cObject);

    RRange.prototype.$hash = function() {
      return (this.$id || (this.$id = yield_hash()));
    };
  };

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

      throw id + " is not a module.";
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

    // This will copy all public and private methods as they are in the module
    // so they keep their visibility.
    for (var method in module.$method_table) {
      if (module.$method_table.hasOwnProperty(method)) {
        // define_method(klass, method, module.$method_table[method]);
        define_raw_method(klass, method,
                          module.$m_prototype_tbl['$' + method],
                          module.$m_prototype_tbl[method]);
      }
    }

    for (var constant in module.$const_table) {
      if (module.$const_table.hasOwnProperty(constant)) {
        // console.log("need to include " + module.$const_table[constant].__classid__);
        const_set(klass, constant, module.$const_table[constant]);
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
        // FIXME: should be define_raw_method
        define_method(meta, method, module.$method_table[method]);
      }
    }
  };

  Rt.extend_module = extend_module;

  /**
    Boot a base class (only used for very core object classes)
  */
  function boot_defclass(id, super_klass) {
    var result = class_boot(super_klass);
    name_class(result, id);
    const_set((cObject || result), id, result);
    return result;
  };

  /**
    Like boot_defclass, but for root object only (i.e. basicobject)
  */
  function boot_defrootclass(id) {
    var result = new RClass(null, null);
    result.$flags = T_CLASS;
    name_class(result, id);
    const_set((cObject || result), id, result);
    return result;
  };

  function class_boot(super_class) {
    if (super_class) {
      var ctor = function() {};
      ctor.prototype = super_class.constructor.prototype;

      var result = function() {
        RClass.call(this, null, super_class);
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
  };

  /**
    @global
  */
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

    singleton_class_attached(klass, obj);

    klass.$klass = class_real(orig_class).$klass;
    klass.$m = klass.$klass.$m_tbl;
    klass.__classid__ = "#<Class:#<Object:" + klass.$id + ">>"

    return klass;
  };

  function singleton_class_attached(klass, obj) {
    if (klass.$flags & FL_SINGLETON) {
      ivar_set(klass, '__attached__', obj);
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
    metaclass.$m = metametaclass.$m_tbl;
    super_of_metaclass = metaclass.$super;

    metametaclass.$super = ivar_get(super_of_metaclass.$klass, '__attached__')
      == super_of_metaclass
      ? super_of_metaclass.$klass
      : make_metametaclass(super_of_metaclass);

    return metametaclass;
  };

  function boot_defmetametaclass(klass, metametaclass) {
    klass.$klass.$klass = metametaclass;
  };

  /**
    Define toll free bridged class
  */
  function bridge_class(prototype, flags, id, super_class) {
    var klass = define_class(id, super_class);

    prototype.$klass = klass;
    prototype.$m = klass.$m_tbl;
    prototype.$flags = flags;
    prototype.$r = true;

    prototype.$hash = function() {
      return flags + '_' + this;
    };

    return klass;
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
      return const_get(base, id);
    }

    klass = define_class_id(id, super_klass);

    if (base == cObject) {
      name_class(klass, id);
    } else {
      name_class(klass, base.__classid__ + '::' + id);
    }

    const_set(base, id, klass);
    klass.$parent = base;

    // Class#inherited hook. We check that the method is already defined first
    // just incase we are calling it during boot. We can't do this anywhere
    // else as we have to make sure we have defined the class incase the method
    // causes an error.
    if (super_klass.$m.inherited) {
      super_klass.$m.inherited(super_klass, klass);
    }

    return klass;
  };

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

    if ((obj.$klass.$flags & FL_SINGLETON)&& ivar_get(obj.$klass, '__attached__') == obj) {
      klass = obj.$klass;
    }
    else {
      var class_id = obj.$klass.__classid__;
      klass = make_metaclass(obj, obj.$klass);
    }

    return klass;
  };

  function RHash(args) {
    var k, v;
    this.$keys = [];
    this.$assocs = {};
    this.$default = Qnil;

    for (var i = 0; i < args.length; i++) {
      k = args[i];
      v = args[i+1];
      i++;
      this.$keys.push(k);
      this.$assocs[k.$hash()] = v;
    }
    return this;
  };

  /**
    Symbol table. All symbols are stored here.
  */
  var symbol_table = { };

  /**
    Range ruby object
  */
  function RRange(beg, end, exclude_end) {
    this.$beg = beg;
    this.$end = end;
    this.$exc = exclude_end;
    return this;
  };

  function class_s_new(cls, sup) {
    var klass = define_class_id("AnonClass", sup || cObject);
    return klass;
  };

  /**
    @example
      !obj  # => true or false
  */
  function obj_not(obj, mid) {
    return obj.$r ? Qfalse : Qtrue;
  };

  /**
    @example
      obj != obj2  # => true or false
  */
  function obj_not_equal(obj1, obj2) {
    var res = obj1.$m['=='](obj1, obj2);
    return res.$r ? Qfalse : Qtrue;
  };

  // ..........................................................
  // FILESYSTEM
  //

  // added to main opal namespace, and Fs for minimizing here.
  var Fs = Op.fs = {};

  /**
    Regular expression used for splitting filenames into their dirname,
    basename and extension. This is unix style only, as filenames inside
    opal in the browser will only ever have this style of filename. The gem
    fs support will depend on the platform being run.
  **/
  var PATH_RE = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

  /**
    Holds the current working directory for the application. This is '/' by
    default, but is usually set to the base directory of the main gem.

    @type {String}
  */
  Fs.cwd = '/';

  /**
    Join the given args using the default seperator. The path returned is not
    expanded.

    @param {arguments<String<} args The arguments to join
    @return {String}
  */
  var file_join = Fs.join = function() {
    var parts = [].slice.call(arguments, 0);
    return parts.join('/');
  };

  /**
    Normalize the path by removing '..' and '.' parts, remove '//' etc to
    return a nice normalized path.

    @param {String} path The path needing normalization
    @param {String} base Optional base to normalize to
    @return {String} Normalized path
  */
  var file_expand_path = Fs.expand_path = function(path, base) {
    if (!base) {
      if (path.charAt(0) !== '/') {
        base = Fs.cwd;
      }
      else {
        base = '';
      }
    }

    path = file_join(base, path);

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
  };

  /**
    Returns all of the components of the given `file_name` except for the last
    one.

    @param {String} file_name
    @return {String}
  */
  var file_dirname = Fs.dirname = function(file_name) {
    var dirname = PATH_RE.exec(file_name)[1];

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
    console.log("checking " + path);
    console.log(file_expand_path(path));
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

      var re = file_glob_to_regexp(glob);
      console.log("glob: " + glob);
      console.log("re  : " + re);

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
  function file_glob_to_regexp(glob) {
    if (typeof glob !== 'string') {
      throw new Error("file_glob_to_regexp: glob must be a string");
    }

    // make sure absolute
    glob = file_expand_path(glob);
    console.log("full glob is: " + glob);
    
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

  // ..........................................................
  // LOADER
  //

  /**
    Require a module.

    @param {String} id The module id
    @return {Object} returns the exports
  */
  Op.require = function(id, parent) {
    var resolved = Op.loader.resolve_module(id, null);
    var cached = Op.cache[resolved];

    // If we have a cache for this require then it has already been
    // required. We return false to indicate this.
    if (cached) {
      return false;
    }

    Op.cache[resolved] = true;
    // try/catch?
    load_file(Op.loader, resolved);

    return true;
  };

  // Virtual machine must also be able to require..
  Rt.require = Op.require;

  /**
    Sets the primary gem, by name, so we know which cwd to use etc. This
    can be changed at any time, but it is only really recomended before
    the application is run.

    Also, if a gem with the given name cannot be found, then an error
    will be thrown.

    @param {String} name The root package name
  */
  Op.primary = function(name) {
    Fs.cwd = '/' + name;
  };

  /**
    Register a package with the given package info.

    This will probably (definately??) always be done only in the browser.

    @param {String} name The package name
    @param {Object} info The package info
  */
  Op.register = function(name, info) {

    // make sure we get a string name
    if (typeof name !== 'string') {
      throw new Error("Cannot register a package without a proper name");
    }

    // registering a single module/file
    if (typeof info === 'string' || typeof info === 'function') {
      register_module(name, info);
    }
    // make sure info is a proper package
    else if (typeof info === 'object') {
      register_package(name, info);
    }
    // else, we have an error.. we can only register packages or modules
    else {
      throw new Error("Invalid package.json data for '" + name + "'");
    }
  };

  /**
    Private method to actually register the package. This is private to
    avoid external interferance. This will be called from {opal#register}.

    @param {String} name The package name
    @param {Object} info The package information
  */
  var register_package = function(name, info) {
    var factories = Op.loader.factories,
        paths     = Op.loader.paths;

    // register all files
    var files = info.files || {};

    // root dir for package is /package_name
    var root_dir = '/' + name;

    // assume './lib' dir for lib files (for now.. should be dynamic)
    var lib_dir = './lib';

    // add lib dir to paths
    paths.unshift(file_expand_path(file_join(root_dir, lib_dir)));

    for (var file in files) {
      if (files.hasOwnProperty(file)) {
        // full path to file; we use the root dir
        var file_path = file_expand_path(file_join(root_dir, file));

        factories[file_path] = files[file];
      }
    }

    // Autobooting. Basically, autoload opal core library and dev tools.
    if (['core', 'opal_parser'].indexOf(name) != -1) {
      // console.log("autorequire: " + name);
      Op.require(name);
    }
  };

  /**
    Private method to register a single module. These modules are added to the
    very top level dir: /module_name.js
  */
  var register_module = function(name, factory) {
    // name gets preceeded with a '/' for root files
    var factory_name = '/' + name;

    Op.loader.factories[factory_name] = factory;
  };


  // valid extensions for loading
  var load_extensions = {};

  load_extensions['.js'] = function(loader, filename) {
    var source = loader.module_contents(filename);
    return execute_file(loader, source, filename);
  };

  load_extensions['.rb'] = function(loader, filename) {
    var source = loader.ruby_module_contents(filename);
    return execute_file(loader, source, filename);
  };

  /**
    The loader is the core machinery used for loading and executing modules
    within opal. An instance of opal will have a .loader property, which
    is an instance of this Loader class. A Loader is responsible for finding,
    opening and reading the contents of modules on disk. Within the browser,
    which is the default environment, a loader will use XHR requests or cached
    modules from JSON to load the required modules.

    Within the browser, the loader, currently, just looks at its opal
    instance for registered files and packages and uses them as needed.
    opal also has 'built in' packages from commonjs, like 'system' etc, so
    all loaders must check opal first for registered packages.

    @param {opal} opal The opal instance for this loader
  */
  var Loader = function(opal) {
    this.opal = opal;
    this.paths = ['', '/lib'];

    this.factories = {};


    return this;
  };

  // Loader prototype
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
    Valid factory format for use in require();
  */
  Lp.valid_extensions = ['.js', '.rb'];

  /**
    Resolves the path to the module, which can then be used to load. This
    method will throw an error if the module cannot be found. If this method
    returns a successful filename, then subsequent methods like load_module
    should be successful and should not throw errors.

    @param {String} id The id to look for
    @param {Module} parent The module that has requested the id
  */
  Lp.resolve_module = function(id, parent) {
    var resolved = this.find_module(id, this.paths);

    if (!resolved) {
      throw new Error("Cannot find module '" + id + "'");
    }

    return resolved;
  };

  /**
    Locates the file/module using the given paths. In the browser context it is
    more likely that we will be dealing with javascript files (pre compiled
    ruby), so we first check all the paths for '.js' files matching, then '.rb'
    as very few, if any, files will still be in ruby format.

    @param {String} id The required() id
    @param {Array} paths The paths to search
    @return {String} Matched path
  */
  Lp.find_module = function(id, paths) {
    var extensions = this.valid_extensions, factories = this.factories, candidate;

    for (var i = 0, ii = extensions.length; i < ii; i++) {
      for (var j = 0, jj = paths.length; j < jj; j++) {
        candidate = file_join(paths[j], id + extensions[i]);

        if (factories[candidate]) {
          return candidate;
        }
      }
    }

    // try full path (we try to load absolute path!)
    if (factories[id]) {
      // console.log("absolute path! " + id);
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
      candidate = file_join(paths[j], id);

      if (factories[candidate]) {
        return candidate;
      }
    }

    return null;
  };

  /**
    Module contents
  */
  Lp.module_contents = function(filename) {
    return this.factories[filename];
  };

  Lp.ruby_module_contents = function(filename) {
    return this.factories[filename];
  };

  /**
    Actually load the file with the given resolved filename. This filename has
    been checked, and is known to exist.
  */
  function load_file(loader, filename) {
    var extension = load_extensions[PATH_RE.exec(filename)[3] || '.js'];

    if (!extension) {
      throw new Error("Loader.load - Bad extension for resolved path");
    }

    extension(loader, filename);
  };

  /**
    Run content, which by now must be javascript. If the content is a string,
    then it is simply evaluated. Within the browser it might be a function, so
    we call it, passing our standard args.

    The arguments we pass are standardised as:

      VM - Our opal vm variable which exposes runtime methods
      Qself - the top level ruby object, which is the 'self' for files
      filename - the Filename to run the file as for __FILE__

    @param {String, Function} content The javascript content to be run.
    @param {String} filename Filename to run content as.
  */
  function execute_file(loader, content, filename) {

    var args = [Rt, Qself, filename];

    if (typeof content === 'function') {
      return content.apply(Op, args);

    } else if (typeof content === 'string') {
      var func = loader.wrap(content, filename);
      return func.apply(Op, args);

    } else {
      throw new Error(
        "Loader.execute - bad content sent for '" + filename + "'");
    }
  };

  // ..........................................................
  // FINAL INITILIZATION
  //

  // init ruby runtime
  init();

  // browser based loader - overriden by v8 context
  Op.loader = new Loader(Op);

  // cache of filenames already evaluated
  Op.cache = {};

})();

// if in a commonjs system already (node etc), exports become our opal
// object. Otherwise, in the browser, we just get a top level opal var
if ((typeof require !== 'undefined') && (typeof module !== 'undefined')) {
  module.exports = opal;
}

