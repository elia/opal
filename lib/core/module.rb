# Implements the core functionality of modules. This is inherited from
# by instances of {Class}, so these methods are also available to
# classes.
class Module

  def define_method(method_id, &block)
    raise LocalJumpError, "no block given" unless block_given?
    `$runtime.define_method(self, #{method_id.to_s}, block)`
    nil
  end

  def alias_method(new_name, old_name)
    `$runtime.alias_method(self, #{new_name.to_s}, #{old_name.to_s});`
    self
  end

  def class_eval(str = nil, &block)
    if block_given?
      `block.call(self)`
    else
      raise "need to compile str"
    end
  end

  def module_eval(str = nil, &block)
    class_eval str, &block
  end

  def extend(mod)
    `$runtime.extend_module(self, mod)`
    nil
  end
end

