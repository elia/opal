class Exception < `Error`
  attr_reader :message

  def self.new(message = '')
    %x{
      var err = #{allocate};
      err.message = message;
      return err;
    }
  end

  def backtrace
    %x{
      var backtrace = #{self}.stack;

      if (typeof(backtrace) === 'string') {
        return backtrace.split("\\n");
      }
      else if (backtrace) {
        return backtrace;
      }

      return ["No backtrace available"];
    }
  end

  def inspect
    "#<#{self.class.name}: '#@message'>"
  end

  alias to_s message
end

StandardError   = Exception
RuntimeError    = Exception
LocalJumpError  = Exception
TypeError       = Exception
NameError       = Exception
NoMethodError   = Exception
ArgumentError   = Exception
IndexError      = Exception
KeyError        = Exception
RangeError      = Exception