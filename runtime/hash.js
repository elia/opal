var cHash;

/**
  Returns a new hash with values passed from the runtime.
*/
Rt.H = function() {
  var hash = hash_alloc(cHash), k, v, args = [].slice.call(arguments);

  for (var i = 0, ii = args.length; i < ii; i++) {
    k = args[i];
    v = args[i + 1];
    i++;
    hash.$keys.push(k);
    hash.$assocs[k.$hash()] = v;
  }

  return hash;
};

function hash_alloc(cls) {
  var hash = new RObject(cls);
  hash.$keys = [];
  hash.$assocs = {};
  hash.$default = Qnil;
  return hash;
}

/**
  Returns a new array populated with the values from `self`.

  @example

      { :a => 1, :b => 2 }.values
      # => [1, 2]

  @return [Array]
*/
function hash_values(hash) {
  var values = [], length = hash.$keys.length;

  for (var i = 0; i < length; i++) {
    values.push(hash.$assocs[hash.$keys[i].$hash()]);
  }

  return values;
}

/**
  Returns the contents of this hash as a string.

  @example

      h = { 'a' => 100, 'b' => 200 }
      # => "{ \"a\" => 100, \"b\" => 200 }"

  @return [String]
*/
function hash_inspect(hash) {
  var str = [], key, value;

  for (var i = 0, ii = hash.$keys.length; i < ii; i++) {
    key = hash.$keys[i];
    value = hash.$assocs[key.$hash()];
    str.push(key.$m.inspect(key) + '=>' + value.$m.inspect(value));
  }

  return '{' + str.join(', ') + '}';
}

/**
  Returns a simple string representation of the hash's keys and values.

  @return [String]
*/
function hash_to_s(hash) {
  var str = [], key, value;

  for (var i = 0, ii = hash.$keys.length; i < ii; i++) {
    key = hash.$keys[i];
    value = hash.$assocs[key.$hash()];
    str.push(key.$m.inspect(key) + value.$m.inspect(value));
  }

  return str.join('');
}

/**
  Yields the block once for each key in `self`, passing the key-value pair
  as parameters.

  @example

      { 'a' => 100, 'b' => 200 }.each { |k, v| puts "#{k} is #{v}" }
      # => "a is 100"
      # => "b is 200"

  @return [Hash] returns the receiver
*/
function hash_each(hash) {
  var block_func = block.f, proc = block.p;

  if (block_func != arguments.callee) {
    raise(eLocalJumpError, "no block given");
  }

  block.f = block.p = Qnil;
  var yself = proc.$self, k, v, keys = hash.$keys, vals = hash.$assocs;

  try {
    for (var i = 0, ii = hash.length; i < ii; i++) {
      key = keys[i]; val = vals[key.$hash()];
      proc(yself, key, val);
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return hash;
}


/**
  Searches through the hash comparing `obj` with the key ysing ==. Returns the
  key-value pair (two element array) or nil if no match is found.

  @example

      h = { 'a' => [1, 2, 3], 'b' => [4, 5, 6] }
      h.assoc 'a'
      # => ['a', [1, 2, 3]]
      h.assoc 'c'
      # => nil

  @param [Object] obj key to search for
  @return [Array<Object, Object>, nil] result or nil
*/
function hash_assoc(hash, obj) {
  var key, keys = hash.$keys, assocs = hash.$assocs;

  for (var i = 0, ii = keys.length; i < ii; i++) {
    key = keys[i];
    if (key.$m['=='](key, obj).$r) {
      return [key, assocs[key.$hash()]];
    }
  }

  return Qnil;
}

/**
  Equality - Two hashes are equal if they each contain the same number of keys
  and if each key-value paid is equal, accordind to {BasicObject#==}, to the
  corresponding elements in the other hash.

  @example

      h1 = { 'a' => 1, 'c' => 2 }
      h2 = { 7 => 35, 'c' => 2, 'a' => 1 }
      h3 = { 'a' => 1, 'c' => 2, 7 => 35 }
      h4 = { 'a' => 1, 'd' => 2, 'f' => 35 }

      h1 == h2    # => false
      h2 == h3    # => true
      h3 == h4    # => false

  @param [Hash] other the hash to compare with
  @return [true, false]
*/
function hash_equal(hash, hash2) {
  if (hash == hash2) return Qtrue;
  if (!hash2.$keys || !hash2.$assocs) return Qfalse;
  if (hash.$keys.length != hash2.$keys.length) return Qfalse;

  for (var i = 0, ii = hash.$keys.length; i < ii; i++) {
    var key = hash.$keys[i], assocs = key.$hash();

    if (!hash2.$assocs.hasOwnProperty(assoc))
      return Qfalse;

    var assoc1 = hash.$assocs[assoc], assoc2 = hash2.$assocs[assoc];

    if (!assoc1.$m['=='](assoc1, assoc2).$r)
      return Qfalse;
  }

  return Qtrue;
}

/**
  Element reference - retrieves the `value` object corresponding to the `key`
  object. If not found, returns the default value.

  @example

      h = { 'a' => 100, 'b' => 200 }
      h['a']
      # => 100
      h['c']
      # => nil

  @param [Object] key the key to look for
  @return [Object] result or default value
*/
function hash_aref(hash, key) {
  var assoc = key.$hash();

  if (hash.$assocs.hasOwnProperty(assoc)) {
    return hash.$assocs[assoc];
  }

  return hash.$default;
}

/**
  Element assignment - Associates the value given by 'value' with the key
  given by 'key'. `key` should not have its value changed while it is used as
  a key.

  @example

      h = { 'a' => 100, 'b' => 200 }
      h['a'] = 9
      h['c'] = 4
      h
      # => { 'a' => 9, 'b' => 200, 'c' => 4 }

  @param [Object] key the key for hash
  @param [Object] value the value for the key
  @return [Object] returns the set value
*/
function hash_aset(hash, key, val) {
  var assoc = key.$hash();

  if (!hash.$assocs.hasOwnProperty(assoc)) {
    hash.$keys.push(key);
  }

  return hash.$assocs[assoc] = val;
}

/**
  Remove all key-value pairs from `self`.

  @example

      h = { 'a' => 100, 'b' => 200 }
      h.clear
      # => {}

  @return [Hash]
*/
function hash_clear(hash) {
  hash.$keys = [];
  hash.$assocs = {};
  return hash;
}

/**
  Returns the default value for the hash.
*/
function hash_default(hash) {
  return hash.$default;
}
/**
  Sets the default value - the value returned when a key does not exist.

  @param [Object] obj the new default
  @return [Object] returns the new default
*/
function hash_set_default(hash, val) {
  return hash.$default = val;
}

/**
  Deletes and returns a key-value pair from self whose key is equal to `key`.
  If the key is not found, returns the default value. If the optional code
  block is given and the key is not found, pass in the key and return the
  result of the block.

  @example

      h = { 'a' => 100, 'b' => 200 }
      h.delete 'a'
      # => 100
      h.delete 'z'
      # => nil

  @param [Object] key the key to delete
  @return [Object] returns value or default value
*/
function hash_delete(hash, key) {
  var assoc = key.$hash();

  if (hash.$assocs.hasOwnProperty(assoc)) {
    var val = hash.$assocs[assoc];
    delete hash.$assocs[assoc];
    hash.$keys.splice(hash.$keys.indexOf(key), 1);
    return val;
  }

  return hash.$default;
}

/**
  Deletes every key-value pair from `self` for which the block evaluates to
  `true`.

  @example

      h = { 'a' => 100, 'b' => 200, 'c' => 300 }
      h.delete_if { |k, v| key >= 'b' }
      # => { 'a' => 100 }

  @return [Hash] returns the receiver
*/
function hash_delete_if(hash) {
  var block_func = block.f, proc = block.p, key, val;

  if (block_func != arguments.callee) {
    raise(eLocalJumpError, "no block given");
  }

  block.f = block.p = Qnil;
  var yself = proc.$proc[0];

  try {
    for (var i = 0, ii = hash.$keys.length; i < ii; i++) {
      key = hash.$keys[i];
      val = hash.$assocs[key.$hash()];

      if (proc(yself, key, val).$r) {
        delete hash.$assocs[key.$hash()];
        hash.$keys.splice(i, 1);
        i--;
      }
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return hash;
}

/**
  Yields the block once for each key in `self`, passing the key as a param.

  @example

      h = { 'a' => 100, 'b' => 200, 'c' => 300 }
      h.each_key { |key| puts key }
      # => 'a'
      # => 'b'
      # => 'c'

  @return [Hash] returns receiver
*/
function hash_each_key(hash) {
  var block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eLocalJumpError, "no block given");
  }

  block.f = block.p = Qnil;
  yself = proc.$proc[0];

  try {
    for (var i = 0, ii = hash.$keys.length; i < ii; i++) {
      proc(yself, hash.$keys[i]);
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return hash;
}

/**
  Yields the block once for each key in self, passing the associated value
  as a param.

  @example

      h = { 'a' => 100, 'b' => 200 }
      h.each_value { |a| puts a }
      # => 100
      # => 200

  @return [Hash] returns the receiver
*/

function hash_each_value(hash) {
  var block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eLocalJumpError, "no block given");
  }

  block.f = block.p = Qnil;
  yself = proc.$proc[0];

  try {
    for (var i = 0, ii = hash.$keys.length; i < ii; i++) {
      proc(yself, hash.$assocs[hash.$keys[i].$hash()]);
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return hash;
}

/**
  Returns `true` if `self` contains no key-value pairs, `false` otherwise.

  @example

      {}.empty?
      # => true

  @return [true, false]
*/
function hash_empty_p(hash) {
  return hash.$keys.length === 0 ? Qtrue : Qfalse;
}

/**
  Returns a value from the hash for the given key. If the key can't be found,
  there are several options; with no other argument, it will raise a
  KeyError exception; if default is given, then that will be returned, if the
  optional code block if specified, then that will be run and its value
  returned.

  @example

      h = { 'a' => 100, 'b' => 200 }
      h.fetch 'a'         # => 100
      h.fetch 'z', 'wow'  # => 'wow'
      h.fetch 'z'         # => KeyError

  @param [Object] key the key to lookup
  @param [Object] defaults the default value to return
  @return [Object] value from hash
*/
function hash_fetch_m(hash, key, defaults) {
  var val = hash.$assocs[key.$hash()];

  if (val !== undefined)
    return val;
  else if (defauts === undefined)
    return raise(eKeyError, "key not found");
  else
    return defaults;
}

/**
  Returns a new array that is a one dimensional flattening of this hash. That
  is, for every key or value that is an array, extraxt its elements into the
  new array. Unlike {Array#flatten}, this method does not flatten
  recursively by default. The optional `level` argument determines the level
  of recursion to flatten.

  @example

      a = { 1 => 'one', 2 => [2, 'two'], 3 => 'three' }
      a.flatten
      # => [1, 'one', 2, [2, 'two'], 3, 'three']
      a.flatten(2)
      # => [1, 'one', 2, 2, 'two', 3, 'three']

  @param [Numeric] level the level to flatten until
  @return [Array] flattened hash
*/
function hash_flatten(hash, level) {
  var ary = [], key, val;
  if (level == undefined) level = 1;

  for (var i = 0, ii = hash.$keys.length; i < ii; i++) {
    key = hash.$keys[i];
    val = hash.$assocs[key.$hash()];
    ary.push(key);

    if (val.$flags & T_ARRAY) {
      if (level == 1) {
        ary.push(val);
      }
      else {
        ary = ary.concat(val.$m.flatten(val, level - 1));
      }
    }
    else {
      ary.push(val);
    }
  }

  return ary;
}

/**
  Returns `true` if the given `key` is present in `self`.

  @example

      h = { 'a' => 100, 'b' => 200 }
      h.has_key? 'a'
      # => true
      h.has_key? 'c'
      # => false

  @param [Object] key the key to check
  @return [true, false]
*/
function hash_has_key(hash, key) {
  if (hash.$assocs.hasOwnProperty(key.$hash()))
    return Qtrue;

  return Qfalse;
}

/**
  Returns `true` if the given `value` is present for some key in `self`.

  @example

      h = { 'a' => 100 }
      h.has_value? 100
      # => true
      h.has_value? 2020
      # => false

  @param [Object] value the value to check for
  @return [true, false]
*/
function hash_has_value(hash, value) {
  var val;

  for (var i = 0, ii = hash.$keys.length; i < ii; i++) {
    val = hash.$assocs[hash.$keys[i].$hash()];

    if (value.$m['=='](value, val).$r)
      return Qtrue;
  }

  return Qfalse;
}

/**
  Replaces the contents of `self` with the contents of `other`.

  @example

      h = { 'a' => 100, 'b' => 200 }
      h.replace({ 'c' => 200, 'd' => 300 })
      # => { 'c' => 200, 'd' => 300 }

  @param [Hash] other hash to replace with
  @return [Hash] returns receiver
*/
function hash_replace(hash, hash2) {
  hash.$keys = []; hash.$assocs = {};

  for (var i = 0, ii = hash2.$keys.length; i < ii; i++) {
    var key = hash2.$keys[i];
    var val = hash2.$assocs[key.$hash()];
    hash.$keys.push(key);
    hash.$assocs[key.$hash()] = val;
  }

  return hash;
}

/**
  Returns the key for the given value. If not found, returns `nil`.

  @example

      h = { 'a' => 100, 'b' => 200 }
      h.key 200
      # => 'b'
      h.key 300
      # => nil

  @param [Object] value the value to check for
  @return [Object] key or nil
*/
function hash_key(hash, value) {
  var key, val;

  for (var i = 0, ii = hash.$keys.length; i < ii; i++) {
    key = hash.$keys[i];
    val = hash.$assocs[key.$hash()];

    if (value.$m['=='](value, val).$r)
      return key;
  }

  return Qnil;
}

/**
  Returns a new array populated with the keys from this hash. See also
  {#values}.

  @example

      h = { 'a' => 100, 'b' => 200 }
      h.keys
      # => ['a', 'b']

  @return [Array]
*/
function hash_keys(hash) {
  return hash.$keys.slice(0);
}

/**
  Returns the number of key-value pairs in the hash.

  @example

      h = { 'a' => 100, 'b' => 200 }
      h.length
      # => 2

  @return [Numeric]
*/
function hash_size(hash) {
  return hash.$keys.length;
}

/**
  Returns a new hash containing the contents of `other` and `self`. If no
  block is specified, the value for the entries with duplicate keys will be 
  that of `other`. Otherwise the value for each duplicate key is determined
  by calling the block with the key and its value in self, and its value in
  other.

  @example

      h1 = { 'a' => 100, 'b' => 200 }
      h2 = { 'b' => 300, 'c' => 400 }
      h1.merge h2
      # => {'a' => 100, 'b' => 300, 'c' => 400 }
      h1
      # => {'a' => 100, 'b' => 200}

  @param [Hash] other hash to merge with
  @return [Hash] returns new hash
*/
function hash_merge(hash, hash2) {
  var res = hash_alloc(cHash), key, val;

  for (var i = 0, ii = hash.$keys.length; i < ii; i++) {
    key = hash.$keys[i];
    val = hash.$assocs[key.$hash()];

    res.$keys.push(key);
    res.$assocs[key.$hash()] = val;
  }

  for (i = 0, ii = hash2.$keys.length; i < ii; i++) {
    key = hash2.$keys[i];
    val = hash2.$assocs[key.$hash()];

    if (!res.$assocs.hasOwnProperty(key.$hash())) {
      res.$keys.push(key);
    }

    res.$assocs[key.$hash()] = val;
  }

  return res;
}

/**
  Merges the contents of `other` into `self`. If no block is given, entries
  with duplicate keys are overwritten with values from `other`.

  @example

      h1 = { 'a' => 100, 'b' => 200 }
      h2 = { 'b' => 300, 'c' => 400 }
      h1.merge! h2
      # => { 'a' => 100, 'b' => 300, 'c' => 400 }
      h1
      # => { 'a' => 100, 'b' => 300, 'c' => 400 }

  @param [Hash] other
  @return [Hash]
*/
function hash_update(hash, hash2) {
  var key, val;

  for (var i = 0, ii = hash2.$keys.length; i < ii; i++) {
    key = hash2.$keys[i];
    val = hash2.$assocs[key.$hash()];

    if (!hash.$assocs.hasOwnProperty(key.$hash())) {
      hash.$keys.push(key);
    }

    hash.$assocs[key.$hash()] = val;
  }

  return hash;
}

/**
  Searches through the hash comparing `obj` with the value using ==. Returns 
  the first key-value pair, as an array, that matches.

  @example

      a = { 1 => 'one', 2 => 'two', 3 => 'three' }
      a.rassoc 'two'
      # => [2, 'two']
      a.rassoc 'four'
      # => nil

  @param [Object] obj object to check
  @return [Array]
*/
function hash_rassoc(hash, obj) {
  var key, val;

  for (var i = 0, ii = hash.$keys.length; i < ii; i++) {
    key = hash.$keys[i];
    val = hash.$assocs[key.$hash()];

    if (val.$m['=='](val, obj).$r)
      return [key, val];
  }

  return Qnil;
}

/**
  Removes a key-value pair from the hash and returns it as a two item array.
  Returns the default value if the hash is empty.

  @example

      h = { 'a' => 1, 'b' => 2 }
      h.shift
      # => ['a', 1]
      h
      # => { 'b' => 2 }
      {}.shift
      # => nil

  @return [Array, Object]
*/
function hash_shift(hash) {
  var key, val;

  if (hash.$keys.length > 0) {
    key = hash.$keys[0];
    val = hash.$assocs[key.$hash()];

    hash.$keys.shift();
    delete hash.$assocs[key.$hash()];
    return [key, val];
  }

  return hash.$default;
}

/**
  Convert self into a nested array of `[key, value]` arrays.

  @example

      h = { 'a' => 1, 'b' => 2, 'c' => 3 }
      h.to_a
      # => [['a', 1], ['b', 2], ['c', 3]]

  @return [Array]
*/
function hash_to_a(hash) {
  var ary = [], key;

  for (var i = 0, ii = hash.$keys.length; i < ii; i++) {
    key = hash.$keys[i];
    ary.push([key, hash.$assocs[key.$hash()]]);
  }

  return ary;
}

/**
  Returns self.

  @return [Hash]
*/
function hash_to_hash(hash) {
  return hash;
}

function init_hash() {
  cHash = define_class('Hash', cObject);
  define_singleton_method(cHash, 'allocate', hash_alloc);

  define_method(cHash, 'values', hash_values);
  define_method(cHash, 'inspect', hash_inspect);
  define_method(cHash, 'to_s', hash_to_s);
  define_method(cHash, 'each', hash_each);
  define_method(cHash, 'each_pair', hash_each);
  define_method(cHash, 'assoc', hash_assoc);
  define_method(cHash, '==', hash_equal);
  define_method(cHash, '[]', hash_aref);
  define_method(cHash, '[]=', hash_aset);
  define_method(cHash, 'clear', hash_clear);
  define_method(cHash, 'default', hash_default);
  define_method(cHash, 'default=', hash_set_default);
  define_method(cHash, 'delete', hash_delete);
  define_method(cHash, 'delete_if', hash_delete_if);
  define_method(cHash, 'each_key', hash_each_key);
  define_method(cHash, 'each_value', hash_each_value);
  define_method(cHash, 'empty?', hash_empty_p);
  define_method(cHash, 'fetch', hash_fetch_m);
  define_method(cHash, 'flatten', hash_flatten);
  define_method(cHash, 'has_key?', hash_has_key);
  define_method(cHash, 'has_value?', hash_has_value);
  define_method(cHash, 'replace', hash_replace);
  define_method(cHash, 'key', hash_key);
  define_method(cHash, 'keys',hash_keys);
  define_method(cHash, 'length', hash_size);
  define_method(cHash, 'size', hash_size);
  define_method(cHash, 'merge', hash_merge);
  define_method(cHash, 'merge!', hash_update);
  define_method(cHash, 'update', hash_update);
  define_method(cHash, 'rassoc', hash_rassoc);
  define_method(cHash, 'shift', hash_shift);
  define_method(cHash, 'to_a', hash_to_a);
  define_method(cHash, 'to_hash', hash_to_hash);
}

