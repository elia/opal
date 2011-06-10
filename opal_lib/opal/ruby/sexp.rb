module Opal
  class RubyParser < Racc::Parser
    class Sexp < Array

      attr_accessor :line, :end_line

      def initialize(*parts)
        push *parts
        @line = 0
        @end_line = 0
      end

      def inspect
        "s(#{ map { |x| x.inspect }.join ', ' })"
      end

      alias_method :to_s, :inspect
    end # Sexp

    class Scope

      attr_reader :locals

      attr_accessor :parent

      def initialize(type)
        @block = type == :block
        @locals = []
        @parent = nil
      end
    end # Scope

    def push_scope(type = nil)
      top = @scopes.last
      scope = Scope.new type
      scope.parent = top
      @scopes << scope
      @scope = scope
    end

    def pop_scope
      @scopes.pop
      @scope = @scopes.last
    end

    def s(*p)
      res = Sexp.new *p
      res.line = @line_number
      res
    end

    def new_block(stmt = nil)
      res = s(:block)
      res << stmt if stmt
      res
    end

    def new_compstmt(block)
      if block.length == 1
        nil
      elsif block.length == 2
        block[1]
      else
        block.line = block[1].line
        block
      end
    end

    def new_body(compstmt, res, els, ens)
      result = compstmt
    end

    def new_defn(line, name, args, body)
      scope = s(:scope, body)
      scope.line = body.line
      res = s(:defn, name.intern, args, scope)
      res.line = line
      res.end_line = @line_number
      res
    end
  end
end

