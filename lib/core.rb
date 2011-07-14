`console.log(1);`
class Module

  def include(*mods)
    `var i = mods.length - 1, mod;
    while (i >= 0) {
      mod = mods[i];
      #{`mod`.append_features self};
      #{`mod`.included self};
      i--;
    }
    return self;`
  end

  def append_features(mod)
    `$rb.include_module(mod, self);`
    self
  end

  def included(mod)
    nil
  end
end

`console.log(1);`
module Kernel

  # Try to load the library or file named `path`. An error is thrown if the
  # path cannot be resolved.
  #
  # @param [String] path The path to load
  # @return [true, false]
  def require(path)
    `console.log("about to require: " + path);`
    `$rb.require(path) ? Qtrue : Qfalse;`
    true
  end

  # Prints the message to `STDOUT`.
  #
  # @param [Array<Object>] args Objects to print using `to_s`
  # @return [nil]
  def puts(*a)
    $stdout.puts *a
    nil
  end
end

`console.log(1);`
class << $stdout
  # FIXME: Should this really be here? We only need to override this when we
  # are in the browser context as we don't have native access to file
  # descriptors etc
  def puts(*a)
    `for (var i = 0, ii = a.length; i < ii; i++) {
      console.log(#{`a[i]`.to_s}.toString());
    }`
    nil
  end
end

`console.log(1);`
class Object
  include Kernel
end

`console.log(2);`
class Symbol
  def to_s
    `return self.sym.toString();`
  end
end

`console.log(2);`
class String
  def to_s
    `return self.toString();`
  end
end

`console.log(3);`
require 'core/basic_object'
require 'core/object'
require 'core/module'
require 'core/class'
require 'core/kernel'
require 'core/top_self'
require 'core/nil_class'
require 'core/true_class'
require 'core/false_class'
require 'core/enumerable'
require 'core/array'
require 'core/numeric'
require 'core/hash'
require 'core/error'
require 'core/string'
require 'core/symbol'
require 'core/proc'
require 'core/range'
require 'core/regexp'
require 'core/match_data'
require 'core/file'
require 'core/dir'

`var platform = opal.platform;`
RUBY_PLATFORM = `platform.platform`
RUBY_ENGINE = `platform.engine`
RUBY_VERSION = `platform.version`

ARGV = `platform.argv`

