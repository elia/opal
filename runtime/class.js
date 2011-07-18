
/**
  Root of all classes and objects (except for bridged).
*/
var boot_base_class = function() {};

boot_base_class.$hash = function() {
  return this.$id;
};

boot_base_class.prototype.$r = true;

/**
  Boot a base class (only used for very core object classes)
*/
function boot_defclass(id, super_klass) {
  var cls = function() {
    this.$id = yield_hash();
  };

  if (super_klass) {
    var ctor = function() {};
    ctor.prototype = super_klass.prototype;
    cls.prototype = new ctor();
  } else {
    cls.prototype = new boot_base_class();
  }

  cls.prototype.constructor = cls;
  cls.prototype.o$f = T_OBJECT;

  cls.prototype.$hash = function() { return this.$id; };
  cls.prototype.$r = true;
  return cls;
};

// make the actual classes themselves (Object, Class, etc)
function boot_makemeta(id, klass, superklass) {
  var meta = function() {
    this.$id = yield_hash();
  };

  var ctor = function() {};
  ctor.prototype = superklass.prototype;
  meta.prototype = new ctor();

  var proto = meta.prototype;
  proto.$included_in = [];
  proto.o$m = {};
  proto.$methods = [];

  proto.o$a = klass;
  proto.o$f = T_CLASS;
  proto.__classid__ = id;
  proto.$super = superklass;
  proto.constructor = meta;

  // constants
  if (superklass.prototype.$constants_alloc) {
    proto.$c = new superklass.prototype.$constants_alloc();
    proto.$constants_alloc = function() {};
    proto.$constants_alloc.prototype = proto.$c;
  } else {
    proto.$constants_alloc = function() {};
    proto.$c = proto.$constants_alloc.prototype;
  }

  var result = new meta();
  klass.prototype.o$k = result;
  return result;
};

function boot_defmetameta(klass, meta) {
  klass.o$k = meta;
}

function class_boot(superklass) {
  // instances
  var cls = function() {
    this.$id = yield_hash();
  };

  var ctor = function() {};
  ctor.prototype = superklass.o$a.prototype;
  cls.prototype = new ctor();

  var proto = cls.prototype;
  proto.constructor = cls;
  proto.o$f = T_OBJECT;

  // class itself
  var meta = function() {
    this.$id = yield_hash();
  };

  var mtor = function() {};
  mtor.prototype = superklass.constructor.prototype;
  meta.prototype = new mtor();

  proto = meta.prototype;
  proto.o$a = cls;
  proto.o$f = T_CLASS;
  proto.o$m = {};
  proto.$methods = [];
  proto.constructor = meta;
  proto.$super = superklass;

  // constants
  proto.$c = new superklass.$constants_alloc();
  proto.$constants_alloc = function() {};
  proto.$constants_alloc.prototype = proto.$c;

  var result = new meta();
  cls.prototype.o$k = result;
  return result;
};

function class_real(klass) {
  while (klass.o$f & FL_SINGLETON) { klass = klass.$super; }
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
  if (klass.o$f & T_CLASS) {
    if ((klass.o$f & T_CLASS) && (klass.o$f & FL_SINGLETON)) {
      return make_metametaclass(klass);
    }
    else {
      // FIXME this needs fixinfg to remove hacked stuff now in make_singleton_class
      var meta = class_boot(super_class);
      // remove this??!
      meta.o$a.prototype = klass.constructor.prototype;
      meta.$c = meta.o$k.$c_prototype;
      meta.o$f |= FL_SINGLETON;
      meta.__classid__ = "#<Class:" + klass.__classid__ + ">";
      klass.o$k = meta;
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
  var orig_class = obj.o$k;
  var klass = class_boot(orig_class);

  klass.o$f |= FL_SINGLETON;

  obj.o$k = klass;

  // make methods we define here actually point to instance
  // FIXME: we could just take advantage of $bridge_prototype like we
  // use for bridged classes?? means we can make more instances...
  klass.$bridge_prototype = obj;

  singleton_class_attached(klass, obj);

  klass.o$k = class_real(orig_class).o$k;
  klass.__classid__ = "#<Class:#<" + orig_class.__classid__ + ":" + klass.$id + ">>";

  return klass;
};

function singleton_class_attached(klass, obj) {
  if (klass.o$f & FL_SINGLETON) {
    klass.__attached__ = obj;
  }
};

function make_metametaclass(metaclass) {
  var metametaclass, super_of_metaclass;

  if (metaclass.o$k == metaclass) {
    metametaclass = class_boot(null);
    metametaclass.o$k = metametaclass;
  }
  else {
    metametaclass = class_boot(null);
    metametaclass.o$k = metaclass.o$k.o$k == metaclass.o$k
      ? make_metametaclass(metaclass.o$k)
      : metaclass.o$k.o$k;
  }

  metametaclass.o$f |= FL_SINGLETON;

  singleton_class_attached(metametaclass, metaclass);
  metaclass.o$k = metametaclass;
  super_of_metaclass = metaclass.$super;

  metametaclass.$super = super_of_metaclass.o$k.__attached__
    == super_of_metaclass
    ? super_of_metaclass.o$k
    : make_metametaclass(super_of_metaclass);

  return metametaclass;
};

function boot_defmetametaclass(klass, metametaclass) {
  klass.o$k.o$k = metametaclass;
};

// Holds an array of all prototypes that are bridged. Any method defined on
// Object in ruby will also be added to the bridge classes.
var bridged_classes = [];

/**
  Define toll free bridged class
*/
function bridge_class(prototype, flags, id, super_class) {
  var klass = define_class(id, super_class);

  bridged_classes.push(prototype);
  klass.$bridge_prototype = prototype;

  for (var meth in cObject.o$m) {
    prototype[meth] = cObject.o$m[meth];
  }

  prototype.o$k = klass;
  prototype.o$f = flags;
  prototype.$r = true;

  prototype.$hash = function() { return flags + '_' + this; };

  return klass;
};

// make native prototype from class
function native_prototype(cls, proto) {
  var sup = cls.$super;

  if (sup != cObject) {
    raise(eRuntimeError, "native_error must be used on subclass of Object only");
  }

  bridged_classes.push(proto);
  cls.$bridge_prototype = proto;

  for (var meth in cObject.o$m) {
    proto[meth] = cObject.o$m[meth];
  }

  // add any methods already defined for class.. although, we should really
  // say that you must call Class#native_prototoype ASAP...
  for (var meth in cls.o$m) {
    console.log("need to add existing method " + meth);
  }

  proto.o$k = cls;
  proto.o$f = T_OBJECT;
  proto.$r = true;

  proto.$hash = function() { return this.$id || (this.$id = yield_hash()); };

  return cls;
}

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

    if (!(klass.o$f & T_CLASS)) {
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
  make_metaclass(klass, super_klass.o$k);

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

  if (obj.o$f & T_OBJECT) {
    if ((obj.o$f & T_NUMBER) || (obj.o$f & T_SYMBOL)) {
      raise(eTypeError, "can't define singleton");
    }
  }

  if ((obj.o$k.o$f & FL_SINGLETON) && obj.o$k.__attached__ == obj) {
    klass = obj.o$k;
  }
  else {
    var class_id = obj.o$k.__classid__;
    klass = make_metaclass(obj, obj.o$k);
  }

  return klass;
};

Rt.singleton_class = singleton_class;

