require "opal/parser"
require "opal/builder"
require "opal/bundle"
require "opal/context"
require "opal/version"

# Opal is a set of build tools and runtime utilies for compiling ruby
# source code into javascript. Opal can use therubyracer to provide a
# ruby context for evaluating the generated javascript against the
# provided runtime.
module Opal
  # Root opal directory (root of gem)
  OPAL_DIR = File.expand_path('../..', __FILE__)

  # Full path to our opal.js runtime file
  OPAL_JS_PATH = File.join OPAL_DIR, "opal.js"

  # Full path to our opal-parser.js parser file
  OPAL_PARSER_JS_PATH = File.join OPAL_DIR, "opal-parser.js"
end

