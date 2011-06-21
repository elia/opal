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

function range_begin(range) {
  return range.$beg;
}

function range_end(range) {
  return range.$end;
}

function range_to_s(range) {
  var str = range.$beg.$m.to_s(range.$beg),
      str2 = range.$end.$m.to_s(range.$end),
      join = range.$exc ? '...' : '..';

  return str + join + str2;
}

function range_inspect(range) {
  var str = range.$beg.$m.inspect(range.$beg),
      str2 = range.$end.$m.inspect(range.$end),
      join = range.$exc ? '...' : '..';

  return str + join + str2;
}

function init_range() {
  cRange = define_class('Range', cObject);
  define_method(cRange, 'begin', range_begin);
  define_method(cRange, 'first', range_begin);
  define_method(cRange, 'end', range_end);
  define_method(cRange, 'to_s', range_to_s);
  define_method(cRange, 'inspect', range_inspect);
}

