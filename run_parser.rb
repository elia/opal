#!/usr/bin/env ruby

opal_lib = File.expand_path('../opal_lib', __FILE__)
$:.unshift opal_lib
require 'opal'

content = %[
  def norm(a, b, c, d = 100); 100; end
  20
].strip

parser = Opal::RubyParser.new(content)
result = parser.parse!
puts result.inspect
puts "=========="
puts Opal::RubyParser::Generator.process(result)

