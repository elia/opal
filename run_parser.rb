#!/usr/bin/env ruby

opal_lib = File.expand_path('../opal_lib', __FILE__)
$:.unshift opal_lib
require 'opal'

content = %[
  1
  2
  true
  false
  nil
  self

  self and self
  false or true and true or false and nil and self

  def something_here
    10
    20
    30
  end


  { 1 => 2 }
  {
    1 => 2,
    3 => 4
  }
  :som_sym

  { :adam => :beynon, :charles => :son }
  121212_12121212
  1212.121

  not 100
  !nil
  200
  1 or 2
  2 and 3

  true
].strip

parser = Opal::RubyParser.new(content)
result = parser.parse!
puts result.inspect
puts "=========="
puts Opal::RubyParser::Generator.process(result)

