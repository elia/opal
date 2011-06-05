class Time
  def initialize
    `self.$date = new Date();`
  end

  def to_f
    `return self.$date.getTime() / 1000;`
  end

  alias_method :to_i, :to_f
end

