/**
  Returns a new array populated with the given objects.

  @example

       Array['a', 'b', 'c']    # => ['a', 'b', 'c']

  @param [Object] objs
  @return [Array]
*/
function ary_s_create(cls) {
  var ary = [];
  ary.$klass = cls;
  ary.$m = cls.$m_tbl;
  ary.splice.apply(ary, [0, 0].concat([].slice.call(arguments, 1)));
  return ary;
}

function ary_alloc(cls) {
  var ary = [];
  ary.$m = cls.$m_tbl;
  ary.$klass = cls;
  return ary;
}

function ary_initialize(ary, len, fill) {
  if (!len) len = 0;
  if (fill == undefined) fill = Qnil;

  for (var i = 0; i < len; i++) {
    ary[i] = fill;
  }

  return ary;
}

/**
  Returns a formatted, printable version of the array. {#inspect} is called
  on each of the elements and appended to the string.

  @return [String] string representation of the receiver
*/
function ary_inspect(ary) {
  var desc = [], part;

  for (var i = 0, ii = ary.length; i < ii; i++) {
    part = ary[i];
    desc.push(part.$m.inspect(part));
  }

  return '[' + desc.join(', ') + ']';
}

/**
  Returns a simple string version of the array. {#to_s} is applied to each
  of the child elements with no seperator.
*/
function ary_to_s(ary) {
  var desc = [], part;

  for (var i = 0, ii = ary.length; i < ii; i++) {
    part = ary[i];
    desc.push(part.$m.to_s(part));
  }

  return desc.join('');
}

/**
  Append - pushes the given object onto the end of this array. This 
  expression returns the array itself, so several appends may be chained
  together.

  @example

      [1, 2] << "c" << "d" << [3, 4]
      # => [1, 2, "c", "d", [3, 4]]

  @param [Object] obj the object to append
  @return [Array] returns the receiver
*/
function ary_push(ary, obj) {
  ary.push(obj);
  return ary;
}

/**
  Returns the number of elements in `self`. May be zero.

  @example

      [1, 2, 3, 4, 5].length
      # => 5

  @return [Numeric] length
*/
function ary_length(ary) {
  return ary.length;
}

/**
  Yields the block once for each element in `self`, passing that element as
  a parameter.

  If no block is given, an enumerator is returned instead.

  @example

      a = ['a', 'b', 'c']
      a.each { |x| puts x }
      # => 'a'
      # => 'b'
      # => 'c'

  **TODO** needs to return enumerator for no block.

  @return [Array] returns the receiver
*/
function ary_each(ary) {
  var block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eRuntimeError, "Array#each no block given");
  }

  block.f = block.p = Qnil;
  yself = proc.$proc[0];

  try {
    for (var i = 0, ii = ary.length; i < ii; i++) {
      proc(yself, ary[i]);
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return ary;
}

/**
  Similar to {#each}, but also passes in the current element index to the
  block.
*/
function ary_each_with_index(ary) {
  var block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eRuntimeError, "Array#each_with_index no block given");
  }

  block.f = block.p = Qnil;
  yself = proc.$proc[0];

  try {
    for (var i = 0, ii = ary.length; i < ii; i++) {
      proc(yself, ary[i], i);
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return ary;
}

/**
  Same as {#each}, but passes the index of the element instead of the 
  element itself.

  If no block given, an enumerator is returned instead.

  **TODO** enumerator functionality not yet implemented.

  @example

      a = [1, 2, 3]
      a.each_index { |x| puts x }
      # => 0
      # => 1
      # => 2

  @return [Array] returns receiver
*/
function ary_each_index(ary) {
  var block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eRuntimeError, "Array#each_with_index no block given");
  }

  block.f = block.p = Qnil;
  yself = proc.$proc[0];

  try {
    for (var i = 0, ii = ary.length; i < ii; i++) {
      proc(yself, i);
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return ary;
}

/**
  Append - pushes the given object(s) onto the end of this array. This
  expression returns the array itself, so several appends may be chained
  together.

  @example

      a = ['a', 'b', 'c']
      a.push 'd', 'e', 'f'
      # => ['a', 'b', 'c', 'd', 'e', 'f'

  @param [Object] obj the object(s) to push onto the array
  @return [Array] returns the receiver
*/
function ary_push_m(ary) {
  var objs = [].slice.call(arguments, 1);
  ary.splice.apply(ary, [ary.length, 0].concat(objs));
  return ary;
}

/**
  Returns the index of the first object in `self` such that it is `==` to
  `obj`. If a block is given instead of an argument, returns first object for
  which the block is true. Returns `nil` if no match is found. See also
  {#rindex}.

  @example

      a = ['a', 'b', 'c']
      a.index('a')              # => 0
      a.index('z')              # => nil
      a.index { |x| x == 'b' }  # => 1

  @param [Object] obj the object to look for
  @return [Numeric, nil] result
*/
function ary_index(ary, obj) {
  var item;
  for (var i = 0, ii = ary.length; i < ii; i++) {
    item = ary[i];

    if (item.$m['=='](item, obj).$r) {
      return i;
    }
  }

  return Qnil;
}

/**
  Concatenation - returns a new array built by concatenating the two arrays
  together to produce a third array.

  @example

      [1, 2, 3] + [4, 5]
      # => [1, 2, 3, 4, 5]

  @param [Array] other the array to concat with
  @return [Array] returns new concatenated array
*/
function ary_plus(ary, ary2) {
  return ary.slice(0).concat(ary2.slice());
}

/**
  Difference. Creates a new array that is a copy of the original array,
  removing any items that also appear in `other`.

  @example

    [1, 2, 3, 3, 4, 4, 5] - [1, 2, 4]
    # => [3, 3, 5]

  @param [Array] other array to use for difference
  @return [Array] new array
*/
function ary_diff(ary, ary2) {
  raise(eRuntimeError, "Array#- not et implemented");
}

/**
  Equality. Two arrays are equal if they contain the same number of elements
  and if each element is equal to (according to {BasicObject#==} the
  corresponding element in the second array.

  @example

      ['a', 'c'] == ['a', 'c', 7]       # => false
      ['a', 'c', '7'] == ['a', 'c', 7]  # => true
      ['a', 'c', 7] == ['a', 'd', 'f']  # => false

  @param [Array] other array to compare self with
  @return [Boolean] if the arrays are equal
*/
function ary_equal(ary, ary2) {
  if (ary === ary2) return Qtrue;
  if (ary.length != ary2.length) return Qfalse;

  for (var i = 0, ii = ary.length; i < ii; i++) {
    var item = ary[i];

    if (!(item.$m['=='](item, ary2[i])).$r) {
      return Qfalse;
    }
  }

  return Qtrue;
}

/**
  Searches through an array whose elements are also arrays, comparing `obj`
  with their first element of each contained array using {BasicObject#==}.
  Returns the first contained array that matches (that is, the first
  associated array) or `nil` if no match is found. See also {#rassoc}.

  @example

      s1 = ['colors', 'red', 'blue', 'green']
      s2 = ['letters', 'a', 'b', 'c']
      s3 = 'foo'
      a = [s1, s2, s3]

      a.assoc 'letters'               # => ['letters', 'a', 'b', 'c']
      a.assoc 'foo'                   # => nil
*/
function ary_assoc(ary, obj) {
  var arg;

  for (var i = 0, ii = ary.length; i < ii; i++) {
    arg = self[i];

    if ((arg.$flags & T_ARRAY) && arg.length && arg[0].$m['=='](arg[0], obj)) {
      return arg;
    }
  }

  return Qnil;
}

/**
  Returns the element at `index`. A negative index counts from the end of the
  receiver. Returns `nil` if the given index is out of range. See also {#[]}.

  @example

      a = ['a', 'b', 'c', 'd', 'e']
      a.at 0          # => 'a'
      a.at -1         # => 'e'
      a.at 324        # => nil

  @param [Numeric] index the index to get
  @return [Object, nil] returns nil or the result
*/
function ary_at(ary, idx) {
  if (idx < 0) idx += ary.length;
  if (idx < 0 || idx >= ary.length) return Qnil;
  return ary[idx];
}

/**
  Removes all elements from the receiver.

  @example

      a = ['a', 'b', 'c', 'd', 'e']
      a.clear   # => []

  @return [Array] returns the receiver
*/
function ary_clear(ary) {
  ary.splice(0);
  return ary;
}

/**
  Yields the block, passing in successive elements from the receiver, 
  returning an array containing those elements for which the block returns a
  true value.

  @example

      a = [1, 2, 3, 4, 5, 6]
      a.select { |x| x > 4 }
      # => [5, 6]

  @return [Array] returns a new array of selected elements
*/
function ary_select(ary) {
  var res = [], arg, block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eArgError, "no block given");
  }

  yself = proc.$proc[0];
  block.f = block.p = Qnil;

  try {
    for (var i = 0, ii = ary.length; i < ii; i++) {
      arg = ary[i];

      if (proc(yself, arg).$r) {
        res.push(arg);
      }
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return res;
}

/**
  Yields the block once for each element of the receiver. Creates a new array
  containing the values returned by the block. See also `Enumerable#collect`.

  @example

      a = ['a', 'b', 'c', 'd']
      a.collect { |x| x + '!' }     # => ['a!', 'b!', 'c!', 'd!']
      a                             # => ['a', 'b', 'c', 'd']

  @return [Array] new array
*/
function ary_collect(ary) {
  var result, block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eRuntimeError, "Array#collect no block given");
  }

  yself = proc.$proc[0];
  block.f = block.p = Qnil;

  try {
    for (var i = 0, ii = ary.length; i < ii; i++) {
      result.push(proc(yself, ary[i]));
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return result;
}

/**
  Yields the block once for each element of `self`, replacing the element with
  the value returned by the block. See also `Enumerable#collect`.

  @example

      a = ['a', 'b', 'c', 'd']
      a.collect { |x| x + '!' }
      # => ['a!', 'b!', 'c!', 'd!']
      a
      # => ['a!', 'b!', 'c!', 'd!']

  @return [Array] returns the receiver
*/
function ary_collect_bang(ary) {
  var block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eRuntimeError, "Array#collect! no block given");
  }

  yself = proc.$proc[0];
  block.f = block.p = Qnil;

  try {
    for (var i = 0, ii = ary.length; i < ii; i++) {
      ary[i] = proc(yself, ary[i]);
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return ary;
}

function ary_dup(ary) {
  return ary.slice(0);
}

/**
  Returns a copy of the receiver with all nil elements removed

  @example

      ['a', nil, 'b', nil, 'c', nil].compact
      # => ['a', 'b', 'c']

  @return [Array] new Array
*/
function ary_compact(ary) {
  var res = [];

  for (var i = 0, ii = ary.length; i < ii; i++) {
    if (ary[i] != Qnil) {
      res.push(ary[i]);
    }
  }

  return result;
}

/**
  Removes nil elements from the receiver. Returns nil if no changes were made,
  otherwise returns self.

  @example

      ['a', nil, 'b', nil, 'c'].compact!
      # => ['a', 'b', 'c']

      ['a', 'b', 'c'].compact!
      # => nil

  @return [Array, nil] returns either the receiver or nil
*/
function ary_compact_bang(ary) {
  var len = ary.length;

  for (var i = 0, ii = ary.length; i < ii; i++) {
    if (ary[i] == Qnil) {
      ary.splice(i, 1);
      i--;
    }
  }

  return len == ary.length ? Qnil : ary;
}

/**
  Appends the elements of `other` to `self`.

  @example

      ['a', 'b'].concat ['c', 'd']
      # => ['a', 'b', 'c', 'd']

  @param [Array] other array to concat
  @return [Array] returns the receiver
*/
function ary_concat(ary, ary2) {
  for (var i = 0, ii = ary2.length; i < ii; i++) {
    ary.push(ary2[i]);
  }

  return ary;
}

/**
  Returns the number of elements. If an argument is given, counts the number
  of elements which equals to `obj`. If a block is given, counts the number of
  elements yielding a true value.

  @example

      ary = [1, 2, 4, 2]
      ary.count     # => 4
      ary.count(2)  # =>2

  @param [Object] obj object to check
  @return [Numeric] count or count of obj
*/
function ary_count(ary, obj) {
  if (obj == undefined) return ary.length;

  var total = 0;

  for (var i = 0, ii = ary.length; i < ii; i++) {
    if (ary[i].$m['=='](ary[i], obj).$r) {
      total++;
    }
  }

  return total;
}

/**
  Deletes items from `self` that are equal to `obj`. If any items are found,
  returns `obj`. If the item is not found, returns `nil`. If the optional code
  block is given, returns the result of block if the item is not found.

  @example

      a = ['a', 'b', 'b', 'b', 'c']

      a.delete 'b'
      # => 'b'
      a
      # => ['a', 'c']

      a.delete 'z'
      # => nil

  @param [Object] obj object to delete
  @return [Object, nil] returns obj or nil
*/
function ary_delete(ary, obj) {
  var len = ary.length;

  for (var i = 0, ii = len; i < ii; i++) {
    if (ary[i].$m['=='](ary[i], obj).$r) {
      ary.splice(i, 1);
      i--;
    }
  }

  return len == ary.length ? Qnil : obj;
}

/**
  Deletes the element at the specified index, returning that element, or nil
  if the index is out of range. 

  @example

      a = ['ant', 'bat', 'cat', 'dog']
      a.delete_at 2
      # => 'cat'
      a
      # => ['ant', 'bat', 'dog']
      a.delete_at 99
      # => nil

  @param [Numeric] idx the index to delete
  @return [Object, nil] returns the deleted object or nil
*/
function ary_delete_at_m(ary, idx) {
  if (idx < 0) idx += ary.length;
  if (idx < 0 || idx >= ary.length) return Qnil;

  var res = ary[idx];
  ary.splice(idx, 1);

  return res;
}

/**
  Deletes every element of `self` for which `block` evaluates to true.

  @example

      a = [1, 2, 3]
      a.delete_if { |x| x >= 2 }
      # => [1]

  @return [Array] returns amended receiver
*/
function ary_delete_if(ary) {
  var block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eRuntimeError, "no block given");
  }

  block.p = block.f = Qnil;
  yself = proc.$proc[0];

  for (var i = 0, ii = ary.length; i < ii; i++) {
    if (proc(yself, ary[i]).$r) {
      ary.splice(i, 1);
      i--;
      ii = ary.length;
    }
  }

  return ary;
}

/**
  Drop first `n` elements from receiver, and returns remaining elements in
  array.

  @example

      a = [1, 2, 3, 4, 5, 6]
      a.drop 3
      # => [4, 5, 6]

  @param [Number] n number of elements to drop
  @return [Array] returns new array
*/
function ary_drop(ary, n) {
  if (n > ary.length) return [];
  return ary.slice(n);
}

/**
  Drop elements up to, but not including, the first element for which the
  block returns nil or false, and returns an array containing the remaining
  elements.

  @example

      a = [1, 2, 3, 4, 5, 6]
      a.drop_while { |i| i < 3 }
      # => [3, 4, 5, 6]

  @return [Array] returns a new array
*/
function drop_while(ary) {
  var block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eRuntimeError, "no block given");
  }

  block.f = block.p = Qnil;
  yself = proc.$proc[0];

  try {
    for (var i = 0, ii = ary.length; i < ii; i++) {
      if (proc(yself, ary[i]).$r) {
        return self.slice(i);
      }
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return [];
}

/**
  Returns `true` if the receiver contains no elements, `false` otherwise.

  @example

      [].empty?
      # => true

  @return [false, true] empty or not
*/
function ary_empty_p(ary) {
  return ary.length == 0 ? Qtrue : Qfalse;
}

/**
  Tries to return the element as position `index`. If the index lies outside
  the array, the first form throws an IndexError exception, the second form
  returns `default`, and the third form returns the value of invoking the
  block, passing in the index. Negative values of `index` count from the end
  of the array.

  @example First form

      a = [11, 22, 33, 44]
      a.fetch 1
      # => 22
      a.fetch -1
      # => 44

  @example Second form

      a.fetch 4, 'cat'
      # => 'cat'

  @example Third form

      a.fetch 4 { |i| i * i }
      # => 16

  @param [Numeric] idx
  @param [Object] defaults
  @return [Object] returns result
*/
function ary_fetch(ary, idx, defaults) {
  var index = idx;

  if (idx < 0) idx += ary.length;
  if (idx < 0 || idx >= ary.length) {
    if (defaults == undefined)
      return raise(eIndexError, "Array#fetch");
    else
      return defaults;
  }

  return ary[idx];
}


/**
  Returns the first element, or the first `n` elements, of the array. If the
  array is empty, the first form returns `nil`, and the second form returns an
  empty array.

  @example

      a = ['q', 'r', 's', 't']
      a.first
      # => q
      a.first 2
      # => ['q', 'r']

  @param [Numeric] count number of elements
  @return [Object, Array] object or array of objects
*/
function ary_first(ary, count) {
  if (count == undefined) {
    if (ary.length === 0) return Qnil;
    return ary[0];
  }

  return ary.slice(0, count);
}

/**
  Returns a new array that is a one-dimensional flattening of this array
  (recursively). That is, for evey element that is an array, extract its
  elements into the new array. If the optional `level` argument determines the
  level of recursion to flatten.

  @example

      s = [1, 2, 3]
      # => [a, 2, 3]
      t = [4, 5, 6, [7, 8]]
      # => [4, 5, 6, [7, 8]]
      a = [s, t, 9, 10]
      # => [[1, 2, 3], [4, 5, 6, [7, 8]], 9, 10]
      a.flatten
      # => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      a = [1, 2, [3, [4, 5]]]
      a.flatten 1
      # => [1, 2, 3, [4, 5]]

  @param [Numeric] level the level to flatten
  @return [Array] returns new array
*/
function ary_flatten(ary, level) {
  var res = [], item;

  for (var i = 0, ii = ary.length; i < ii; i++) {
    item = ary[i];

    if (item.$flags & T_ARRAY) {
      if (level == undefined)
        res = res.concat(item.$m.flatten(item));
      else if (level === 0)
        res.push(item);
      else
        res = res.concat(item.$m.flatten(item, level - 1));
    }
    else {
      res.push(item);
    }
  }

  return res;
}

/**
  Flattens the receiver in place. Returns `nil` if no modifications were made.
  If the optional level argument determines the level of recursion to flatten.

  @example

      a = [1, 2, [3, [4, 5]]]
      a.flatten!
      # => [1, 2, 3, 4, 5]
      a.flatten!
      # => nil
      a
      # => [1, 2, 3, 4, 5]

  @param [Number] level to flatten to
  @return [Array] returns the receiver
*/
function ary_flatten_bang(ary, level) {
  var len = ary.length;
  var result = ary_flatten(ary, level);
  self.splice(0);

  for (var i = 0, ii = result.length; i < ii; i++) {
    ary[i] = result[i];
  }

  if (ary.length == len) return Qnil;

  return ary;
}

/**
  Returns true if the given object is present in `self`, false otherwise.

  @example

      a = ['a', 'b', 'c']
      a.include? 'b'
      # => true
      a.include? 'z'
      # => false
*/
function ary_include_p(ary, member) {
  for (var i = 0, ii = ary.length; i < ii; i++) {
    if (ary[i].$m['=='](ary[i], member).$r) {
      return Qtrue;
    }
  }

  return Qfalse;
}

/**
  Replaces the contents of `self` with the contents of `other`, truncating or
  expanding if necessary.

  @example

      a = ['a', 'b', 'c', 'd', 'e']
      a.replace ['x', 'y', 'z']
      # => ['x', 'y', 'z']
      a
      # => ['x', 'y', 'z']

  @param [Array] other array to replace contents with
  @return [Array] returns the receiver
*/
function ary_replace(ary, ary2) {
  ary.splice(0);

  for (var i = 0, ii = ary2.length; i < ii; i++) {
    ary[i] = ary2[i];
  }

  return ary;
}

/**
  Inserts the given values before the element with the given index (which may
  be negative).

  @example

      a = ['a', 'b', 'c', 'd']
      a.insert 2, 99
      # => ['a', 'b', 99, 'c', 'd']
      a.insert -2, 1, 2, 3
      # => ['a', 'b', 99, 'c', 1, 2, 3, 'd']

  @param [Numeric] idx the index for insertion
  @param [Object] objs objects to insert
  @return [Array] returns the receiver
*/
function ary_insert(ary, idx) {
  var objs = [].slice.call(arguments, 2);

  if (idx < 0) idx += ary.length;
  if (idx < 0 || idx >= ary.length) {
    raise(eIndexError, "out of range");
  }

  ary.splice.apply(ary, [idx, 0].concat(objs));
  return ary;
}

/**
  Returns a string created by converting each element of the array to a string
  seperated by `sep`.

  @example

      ['a', 'b', 'c'].join
      # => 'abc'
      ['a', 'b', 'c'].join '-'
      # => 'a-b-c'

  @param [String] sep the separator
  @return [String] joined string
*/
function ary_join(ary, sep) {
  if (sep == undefined) sep = '';
  var res = [];

  for (var i = 0, ii = ary.length; i < ii; i++) {
    res.push(ary[i].$m.to_s(ary[i]));
  }

  return res.join(sep);
}

/**
  Deletes every element of `self` for which the block evaluates to false.

  @example

      a = [1, 2, 3, 4, 5, 6]
      a.keep_if { |x| x < 4 }
      # => [1, 2, 3]

  @return [Array] returns the receiver
*/
function ary_keep_if(ary) {
  var block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eRuntimeError, "no block given");
  }

  block.f = block.p = Qnil;
  yself = proc.$proc[0];

  try {
    for (var i = 0, ii = ary.length; i < ii; i++) {
      if (proc(yself, ary[i]).$r) {
        ary.splice(i, 1);
        i--;
      }
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return ary;
}

/**
  Return the last element(s) of `self`. If the array is empty, the first form
  returns `nil`.

  @example

      a = ['w', 'x', 'y', 'z']
      a.last
      # => 'z'
      a.last 2
      # => ['y', 'z']

  @param [Number] count the number of items to get
  @return [Object, Array] result
*/
function ary_last(ary, count) {
  if (count == undefined) {
    if (ary.length == 0) return Qnil;
    return ary[ary.length - 1];
  }
  else {
    if (count > ary.length) count = ary.length;
    return ary.slice(ary.length - count, ary.length);
  }
}

/**
  Removes the last element from `self` and returns it, or `nil` if the array
  is empty. If a count is given, returns an array of the last `count`
  elements (or less).

  @example

      a = ['a', 'b', 'c', 'd']
      a.pop
      # => 'd'
      a.pop 2
      # => 'b', 'c'
      a
      # => ['a']

  @param [Numeric] count number to pop
  @return [Array] returns popped items
*/
function ary_pop(ary, count) {
  if (count == undefined) {
    if (ary.length) return ary.pop();
    return Qnil;
  }
  else {
    return ary.splice(ary.length - count, ary.length);
  }
}

/**
  Searches through the array whose elements are also arrays. Compares `obj`
  with the second element of each contained array using `==`. Returns the
  first contained array that matches.

  @example

      a = [[1, 'one'], [2, 'two'], [3, 'three'], ['ii', 'two']]
      a.rassoc 'two'
      # => [2, 'two']
      a.rassoc 'four'
      # => nil

  @param [Object] obj object to search for
  @return [Object, nil] result or nil
*/
function ary_rassoc(ary, obj) {
  var test;

  for (var i = 0, ii = ary.length; i < ii; i++) {
    test = ary[i];
    if ((test.$flags & T_ARRAY) && test[1] != undefined) {
      if (test[1].$m['=='](test[1], obj).$r) return test;
    }
  }

  return Qnil;
}

/**
  Returns a new array containing the items in `self` for which the block is
  not true. See also `#delete_if`.

  @example

      a = [1, 2, 3, 4, 5, 6]
      a.reject { |x| x > 3 }
      # => [1, 2, 3]
      a
      # => [1, 2, 3, 4, 5, 6]

  @return [Array] returns the receiver
*/
function ary_reject(ary) {
  var block_func = block.f, proc = block.p, result = [], yself;

  if (block_func != arguments.callee) {
    raise(eRuntimeError, "no block given");
  }

  block.f = block.p = Qnil;
  yself = proc.$proc[0];

  for (var i = 0, ii = ary.length; i < ii; i++) {
    if (!proc(yself, ary[i]).$r) {
      result.push(ary[i]);
    }
  }

  return result;
}

/**
  Equivalent to `#delete_if!`, deleting elements from self for which the block
  evaluates to true, but returns nil if no changes were made.

  @example

      a = [1, 2, 3, 4, 5, 6]
      a.reject! { |x| x > 3 }
      # => [1, 2, 3]
      a.reject! { |x| x > 3 }
      # => nil
      a
      # => [1, 2, 3]

  @return [Array] returns receiver
*/
function ary_reject_bang(ary) {
  var block_func = block.f, proc = block.p, length = ary.length, yself;

  if (block_func != arguments.callee) {
    raise(eRuntimeError, "no block given");
  }

  block.f = block.p = Qnil;
  yself = proc.$proc[0];

  try {
    for (var i = 0; i < ary.length; i++) {
      if (proc(yself, ary[i]).$r) {
        ary.splice(i, 1);
        i--;
      }
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return ary.length == length? Qnil : ary;
}

/**
  Returns a new array containing the receiver's elements in reverse order.

  @example

      ['a', 'b', 'c'].reverse
      # => ['c', 'b', 'a']
      [1].reverse
      # => [1]

  @return [Array] return new array
*/
function ary_reverse(ary) {
  var result = [];

  for (var i = ary.length - 1; i >= 0; i--) {
    result.push(ary[i]);
  }

  return result;
}

/**
  Reverses the receiver in place.

  @example

      a = ['a', 'b', 'c']
      a.reverse!
      # => ['c', 'b', 'a']
      a
      # => ['c', 'b', 'a']

  @return [Array] returns the receiver
*/
function ary_reverse_bang(ary) {
  var len = ary.length / 2, tmp;

  for (var i = 0; i < len; i++) {
    tmp = ary[i];
    ary[i] = ary[ary.length - (i + 1)];
    ary[ary.length - (i + 1)] = tmp;
  }

  return ary;
}

/**
  Same as {#each}, but traverses the receiver in reverse order

  @example

      a = ['a', 'b', 'c']
      a.reverse_each { |x| puts x }
      # => 'c'
      # => 'b'
      # => 'a'

  @return [Array] returns the receiver
*/
function ary_reverse_each(ary) {
  var block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eRuntimeError, "no block given");
  }

  block.f = block.p = Qnil;
  yself = proc.$proc[0];

  try {
    for (var i = ary.length - 1; i >= 0; i--) {
      proc(yself, ary[i]);
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return ary;
}

/**
  Returns the index of the last object in self that is == to object. If a 
  block is given instead of an argument, returns the first object for which
  block is true, starting from the last object. Returns `nil` if no match is
  found.

  @example

      a = ['a', 'b', 'b', 'b', 'c']
      a.rindex 'b'
      # => 3
      a.rindex 'z'
      # => nil
      a.rindex { |x| x == 'b' }
      # => 3

  @return [Object, nil] returns result or nil
*/
function ary_rindex(ary, obj) {
  if (obj != undefined) {
    for (var i = ary.length - 1; i >= 0; i--) {
      if (ary[i].$m['=='](ary[i], obj).$r) {
        return i;
      }
    }
  }

  return Qnil;
}

/**
  Invokes the block passing in successive elements from `self`, deleting the
  elements for which the block returns a false value. It returns `self` if
  changes were made, otherwise it returns `nil`.

  @example

      a = [1, 2, 3, 4, 5, 6]
      a.select! { |x| x > 4 }
      # => [5, 6]
      a.select! { |x| x > 4 }
      # => nil
      a
      # => [5, 6]

  @return [Array] returns receiver
*/
function ary_select_bang(ary) {
  var len = ary.length, block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eRuntimeError, "no block given");
  }

  block.f = block.p = Qnil;
  yself = proc.$proc[0];

  try {
    for (var i = 0; i < ary.length; i++) {
      if (proc(yself, ary[i]).$r) {
        ary.splice(i, 1);
        i--;
      }
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return ary.length == len ? Qnil : ary;
}

/**
  Returns the first element of `self` and removes it (shifting all other
  elements down by one). Returns `nil` if the array is empty.

  If a number `n` is given, returns an array of the first n elements (or 
  less), just like `#slice` does.

  @example

      a = ['a', 'b', 'c']
      a.shift
      # => 'a'
      a
      # => ['b', 'c']
      a = ['a', 'b', 'c']
      a.shift 2
      # => ['a', 'b']
      a
      # => ['c']

  @param [Numeric] count elements to shift
  @return [Array] result
*/
function ary_shift(ary, count) {
  if (count != undefined)
    return ary.splice(0, count);

  if (ary.length)
    return ary.shift();

  return Qnil;
}

/**
  Deletes the element(s) given by an `index` (optionally with a length) or
  by a range. Returns the deleted object(s), or `nil` if the index is out of
  range.

  @example

      a = ['a', 'b', 'c']
      a.slice! 1
      # => 'b'
      a
      # => ['a', 'c']
      a.slice! -1
      # => 'c'
      a
      # => ['a']
      a.slice! 100
      # => nil

  **TODO** does not yet work with ranges

  @param [Range, Number] index to begin with
  @param [Number] length last index
  @return [Array, nil] result
*/
function ary_slice_bang(ary, index, length) {
  var size = ary.length;

  if (index < 0) index += size;
  if (index < 0 || index >= size) return Qnil;

  if (length != undefined) {
    if (length <= 0 || length > ary.length) return Qnil;
    return ary.splice(index, index + length);
  }
  else {
    return ary.splice(index, 1)[0];
  }
}

/**
  Returns first `count` elements from ary.

  @example

      a = [1, 2, 3, 4, 5, 6]
      a.take 3
      # => [1, 2, 3]

  @return [Array] array of elements
*/
function ary_take(ary, count) {
  return ary.slice(0, count);
}

/**
  Passes elements to the block until the block returns a false value, then
  stops iterating and returns an array of all prior elements.

  @example

      a = [1, 2, 3, 4, 5, 6]
      a.take_while { |i| i < 3 }
      # => [1, 2]

  @return [Array] new array with elements
*/
function ary_take_while(ary) {
  var block_func = block.f, proc = block.p, result = [], arg, yself;

  if (block_func != arguments.callee) {
    raise(eRuntimeError, "no block given");
  }

  block.p = block.f = Qnil;
  yself = proc.$proc[0];

  try {
    for (var i = 0, ii = ary.length; i < ii; i++) {
      arg = ary[i];
      if (proc(yself, arg).$r) {
        result.push(arg);
      }
      else {
        break;
      }
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return result;
}

/**
  Returns the receiver.

  @example

      a = [1, 2, 3]
      a.to_a
      # => [1, 2, 3]

  @return [Array] returns the receiver
*/
function ary_to_a(ary) {
  return ary;
}

/**
  Returns a new array by removing duplicate values in `self`.

  @example

      a = ['a', 'a', 'b', 'b', 'c']
      a.uniq
      # => ['a', 'b', 'c']
      a
      # => ['a', 'a', 'b', 'b', 'c']

  @return [Array]
*/
function ary_uniq(ary) {
  var result = [], seen = [];

  for (var i = 0, ii = ary.length; i < ii; i++) {
    var test = ary[i], hash = test.$hash();
    if (seen.indexOf(hash) == -1) {
      seen.push(hash);
      result.push(test);
    }
  }

  return result;
}

/**
  Removes duplicate elements from `self`. Returns `nil` if no changes are
  made (that is, no duplicates are found).

  @example

      a = ['a', 'a', 'b', 'b', 'c']
      a.uniq!
      # => ['a', 'b', 'c']
      a.uniq!
      # => nil

  @return [Array] returns receiver
*/
function ary_uniq_bang(ary) {
  var seen = [], length = ary.length;

  for (var i = 0; i < ary.length; i++) {
    var test = ary[i], hash = test.$hash();
    if (seen.indexOf(hash) == -1) {
      seen.push(hash);
    }
    else {
      ary.splice(i, 1);
      i--;

    }
  }

  return ary.length == length ? Qnil : ary;
}

/**
  Prepends objects to the front of `self`, moving other elements upwards.

  @example

      a = ['b', 'c', 'd']
      a.unshift 'a'
      # => ['a', 'b', 'c', 'd']
      a.unshift 1, 2
      # => [1, 2, 'a', 'b', 'c', 'd']

  @param [Object] objs objects to add
  @return [Array] returns the receiver
*/
function ary_unshift(ary) {
  var objs = [].slice.call(arguments, 1);

  for (var i = objs.length - 1; i >= 0; i--) {
    ary.unshift(objs[i]);
  }

  return ary;
}

/**
  Set intersection - Returns a new array containing elements common to the
  two arrays, with no duplicates.

  @example

      [1, 1, 3, 5] & [1, 2, 3]
      # => [1, 3]

  @param [Array] other second array to intersect
  @return [Array] new intersected array
*/
function ary_and(ary, ary2) {
  var result = [], seen = [];

  for (var i = 0; i < ary.length; i++) {
    var test = ary[i], hash = test.$hash();

    if (seen.indexOf(hash) == -1) {
      for (var j = 0; j < ary2.length; j++) {
        var test_b = ary2[j], hash_b = test_b.$hash();

        if ((hash == hash_b) && (seen.indexOf(hash) == -1)) {
          seen.push(hash);
          result.push(test);
        }
      }
    }
  }

  return result;
}

/**
  Repitition - When given a string argument, acts the same as {#join}.
  Otherwise, returns a new array build by concatenating the `num` copies of
  self.

  @example With Number

      [1, 2, 3] * 3
      # => [1, 2, 3, 1, 2, 3, 1, 2, 3]

  @example With String

      [1, 2, 3] * ','
      # => '1,2,3'

  @param [String, Number] num string or number used to join or concat
  @return [String, Array] depending on argument
*/
function ary_times(ary, arg) {
  if (arg.$flags & T_STRING) {
    return ary_join(ary, arg);
  }
  else {
    var result = [];
    for (var i = 0; i < arg; i++) {
      result = result.concat(ary);
    }

    return result;
  }
}

/**
  Element Reference - Returns the element at `index`, or returns a subarray
  at index and counting for length elements, or returns a subarray if index
  is a range. Negative indecies count backward from the end of the array (-1
  is the last element). Returns `nil` if the index (or starting index) are
  out of range.

  @example

      a = ['a', 'b', 'c', 'd', 'e']
      a[2] + a[0] + a[1]              # => 'cab'
      a[6]                            # => nil
      a[1, 2]                         # => ['b', 'c']
      a[1..3]                         # => ['b', 'c', 'd']
      a[4..7]                         # => ['e']
      a[6..10]                        # => nil
      a[-3, 3]                        # => ['c', 'd', 'e']
      a[5]                            # => nil
      a[5, 1]                         # => []
      a[5..10]                        # => []

  **TODO** does not yet work with ranges

  @param [Range, Numeric] index to begin
  @param [Numeric] length last index
  @return [Array, Object, nil] result
*/
function ary_aref(ary, index, length) {
  var size = ary.length;

  if (index < 0) index += size;
  if (index < 0 || index >= size) return Qnil;

  if (length != undefined) {
    if (length <= 0) return [];
    return ary.slice(index, index + length);
  }
  else {
    return ary[index];
  }
}

/**
 Element reference setting.

  **TODO** need to expand functionlaity.
*/
function ary_aset(ary, index, value) {
  if (index < 0) index += ary.length;
  return ary[index] = value;
}

function init_array() {
  cArray = bridge_class(Array.prototype,
    T_OBJECT | T_ARRAY, 'Array', cObject);

  Array.prototype.$hash = function() {
    return (this.$id || (this.$id = yield_hash()));
  };

  define_singleton_method(cArray, '[]', ary_s_create);
  define_singleton_method(cArray, 'allocate', ary_alloc);

  define_method(cArray, 'initialize', ary_initialize);
  define_method(cArray, 'inspect', ary_inspect);
  define_method(cArray, 'to_s', ary_to_s);
  define_method(cArray, '<<', ary_push);
  define_method(cArray, 'length', ary_length);
  define_method(cArray, 'size', ary_length);
  define_method(cArray, 'each', ary_each);
  define_method(cArray, 'each_with_index', ary_each_with_index);
  define_method(cArray, 'each_index', ary_each_index);
  define_method(cArray, 'push', ary_push_m);
  define_method(cArray, 'index', ary_index);
  define_method(cArray, '+', ary_plus);
  define_method(cArray, '-', ary_diff);
  define_method(cArray, '==', ary_equal);
  define_method(cArray, 'assoc', ary_assoc);
  define_method(cArray, 'at', ary_at);
  define_method(cArray, 'clear', ary_clear);
  define_method(cArray, 'select', ary_select);
  define_method(cArray, 'collect', ary_collect);
  define_method(cArray, 'map', ary_collect);
  define_method(cArray, 'collect!', ary_collect_bang);
  define_method(cArray, 'map!', ary_collect_bang);
  define_method(cArray, 'dup', ary_dup);
  define_method(cArray, 'compact', ary_compact);
  define_method(cArray, 'compact!', ary_compact_bang);
  define_method(cArray, 'concat', ary_concat);
  define_method(cArray, 'count', ary_count);
  define_method(cArray, 'delete', ary_delete);
  define_method(cArray, 'delete_at', ary_delete_at_m);
  define_method(cArray, 'delete_if', ary_delete_if);
  define_method(cArray, 'drop', ary_drop);
  define_method(cArray, 'drop_while', ary_drop_while);
  define_method(cArray, 'empty?', ary_empty_p);
  define_method(cArray, 'fetch', ary_fetch);
  define_method(cArray, 'first', ary_first);
  define_method(cArray, 'flatten', ary_flatten);
  define_method(cArray, 'flatten!', ary_flatten_bang);
  define_method(cArray, 'include?', ary_include_p);
  define_method(cArray, 'replace', ary_replace);
  define_method(cArray, 'insert', ary_insert);
  define_method(cArray, 'join', ary_join);
  define_method(cArray, 'keep_if', ary_keep_if);
  define_method(cArray, 'last', ary_last);
  define_method(cArray, 'pop', ary_pop);
  define_method(cArray, 'rassoc', ary_rassoc);
  define_method(cArray, 'reject', ary_reject);
  define_method(cArray, 'reject!', ary_reject_bang);
  define_method(cArray, 'reverse', ary_reverse);
  define_method(cArray, 'reverse!', ary_reverse_bang);
  define_method(cArray, 'reverse_each', ary_reverse_each);
  define_method(cArray, 'rindex', ary_rindex);
  define_method(cArray, 'select!', ary_select_bang);
  define_method(cArray, 'shift', ary_shift);
  define_method(cArray, 'slice!', ary_slice_bang);
  define_method(cArray, 'take', ary_take);
  define_method(cArray, 'take_while', ary_take_while);
  define_method(cArray, 'to_a', ary_to_a);
  define_method(cArray, 'uniq', ary_uniq);
  define_method(cArray, 'uniq!', ary_uniq_bang);
  define_method(cArray, 'unshift', ary_unshift);
  define_method(cArray, '&', ary_and);
  define_method(cArray, '*', ary_times);
  define_method(cArray, '[]', ary_aref);
  define_method(cArray, '[]=', ary_aset);
}

