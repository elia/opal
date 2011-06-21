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
  Define methods. Public method for defining a method on the given base.

  @param {RubyObject} base The base to define method on
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
  var prototype = cBasicObject.$m_prototype_tbl;

  for (var i = 0, ii = method_ids.length; i < ii; i++) {
    var mid = method_ids[i];

    var imp = (function(mid, method_id) {
      return function() {
        var args = [].slice.call(arguments, 0);
        args.unshift(Rt.Y(method_id));
        return this.m$method_missing.apply(this, args);
      };
    })(mid, method_ids[i]);

    imp.$rbMM = true;

    if (!prototype[mid]) {
      prototype[mid] = imp;
    }
  }
};

/**
  Debug support for checking argument counts. This is called when a method
  did not receive the right number of args as expected.
*/
Rt.ac = function(expected, actual) {
  throw new Error("ArgumentError - wrong number of arguments(" + actual + " for " + expected + ")");
};

/**
  Sets the constant value `val` on the given `klass` as `id`.

  @param {RClass} klass
  @param {String} id
  @param {Object} val
  @return {Object} returns the set value
*/
function const_set(klass, id, val) {
  // klass.$c_prototype[id] = val;
  // klass.$const_table[id] = val;
  klass.$c[id] = val;
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
  Every class in opal is an instance of RClass

  @param {RClass} klass
  @param {RClass} superklass
*/
var RClass = Rt.RClass = function(klass, superklass) {
  this.$id = yield_hash();
  this.$super = superklass;

  if (superklass) {
    var ctor = function() {};
    ctor.prototype = superklass.$m_prototype_tbl;

    var mtor = function() {};
    mtor.prototype = new ctor();

    this.$m_tbl = new mtor();
    this.$m_prototype_tbl = mtor.prototype;

    var cctor = function() {};
    cctor.prototype = superklass.$c_prototype;

    var c_tor = function(){};
    c_tor.prototype = new cctor();

    this.$c = new c_tor();
    this.$c_prototype = c_tor.prototype;
  }
  else {
    var mtor = function() {};
    this.$m_tbl = new mtor();
    this.$m_prototype_tbl = mtor.prototype;

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
  Root of all classes and objects (except for bridged).
*/
var boot_base_class = function() {};

boot_base_class.$hash = function() {
  return this.$id;
};

boot_base_class.prototype.$r = true;

/**
  Internal method for defining a method.

  @param {RClass} klass The klass to define the method on
  @param {String} name The method id
  @param {Function} body Method implementation
  @return {Qnil}
*/
function define_method(klass, name, body) {
  if (!body.$rbName) {
    body.$rbName = name;
  }

  define_raw_method(klass, name, body);

  return Qnil;
};

Rt.define_method = define_method;

Rt.alias_method = function(klass, new_name, old_name) {
  var body = klass.$m_prototype_tbl[old_name];

  if (!body) {
    throw new Error("NameError: undefined method `" + old_name + "' for class `" + klass.__classid__ + "'");
  }

  define_raw_method(klass, new_name, body);
  return Qnil;
};

/**
  This does the main work, but does not call runtime methods like
  singleton_method_added etc. define_method does that.

*/
function define_raw_method(klass, name, body) {

  klass.$m_prototype_tbl[name] = body;
  klass.$method_table[name] = body;

  var included_in = klass.$included_in, includee;

  if (included_in) {
    for (var i = 0, ii = included_in.length; i < ii; i++) {
      includee = included_in[i];

      define_raw_method(includee, name, body);
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
  var obj = new RObject(klass, T_OBJECT);
  return obj;
};

/**
  Raise the exception class with the given string message.
*/
function raise(exc, str) {
  if (str === undefined) {
    str = exc;
    exc = eException;
  }
  // var exception = exc.$m['new'](exc, str);
  var exception = exc.$m['new'](str);
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

  // var args_to_send = [self].concat(args);
  var args_to_send = args;
  return func.apply(self, args_to_send);
};

/**
  Actually find super impl to call.  Returns null if cannot find it.
*/
function super_find(klass, callee, mid) {
  mid = 'm$' + mid;
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


/**
  Main init method. This is called once this file has fully loaded. It setups
  all the core objects and classes and required runtime features.
*/
function init() {
  init_object();
  init_enumerable();

  define_singleton_method(cClass, "new", class_s_new);

  init_array();
  init_numeric();
  init_hash();
  init_string();
  init_proc();
  init_range();
  init_re();
  init_error();
  init_io();
  init_file();
  init_dir();
  init_load();
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

  // This will copy all public and private methods as they are in the module
  // so they keep their visibility.
  for (var method in module.$method_table) {
    if (module.$method_table.hasOwnProperty(method)) {
      // define_method(klass, method, module.$method_table[method]);
      define_raw_method(klass, method,
                        module.$method_table[method]);
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

  // console.log("meta is: ");
  // console.log(meta);

  for (var method in module.$method_table) {
    if (module.$method_table.hasOwnProperty(method)) {
      // FIXME: should be define_raw_method
      // define_method(meta, method, module.$method_table[method]);
      define_raw_method(meta, method,
                        module.$method_table[method]);
    }
  }
};

Rt.extend_module = extend_module;

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

  singleton_class_attached(klass, obj);

  klass.$klass = class_real(orig_class).$klass;
  klass.$m = klass.$klass.$m_tbl;
  klass.__classid__ = "#<Class:#<Object:" + klass.$id + ">>";

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
  metaclsss.$m = metametaclass.$m_tbl;
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

/**
  Symbol table. All symbols are stored here.
*/
var symbol_table = { };

function class_s_new(sup) {
  // console.log("need to make singleton subclass of: " + sup.__classid__);
  // console.log("description: " + sup['m$description=']);
  var klass = define_class_id("AnonClass", sup || cObject);
  // console.log("result is: " + klass.__classid__);
  // console.log("result's description: " + klass['m$description=']);
  return klass;
};

