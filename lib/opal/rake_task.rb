require 'opal'
require 'opal/builder'
require 'fileutils'

module Opal
  class RakeTask
    include Rake::DSL if defined? Rake::DSL

    attr_accessor :name, :build_dir, :specs_dir, :files, :dependencies

    def initialize(namespace = nil)
      @project_dir = Dir.getwd

      @name         = File.basename(@project_dir)
      @build_dir    = 'build'
      @specs_dir    = 'spec'
      @files        = Dir['lib/**/*.{rb,js,erb}']
      @dependencies = []

      yield self if block_given?

      define_tasks
    end

    def build_gem(name)
      out = File.join @build_dir, "#{ name }.js"
      puts " * #{out}"
      write_code Opal.build_gem(name), out
    rescue Gem::LoadError => e
      puts "  - Error: Could not find gem #{name}"
    end

    def write_code(code, out)
      FileUtils.mkdir_p File.dirname(out)
      File.open(out, 'w+') { |o| o.puts code }
    end

    def define_tasks
      desc "Build opal project"
      task 'opal:build' do
        out = File.join @build_dir, "#{ @name }.js"
        puts " * #{out}"
        write_code Opal.build_files(@files), out
      end

      desc "Build specs"
      task 'opal:spec' do
        out = File.join @build_dir, 'specs.js'
        puts " * #{out}"
        write_code Opal.build_files(@specs_dir), out
      end

      desc "Build dependencies"
      task 'opal:dependencies' do
        out = File.join @build_dir, 'opal.js'
        puts " * #{out}"
        write_code Opal.runtime, File.join(@build_dir, 'opal.js')

        @dependencies.each { |dep| build_gem dep }
      end

      desc "Build opal files, dependencies and specs"
      task :opal => %w(opal:build opal:dependencies opal:spec)
    end
  end
end