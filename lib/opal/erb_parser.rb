require 'opal/parser'

module Opal
  class ERBParser

    def parse(str, name = 'erb')
      Parser.new.parse compile(str, name)
    end

    def compile(str, name)
      res = "TinyERB.new('#{name}') do\nout = []\nout.<<(\"" +
      str.gsub(/<%=([\s\S]+?)%>/) do
        "\")\nout.<<(" + $1.gsub(/\\'/, "'") + ")\nout.<<(\""
      end.gsub(/<%([\s\S]+?)%>/) do
        "\")\n" + $1 + "\nout.<<(\""
      end + "\")\nout.join\nend"
    end
  end
end