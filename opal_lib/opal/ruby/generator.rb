module Opal
  class RubyParser < Racc::Parser
    class Generator

      INDENT = '  '

      LEVEL_TOP         = 0
      LEVEL_TOP_CLOSURE = 1
      LEVEL_LIST        = 2
      LEVEL_EXPR        = 3
      LEVEL_RECV        = 4

      class Scope
        attr_accessor :parent

        attr_reader :temps

        attr_reader :lvars

        attr_reader :ivars

        def initialize(type)
          @parent = nil
          @type = type
          @lvars = []
          @temp_queue = []
          @temp = 'a'
          @temps = []
          @ivars = []
        end

        def new_temp
          return @temp_queue.pop if @temp_queue.last

          name = "__#{@temp}"
          @temps << name
          @temp = @temp.succ
          name
        end

        def queue_temp(tmp)
          @temp_queue << tmp
        end

        def add_ivar(ivar)
          @ivars << ivar unless @ivars.include? ivar
        end

        def lvar_defined?(lvar)
          @lvars.include? lvar
        end

        def lvar_add(lvar)
          @lvars << lvar
        end
      end

      def self.process(sexp)
        self.new.process_top sexp
      end

      def initialize
        @scope = nil
        @line = 1
        @indent = ''
      end

      def process(sexp, level)
        type = sexp.shift
        mid = "process_#{type}"
        raise "Unsupported sexp: #{type}" unless respond_to? mid

        line = fix_line sexp.line
        code = __send__ mid, sexp, level

        line + code
      end

      def s(*p)
        Opal::RubyParser::Sexp.new *p
      end

      def scope(type = nil)
        top = @scope
        scope = Scope.new type
        scope.parent = top
        @scope = scope
        yield scope
        @scope = top
      end

      def fix_line(line)
        res = ""
        if @line < line
          res = "\n" * (line - @line)
          res += @indent
          @line = line
        end
        res
      end

      def expression?(sexp)
        ![:if, :xstr].include?(sexp[0])
      end

      def returns(sexp)
        unless sexp
          s = returns s(:nil)
          s
        end

        case sexp[0]
        when :scope
          sexp
        when :block
          if sexp.length > 1
            sexp[-1] = returns sexp[-1]
          else
            sexp << returns(s(:nil))
          end
          sexp
        else
          res = s(:js_return, sexp)
          res.line = sexp.line
          res
        end
      end

      def indent
        indent = @indent
        @indent += INDENT
        res = yield
        @indent = indent
        res
      end

      def process_top(sexp)
        code = nil
        top = s(:scope, sexp)
        scope do
          code = process top, LEVEL_TOP
        end
        code
      end

      def process_scope(sexp, level)
        stmt = returns sexp.shift
        code = process stmt, LEVEL_TOP
        vars = []
        pre = ''

        vars.push *@scope.temps

        # lvars need to be set to nil incase they are not initially set
        # by logic routes
        vars.push *@scope.lvars.map { |l|
          "#{l} = nil"
        }

        pre += @scope.ivars.map { |i|
          "if (self['#{i}'] == undefined) { self['#{i}'] = nil; }"
        }.join ''

        pre += "var #{vars.join ', '};" unless vars.empty?

        pre + code
      end

      def process_block(sexp, level)
        result = []
        parts = sexp
        parts << s(:nil) if parts.empty?

        until sexp.empty?
          stmt = sexp.shift
          exp = expression?(stmt) and level < LEVEL_LIST
          result << process(stmt, level)
          result << ';' if exp
        end

        result.join ''
      end

      def process_lit(sexp, level)
        lit = sexp.shift
        case lit
        when Numeric
          level == LEVEL_RECV ? "(#{lit.inspect})" : lit.inspect
        when Symbol
          "$symbol('#{lit}')"
        else
          raise "Bad lit type #{lit}"
        end
      end

      def process_true(sexp, level)
        "Qtrue"
      end

      def process_false(sexp, level)
        "Qfalse"
      end

      def process_self(sexp, level)
        "self"
      end

      def process_nil(sexp, level)
        "nil"
      end

      def process_ivar(sexp, level)
        ivar = sexp.shift
        @scope.add_ivar ivar
        "self['#{ivar}']"
      end

      def process_iasgn(sexp, level)
        ivar = sexp.shift
        "self['#{ivar}'] = #{process sexp.shift, LEVEL_EXPR}"
      end

      def process_op_asgn_or(sexp, level)
        tmp = @scope.new_temp
        res = "((#{tmp} = #{process sexp.shift, LEVEL_LIST}).$r ? #{tmp}"
        res += " : #{process sexp.shift, LEVEL_LIST})"
        @scope.queue_temp tmp
        res
      end

      def process_op_asgn_2(sexp, level)
        recv = sexp.shift
        set = sexp.shift.to_s
        get = set[0..-2]
        asgn = sexp.shift
        arg = sexp.shift
        tmp = @scope.new_temp
        tmp2 = @scope.new_temp

        case asgn
        when :"||"
          res = "((#{tmp2} = (#{tmp} = #{process recv, LEVEL_EXPR})['m$#{get}']()).$r ? "
          res += "#{tmp2} : #{tmp}['m$#{set}'](#{process arg, LEVEL_EXPR}))"
          res
        else
          res = "((#{tmp} = #{process recv, LEVEL_EXPR})['m$#{set}']("
          res += "#{tmp}['m$#{get}']()['m$#{asgn}'](#{process arg, LEVEL_EXPR})))"
          res
        end
      end

      def process_and(sexp, level)
        tmp = @scope.new_temp
        res = "((#{tmp} = #{process sexp.shift, LEVEL_LIST}).$r ? "
        res += "#{process sexp.shift, LEVEL_LIST} : #{tmp})"
        @scope.queue_temp tmp
        res
      end

      def process_or(sexp, level)
        tmp = @scope.new_temp
        res = "((#{tmp} = #{process sexp.shift, LEVEL_LIST}).$r ? #{tmp}"
        res += " : #{process sexp.shift, LEVEL_LIST})"
        @scope.queue_temp tmp
        res
      end

      def process_not(sexp, level)
        res = "((#{process sexp.shift, LEVEL_LIST}).$r ? Qfalse : Qtrue)"
        res
      end

      def process_class(sexp, level)
        cls = sexp.shift
        sup = sexp.shift
        stmt = nil

        if Symbol === cls
          base = "self"
          name = cls.to_s
        elsif cls[0] == :colon2
          base = process(cls[1], LEVEL_EXPR)
          # puts cls[2].inspect
          name = cls[2].to_s
        elsif cls[0] == :colon3
          base = "$runtime.Object"
          name = cls[1].to_s
        end

        sup = sup ? process(sup, LEVEL_EXPR) : "nil"

        scope do
          stmt = indent { process sexp.shift, LEVEL_TOP }
        end

        "$class(#{base}, #{sup}, '#{name}', function() { var self = this; #{stmt} #{fix_line sexp.end_line}}, 0)"

      end

      def process_defn(sexp, level)
        mid = sexp.shift
        args = sexp.first

        # if last args is a s(:exp) then it contains opt arg assigns etc
        if args.last.is_a? Array
          opt_asgns = args.pop
        end

        # also need to check if last arg is splat op so we can use it
        if args.last.to_s[0] == '*'
          puts "splat!"
          splat = args[-1].to_s[1..-1].intern
          args[-1] = splat
          args_len = args.length - 2
        end

        args = process sexp.shift, LEVEL_EXPR
        stmt = ""
        indent = @indent
        @indent += INDENT
        scope do
          stmts = sexp.shift
          if opt_asgns
            stmts[1].insert(1, *opt_asgns[1..-1].map { |a| s(:js_opt_asgn, a[1], a[2]) })
          end
          if splat
            stmts[1].insert(1, s(:js_tmp, "#{splat} = [].slice.call(arguments, #{args_len});"))
          end
          puts stmts.inspect
          stmt += process(stmts, LEVEL_TOP)
        end
        @indent = indent

        "$def(self, '#{mid}', function(#{args}) { #{stmt} #{fix_line sexp.end_line}}, 0)"
      end

      def process_js_tmp(sexp, level)
        sexp.shift
      end

      def process_js_opt_asgn(sexp, level)
        id = sexp.shift
        rhs = sexp.shift
        "if (#{id} == undefined) { id = #{process rhs, LEVEL_TOP};}"
      end

      def process_args(sexp, level)
        args = []

        until sexp.empty?
          arg = sexp.shift

          args << arg

        end

        args.join ', '
      end

      def process_const(sexp, level)
        "$cg(self, '#{sexp.shift}')"
      end

      def process_colon2(sexp, level)
        "$cg(#{process sexp.shift, LEVEL_EXPR}, '#{sexp.shift}')"
      end

      def process_colon3(sexp, level)
        "$cg($runtime.Object, '#{sexp.shift}')"
      end

      def process_ternary(sexp, level)
        code = "#{process sexp.shift, LEVEL_EXPR} ? #{process sexp.shift, LEVEL_EXPR} : #{process sexp.shift, LEVEL_EXPR}"
        level == LEVEL_RECV ? "(#{code})" : code
      end

      def process_lasgn(sexp, level)
        lvar = sexp.shift
        @scope.lvar_add lvar unless @scope.lvar_defined? lvar
        "#{lvar} = #{process sexp.shift, LEVEL_EXPR}"
      end

      def process_lvar(sexp, level)
        sexp.shift.to_s
      end

      def process_js_return(sexp, level)
        "return #{process sexp.shift, LEVEL_EXPR}"
      end

      def process_dot2(sexp, level)
        level = LEVEL_EXPR
        "$range(#{process sexp.shift, level}, #{process sexp.shift, level}, false)"
      end

      def process_dot3(sexp, level)
        level = LEVEL_EXPR
        "$range(#{process sexp.shift, level}, #{process sexp.shift, level}, true)"
      end

      def process_hash(sexp, level)
        parts = []

        until sexp.empty?
          parts << process(sexp.shift, LEVEL_EXPR)
        end

        "$hash(#{ parts.join ', ' }#{fix_line sexp.end_line})"
      end

      def process_if(sexp, level)
        stmt_level = LEVEL_TOP
        if level >= LEVEL_EXPR
          stmt_level = LEVEL_TOP_CLOSURE
        end
        expr = process sexp.shift, LEVEL_RECV
        res = ''
        body = indent { process sexp.shift, stmt_level }
        tail = sexp.first ? indent { process sexp.shift, stmt_level } : nil

        res += "if (#{expr}.$r) {"
        res += body
        res += "} else {#{tail}" if tail
        res += fix_line sexp.end_line
        res += "}"

        level == LEVEL_EXPR ? "(function() {#{res}})()" : res
      end

      def mid_to_jsid(id)
        return "['m$#{id}']" if /[\!\=\?\+\-\*\/\^\&\%\@\|\[\]\<\>\~]/ =~ id

        # default we just do .method_name
        '.m$' + id
      end

      def process_call(sexp, level)
        base = sexp.shift
        mid = sexp.shift.to_s
        arglist = sexp.shift
        iter = sexp.shift
        tmp_recv = nil
        block_pass = nil

        if base.nil? or base[0] == :self
          recv = "self"
          recv_exp = s(:js_tmp, "self")
        else
          recv = process base, LEVEL_RECV
          recv_exp = s(:js_tmp, "#{tmp_recv}")
          recv_exp.line = sexp.line
        end

        args = process arglist, LEVEL_EXPR
        mid = mid_to_jsid mid

        if block_pass
        else
          # detect any splats...
          if args[0] == '[' || args[0] == '('
            code = "#{recv}#{mid}.apply(recv, #{args})"
          else
            code = "#{recv}#{mid}(#{args})"
          end
        end

        code
      end

    # Call args..
    #
    # FIXME ughhhhh, clean this up
    def process_arglist(exp, *)
      code = ""
      working = []

      until exp.empty?
        arg = exp.shift

        if arg[0] == :splat
          if working.empty?
            if code.empty?
              code += process arg, LEVEL_EXPR
            else
              code += ".concat(#{process arg, LEVEL_EXPR})"
            end
          else
            if code.empty?
              code += "[#{working.join ', '}]"
            else
              code += ".concat([#{working.join ', '}])"
            end
            code += ".concat(#{process arg, LEVEL_EXPR})"
          end

          working = []
        else
          working.push process arg, LEVEL_EXPR
        end
      end

      unless working.empty?
        if code.empty?
          code += "#{working.join ', '}"
        else
          code += ".concat([#{working.join ', '}])"
        end
      end

      code
    end

    def process_splat(sexp, level)
      tmp = '__a'
      splat = process sexp.shift, LEVEL_EXPR
      "tmp_queue"
      "((#{tmp} = #{splat}).$flags & $runtime.T_ARRAY ? #{tmp} : " +
        "$runtime.sp(#{tmp}))"
    end

# FIXME: requires cleanup.. this isnt exactly easy to follow...
    def process_array(exp, *)
      return "[]" if exp.length == 1

      code = ""
      working = []

      exp[1..-1].each do |part|
        if part[0] == :splat
          if working.empty?
            if code.empty?
              code += process part, LEVEL_EXPR
            else
              code += ".concat(#{process part, LEVEL_EXPR})"
            end
          else
            if code.empty?
              code += "[#{working.join ', '}]"
            else
              code += ".concat([#{working.join ', '}])"
            end
            code += ".concat(#{process part, LEVEL_EXPR})"
          end

          working = []
        else
          working.push process part, LEVEL_EXPR
        end
      end

      unless working.empty?
        if code.empty?
          code += "[#{working.join ', '}]"
        else
          code += ".concat([#{working.join ', '}])"
        end
      end

      code
    end

    end # Generator
  end
end

