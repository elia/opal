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
  throw eBreakInstance;
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

function err_alloc(cls) {
  var err = new Error();
  err.$klass = cls;
  err.$m = cls.$m_tbl;
  return err;
}

function err_initialize(err, message) {
  return err.message = err.$klass.__classid__ + ': ' + (message || '');
}

function err_message(err) {
  return err.message;
}

function err_inspect(err) {
  return '#<' + err.$klass.__classid__ + ': "' + err.message + '">';
}

function err_to_s(err) {
  return err.message;
}

function init_error() {

  eException = bridge_class(Error.prototype, T_OBJECT, 'Exception', cObject);

  define_singleton_method(eException, 'allocate', err_alloc);
  define_method(eException, 'initialize', err_initialize);
  define_method(eException, 'message', err_message);
  define_method(eException, 'inspect', err_inspect);
  define_method(eException, 'to_s', err_to_s);

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

  eBreakInstance = new Error('unexpected break');
  eBreakInstance.$klass = eLocalJumpError;
  eBreakInstance.$keyword = 2;

  eReturnInstance = new Error('unexpected return');
  eReturnInstance.$klass = eLocalJumpError;
  eReturnInstance.$keyword = 1;

  eNextInstance = new Error('unexpected next');
  eNextInstance.$klass = eLocalJumpError;
  eNextInstance.$keyword = 3;
}

