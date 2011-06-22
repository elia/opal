function obj_dummy() {
  return Qnil;
}

function obj_equal(obj, obj2) {
  if (obj == obj2) return Qtrue;
  return Qfalse;
}

function obj_eqq(obj, obj2) {
  if (obj.$m['==='](obj, obj2).$r) return Qtrue;
  return Qfalse;
}

function obj_not(obj) {
  return obj.$r ? Qtrue : Qfalse;
}

function obj_not_equal(obj, obj2) {
  if (obj.$m['=='](obj, obj2).$r) return Qfalse;
  return Qtrue;
}

function obj_false() {
  return Qfalse;
}

function obj_true() {
  return Qtrue;
}

function obj_match() {
  return Qnil;
}

function obj_not_match(obj, obj2) {
  if (obj.$m['=~'](obj, obj2).$r) return Qfalse;
  return Qtrue;
}

function obj_class(obj) {
  return class_real(obj.$klass);
}

function obj_singleton_class(obj) {
  return singleton_class(obj);
}

function obj_to_s(obj) {
  return "#<" + class_real(obj.$klass).__classid__ + ":0x"
    + (obj.$hash() * 400487).toString(16) + ">";
}

function obj_inspect(obj) {
  return obj.$m.to_s(obj);
}

function obj_ivar_get(obj, name) {
  name = name.$m.to_s(name);
  return obj[name] == undefined ? nil : obj[name];
}

function obj_ivar_set(obj, name, value) {
  name = name.$m.to_s(name);
  return obj[name] = value;
}

function obj_ivar_defined(obj, name) {
  name = name.$m.to_s(name);
  return obj[name] == undefined ? Qfalse : Qtrue;
}

function obj_is_instance_of(obj, cls) {
  return Qfalse;
}

function obj_is_kind_of(obj, cls) {
  var search = obj.$klass;

  while (search) {
    if (search == cls) return Qtrue;
    search = search.$superl
  }

  return Qfalse;
}

function obj_tap(obj) {
  var block_func = block.f, proc = block.p;

  if (block_func != arguments.callee) {
    raise(eLocalJumpError, "no block given");
  }

  block.f = block.p = Qnil;

  try {
    proc(proc.$self, obj);
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return obj;
}

function nil_to_i() {
  return 0;
}

function nil_to_f() {
  return 0.0;
}

function nil_to_a() {
  return [];
}

function nil_to_s() {
  return "";
}

function nil_inspect() {
  return "nil";
}

function false_to_s() {
  return "false";
}

function false_and(obj, obj2) {
  return Qfalse;
}

function false_or(obj, obj2) {
  return obj2.$r ? Qtrue : Qfalse;
}

function false_xor(obj, obj2) {
  return obj2.$r ? Qtrue : Qfalse;
}

function true_to_s() {
  return "true";
}

function true_and(obj, obj2) {
  return obj2.$r ? Qtrue : Qfalse;
}

function true_or(obj, obj2) {
  return Qtrue;
}

function true_xor(obj, obj2) {
  return obj2.$r ? Qfalse : Qtrue;
}

function top_to_s() {
  return "main";
}

function top_include(top, mod) {
  include_module(cObject, mod);
  return top;
}

function mod_eqq(mod, arg) {
  return obj_is_kind_of(arg, mod);
}

function mod_to_s(mod) {
  return mod.__classid__;
}

function mod_name(mod) {
  return mod.__classid__;
}

function mod_attr_reader(mod, attrs) {
  attrs = [].slice.call(arguments, 1);

  for (var i = 0, ii = attrs.length; i < ii; i++) {
    (function(mid) {
      mid = mid.$m.to_s(mid);

      define_method(mod, mid, function(obj) {
        var iv = obj['@' + mid];
        return iv == undefined ? Qnil : iv;
      });
    })(attrs[i]);
  }

  return Qnil;
}

function mod_attr_writer(mod, attrs) {
  attrs = [].slice.call(arguments, 1);

  for (var i = 0, ii = attrs.length; i < ii; i++) {
    (function(mid) {
      mid = mid.$m.to_s(mid);

      define_method(mod, mid + '=', function(obj, val) {
        return obj['@' + mid] = val;
      });
    })(attrs[i]);
  }

  return Qnil;
}

function mod_attr_accessor(mod, attrs) {
  var args = [mod].concat([].slice.call(arguments, 1));
  mod_attr_reader.apply(null, args);
  mod_attr_writer.apply(null, args);
  return Qnil;
}

function mod_const_set(mod, name, value) {
  name = name.$m.to_s(name);
  const_set(mod, name, value);
  return value;
}

function class_new_instance(cls) {
  var arg = [].slice.call(arguments, 1);
  var obj = cls.$m.allocate(cls);

  if (block.f == arguments.callee) {
    block.f = obj.$m.initialize;
  }

  obj.$m.initialize.apply(obj, [obj].concat(arg));
  return obj;
}

function class_initialize(cls) {
  return cls;
}

function class_superclass(cls) {
  var sup = cls.$super;

  if (!sup) {
    if (cls == cBasicObject) return Qnil;
    raise(eRuntimeError, "uninitialized class");
  }

  return sup;
}

function mod_define_method(mod, method_id) {
  var block_func = block.f, proc = block.p;

  if (block_func != arguments.callee) {
    raise(eLocalJumpError, "no block given");
  }

  define_method(mod, method_id.$m.to_s(method_id), proc);
  return Qnil;
}

function mod_alias_method(mod, new_name, old_name) {
  alias_method(mod, new_name.$m.to_s(new_name), old_name.$m.to_s(old_name));
  return mod;
}

function mod_class_eval(mod, str) {
  var block_func = block.f, proc = block.p;

  if (block_func != arguments.callee) {
    raise(eException, "class_eval: need to compile code..");
  }

  return proc(mod);
}

function mod_extend(cls, mod) {
  extend_module(cls, mod);
  return Qnil;
}

function obj_send(obj, method_id) {
  var args = [].slice.call(arguments, 2), block_func = block.f, method;

  method_id = method_id.$m.to_s(method_id);
  method = obj.$m[method_id];

  if (block_func == arguments.callee) {
    block.f = method;
  }

  return method.apply(obj, [obj].concat(args));
}

function obj_instance_eval(obj) {
  var block_func = block.f, proc = block.p;

  if (block_func != arguments.callee) {
    raise(eArgError, "block not supplied");
  }

  return proc(obj);
}

function obj_method_missing(obj, sym) {
  raise(eNoMethodError, "undefined method `" + sym.$m.to_s(sym) + "` for "
        + obj.$m.inspect(obj));
}

function obj_to_a(obj) {
  return [obj];
}

function obj_respond_to_p(obj, method_id) {
  method_id = method_id.$m.to_s(method_id);

  var method = obj.$m[method_id];

  if (method && !method.$rbMM)
    return Qtrue;

  return Qfalse;
}

function obj_raise(obj, exception, str) {
  var msg, exc;

  if (exception.$flags & T_STRING) {
    msg = exception;
    exc = eRuntimeError.$m['new'](eRuntimeError, msg);
  }
  else if (obj_is_kind_of(exception, eException)) {
    exc = exception;
  }
  else {
    if (str != undefined) msg = str;
    exc = exception.$m['new'](exception, msg);
  }
  raise_exc(exc);
}

function obj_loop(obj) {
  var block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eLocalJumpError, "no block given");
  }

  yself = proc.$proc[0];

  try {
    while (true) {
      proc(yself);
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return obj;
}

function obj_proc(obj) {
  var block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eLocalJumpError, "no block given");
  }

  return proc;
}

function obj_lambda(proc) {
  var block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eLocalJumpError, "no block given");
  }

  return proc;
}

function mod_include(cls) {
  var mods = [].slice.call(arguments, 1), i = mods.length - 1, mod;

  while (i >= 0) {
    mod = mods[i];
    mod.$m.append_features(mod, cls);
    mod.$m.included(mod, cls);
    i--;
  }

  return cls;
}

function mod_append_features(cls, mod) {
  include_module(mod, cls);
  return cls;
}

function init_object() {

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

  define_method(cBasicObject, 'initialize', obj_dummy);
  define_method(cBasicObject, '==', obj_equal);
  define_method(cBasicObject, 'equal?', obj_equal);
  define_method(cBasicObject, '!', obj_not);
  define_method(cBasicObject, '!=', obj_not_equal);

  define_method(cBasicObject, 'singleton_method_added', obj_dummy);
  define_method(cBasicObject, 'singleton_method_removed', obj_dummy);
  define_method(cBasicObject, 'singleton_method_undefined', obj_dummy);

  top_self = obj_alloc(cObject);
  Rt.top = top_self;
  define_singleton_method(top_self, 'to_s', top_to_s);
  define_singleton_method(top_self, 'include', top_include);

  mKernel = Rt.Kernel = define_module('Kernel');
  include_module(cObject, mKernel);

  define_method(cClass, 'inherited', obj_dummy);
  define_method(cModule, 'included', obj_dummy);
  define_method(cModule, 'extended', obj_dummy);
  define_method(cModule, 'method_added', obj_dummy);
  define_method(cModule, 'method_removed', obj_dummy);
  define_method(cModule, 'method_undefined', obj_dummy);

  define_method(mKernel, 'nil?', obj_false);
  define_method(mKernel, '===', obj_eqq);
  define_method(mKernel, '=~', obj_match);
  define_method(mKernel, '!~', obj_not_match);
  define_method(mKernel, 'eql?', obj_equal);

  define_method(mKernel, 'class', obj_class);
  define_method(mKernel, 'singleton_class', obj_singleton_class);

  define_method(mKernel, 'to_s', obj_to_s);
  define_method(mKernel, 'inspect', obj_inspect);
  define_method(mKernel, 'instance_variable_get', obj_ivar_get);
  define_method(mKernel, 'instance_variable_set', obj_ivar_set);
  define_method(mKernel, 'instance_variable_defined?', obj_ivar_defined);

  define_method(mKernel, 'instance_of?', obj_is_instance_of);
  define_method(mKernel, 'kind_of?', obj_is_kind_of);
  define_method(mKernel, 'is_a?', obj_is_kind_of);
  define_method(mKernel, 'tap', obj_tap);
  define_method(mKernel, 'to_a', obj_to_a);
  define_method(mKernel, 'respond_to?', obj_respond_to_p)
  define_method(mKernel, 'raise', obj_raise);
  define_method(mKernel, 'fail', obj_raise);
  define_method(mKernel, 'loop', obj_loop);
  define_method(mKernel, 'proc', obj_proc);
  define_method(mKernel, 'lambda', obj_lambda);

  define_method(cModule, '===', mod_eqq);
  define_method(cModule, '==', obj_equal);
  define_method(cModule, 'to_s', mod_to_s);

  define_method(cModule, 'attr_reader', mod_attr_reader);
  define_method(cModule, 'attr_writer', mod_attr_writer);
  define_method(cModule, 'attr_accessor', mod_attr_accessor);

  define_method(cModule, 'const_set', mod_const_set);

  define_method(cModule, 'define_method', mod_define_method);
  define_method(cModule, 'alias_method', mod_alias_method);
  define_method(cModule, 'class_eval', mod_class_eval);
  define_method(cModule, 'module_eval', mod_class_eval);
  define_method(cModule, 'extend', mod_extend);

  define_method(cModule, 'include', mod_include);
  define_method(cModule, 'append_features', mod_append_features);
  define_method(cModule, 'included', obj_dummy);

  define_method(cClass, 'allocate', obj_alloc);
  define_method(cClass, 'new', class_new_instance);
  define_method(cClass, 'initialize', class_initialize);
  define_method(cClass, 'superclass', class_superclass);

  define_method(cBasicObject, '__send__', obj_send);
  define_method(mKernel, 'send', obj_send);
  define_method(cBasicObject, 'instance_eval', obj_instance_eval);
  define_method(cBasicObject, 'method_missing', obj_method_missing);

  cNilClass = define_class('NilClass', cObject);
  define_method(cNilClass, 'to_i', nil_to_i);
  define_method(cNilClass, 'to_f', nil_to_f);
  define_method(cNilClass, 'to_s', nil_to_s);
  define_method(cNilClass, 'to_a', nil_to_a);
  define_method(cNilClass, 'inspect', nil_inspect);
  define_method(cNilClass, '&', false_and);
  define_method(cNilClass, '|', false_or);
  define_method(cNilClass, '^', false_xor);
  define_method(cNilClass, 'nil?', obj_true);

  Rt.Qnil = Qnil = obj_alloc(cNilClass);
  Qnil.$r = false;
  const_set(cObject, 'NIL', Qnil);

  cTrueClass = define_class('TrueClass', cObject);
  define_method(cTrueClass, 'to_s', true_to_s);
  define_method(cTrueClass, '&', true_and);
  define_method(cTrueClass, '|', true_or);
  define_method(cTrueClass, '^', true_xor);

  Rt.Qtrue = Qtrue = obj_alloc(cTrueClass);
  const_set(cObject, 'TRUE', Qtrue);

  cFalseClass = define_class('FalseClass', cObject);
  define_method(cFalseClass, 'to_s', false_to_s);
  define_method(cFalseClass, '&', false_and);
  define_method(cFalseClass, '|', false_or);
  define_method(cFalseClass, '^', false_xor);

  Rt.Qfalse = Qfalse = obj_alloc(cFalseClass);
  Qfalse.$r = false;
  const_set(cObject, 'FALSE', Qfalse);
}

