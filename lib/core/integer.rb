class Integer < Numeric

  class << self
    undef new
    undef allocate
  end

  # Iterates the block `self` number of times, passing values in the range 0 to
  # `self` - 1.
  #
  # @example
  #
  #     5.times { |x| puts x }
  #     # => 0
  #     # => 1
  #     # => 2
  #     # => 3
  #     # => 4
  #
  # @return [Integer] returns the receiver
  def times
    raise "no block given" unless block_given?
    `for (var i = 0; i < self; i++) {
      #{ yield `i` };
    }`
    self
  end

  # Returns the smallest integer greater than or equal to `num`.
  #
  # @example
  #
  #     1.ceil        # => 1
  #     1.2.ceil      # => 2
  #     (-1.2).ceil   # => -1
  #     (-1.0).ceil   # => -1
  #
  # @return [Numeric]
  def ceil
    `return Math.ceil(self);`
  end

  # Iterates the block, passing decreasing values from `self` downto and
  # including `finish`.
  #
  # @example
  #
  #     5.downto(1) { |x| puts x }
  #     # => 5
  #     # => 4
  #     # => 3
  #     # => 2
  #     # => 1
  #
  # @param [Numeric] finish where to stop iteration
  # @return [Numeric] returns the receiver
  def downto(finish)
    `for (var i = self; i >= finish; i--) {
      #{yield `i`};
    }

    return self;`
  end

  # Returns the largest integer less than or equal to `self`.
  #
  # @example
  #
  #     1.floor       # => 1
  #     (-1).floor    # => -1
  #
  # @return [Numeric]
  def floor
    `return Math.floor(self);`
  end

  # Returns `true` if self is an ineteger, `false` otherwise.
  #
  # @return [true, false]
  def integer?
    `return self % 1 == 0 ? Qtrue : Qfalse;`
  end

  # Returns the number equal to `self` + 1.
  #
  # @example
  #
  #     1.next
  #     # => 2
  #     (-1).next
  #     # => 0
  #
  # @return [Numeric]
  def succ
    `return self + 1;`
  end

  def next
    `return self + 1;`
  end

  # Returns the number equal to `self` - 1
  #
  # @example
  #
  #     1.pred
  #     # => 0
  #     (-1).pred
  #     # => -2
  #
  # @return [Numeric]
  def pred
    `return self - 1;`
  end

  # Iterates the block, passing integer values from `self` upto and including
  # `finish`.
  #
  # @example
  #
  #     5.upto(10) { |i| puts i }
  #     # => 5
  #     # => 6
  #     # => 7
  #     # => 8
  #     # => 9
  #     # => 10
  #
  # @param [Numeric] finish where to stop iteration
  # @return [Numeric] returns the receiver
  def upto(finish)
    `for (var i = self; i <= finish; i++) {
      #{yield `i`};
    }

    return self;`
  end
end

