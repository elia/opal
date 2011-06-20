# BasicObject is the root object in opal. Even {Object} inherits from
# {BasicObject}. Instances of BasicObject (or subclasses of) are useful
# as they give almost a clean interface in which the absolute minimum of
# methods are defined on it. It therefore becomes useful for such
# applications as HashStructs.
class BasicObject

  def __send__(method_id, *args, &block)
    `
    var method = self['m$' + #{method_id.to_s}];


    if ($B.f == arguments.callee) {
      $B.f = method;
    }

    return method.apply(self, args);`
  end

  def instance_eval(&block)
    raise ArgumentError, "block not supplied" unless block_given?
    `block.call(self);`
    self
  end

  def method_missing(sym, *args)
    raise NoMethodError, "undefined method `#{sym}` for #{self.inspect}"
  end
end

