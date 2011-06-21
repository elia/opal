var mEnumerable;

function enum_to_a(obj) {
  var ary = [];

  var proc = function(s, i) {
    ary.push(i);
    return i;
  };

  proc.$proc = [obj];
  block.p = proc;

  var method = obj.$m.each;

  block.f = method;
  method(obj);
  return ary;
}

function init_enumerable() {
  mEnumerable = define_module('Enumerable');

  define_method(mEnumerable, 'to_a', enum_to_a);
  define_method(mEnumerable, 'entries', enum_to_a);
}

