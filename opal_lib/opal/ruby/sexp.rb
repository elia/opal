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

      def add_local(local)
        @locals << local
      end

      def has_local?(local)
        @locals.include? local
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

    def new_args(norm_arg, opt_arg, rest_arg, block_arg)
      res = s(:args)

      if norm_arg
        norm_arg.each do |arg|
          @scope.add_local arg
          res << arg
        end
      end

      if opt_arg
        opt_arg[1..-1].each do |opt|
          res << opt[1]
        end
      end

      res.push rest_arg if rest_arg
      res << opt_arg if opt_arg

      res
    end

    def new_assign(lhs, rhs)
      case lhs[0]
      when :iasgn, :cdecl, :lasgn
        lhs << rhs
        lhs
      else
        raise "bad lhs for assign: #{lhs[0]}"
      end
    end

    def new_assignable(ref)
      case ref[0]
      when :ivar
        ref[0] = :iasgn
      when :const
        ref[0] = :cdecl
      when :identifier
        @scope.add_local ref[1] unless @scope.has_local? ref[1]
        ref[0] = :lasgn
      else
        raise "bad assignable type: #{ref[0]}"
      end

      ref
    end

    def new_gettable_from_assignable(asgn)
      case asgn[0]
      when :lasgn
        s(:lvar, asgn[1])
      when :iasgn
        s(:ivar, asgn[1])
      else
        raise "Bad assignable for converting to gettable: #{asgn[0]}"
      end
    end

    def new_var_ref(ref)
      case ref[0]
      when :self, :nil, :true, :false, :line, :file
        ref
      when :identifier
        if @scope.has_local? ref[1]
          s(:lvar, ref[1])
        else
          s(:call, nil, ref[1], s(:arglist))
        end
      when :const
        ref
      when :ivar, :gvar
        ref
      else
        raise "Bad var_ref type: #{ref[0]}"
      end
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
      res = s(:block, compstmt) unless compstmt[0] == :block
      res.line = compstmt.line
      res
    end

    def new_defn(line, name, args, body)
      scope = s(:scope, body)
      scope.line = body.line
      res = s(:defn, name.intern, args, scope)
      res.line = line
      res.end_line = @line_number
      res
    end

    def new_class(path, sup, body)
      scope = s(:scope, body)
      scope.line = body.line
      res = s(:class, path, sup, scope)
      res
    end

    def new_if(expr, stmt, tail)
      line = expr.line
      res = s(:if, expr, stmt, tail)
      res.line = line
      res.end_line = @line_number
      res
    end

    def new_call(recv, meth, args = nil)
      call = s(:call, recv, meth)
      args = s(:arglist) unless args
      args[0] = :arglist if args[0] == :array
      call << args

      if recv
        call.line = recv.line
      elsif args[1]
        call.line = args[1].line
      end

      # fix arglist spilling over into next line if no args
      if args.length == 1
        args.line = call.line
      else
        args.line = args[1].line
      end

      call
    end

    def add_block_pass(arglist, block)
      arglist << block if block
      arglist
    end

    def new_op_asgn(lhs, asgn, rhs)
      res = if asgn == :"||"
        s(:op_asgn_or, new_gettable_from_assignable(lhs), (lhs << rhs))
      else
        # puts lhs.inspect, asgn.inspect, rhs.inspect
        lhs << new_call(new_gettable_from_assignable(lhs), asgn, s(:arglist, rhs))
        # raise "asgn is: #{asgn.inspect}"
        lhs
      end

      res.line = lhs.line
      res
    end
  end
end

