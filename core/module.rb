class Module

  def alias_method(newname, oldname)
    `#{self}.prototype['$' + newname] = #{self}.prototype['$' + oldname]`
    self
  end

  def ancestors
    %x{
      var parent = #{self},
          result = [];

      while (parent) {
        result.push(parent);
        parent = parent._super;
      }

      return result;
    }
  end

  def append_features(klass)
    %x{
      var module = #{self};

      if (!klass.$included_modules) {
        klass.$included_modules = [];
      }

      for (var idx = 0, length = klass.$included_modules.length; idx < length; idx++) {
        if (klass.$included_modules[idx] === module) {
          return;
        }
      }

      klass.$included_modules.push(module);

      if (!module.$included_in) {
        module.$included_in = [];
      }

      module.$included_in.push(klass);

      var donator   = module.prototype,
          prototype = klass.prototype,
          methods   = module._methods;

      for (var i = 0, length = methods.length; i < length; i++) {
        var method = methods[i];
        prototype[method] = donator[method];
      }

      if (klass.$included_in) {
        klass._donate(methods.slice(), true);
      }
    }

    self
  end

  # Private helper function to define attributes
  %x{
    function define_attr(klass, name, getter, setter) {
      if (getter) {
        klass.prototype['$' + name] = function() {
          var res = this[name];
          return res == null ? nil : res;
        };

        klass._donate([name]);
      }

      if (setter) {
        klass.prototype['$' + name + '='] = function(val) {
          return this[name] = val;
        };

        klass._donate([name]);
      }
    }
  }

  def attr_accessor(*attrs)
    %x{
      for (var i = 0, length = attrs.length; i < length; i++) {
        define_attr(#{self}, attrs[i], true, true);
      }

      return nil;
    }
  end

  def attr_reader(*attrs)
    %x{
      for (var i = 0, length = attrs.length; i < length; i++) {
        define_attr(#{self}, attrs[i], true, false);
      }

      return nil;
    }
  end

  def attr_writer(*attrs)
    %x{
      for (var i = 0, length = attrs.length; i < length; i++) {
        define_attr(#{self}, attrs[i], false, true);
      }

      return nil;
    }
  end

  def attr(name, setter = false)
    `define_attr(#{self}, name, true, setter)`

    self
  end

  def define_method(name, &block)
    %x{
      if (block === nil) {
        no_block_given();
      }

      var jsid    = '$' + name;
      block._jsid = jsid;
      block._sup  = #{self}.prototype[jsid];

      #{self}.prototype[jsid] = block;
      #{self}._donate([jsid]);

      return nil;
    }
  end

  def include(*mods)
    %x{
      var i = mods.length - 1, mod;
      while (i >= 0) {
        mod = mods[i];
        i--;

        if (mod === #{self}) {
          continue;
        }

        #{ `mod`.append_features self };
        #{ `mod`.included self };
      }

      return #{self};
    }
  end

  # FIXME
  def instance_methods
    []
  end

  def included(mod)
  end

  def module_eval(&block)
    %x{
      if (block === nil) {
        no_block_given();
      }

      return block.call(#{self});
    }
  end

  alias class_eval module_eval

  def name
    `#{self}._name`
  end

  alias public_instance_methods instance_methods

  def singleton_class
    %x{
      if (#{self}._singleton) {
        return #{self}._singleton;
      }

      var meta = new __opal.Class;
      #{self}._singleton = meta;
      meta.prototype = #{self};

      return meta;
    }
  end

  alias to_s name
end