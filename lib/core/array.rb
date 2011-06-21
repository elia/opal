


























# Returns the receiver.
#
# @example
#
#     a = [1, 2, 3]
#     a.to_a
#     # => [1, 2, 3]
#
# @return [Array] returns the receiver
def to_a
  self
end

# Returns a new array by removing duplicate values in `self`.
#
# @example
#
#     a = ['a', 'a', 'b', 'b', 'c']
#     a.uniq
#     # => ['a', 'b', 'c']
#     a
#     # => ['a', 'a', 'b', 'b', 'c']
#
# @return [Array]
def uniq
  `var result = [], seen = [];

  for (var i = 0; i < self.length; i++) {
    var test = self[i], hash = test.$hash();
    if (seen.indexOf(hash) == -1) {
      seen.push(hash);
      result.push(test);
    }
  }

  return result;`
end

# Removes duplicate elements from `self`. Returns `nil` if no changes are
# made (that is, no duplicates are found).
#
# @example
#
#     a = ['a', 'a', 'b', 'b', 'c']
#     a.uniq!
#     # => ['a', 'b', 'c']
#     a.uniq!
#     # => nil
#
# @return [Array] returns receiver
def uniq!
  `var seen = [], length = self.length;

  for (var i = 0; i < self.length; i++) {
    var test = self[i], hash = test.$hash();
    if (seen.indexOf(hash) == -1) {
      seen.push(hash);
    } else {
      self.splice(i, 1);
      i--;
    }
  }

  return self.length == length ? nil : self;`
end

# Prepends objects to the front of `self`, moving other elements upwards.
#
# @example
#
#     a = ['b', 'c', 'd']
#     a.unshift 'a'
#     # => ['a', 'b', 'c', 'd']
#     a.unshift 1, 2
#     # => [1, 2, 'a', 'b', 'c', 'd']
#
# @param [Object] objs objects to add
# @return [Array] returns the receiver
def unshift(*objs)
  `for (var i = objs.length - 1; i >= 0; i--) {
    self.unshift(objs[i]);
  }

  return self;`
end

# Set intersection - Returns a new array containing elements common to the
# two arrays, with no duplicates.
#
# @example
#
#     [1, 1, 3, 5] & [1, 2, 3]
#     # => [1, 3]
#
# @param [Array] other second array to intersect
# @return [Array] new intersected array
def &(other)
  `var result = [], seen = [];

  for (var i = 0; i < self.length; i++) {
    var test = self[i], hash = test.$hash();

    if (seen.indexOf(hash) == -1) {
      for (var j = 0; j < other.length; j++) {
        var test_b = other[j], hash_b = test_b.$hash();

        if ((hash == hash_b) && seen.indexOf(hash) == -1) {
          seen.push(hash);
          result.push(test);
        }
      }
    }
  }

  return result;`
end

# Repitition - When given a string argument, acts the same as {#join}.
# Otherwise, returns a new array build by concatenating the `num` copies of
# self.
#
# @example With Number
#
#     [1, 2, 3] * 3
#     # => [1, 2, 3, 1, 2, 3, 1, 2, 3]
#
# @example With String
#
#     [1, 2, 3] * ','
#     # => '1,2,3'
#
# @param [String, Number] num string or number used to join or concat
# @return [String, Array] depending on argument
def *(arg)
  `if (typeof arg == 'string') {
    return #{self.join `arg`};
  } else {
    var result = [];
    for (var i = 0; i < parseInt(arg); i++) {
      result = result.concat(self);
    }

    return result;
  }`
end

# Element Reference - Returns the element at `index`, or returns a subarray
# at index and counting for length elements, or returns a subarray if index
# is a range. Negative indecies count backward from the end of the array (-1
# is the last element). Returns `nil` if the index (or starting index) are
# out of range.
#
# @example
#
#     a = ['a', 'b', 'c', 'd', 'e']
#     a[2] + a[0] + a[1]              # => 'cab'
#     a[6]                            # => nil
#     a[1, 2]                         # => ['b', 'c']
#     a[1..3]                         # => ['b', 'c', 'd']
#     a[4..7]                         # => ['e']
#     a[6..10]                        # => nil
#     a[-3, 3]                        # => ['c', 'd', 'e']
#     a[5]                            # => nil
#     a[5, 1]                         # => []
#     a[5..10]                        # => []
#
# **TODO** does not yet work with ranges
#
# @param [Range, Numeric] index to begin
# @param [Numeric] length last index
# @return [Array, Object, nil] result
def [](index, length = `undefined`)
  `var size = self.length;

  if (index < 0) index += size;

  if (index >= size || index < 0) return nil;

  if (length != undefined) {
    if (length <= 0) return [];
    return self.slice(index, index + length);
  } else {
    return self[index];
  }`
end

# Element reference setting.
#
# **TODO** need to expand functionlaity.
def []=(index, value)
  `if (index < 0) index += self.length;
  return self[index] = value;`
end

