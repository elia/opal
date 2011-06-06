class Float < Numeric

  def *(other)
    `return $runtime.F(self * other);`
  end

  def +(other)
    `return $runtime.F(self + other);`
  end

  def -(other)
    `return $runtime.F(self - other);`
  end

  def to_s
    `return self.toString();`
  end

  def to_i
    `return parseInt(self);`
  end

  def to_f
    self
  end
end
