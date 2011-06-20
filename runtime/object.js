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
  return "#<" + class_real(obj.$klass) + ":0x"
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

function false_and(obj, obj2) {
  return Qfalse;
}

function false_or(obj, obj2) {
  return obj2.$r ? Qtrue : Qfalse;
}

function false_xor(obj, obj2) {
  return obj2.$r ? Qtrue : Qfalse;
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
  attrs = [].slice.call(attrs, 1);

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
  attrs = [].slice.call(attrs, 1);

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

  mKernel = Rt.Kernel = define_module('Kernel');
  include_module(cObject, mKernel);

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

  define_method(cModule, '===', mod_eqq);
  define_method(cModule, '==', obj_equal);
  define_method(cModule, 'to_s', mod_to_s);

  define_method(cModule, 'attr_reader', mod_attr_reader);
  define_method(cModule, 'attr_writer', mod_attr_writer);
  define_method(cModule, 'attr_accessor', mod_attr_accessor);

  define_method(cModule, 'const_set', mod_const_set);
}

