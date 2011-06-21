function reg_s_escape(reg) {
  return reg;
}

function reg_s_new(str) {
  return new RegExp(str);
}

function reg_inspect(reg) {
  return reg.toString();
}

function reg_to_s(reg) {
  return reg.source;
}

function reg_equal(reg, reg2) {
  return reg.toString() === reg2.toString() ? Qtrue : Qfalse;
}

function reg_match(reg, str) {
  var res = reg.exec(str);
  X = res;

  if (res) {
    return res.index;
  }
  else {
    return Qnil;
  }
}

function reg_match_m(reg, str) {
  return reg_match(reg, str);
}

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

function init_re() {
  cRegexp = bridge_class(RegExp.prototype,
    T_OBJECT, 'Regexp', cObject);

  define_singleton_method(cRegexp, 'escape', reg_s_escape);
  define_singleton_method(cRegexp, 'new', reg_s_new);
  define_method(cRegexp, 'inspect', reg_inspect);
  define_method(cRegexp, 'to_s', reg_to_s);
  define_method(cRegexp, '==', reg_equal);
  define_method(cRegexp, 'eql?', reg_equal);
  define_method(cRegexp, '=~', reg_match);
  define_method(cRegexp, 'match', reg_match_m);

  cMatch = define_class('MatchData', cObject);
  define_hooked_variable('$~', regexp_match_getter, gvar_readonly_setter);
}

