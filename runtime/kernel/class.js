// Root of all objects and classes inside opal
function RootObject() {};

RootObject.prototype.toString = function() {
  if (this.$flags & T_OBJECT) {
    return "#<" + (this.$klass).$name + ":0x" + this.$id + ">";
  }
  else {
    return '<' + this.$name + ' ' + this.$id + '>';
  }
};

// Boot a base class (makes instances).
function boot_defclass(superklass) {
  var cls = function() {
    this.$id = unique_id++;

    return this;
  };

  if (superklass) {
    var ctor           = function() {};
        ctor.prototype = superklass.prototype;

    cls.prototype = new ctor();
  }
  else {
    cls.prototype = new RootObject();
  }

  cls.prototype.constructor = cls;
  cls.prototype.$flags          = T_OBJECT;

  return cls;
}

// Boot actual (meta classes) of core objects.
function boot_makemeta(id, klass, superklass) {
  var meta = function() {
    this.$id = unique_id++;

    return this;
  };

  var ctor           = function() {};
      ctor.prototype = superklass.prototype;

  meta.prototype = new ctor();

  var proto              = meta.prototype;
      proto.$included_in = [];
      proto.$allocator   = klass;
      proto.$flags       = T_CLASS;
      proto.$name  = id;
      proto.$s           = superklass;
      proto.constructor  = meta;

  var result = new meta();
  klass.prototype.$klass = result;
  result.$proto = klass.prototype;

  return result;
}

// Create generic class with given superclass.
function boot_class(superklass) {
  // instances
  var cls = function() {
    this.$id = unique_id++;

    return this;
  };

  var ctor = function() {};
      ctor.prototype = superklass.$allocator.prototype;

  cls.prototype = new ctor();

  var proto             = cls.prototype;
      proto.constructor = cls;
      proto.$flags          = T_OBJECT;

  // class itself
  var meta = function() {
    this.$id = unique_id++;

    return this;
  };

  var mtor = function() {};
      mtor.prototype = superklass.constructor.prototype;

  meta.prototype = new mtor();

  proto                            = meta.prototype;
  proto.$allocator                 = cls;
  proto.$flags                     = T_CLASS;
  proto.constructor                = meta;
  proto.$s                         = superklass;

  var result = new meta();
  cls.prototype.$klass = result;
  
  result.$proto = cls.prototype;

  return result;
}

function boot_module() {
  // where module "instance" methods go. will never be instantiated so it
  // can be a regular object
  var module_cons = function(){};
  var module_inst = module_cons.prototype;
  
  // Module itself
  var meta = function() {
    this.$id = unique_id++;
    return this;
  };
  
  var mtor = function(){};
  mtor.prototype = RubyModule.constructor.prototype;
  meta.prototype = new mtor();
  
  var proto = meta.prototype;
  proto.$allocator  = module_cons;
  proto.$flags      = T_MODULE;
  proto.constructor = meta;
  proto.$s          = RubyModule;
  
  var module          = new meta();
  module.$proto       = module_inst;
  
  return module;
}

// Get actual class ignoring singleton classes and iclasses.
function class_real(klass) {
  while (klass.$flags & FL_SINGLETON) {
    klass = klass.$s;
  }

  return klass;
}

// Make metaclass for the given class
function make_metaclass(klass, superklass) {
  if (klass.$flags & T_CLASS) {
    if ((klass.$flags & T_CLASS) && (klass.$flags & FL_SINGLETON)) {
      raise(RubyException, "too much meta: return klass?");
    }
    else {
      var class_id = "#<Class:" + klass.$name + ">",
          meta     = boot_class(superklass);

      meta.$name = class_id;
      meta.$allocator.prototype = klass.constructor.prototype;
      meta.$flags |= FL_SINGLETON;

      klass.$klass = meta;

      meta.$const = klass.$const;
      meta.__attached__ = klass;

      return meta;
    }
  }
  else {
    return make_singleton_class(klass);
  }
}

function make_singleton_class(obj) {
  var orig_class = obj.$klass,
      class_id   = "#<Class:#<" + orig_class.$name + ":" + orig_class.$id + ">>";

  klass             = boot_class(orig_class);
  klass.$name = class_id;

  klass.$flags                |= FL_SINGLETON;
  klass.$bridge_prototype  = obj;

  obj.$klass = klass;

  klass.__attached__ = obj;

  klass.$klass = class_real(orig_class).$k;

  return klass;
}

function bridge_class(constructor, flags, id) {
  var klass     = define_class(RubyObject, id, RubyObject),
      prototype = constructor.prototype;

  klass.$allocator = constructor;
  klass.$proto = prototype;

  bridged_classes.push(klass);

  prototype.$klass = klass;
  prototype.$flags = flags;

  return klass;
}

// Define new ruby class
function define_class(base, id, superklass) {
  var klass;

  var class_id = (base === RubyObject ? id : base.$name + '::' + id);

  klass             = boot_class(superklass);
  klass.$name = class_id;

  make_metaclass(klass, superklass.$klass);

  var const_alloc   = function() {};
  var const_scope   = const_alloc.prototype = new base.$const.alloc();
  klass.$const      = const_scope;
  const_scope.alloc = const_alloc;

  base.$const[id] = klass;

  if (superklass.$inherited) {
    superklass.$inherited(null, klass);
  }

  return klass;
}

// Get singleton class of obj
function singleton_class(obj) {
  var klass;

  if (obj.$flags & T_OBJECT) {
    if ((obj.$flags & T_NUMBER) || (obj.$flags & T_STRING)) {
      raise(RubyTypeError, "can't define singleton");
    }
  }

  if ((obj.$klass.$flags & FL_SINGLETON) && obj.$klass.__attached__ == obj) {
    klass = obj.$klass;
  }
  else {
    var class_id = obj.$klass.$name;

    klass = make_metaclass(obj, obj.$klass);
  }

  return klass;
}
