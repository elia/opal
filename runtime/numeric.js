var cNumeric;

/**
  Unary Plus - Returns the receivers value

  @example

      +5
      # => 5

  @return [Numeric] receiver
*/
function num_uplus(num) {
  return num;
}

/**
 Unary minus - returns the receiver's value, negated.

  @example

      -5
      # => -5

  @return [Numeric] result
*/
function num_uminus(num) {
  return -num;
}

/**
  Returns `self` modulo `other`. See `divmod` for more information.

  @param [Numeric] other number to use for module
  @return [Numeric] result
*/
function num_modulo(num, num2) {
  return num % num2;
}

/**
  Bitwise AND.

  @param [Numeric] other numeric to AND with
  @return [Numeric]
*/
function num_and(num, num2) {
  return num & num2;
}

/**
  Performs multiplication

  @param [Numeric] other number to multiply with
  @return [Numeric]
*/
function num_mul(num, num2) {
  return num * num2;
}

/**
  Raises `self` to the power of `other`.

  @param [Numeric] other number to raise to
  @return [Numeric]
*/
function num_pow(num, num2) {
  return Math.pow(num, num2);
}

/**
  Performs addition.

  @param [Numeric] other number to add
  @return [Numeric]
*/
function num_plus(num, num2) {
  return num + num2;
}

/**
  Performs subtraction

  @param [Numeric] other number to subtract
  @return [Numeric]
*/
function num_minus(num, num2) {
  return num - num2;
}

/**
 Performs division

  @param [Numeric] other number to divide by
  @return [Numeric]
*/
function num_div(num, num2) {
  return num / num2;
}

/**
  Returns `true` if the value of `self` is less than that or `other`, `false`
  otherwise.

  @param [Numeric] other number to compare
  @return [true, false] result of comparison
*/
function num_lt(num, num2) {
  return num < num2 ? Qtrue : Qfalse;
}

/**
  Returns `true` if the value of `self` is less than or equal to `other`,
  `false` otherwise.

  @param [Numeric] other number to comapre
  @return [true, false] result of comparison
*/
function num_le(num, num2) {
  return num <= num2 ? Qtrue : Qfalse;
}

/**
  Returns `true` if the value of `self` is greater than `other`, `false`
  otherwise.

  @param [Numeric] other number to compare with
  @return [true, false] result of comparison
*/
function num_gt(num, num2) {
  return num > num2 ? Qtrue : Qfalse;
}

/**
  Returns `true` if `self` is greater than or equal to `other`, `false`
  otherwise.

  @param [Numeric] other number to compare with
  @return [true, false] result of comparison
*/
function num_ge(num, num2) {
  return num >= num2 ? Qtrue : Qfalse;
}
/**
  Shift `self` left by `count` positions.

  @param [Numeric] count number to shift
  @return [Numeric]
*/
function num_lshift(num, num2) {
  return num << num2;
}

/**
  Shifts 'self' right by `count` positions.

  @param [Numeric] count number to shift
  @return [Numeric]
*/
function num_rshift(num, num2) {
  return num >> num2;
}

/**
  Comparison - Returns '-1', '0', '1' or nil depending on whether `self` is
  less than, equal to or greater than `other`.

  @param [Numeric] other number to compare with
  @return [Number, nil]
*/
function num_cmp(num, num2) {
  if (!(num2.$flags & T_NUMBER)) return Qnil;
  else if (num < num2) return -1;
  else if (num > num2) return 1;
  else return 0;
}

/**
  Returns `true` if `self` equals `other` numerically, `false` otherwise.

  @param [Numeric] other number to compare
  @return [true, false]
*/
function num_equal(num, num2) {
  return num === num2 ? Qtrue : Qfalse;
}

/**
  Bitwise EXCLUSIVE OR.

  @param [Numeric] other number to XOR with
  @return [Numeric]
*/
function num_xor(num, num2) {
  return num ^ num2;
}

/**
  Returns the absolute value of `self`.

  @example

      -1234.abs
      # => 1234
      1234.abs
      # => 1234

  @return [Numeric]
*/
function num_abs(num) {
  return Math.abs(num);
}

/**
  Returns `true` if self is even, `false` otherwise.

  @return [true, false]
*/
function num_even_p(num) {
  return (num % 2 === 0) ? Qtrue : Qfalse;
}

/**
  Returns `true` if self is odd, `false` otherwise.

  @return [true, false]
*/
function num_odd_p(num) {
  return (num % 2 === 0) ? Qfalse : Qtrue;
}

/**
  Returns the number equal to `self` + 1.

  @example

      1.next
      # => 2
      (-1).next
      # => 0

  @return [Numeric]
*/
function num_succ(num) {
  return num + 1;
}

/**
  Returns the number equal to `self` - 1

  @example

      1.pred
      # => 0
      (-1).pred
      # => -2

  @return [Numeric]
*/
function num_pred(num) {
  return num - 1;
}

/**
  Iterates the block, passing integer values from `self` upto and including
  `finish`.

  @example

      5.upto(10) { |i| puts i }
      # => 5
      # => 6
      # => 7
      # => 8
      # => 9
      # => 10

  @param [Numeric] finish where to stop iteration
  @return [Numeric] returns the receiver
*/
function num_upto(num, finish) {
  var block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eLocalJumpError, "no block given");
  }

  block.f = block.p = Qnil;
  yself = proc.$proc[0];

  try {
    for (var i = num; i <= finish; i++) {
      proc(yself, i);
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return num;
}

/**
  Iterates the block, passing decreasing values from `self` downto and
  including `finish`.

  @example

      5.downto(1) { |x| puts x }
      # => 5
      # => 4
      # => 3
      # => 2
      # => 1

  @param [Numeric] finish where to stop iteration
  @return [Numeric] returns the receiver
*/
function num_downto(num, finish) {
  var block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eLocalJumpError, "no block given");
  }

  block.f = block.p = Qnil;
  yself = proc.$proc[0];

  try {
    for (var i = num; i >= finish; i--) {
      proc(yself, i);
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return num;
}

/**
  Iterates the block `self` number of times, passing values in the range 0 to
  `self` - 1.

  @example

      5.times { |x| puts x }
      # => 0
      # => 1
      # => 2
      # => 3
      # => 4

  @return [Numeric] returns the receiver
*/
function num_times(num) {
  var block_func = block.f, proc = block.p, yself;

  if (block_func != arguments.callee) {
    raise(eLocalJumpError, "no block given");
  }

  block.f = block.p = Qnil;
  yself = proc.$proc[0];

  try {
    for (var i = 0; i < num; i++) {
      proc(yself, i);
    }
  }
  catch (err) {
    if (err.$keyword == 2) return err.$value;
    throw err;
  }

  return num;
}

/**
  Bitwise OR.

  @param [Numeric] other number to OR with
  @return [Numeric]
*/
function num_or(num, num2) {
  return num | num2;
}

/**
  Returns `true` if `self` is zero, `false` otherwise.

  @return [true, false]
*/
function num_zero_p(num) {
  return self === 0 ? Qtrue : Qfalse;
}

/**
  Returns the receiver if it is not zero, `nil` otherwise

  @return [Numeric, nil]
*/
function num_nonzero_p(num) {
  return num === 0 ? Qnil : num;
}

/**
  One's complement: returns a number where each bit is flipped.

  @return [Numeric]
*/
function num_rev(num) {
  return ~num;
}

/**
  Returns the smallest integer greater than or equal to `num`.

  @example

      1.ceil        # => 1
      1.2.ceil      # => 2
      (-1.2).ceil   # => -1
      (-1.0).ceil   # => -1

  @return [Numeric]
*/
function num_ceil(num) {
  return Math.ceil(num);
}

/**
  Returns the largest integer less than or equal to `self`.

  @example

      1.floor       # => 1
      (-1).floor    # => -1

  @return [Numeric]
*/
function num_floor(num) {
  return Math.floor(num);
}

/**
  Returns `true` if self is an ineteger, `false` otherwise.

  @return [true, false]
*/
function num_int_p(num) {
  return num % 1 === 0 ? Qtrue : Qfalse;
}

function num_to_s(num) {
  return num.toString();
}

function num_to_i(num) {
  return parseInt(num);
}

function init_numeric() {
  cNumeric = bridge_class(Number.prototype,
    T_OBJECT | T_NUMBER, 'Numeric', cObject);

  define_method(cNumeric, '+@', num_uplus);
  define_method(cNumeric, '-@', num_uminus);
  define_method(cNumeric, '%', num_modulo);
  define_method(cNumeric, 'modulo', num_modulo);
  define_method(cNumeric, '&', num_and);
  define_method(cNumeric, '*', num_mul);
  define_method(cNumeric, '**', num_pow);
  define_method(cNumeric, '+', num_plus);
  define_method(cNumeric, '-', num_minus);
  define_method(cNumeric, '/', num_div);
  define_method(cNumeric, '<', num_lt);
  define_method(cNumeric, '<=', num_le);
  define_method(cNumeric, '>', num_gt);
  define_method(cNumeric, '>=', num_ge);
  define_method(cNumeric, '<<', num_lshift);
  define_method(cNumeric, '>>', num_rshift);
  define_method(cNumeric, '<=>', num_cmp);
  define_method(cNumeric, '==', num_equal);
  define_method(cNumeric, '===', num_equal);
  define_method(cNumeric, '^', num_xor);
  define_method(cNumeric, 'abs', num_abs);
  define_method(cNumeric, 'magnitude', num_abs);
  define_method(cNumeric, 'even?', num_even_p);
  define_method(cNumeric, 'odd?', num_odd_p);
  define_method(cNumeric, 'succ', num_succ);
  define_method(cNumeric, 'next', num_succ);
  define_method(cNumeric, 'pred', num_pred);
  define_method(cNumeric, 'upto', num_upto);
  define_method(cNumeric, 'downto', num_downto);
  define_method(cNumeric, 'times', num_times);
  define_method(cNumeric, '|', num_or);
  define_method(cNumeric, 'zero?', num_zero_p);
  define_method(cNumeric, 'nonzero?', num_nonzero_p);
  define_method(cNumeric, '~', num_rev);
  define_method(cNumeric, 'ceil', num_ceil);
  define_method(cNumeric, 'floor', num_floor);
  define_method(cNumeric, 'integer?', num_int_p);
  define_method(cNumeric, 'inspect', num_to_s);
  define_method(cNumeric, 'to_s', num_to_s);
  define_method(cNumeric, 'to_i', num_to_i);
}

