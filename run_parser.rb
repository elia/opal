#!/usr/bin/env ruby

opal_lib = File.expand_path('../opal_lib', __FILE__)
$:.unshift opal_lib
require 'opal'

content = %[
  class Adam
    100  
end

class Assignment < WOW
  nil
end

class A::B
 10
end

class ::C
  10000
end
].strip

parser = Opal::RubyParser.new(content)
result = parser.parse!
puts result.inspect
puts "=========="
puts Opal::RubyParser::Generator.process(result)

