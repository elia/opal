var cString, cSymbol;

/**
  Returns a new ruby symbol with the given intern value. Symbols are made
  using the new String() constructor, and just have its klass and method
  table reassigned. This makes dealing with strings/symbols internally
  easier as both can be used as a string within opal.

  @param {String} intern Symbol value
  @return {RSymbol} symbol
*/
var intern = Rt.Y = function(intern) {
  if (symbol_table.hasOwnProperty(intern)) {
    return symbol_table[intern];
  }

  var res = new String(intern);
  res.$klass = cSymbol;
  res.$m = cSymbol.$m_tbl;
  res.$flags = T_OBJECT | T_SYMBOL;
  symbol_table[intern] = res;
  return res;
};

var STR_CX = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

var STR_ESCAPABLE = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

var STR_META = {
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\f': '\\f',
  '\r': '\\r',
  '"' : '\\"',
  '\\': '\\\\'
};

STR_ESCAPABLE.lastIndex = 0;

function str_new(cls, str) {
  var res = new String(str);
  res.$klass = cls;
  res.$m = cls.$m_tbl;
  return res;
}

/**
  Copy - returns a new string containing `count` copies of the receiver.

  @example

      'Ho!' * 3       # => 'Ho!Ho!Ho!'

  @param {Number} times Number of copies
  @return {String}
*/
function str_times(str, times) {
  var result = [];

  for (var i = 0; i < times; i++) {
    result.push(str);
  }

  return result.join('');
}

/**
  Concatenation - Returns a new string containing `other` concatendated
  onto the receiver.

  @example

      'Hello from ' + self.to_s   # => 'Hello from main'

  @param {String} str2 String to concatentate
  @return {String}
*/
function str_plus(str1, str2) {
  return str1 + str2;
}

/**
  Returns a copy of `self` with the first character converted to uppercase and
  the remaining to lowercase.

  @example

      'hello'.capitalize
      # => 'Hello'
      'HELLO'.capitalize
      # => 'Hello'
      '123ABC'.capitalize
      # => '123abc'

  @return {String}
*/
function str_capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}

/**
  Returns a copy of `self` with all uppercase letters replaces with their
  lowercase counterparts.

  @example

      'hELLo'.downcase
      # => 'hello'

  @return {String}
*/
function str_downcase(str) {
  return str.toLowerCase();
}

/**
  Returns a printable version of `self`, surrounded with quotation marks, with
  all special characters escaped.

  @example

      str = "hello"
      str.inspect
      # => "\"hello\""

  @return [String]
*/
function str_inspect(str) {
  if (STR_ESCAPABLE.test(str)) {
    return '"' + str.replace(STR_ESCAPABLE, function(a) {
      var c = STR_META[a];
      if (typeof c == 'string') {
        return c;
      } else {
        return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
      }
    }) + '"';
  }
  else {
    return '"' + str + '"';
  }
}

function str_to_s(str) {
  return str.toString();
}

/**
 Returns the number of characters in `self`.

  @return [Numeric]
*/
function str_length(str) {
  return str.length;
}

function str_to_i(str) {
  return parseInt(str);
}

/**
  Returns the corresponding symbol for the receiver.

  @example

      "koala".to_sym      # => :Koala
      'cat'.to_sym        # => :cat
      '@cat'.to_sym       # => :@cat

  @return {Symbol}
*/
function str_intern(str) {
  return intern(str);
}

/**
  Returns a new string with the characters from `self` in reverse order.

  @example

      'stressed'.reverse
      # => 'desserts'

  @return {String}
*/
function str_reverse(str) {
  return str.split('').reverse().join('');
}

function str_succ(str) {
  return String.fromCharCode(str.charCodeAt(0));
}

function str_aref(str, idx) {
  return str.substr(idx, idx + 1);
}

function str_sub(str, pattern, replace) {
  return str.replace(pattern, function(s) {
    return replace;
  });
}

function str_gsub(str, pattern, replace) {
  var r = pattern.toString();
  r = r.substr(1, r.lastIndexOf('/') - 1);
  r = new RegExp(r, 'g');
  return str.replace(r, function(s) {
    return replace;
  });
}

function str_split(str, split, limit) {
  return str.split(split);
}

/**
  Comparison - returns -1 if `other` is greater than, 0 if `other` is equal to
  or 1 if `other` is less than `self. Returns nil if `other` is not a string.

  @example

      'abcdef' <=> 'abcde'        # => 1
      'abcdef' <=> 'abcdef'       # => 0
      'abcdef' <=> 'abcdefg'      # => -1
      'abcdef' <=> 'ABCDEF'       # => 1

  @param {String} other string to compare
  @return {-1, 0, 1, nil} result
*/
function str_cmp(str, str2) {
  if ((!str2.$flags & T_STRING)) return Qnil;
  else if (str > str2) return 1;
  else if (str < str2) return -1;
  return 0;
}

/**
  Equality - if other is not a string, returns false. Otherwise, returns true
  if self <=> other returns zero.

  @param [String] other string to compare
  @return [true, false]
*/
function str_equal(str, str2) {
  return str.valueOf() === str2.valueOf() ? Qtrue : Qfalse;
}

/**
  Match - if obj is a Regexp, then uses it to match against self, returning
  nil if there is no match, or the index of the match location otherwise. If
  obj is not a regexp, then it calls =~ on it, using the receiver as an
  argument

  TODO passing a non regexp is not currently supported

  @param {Regexp, Objec} obj
  @return {Numeric, nil}
*/
function str_match(str, obj) {
  return obj.$m['=~'](obj, str);
}

/**
  Case-insensitive version of {#<=>}

  @example

      'abcdef'.casecmp 'abcde'        # => 1
      'aBcDeF'.casecmp 'abcdef'       # => 0
      'abcdef'.casecmp 'aBcdEFg'      # => -1

  @param {String} other string to compare
  @return {-1, 0, 1, nil}
*/
function str_casecmp(str, str2) {
  if (!(str2.$flags & T_STRING)) return Qnil;
  var a = str.toLowerCase(), b = str2.toLowerCase();

  if (a > b) return 1;
  else if (a < b) return -1;
  return 0;
}

/**
  Returns `true` if self has a length of zero.

  @example

      'hello'.empty?
      # => false
      ''.empty?
      # => true

  @return [true, false]
*/
function str_empty(str) {
  return str.length == 0 ? Qtrue : Qfalse;
}

/**
  Returns true is self ends with the given suffix.

  @example

      'hello'.end_with? 'lo'
      # => true

  @param [String] suffix the suffix to check
  @return [true, false]
*/
function str_end_with(str, suffix) {
  if (str.lastIndexOf(suffix) == str.length - suffix.length) {
    return Qtrue;
  }

  return Qfalse;
}

/**
  Returns true if self contains the given string `other`.

  @example

      'hello'.include? 'lo'     # => true
      'hello'.include? 'ol'     # => false

  @param [String] other string to check for
  @return [true, false]
*/
function str_include(str, str2) {
  return str.indexOf(str2) == -1 ? Qfalse : Qtrue;
}

/**
  Returns the index of the first occurance of the given `substr` or pattern in
  self. Returns `nil` if not found. If the second param is present then it
  specifies the index of self to begin searching.

  TODO: regexp and offsets not yet implemented.

  @example

      'hello'.index 'e'         # => 1
      'hello'.index 'lo'        # => 3
      'hello'.index 'a'         # => nil

  @param [String] substr string to check for
  @return [Numeric, nil]
*/
function str_index(str, str2) {
  var res = str.indexOf(str2);
  return res == -1 ? Qnil : res;
}

/**
  Returns a copy of self with leading whitespace removed.

  @example

      '   hello   '.lstrip
      # => 'hello   '
      'hello'.lstrip
      # => 'hello'

  @return [String]
*/
function str_lstrip(str) {
  return str.replace(/^\s*/, '');
}

function sym_inspect(sym) {
  return ':' + sym;
}

function sym_to_s(sym) {
  return sym.toString();
}

function sym_intern(sym) {
  return sym;
}

function init_string() {
  cString = bridge_class(String.prototype,
    T_OBJECT | T_STRING, 'String', cObject);

  define_singleton_method(cString, 'new', str_new);
  define_method(cString, '*', str_times);
  define_method(cString, '+', str_plus);
  define_method(cString, 'capitalize', str_capitalize);
  define_method(cString, 'downcase', str_downcase);
  define_method(cString, 'inspect', str_inspect);
  define_method(cString, 'to_s', str_to_s);
  define_method(cString, 'length', str_length);
  define_method(cString, 'size', str_length);
  define_method(cString, 'to_i', str_to_i);
  define_method(cString, 'intern', str_intern);
  define_method(cString, 'to_sym', str_intern);
  define_method(cString, 'reverse', str_reverse);
  define_method(cString, 'succ', str_succ);
  define_method(cString, '[]', str_aref);
  define_method(cString, 'sub', str_sub);
  define_method(cString, 'gsub', str_gsub);
  define_method(cString, 'slice', str_aref);
  define_method(cString, 'split', str_split);
  define_method(cString, '<=>', str_cmp);
  define_method(cString, '===', str_equal);
  define_method(cString, '==', str_equal);
  define_method(cString, '=~', str_match);
  define_method(cString, 'casecmp', str_casecmp);
  define_method(cString, 'empty?', str_empty);
  define_method(cString, 'end_with?', str_end_with);
  define_method(cString, 'eql?', str_equal);
  define_method(cString, 'include?', str_include);
  define_method(cString, 'index', str_index);
  define_method(cString, 'lstrip', str_lstrip);

  cSymbol = define_class('Symbol', cObject);
  define_method(cSymbol, 'inspect', sym_inspect);
  define_method(cSymbol, 'to_s', sym_to_s);
  define_method(cSymbol, 'to_sym', sym_intern);
  define_method(cSymbol, 'intern', sym_intern);
}

