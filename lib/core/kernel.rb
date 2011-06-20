# The {Kernel} module is directly included into {Object} and provides a
# lot of the core object functionality. It is not, however, included in
# {BasicObject}.
module Kernel

  def to_a
    [self]
  end

  def tap
    raise LocalJumpError, "no block given" unless block_given?
    yield self
    self
  end

  # Returns `true` if the method with the given id exists on the receiver,
  # `false` otherwise.
  #
  # Implementation Details
  # ----------------------
  # Opals' internals are constructed so that when a method is initially called,
  # a fake method is created on the root basic object, so that any subsequent
  # calls to that method on an object that has not defined it, will yield a
  # method_missing behaviour. For this reason, fake methods are tagged with a
  # `.$rbMM` property so that they will not be counted when this method checks
  # if a given method has been defined.
  #
  # @param [String, Symbol] method_id
  # @return [Boolean]
  def respond_to?(method_id)
    `var method = self.$m[#{`method_id`.to_s}];

    if (method && !method.$rbMM) {
      return Qtrue;
    }

    return Qfalse;`
  end

  def send(method_id, *args, &block)
    `
    var method = self['m$' + #{method_id.to_s}];

    if ($block.f == arguments.callee) {
      $block.f = method;
    }
    return method.apply(self, args);
    `
  end

  # Returns a random number. If max is `nil`, then the result is 0. Otherwise
  # returns a random number between 0 and max.
  #
  # @example
  #
  #     rand        # => 0.918378392234
  #     rand        # => 0.283842929289
  #     rand 10     # => 9
  #     rand 100    # => 21
  #
  # @param [Numeric] max
  # @return [Numeric]
  def rand(max = `undefined`)
    `if (max != undefined)
        return Math.floor(Math.random() * max);
    else
      return Math.random();`
  end

  def const_set(name, value)
    `return rb_const_set($runtime.class_real(self.$klass), name, value);`
  end

  def const_defined?(name)
    false
  end

  def =~(obj)
    nil
  end

  def extend(mod)
    `$runtime.extend_module(self, mod);`
    nil
  end

  # Raises an exception. If given a string, this method will raise a
  # RuntimeError with the given string as a message. Otherwise, if the first
  # parameter is a subclass of Exception, then the method will raise a new
  # instance of the given exception class with the string as a message, if it
  # exists, or a fdefault message otherwise.
  #
  # @example String message
  #
  #     raise "some error"
  #     # => RuntimeError: some error
  #
  # @example Exception subclass
  #
  #     raise StandardError, "something went wrong"
  #     # => StandardError: something went wrong
  #
  # @param [Exception, String] exception
  # @param [String]
  # @return [nil]
  def raise(exception, string = nil)
    `var msg = nil, exc;

    if (typeof exception == 'string') {
      msg = exception;
      exc = #{RuntimeError.new `msg`};
    } else if (#{`exception`.kind_of? Exception}.$r) {
      exc = exception;
    } else {
      if (string != nil) msg = string;
      exc = #{`exception`.new `msg`};
    }
    $runtime.raise_exc(exc);`
  end

  # def fail(exception, string = nil)
    # raise exception, string
  # end
  alias_method :fail, :raise

  # Repeatedly executes the given block.
  #
  # @example
  #
  #     loop do
  #       puts "this will infinetly repeat"
  #     end
  #
  # @return [Object] returns the receiver.
  def loop
    `while (true) {
      #{yield};
    }

    return self;`
  end

  # Simple equivalent to `Proc.new`. Returns a new proc from the given block.
  #
  # @example
  #
  #     proc { puts "a" }
  #     # => #<Proc 02002>
  #
  # @return [Proc]
  def proc(&block)
    raise ArgumentError,
      "tried to create Proc object without a block" unless block_given?
    block
  end

  def lambda(&block)
    raise ArgumentError,
      "tried to create Proc object without a block" unless block_given?
    `return $runtime.lambda(block);`
  end
end

