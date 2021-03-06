class Hash
  include Enumerable

  %x{
    __hash = Opal.hash = function() {
      var hash   = new Hash,
          args   = __slice.call(arguments),
          assocs = {};

      hash.map   = assocs;

      for (var i = 0, length = args.length, key; i < length; i++) {
        key = args[i];
        assocs[key] = [key, args[++i]];
      }

      return hash;
    };
  }

  def self.[](*objs)
    `__hash.apply(null, objs)`
  end

  def self.allocate
    `__hash()`
  end

  def self.from_native(obj)
    %x{
      var hash = __hash(), map = hash.map;

      for (var key in obj) {
        map[key] = [key, obj[key]]
      }

      return hash;
    }
  end

  def self.new(defaults, &block)
    %x{
      var hash = __hash();

      if (defaults != null) {
        hash.none = defaults;
      }
      else if (block !== nil) {
        hash.proc = block;
      }

      return hash;
    }
  end

  def ==(other)
    %x{
      if (#{self} === other) {
        return true;
      }

      if (!other.map) {
        return false;
      }

      var map  = #{self}.map,
          map2 = other.map;

      for (var assoc in map) {
        if (!map2[assoc]) {
          return false;
        }

        var obj  = map[assoc][1],
            obj2 = map2[assoc][1];

        if (#{`obj` != `obj2`}) {
          return false;
        }
      }

      return true;
    }
  end

  def [](key)
    %x{
      var bucket;

      if (bucket = #{self}.map[key]) {
        return bucket[1];
      }

      var proc = #{@proc};

      if (proc !== nil) {
        return #{ `proc`.call self, key };
      }

      return #{@none};
    }
  end

  def []=(key, value)
    %x{
      #{self}.map[key] = [key, value];

      return value;
    }
  end

  def assoc(object)
    %x{
      for (var assoc in #{self}.map) {
        var bucket = #{self}.map[assoc];

        if (#{`bucket[0]` == `object`}) {
          return [bucket[0], bucket[1]];
        }
      }

      return nil;
    }
  end

  def clear
    %x{
      #{self}.map = {};

      return #{self};
    }
  end

  def clone
    %x{
      var result = __hash(),
          map    = #{self}.map,
          map2   = result.map;

      for (var assoc in map) {
        map2[assoc] = [map[assoc][0], map[assoc][1]];
      }

      return result;
    }
  end

  def default
    @none
  end

  def default=(object)
    @none = object
  end

  def default_proc
    @proc
  end

  def default_proc=(proc)
    @proc = proc
  end

  def delete(key)
    %x{
      var map  = #{self}.map, result;

      if (result = map[key]) {
        result = bucket[1];

        delete map[key];
      }

      return result;
    }
  end

  def delete_if(&block)
    return enum_for :delete_if unless block_given?

    %x{
      var map = #{self}.map;

      for (var assoc in map) {
        var bucket = map[assoc],
            value;

        if ((value = block.call(__context, bucket[0], bucket[1])) === __breaker) {
          return __breaker.$v;
        }

        if (value !== false && value !== nil) {
          delete map[assoc];
        }
      }

      return #{self};
    }
  end

  alias dup clone

  def each(&block)
    return enum_for :each unless block_given?

    %x{
      var map = #{self}.map;

      for (var assoc in map) {
        var bucket = map[assoc];

        if (block.call(__context, bucket[0], bucket[1]) === __breaker) {
          return __breaker.$v;
        }
      }

      return #{self};
    }
  end

  def each_key(&block)
    return enum_for :each_key unless block_given?

    %x{
      var map = #{self}.map;

      for (var assoc in map) {
        var bucket = map[assoc];

        if (block.call(__context, bucket[0]) === __breaker) {
          return __breaker.$v;
        }
      }

      return #{self};
    }
  end

  alias each_pair each

  def each_value(&block)
    return enum_for :each_value unless block_given?

    %x{
      var map = #{self}.map;

      for (var assoc in map) {
        var bucket = map[assoc];

        if (block.call(__context, bucket[1]) === __breaker) {
          return __breaker.$v;
        }
      }

      return #{self};
    }
  end

  def empty?
    %x{
      for (var assoc in #{self}.map) {
        return false;
      }

      return true;
    }
  end

  alias eql? ==

  def fetch(key, defaults, &block)
    %x{
      var bucket = #{self}.map[key];

      if (bucket) {
        return bucket[1];
      }

      if (block !== nil) {
        var value;

        if ((value = block.call(__context, key)) === __breaker) {
          return __breaker.$v;
        }

        return value;
      }

      if (defaults != null) {
        return defaults;
      }

      #{ raise "key not found" };
    }
  end

  def flatten(level)
    %x{
      var map    = #{self}.map,
          result = [];

      for (var assoc in map) {
        var bucket = map[assoc],
            key    = bucket[0],
            value  = bucket[1];

        result.push(key);

        if (value._isArray) {
          if (level == null || level === 1) {
            result.push(value);
          }
          else {
            result = result.concat(#{`value`.flatten(level - 1)});
          }
        }
        else {
          result.push(value);
        }
      }

      return result;
    }
  end

  def has_key?(key)
    `!!#{self}.map[key]`
  end

  def has_value?(value)
    %x{
      for (var assoc in #{self}.map) {
        if (#{`#{self}.map[assoc][1]` == value}) {
          return true;
        }
      }

      return false;
    }
  end

  def hash
    `#{self}._id`
  end

  alias include? has_key?

  def index(object)
    %x{
      for (var assoc in #{self}.map) {
        var bucket = #{self}.map[assoc];

        if (#{object == `bucket[1]`}) {
          return bucket[0];
        }
      }

      return nil;
    }
  end

  def indexes(*keys)
    %x{
      var result = [], map = #{self}.map, bucket;

      for (var i = 0, length = keys.length; i < length; i++) {
        var key = keys[i];

        if (bucket = map[key]) {
          result.push(bucket[1]);
        }
        else {
          result.push(#{self}.none);
        }
      }

      return result;
    }
  end

  alias indices indexes

  def inspect
    %x{
      var inspect = [],
          map     = #{self}.map;

      for (var assoc in map) {
        var bucket = map[assoc];

        inspect.push(#{`bucket[0]`.inspect} + '=>' + #{`bucket[1]`.inspect});
      }
      return '{' + inspect.join(', ') + '}';
    }
  end

  def invert
    %x{
      var result = __hash(),
          map    = #{self}.map,
          map2   = result.map;

      for (var assoc in map) {
        var bucket = map[assoc];

        map2[bucket[1]] = [bucket[1], bucket[0]];
      }

      return result;
    }
  end

  def keep_if(&block)
    return enum_for :keep_if unless block_given?

    %x{
      var map = #{self}.map, value;

      for (var assoc in map) {
        var bucket = map[assoc];

        if ((value = block.call(__context, bucket[0], bucket[1])) === __breaker) {
          return __breaker.$v;
        }

        if (value === false || value === nil) {
          delete map[assoc];
        }
      }

      return #{self};
    }
  end

  alias key index

  alias key? has_key?

  def keys
    %x{
      var result = [];

      for (var assoc in #{self}.map) {
        result.push(#{self}.map[assoc][0]);
      }

      return result;
    }
  end

  def length
    %x{
      var result = 0;

      for (var assoc in #{self}.map) {
        result++;
      }

      return result;
    }
  end

  alias member? has_key?

  def merge(other, &block)
    %x{
      var result = __hash(),
          map    = #{self}.map,
          map2   = result.map;

      for (var assoc in map) {
        var bucket = map[assoc];

        map2[assoc] = [bucket[0], bucket[1]];
      }

      map = other.map;

      if (block === nil) {
        for (var assoc in map) {
          var bucket = map[assoc];

          map2[assoc] = [bucket[0], bucket[1]];
        }
      }
      else {
        for (var assoc in map) {
          var bucket = map[assoc], key = bucket[0], val = bucket[1];

          if (__hasOwn.call(map2, assoc)) {
            val = block.call(__context, key, map2[assoc][1], val);
          }

          map2[assoc] = [key, val];
        }
      }

      return result;
    }
  end

  def merge!(other, &block)
    %x{
      var map  = #{self}.map,
          map2 = other.map;

      if (block === nil) {
        for (var assoc in map2) {
          var bucket = map2[assoc];

          map[assoc] = [bucket[0], bucket[1]];
        }
      }
      else {
        for (var assoc in map2) {
          var bucket = map2[assoc], key = bucket[0], val = bucket[1];

          if (__hasOwn.call(map, assoc)) {
            val = block.call(__context, key, map[assoc][1], val);
          }

          map[assoc] = [key, val];
        }
      }

      return #{self};
    }
  end

  def rassoc(object)
    %x{
      var map = #{self}.map;

      for (var assoc in map) {
        var bucket = map[assoc];

        if (#{`bucket[1]` == object}) {
          return [bucket[0], bucket[1]];
        }
      }

      return nil;
    }
  end

  def reject(&block)
    return enum_for :reject unless block_given?

    %x{
      var map = #{self}.map, result = __hash(), map2 = result.map;

      for (var assoc in map) {
        var bucket = map[assoc],
            value;

        if ((value = block.call(__context, bucket[0], bucket[1])) === __breaker) {
          return __breaker.$v;
        }

        if (value === false || value === nil) {
          map2[bucket[0]] = [bucket[0], bucket[1]];
        }
      }

      return result;
    }
  end

  def replace(other)
    %x{
      var map = #{self}.map = {};

      for (var assoc in other.map) {
        var bucket = other.map[assoc];

        map[bucket[0]] = [bucket[0], bucket[1]];
      }

      return #{self};
    }
  end

  def select(&block)
    return enum_for :select unless block_given?

    %x{
      var map = #{self}.map, result = __hash(), map2 = result.map;

      for (var assoc in map) {
        var bucket = map[assoc],
            value;

        if ((value = block.call(__context, bucket[0], bucket[1])) === __breaker) {
          return __breaker.$v;
        }

        if (value !== false && value !== nil) {
          map2[bucket[0]] = [bucket[0], bucket[1]];
        }
      }

      return result;
    }
  end

  def select!(&block)
    return enum_for :select! unless block_given?

    %x{
      var map = #{self}.map, result = nil;

      for (var assoc in map) {
        var bucket = map[assoc],
            value;

        if ((value = block.call(__context, bucket[0], bucket[1])) === __breaker) {
          return __breaker.$v;
        }

        if (value === false || value === nil) {
          delete map[assoc];
          result = #{self};
        }
      }

      return result;
    }
  end

  def shift
    %x{
      var map = #{self}.map;

      for (var assoc in map) {
        var bucket = map[assoc];
        delete map[assoc];
        return [bucket[0], bucket[1]];
      }

      return nil;
    }
  end

  alias size length

  def to_a
    %x{
      var map    = #{self}.map,
          result = [];

      for (var assoc in map) {
        var bucket = map[assoc];

        result.push([bucket[0], bucket[1]]);
      }

      return result;
    }
  end

  def to_hash
    self
  end

  def to_json
    %x{
      var parts = [], map = #{self}.map, bucket;

      for (var assoc in map) {
        bucket = map[assoc];
        parts.push(#{ `bucket[0]`.to_json } + ': ' + #{ `bucket[1]`.to_json });
      }

      return '{' + parts.join(', ') + '}';
    }
  end

  def to_native
    %x{
      var result = {}, map = #{self}.map, bucket;

      for (var assoc in map) {
        bucket = map[assoc];
        result[bucket[0]] = #{ `bucket[1]`.to_json };
      }

      return result;
    }
  end

  alias to_s inspect

  alias update merge!

  def value?(value)
    %x{
      var map = #{self}.map;

      for (var assoc in map) {
        var v = map[assoc][1];
        if (#{`v` == value}) {
          return true;
        }
      }

      return false;
    }
  end

  alias values_at indexes

  def values
    %x{
      var map    = #{self}.map,
          result = [];

      for (var assoc in map) {
        result.push(map[assoc][1]);
      }

      return result;
    }
  end
end