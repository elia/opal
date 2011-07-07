/*!
 * opal v0.3.5
 * http://opalscript.org
 *
 * Copyright 2011, Adam Beynon
 * Released under the MIT license
 */
opal.register('opal/ruby/nodes.rb', function($rb, self, __FILE__) { function $$(){return $class(self, nil, 'Opal', function(self) { 
  return $class(self, $cg($cg(self, 'Racc'), 'Parser'), 'RubyParser', function(self) {


    $rb.cs(self, 'INDENT', '  ');

    $rb.cs(self, 'LEVEL_TOP', 0);
    $rb.cs(self, 'LEVEL_TOP_CLOSURE', 1);
    $rb.cs(self, 'LEVEL_LIST', 2);
    $rb.cs(self, 'LEVEL_EXPR', 3);


    $class(self, nil, 'BaseNode', function(self) { var __a;

      self.$m.$attr_reader(self, $symbol_1);


      $defn(self, 'generate', function(self, opts, level) {
        return '';
      }, 2);





      $defn(self, 'returns', function(self) {var __a;
        return (__a = $cg(self, 'FuncReturnNode')).$m['new'](__a, self);
      }, 0);



      $defn(self, 'expression?', function(self) {
        return Qtrue;
      }, 0);







      $defn(self, 'process', function(self, opts, level) {var __a, __b;
        if (level.$m['<='](level, $cg(self, 'LEVEL_LIST')).$r) {
          return (__a = self.$m.$fix_line_number(self, opts)).$m['+'](__a, self.$m.$generate(self, opts, level));
        } else {
          return self.$m.$generate(self, opts, level);
        }
      }, 2);






      return $defn(self, 'fix_line_number', function(self, opts, line) {var code, target, __a, current, __b;if (line == undefined) {line = nil;}self['@line']==undefined&&(self['@line']=nil);
        code = '';

        target = ((__a = line).$r ? __a : self['@line']);
        current = (__a = opts.$m['[]'](opts, $symbol_2)).$m.line(__a);

        if (current.$m['<'](current, target).$r) {
          ($B.f = (__a = (target.$m['-'](target, current))).$m.times, ($B.p =function(self) { var __a, __b, __c, __d;
            (__a = opts.$m['[]'](opts, $symbol_2)).$m['line='](__a, (__b = (__c = opts.$m['[]'](opts, $symbol_2)).$m.line(__c)).$m['+'](__b, 1));
            return code = code.$m['+'](code, "\n");
          }).$proc =[self], $B.f)(__a);

          code = code.$m['+'](code, opts.$m['[]'](opts, $symbol_3));
        }

        return code;
      }, -2);
        }, 0);



    $class(self, $cg(self, 'BaseNode'), 'ScopeNode', function(self) { var __a;

      self.$m.$attr_reader(self, $symbol_4);

      self.$m.$attr_reader(self, $symbol_5);

      $defn(self, 'initialize', function(self, parent, statements) {
        self['@parent'] = parent;
        self['@statements'] = statements;

        self['@variables'] = [];

        self['@scope_vars'] = [];

        self['@temp_current'] = 'a';
        self['@temp_queue'] = [];

        self['@ivars'] = [];


        self['@while_scope'] = 0;
        return self['@while_scope_stack'] = [];
      }, 2);

      $defn(self, 'push_while_scope', function(self, while_scope) {var __a;self['@while_scope_stack']==undefined&&(self['@while_scope_stack']=nil);self['@while_scope']==undefined&&(self['@while_scope']=nil);
        (__a = self['@while_scope_stack']).$m['<<'](__a, while_scope);
        return self['@while_scope'] = (__a = self['@while_scope']).$m['+'](__a, 1);
      }, 1);

      $defn(self, 'pop_while_scope', function(self) {var __a;self['@while_scope_stack']==undefined&&(self['@while_scope_stack']=nil);self['@while_scope']==undefined&&(self['@while_scope']=nil);
        (__a = self['@while_scope_stack']).$m.pop(__a);
        return self['@while_scope'] = (__a = self['@while_scope']).$m['-'](__a, 1);
      }, 0);

      $defn(self, 'in_while_scope?', function(self) {var __a;self['@while_scope']==undefined&&(self['@while_scope']=nil);
        return (__a = self['@while_scope']).$m['>'](__a, 0);
      }, 0);

      $defn(self, 'while_scope', function(self) {var __a;self['@while_scope_stack']==undefined&&(self['@while_scope_stack']=nil);
        return (__a = self['@while_scope_stack']).$m.last(__a);
      }, 0);

      $defn(self, 'ensure_ivar', function(self, name) {var __a;self['@ivars']==undefined&&(self['@ivars']=nil);
        if(!((__a = self['@ivars']).$m['include?'](__a, name)).$r) {return (__a = self['@ivars']).$m['<<'](__a, name)} else { return nil; };
      }, 1);

      $defn(self, 'param_variable', function(self, name) {var __a;self['@variables']==undefined&&(self['@variables']=nil);
        return (__a = self['@variables']).$m['<<'](__a, name);
      }, 1);

      $defn(self, 'ensure_variable', function(self, name) {var variable, __a;self['@scope_vars']==undefined&&(self['@scope_vars']=nil);self['@variables']==undefined&&(self['@variables']=nil);
        variable = self.$m.$find_variable(self, name);
        if (variable.$r) {          return variable;}


        (__a = self['@scope_vars']).$m['<<'](__a, name);
        return (__a = self['@variables']).$m['<<'](__a, name);
      }, 1);

      $defn(self, 'find_variable', function(self, name) {var scope, __a, __b, __c;
        scope = self;

        __b = nil; __a = false; while (__a || (scope).$r) {__a = false;
        if ((__b = scope.$m.variables(scope)).$m['include?'](__b, name).$r) {          return name;}

        if (((__b = scope.$m['is_a?'](scope, $cg(self, 'BlockNode'))).$r ? scope.$m.parent(scope) : __b).$r) {
          scope = scope.$m.parent(scope);
        } else {
          __b = nil; break;
        }
        };

        return nil;
      }, 1);

      $defn(self, 'temp_local', function(self) {var __a, name;self['@temp_queue']==undefined&&(self['@temp_queue']=nil);self['@temp_current']==undefined&&(self['@temp_current']=nil);self['@scope_vars']==undefined&&(self['@scope_vars']=nil);
        if ((__a = self['@temp_queue']).$m.last(__a).$r) {          return (__a = self['@temp_queue']).$m.pop(__a);}

        name = (__a = '__').$m['+'](__a, self['@temp_current']);
        (__a = self['@scope_vars']).$m['<<'](__a, name);
        self['@temp_current'] = (__a = self['@temp_current']).$m.succ(__a);
        return name;
      }, 0);

      $defn(self, 'queue_temp', function(self, temp) {var __a;self['@temp_queue']==undefined&&(self['@temp_queue']=nil);
        return (__a = self['@temp_queue']).$m['<<'](__a, temp);
      }, 1);

      $defn(self, 'set_uses_block', function(self) {self['@block_arg_name']==undefined&&(self['@block_arg_name']=nil);
        if (self['@block_arg_name'].$r) {          return self['@block_arg_name'];}

        return self['@block_arg_name'] = '__block__';
      }, 0);

      return $defn(self, 'generate', function(self, opts, level) {var stmts, __a, vars;self['@statements']==undefined&&(self['@statements']=nil);
        stmts = (__a = self['@statements']).$m.generate(__a, opts, level);
        vars = '';

        return vars.$m['+'](vars, stmts);
      }, 2);
        }, 0);




    $class(self, $cg(self, 'ScopeNode'), 'TopScopeNode', function(self) { var __a;


      self.$m.$attr_reader(self, $symbol_6);


      self.$m.$attr_accessor(self, $symbol_1);



      self.$m.$attr_reader(self, $symbol_7);

      $defn(self, 'initialize', function(self, statements) {
        $super(arguments.callee, self, [nil, statements]);
        self['@file_helpers'] = [];
        self['@line'] = 1;
        self['@mm_ids'] = [];

        self['@symbol_refs'] = $hash();
        self['@symbol_count'] = 1;

        return self['@regexp_refs'] = [];
      }, 1);

      $defn(self, 'register_mm_id', function(self, mid) {var __a;self['@mm_ids']==undefined&&(self['@mm_ids']=nil);
        if(!((__a = self['@mm_ids']).$m['include?'](__a, mid)).$r) {return (__a = self['@mm_ids']).$m['<<'](__a, mid)} else { return nil; };
      }, 1);

      $defn(self, 'register_symbol', function(self, sym) {var ref, __a, __b;self['@symbol_refs']==undefined&&(self['@symbol_refs']=nil);self['@symbol_count']==undefined&&(self['@symbol_count']=nil);
        if (ref = (__a = self['@symbol_refs']).$m['[]'](__a, sym).$r) {
          return ref;
        } else {
          ref = (__a = self['@symbol_refs']).$m['[]='](__a, sym, ("$symbol_" + (__b = self['@symbol_count']).$m.to_s(__b)));
          self['@symbol_count'] = (__a = self['@symbol_count']).$m['+'](__a, 1);
          return ref;
        }
      }, 1);

      return $defn(self, 'generate', function(self, opts, level) {var code, __a, __b, pre, post, __c;self['@statements']==undefined&&(self['@statements']=nil);self['@scope_vars']==undefined&&(self['@scope_vars']=nil);self['@symbol_refs']==undefined&&(self['@symbol_refs']=nil);self['@mm_ids']==undefined&&(self['@mm_ids']=nil);self['@ivars']==undefined&&(self['@ivars']=nil);
        self['@opts'] = opts;
        code = [];
        (__a = self['@statements']).$m.returns(__a);

        code.$m['<<'](code, (__b = self['@statements']).$m.generate(__b, opts, level));

        pre = 'function $$(){';
        post = "\n}\n";



        if (!(__a = self['@scope_vars']).$m['empty?'](__a).$r) {
          post = post.$m['+'](post, ("var " + (__b = (__c = self['@scope_vars']).$m.join(__c, ', ')).$m.to_s(__b) + ";"));
        }

        post = post.$m['+'](post, 'var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, ');
        post = post.$m['+'](post, '$class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, ');
        post = post.$m['+'](post, '$hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, ');
        post = post.$m['+'](post, '$cg = $rb.cg, $range = $rb.G');


        ($B.f = (__a = self['@symbol_refs']).$m.each, ($B.p =function(self, val, sym) { var __a, __b;if (val === undefined) { val = nil; }if (sym === undefined) { sym = nil; }
          return post = post.$m['+'](post, (", " + (__b = sym).$m.to_s(__b) + " = $symbol('" + (__b = val).$m.to_s(__b) + "')"));
        }).$proc =[self], $B.f)(__a);

        post = post.$m['+'](post, ';');

        if ((__a = (__b = self['@mm_ids']).$m.length(__b)).$m['>'](__a, 0).$r) {
          post = post.$m['+'](post, ("$rb.mm(['" + (__b = (__c = self['@mm_ids']).$m.join(__c, "', '")).$m.to_s(__b) + "']);"));
        }


        ($B.f = (__a = self['@ivars']).$m.each, ($B.p =function(self, ivar) { var __a, __b;if (ivar === undefined) { ivar = nil; }
          return post = post.$m['+'](post, ("if (self['" + (__b = ivar).$m.to_s(__b) + "'] == undefined) { self['" + (__b = ivar).$m.to_s(__b) + "'] = nil; }"));
        }).$proc =[self], $B.f)(__a);

        post = post.$m['+'](post, "return $$();\n");

        return (__a = pre.$m['+'](pre, code.$m.join(code, ''))).$m['+'](__a, post);
      }, 2);
        }, 0);


    $class(self, $cg(self, 'BaseNode'), 'StatementsNode', function(self) { var __a;

      self.$m.$attr_reader(self, $symbol_8);

      $defn(self, 'initialize', function(self, nodes) {if (nodes == undefined) {nodes = [];}
        self['@line'] = 0;
        return self['@nodes'] = nodes;
      }, -1);

      $defn(self, 'returns', function(self) {var __a, __b, __c;self['@nodes']==undefined&&(self['@nodes']=nil);
        if ((__a = (__b = self['@nodes']).$m.length(__b)).$m['>'](__a, 0).$r) {
          return (__a = self['@nodes']).$m['[]='](__a, -1, (__b = (__c = self['@nodes']).$m['[]'](__c, -1)).$m.returns(__b));
        } else {
          return (__a = self['@nodes']).$m['<<'](__a, (__b = $cg(self, 'FuncReturnNode')).$m['new'](__b, (__c = $cg(self, 'NilNode')).$m['new'](__c)));
        }
      }, 0);

      $defn(self, 'generate', function(self, opts, level) {var code, __a, __b;self['@nodes']==undefined&&(self['@nodes']=nil);
        code = [];

        if ((__a = self['@nodes']).$m['empty?'](__a).$r) {          return (__a = (__b = $cg(self, 'NilNode')).$m['new'](__b)).$m.generate(__a, opts, level);}

        ($B.f = (__a = self['@nodes']).$m.each, ($B.p =function(self, node) { var node_code, __a, __b, __c;if (node === undefined) { node = nil; }
          node_code = node.$m.process(node, opts, level);

          if (level.$m['<='](level, $cg(self, 'LEVEL_TOP_CLOSURE')).$r) {



            if ((__a = node_code.$m['[]'](node_code, 0)).$m['=='](__a, "\n").$r) {
              code.$m['<<'](code, node_code);
            } else {
              code.$m['<<'](code, ((__b = opts.$m['[]'](opts, $symbol_3)).$m['+'](__b, node_code)));
            }






            if (node.$m['expression?'](node).$r) {              return code.$m['<<'](code, ';');}

          } else {
            return code.$m['<<'](code, node_code);
          }
        }).$proc =[self], $B.f)(__a);

        return code.$m.join(code, '');
      }, 2);


      $defn(self, '<<', function(self, node) {var __a;self['@nodes']==undefined&&(self['@nodes']=nil);
        (__a = self['@nodes']).$m['<<'](__a, node);
        return self;
      }, 1);


      return $defn(self, 'generate_top', function(self, opts) {var scope, __a;if (opts == undefined) {opts = $hash();}
        scope = (__a = $cg(self, 'TopScopeNode')).$m['new'](__a, self);
        opts.$m['[]='](opts, $symbol_9, scope);
        opts.$m['[]='](opts, $symbol_3, '');
        opts.$m['[]='](opts, $symbol_2, scope);
        return scope.$m.generate(scope, opts, $cg(self, 'LEVEL_TOP'));
      }, -1);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'NumericNode', function(self) { var __a;

      self.$m.$attr_accessor(self, $symbol_10);

      $defn(self, 'initialize', function(self, val) {var __a;
        self['@line'] = val.$m['[]'](val, $symbol_1);
        return self['@value'] = val.$m['[]'](val, $symbol_10);
      }, 1);

      return $defn(self, 'generate', function(self, opts, level) {var __a;self['@value']==undefined&&(self['@value']=nil);
        return (__a = self['@value']).$m.to_s(__a);
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'SymbolNode', function(self) {

      $defn(self, 'initialize', function(self, val) {var __a;
        self['@line'] = val.$m['[]'](val, $symbol_1);
        return self['@value'] = val.$m['[]'](val, $symbol_10);
      }, 1);

      return $defn(self, 'generate', function(self, opts, level) {var __a, __b;self['@value']==undefined&&(self['@value']=nil);
        return (__a = opts.$m['[]'](opts, $symbol_2)).$m.register_symbol(__a, self['@value']);
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'CallNode', function(self) { var __a;


      self.$m.$attr_writer(self, $symbol_11);

      self.$m.$attr_reader(self, $symbol_12);

      self.$m.$attr_reader(self, $symbol_13);

      $defn(self, 'initialize', function(self, recv, mid, args) {var __a;
        self['@recv'] = recv;
        self['@mid'] = mid.$m['[]'](mid, $symbol_10);
        self['@args'] = args;
        return self['@line'] = (recv.$r ? recv.$m.line(recv) : mid.$m['[]'](mid, $symbol_1));
      }, 3);

      $defn(self, 'mid_to_jsid', function(self, id) {var __a, __b;
        if ((__a = /[\!\=\?\+\-\*\/\^\&\%\@\|\[\]\<\>\~]/).$m['=~'](__a, id).$r) {          return (".$m['" + (__a = id).$m.to_s(__a) + "']");}

        if ((__a = self.$m.$js_reserved_words(self)).$m['include?'](__a, id).$r) {          return (".$m['" + (__a = id).$m.to_s(__a) + "']");}


        return (__a = '.$m.').$m['+'](__a, id);
      }, 1);



      $defn(self, 'js_reserved_words', function(self) {
        return ["break", "case", "catch", "continue", "debugger", "default", "delete", "do", "else", "finally", "for", "function", "if", "in", "instanceof", "new", "return", "switch", "this", "throw", "try", "typeof", "var", "void", "while", "with", "class", "enum", "export", "extends", "import", "super"];
      }, 0);

      return $defn(self, 'generate', function(self, opts, level) {var __a, __b, __c, code, arg_res, recv, mid, tmp_recv, recv_code, recv_arg, args, __d, block, splat, splat_args, splat_recv, result;self['@recv']==undefined&&(self['@recv']=nil);self['@mid']==undefined&&(self['@mid']=nil);self['@args']==undefined&&(self['@args']=nil);self['@block']==undefined&&(self['@block']=nil);

        if (((__a = (__b = self['@recv']).$m['is_a?'](__b, $cg(self, 'NumericNode'))).$r ? (__b = self['@mid']).$m['=='](__b, '-@') : __a).$r) {
          (__a = self['@recv']).$m['value='](__a, ("-" + (__b = (__c = self['@recv']).$m.value(__c)).$m.to_s(__b)));
          return (__a = self['@recv']).$m.generate(__a, opts, level);

        } else if ((__a = self['@mid']).$m['=='](__a, "block_given?").$r) {

          return "($yy == $y.y ? Qfalse : Qtrue)";
        }

        code = '';
        arg_res = [];
        recv = nil;
        mid = self['@mid'];
        tmp_recv = (__a = opts.$m['[]'](opts, $symbol_9)).$m.temp_local(__a);

        (__a = opts.$m['[]'](opts, $symbol_2)).$m.register_mm_id(__a, self['@mid']);


        if ((__a = self['@recv']).$m['is_a?'](__a, $cg(self, 'NumericNode')).$r) {
          recv = ("(" + (__a = (__b = self['@recv']).$m.process(__b, opts, $cg(self, 'LEVEL_EXPR'))).$m.to_s(__a) + ")");
        } else if (self['@recv'].$r) {
          recv = (__a = self['@recv']).$m.process(__a, opts, $cg(self, 'LEVEL_EXPR'));
        } else {
          self['@recv'] = (__a = $cg(self, 'SelfNode')).$m['new'](__a);
          recv = "self";
          mid = (__a = '$').$m['+'](__a, mid);
        }

        mid = self.$m.$mid_to_jsid(self, mid);

        if ((__a = self['@recv']).$m['is_a?'](__a, $cg(self, 'SelfNode')).$r) {
          recv_code = recv;
          recv_arg = recv;
        } else if (((__a = (__b = self['@recv']).$m['is_a?'](__b, $cg(self, 'IdentifierNode'))).$r ? (__b = self['@recv']).$m['local_variable?'](__b, opts) : __a).$r) {
          recv_code = recv;
          recv_arg = recv;
        } else {
          recv_code = ("(" + (__a = tmp_recv).$m.to_s(__a) + " = " + (__a = recv).$m.to_s(__a) + ")");
          recv_arg = (__a = tmp_recv).$m.to_s(__a);
        }


        args = self['@args'];

        if (args.$m['[]'](args, 0).$r) {
          ($B.f = (__a = args.$m['[]'](args, 0)).$m.each, ($B.p =function(self, arg) { var __a, __b;if (arg === undefined) { arg = nil; }
            return arg_res.$m['<<'](arg_res, arg.$m.generate(arg, opts, $cg(self, 'LEVEL_EXPR')));
          }).$proc =[self], $B.f)(__a);
        }


        if (args.$m['[]'](args, 2).$r) {
          arg_res.$m['<<'](arg_res, (__b = (__c = $cg(self, 'HashNode')).$m['new'](__c, args.$m['[]'](args, 2), $hash($symbol_1, 0), $hash($symbol_1, 0))).$m.generate(__b, opts, $cg(self, 'LEVEL_EXPR')));
        }

        if (self['@block'].$r) {
          block = (__a = self['@block']).$m.generate(__a, opts, $cg(self, 'LEVEL_TOP'));
          arg_res.$m.unshift(arg_res, recv_arg);

          code = ("($B.f = " + (__a = recv_code).$m.to_s(__a) + (__a = mid).$m.to_s(__a) + ", ($B.p =");
          code = code.$m['+'](code, ((__b = block).$m.to_s(__b) + ").$proc =[self], $B.f)(" + (__b = arg_res.$m.join(arg_res, ', ')).$m.to_s(__b) + ")"));

          (__a = opts.$m['[]'](opts, $symbol_9)).$m.queue_temp(__a, tmp_recv);
          return code;





        } else if (args.$m['[]'](args, 3).$r) {
          arg_res.$m.unshift(arg_res, recv_arg);

          code = ("($B.p = " + (__a = (__b = args.$m['[]'](args, 3)).$m.process(__b, opts, $cg(self, 'LEVEL_LIST'))).$m.to_s(__a) + ", ");
          code = code.$m['+'](code, ("$B.f = " + (__b = recv_code).$m.to_s(__b) + (__b = mid).$m.to_s(__b) + ")(" + (__b = arg_res.$m.join(arg_res, ', ')).$m.to_s(__b) + ")"));

          (__a = opts.$m['[]'](opts, $symbol_9)).$m.queue_temp(__a, tmp_recv);

          return code;


        } else {

          if (args.$m['[]'](args, 1).$r) {
            arg_res.$m.unshift(arg_res, recv_arg);
            splat = (__a = args.$m['[]'](args, 1)).$m.generate(__a, opts, $cg(self, 'LEVEL_EXPR'));
            splat_args = (arg_res.$m['empty?'](arg_res).$r ? (__a = splat).$m.to_s(__a) : ("[" + (__a = arg_res.$m.join(arg_res, ', ')).$m.to_s(__a) + "].concat(" + (__a = splat).$m.to_s(__a) + ")"));


            splat_recv = recv;
            result = (__a = (__b = (__c = recv_code).$m.to_s(__c)).$m['+'](__b, mid)).$m['+'](__a, (".apply(nil, " + (__b = splat_args).$m.to_s(__b) + ")"));

            (__a = opts.$m['[]'](opts, $symbol_9)).$m.queue_temp(__a, tmp_recv);
            return result;
          } else {
            arg_res.$m.unshift(arg_res, recv_arg);

            result = ((__a = recv_code).$m.to_s(__a) + (__a = mid).$m.to_s(__a) + "(" + (__a = arg_res.$m.join(arg_res, ', ')).$m.to_s(__a) + ")");
            (__a = opts.$m['[]'](opts, $symbol_9)).$m.queue_temp(__a, tmp_recv);
            return result;
          }
        }
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'SelfNode', function(self) {


      $defn(self, 'initialize', function(self, val) {var __a;if (val == undefined) {val = $hash($symbol_1, 0);}
        return self['@line'] = val.$m['[]'](val, $symbol_1);
      }, -1);

      return $defn(self, 'generate', function(self, opts, level) {
        return 'self';
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'NilNode', function(self) {

      $defn(self, 'initialize', function(self, val) {var __a;if (val == undefined) {val = $hash($symbol_1, 0);}
        return self['@line'] = val.$m['[]'](val, $symbol_1);
      }, -1);

      return $defn(self, 'generate', function(self, opts, level) {
        return 'nil';
      }, 2);
        }, 0);

    $class(self, $cg(self, 'ScopeNode'), 'ModuleNode', function(self) {

      $defn(self, 'initialize', function(self, mod, path, body, _end) {var __a, __b;
        $super(arguments.callee, self, [nil, body]);
        self['@line'] = mod.$m['[]'](mod, $symbol_1);
        self['@base'] = path.$m['[]'](path, 0);
        self['@class_name'] = (__a = path.$m['[]'](path, 1)).$m['[]'](__a, $symbol_10);
        return self['@end_line'] = _end.$m['[]'](_end, $symbol_1);
      }, 4);

      return $defn(self, 'generate', function(self, opts, level) {var code, __a, __b, __c, __d, scope, stmt;self['@base']==undefined&&(self['@base']=nil);self['@class_name']==undefined&&(self['@class_name']=nil);self['@statements']==undefined&&(self['@statements']=nil);self['@scope_vars']==undefined&&(self['@scope_vars']=nil);self['@end_line']==undefined&&(self['@end_line']=nil);
        code = '$class(';


        if ((__a = self['@base']).$m['nil?'](__a).$r) {
          code = code.$m['+'](code, (__b = (__c = $cg(self, 'SelfNode')).$m['new'](__c)).$m.generate(__b, opts, level));
        } else {
          code = code.$m['+'](code, (__b = self['@base']).$m.generate(__b, opts, level));
        }

        code = code.$m['+'](code, ', ');


        code = code.$m['+'](code, ((__b = (__c = (__d = $cg(self, 'NilNode')).$m['new'](__d)).$m.generate(__c, opts, level)).$m['+'](__b, ', ')));


        code = code.$m['+'](code, ("'" + (__b = self['@class_name']).$m.to_s(__b) + "', "));


        scope = $hash($symbol_3, (__a = opts.$m['[]'](opts, $symbol_3)).$m['+'](__a, $cg(self, 'INDENT')), $symbol_2, opts.$m['[]'](opts, $symbol_2), $symbol_9, self);
        (__a = self['@statements']).$m.returns(__a);
        stmt = (__a = self['@statements']).$m.generate(__a, scope, $cg(self, 'LEVEL_TOP'));

        if ((__a = self['@scope_vars']).$m['empty?'](__a).$r) {
          code = code.$m['+'](code, ((__b = 'function(self) { ').$m['+'](__b, stmt)));
        } else {
          code = code.$m['+'](code, ("function(self) {var " + (__b = (__c = self['@scope_vars']).$m.join(__c, ', ')).$m.to_s(__b) + ";" + (__b = stmt).$m.to_s(__b)));
        }


        code = code.$m['+'](code, self.$m.$fix_line_number(self, opts, self['@end_line']));
        code = code.$m['+'](code, '}, 2)');

        return code;
      }, 2);
        }, 0);

    $class(self, $cg(self, 'ScopeNode'), 'ClassNode', function(self) {

      $defn(self, 'initialize', function(self, cls, path, sup, body, _end) {var __a;
        $super(arguments.callee, self, [nil, body]);
        self['@line'] = cls.$m['[]'](cls, $symbol_1);
        self['@base'] = path.$m['[]'](path, 0);
        self['@cls_name'] = path.$m['[]'](path, 1);
        self['@super'] = sup;
        return self['@end_line'] = _end.$m['[]'](_end, $symbol_1);
      }, 5);

      return $defn(self, 'generate', function(self, opts, level) {var code, __a, __b, __c, scope, stmt;self['@base']==undefined&&(self['@base']=nil);self['@super']==undefined&&(self['@super']=nil);self['@cls_name']==undefined&&(self['@cls_name']=nil);self['@statements']==undefined&&(self['@statements']=nil);self['@scope_vars']==undefined&&(self['@scope_vars']=nil);self['@end_line']==undefined&&(self['@end_line']=nil);
        code = '$class(';


        code = code.$m['+'](code, (((__b = self['@base']).$m['nil?'](__b).$r ? (__b = (__c = $cg(self, 'SelfNode')).$m['new'](__c)).$m.generate(__b, opts, level) : (__b = self['@base']).$m.generate(__b, opts, level))));
        code = code.$m['+'](code, ', ');


        code = code.$m['+'](code, ((self['@super'].$r ? (__b = self['@super']).$m.generate(__b, opts, level) : (__b = (__c = $cg(self, 'NilNode')).$m['new'](__c)).$m.generate(__b, opts, level))));
        code = code.$m['+'](code, ', ');


        code = code.$m['+'](code, ("'" + (__b = (__c = self['@cls_name']).$m['[]'](__c, $symbol_10)).$m.to_s(__b) + "', "));


        scope = $hash($symbol_3, (__a = opts.$m['[]'](opts, $symbol_3)).$m['+'](__a, $cg(self, 'INDENT')), $symbol_2, opts.$m['[]'](opts, $symbol_2), $symbol_9, self);
        (__a = self['@statements']).$m.returns(__a);
        stmt = (__a = self['@statements']).$m.generate(__a, scope, level);

        if ((__a = self['@scope_vars']).$m['empty?'](__a).$r) {
          code = code.$m['+'](code, ("function(self) {" + (__b = stmt).$m.to_s(__b)));
        } else {
          code = code.$m['+'](code, ("function(self) { var " + (__b = (__c = self['@scope_vars']).$m.join(__c, ', ')).$m.to_s(__b) + ";" + (__b = stmt).$m.to_s(__b)));
        }


        code = code.$m['+'](code, self.$m.$fix_line_number(self, opts, self['@end_line']));

        code = code.$m['+'](code, (__b = opts.$m['[]'](opts, $symbol_3)).$m['+'](__b, '}, 0)'));
        return code;
      }, 2);
        }, 0);

    $class(self, $cg(self, 'ScopeNode'), 'ClassShiftNode', function(self) {

      $defn(self, 'initialize', function(self, cls, expr, body, endn) {var __a;
        $super(arguments.callee, self, [nil, body]);
        self['@line'] = cls.$m['[]'](cls, $symbol_1);
        self['@expr'] = expr;
        return self['@end_line'] = endn.$m['[]'](endn, $symbol_1);
      }, 4);

      return $defn(self, 'generate', function(self, opts, level) {var code, __a, __b, scope, stmt, __c;self['@expr']==undefined&&(self['@expr']=nil);self['@statements']==undefined&&(self['@statements']=nil);self['@scope_vars']==undefined&&(self['@scope_vars']=nil);self['@end_line']==undefined&&(self['@end_line']=nil);
        code = '$class(';


        code = code.$m['+'](code, (__b = self['@expr']).$m.generate(__b, opts, level));
        code = code.$m['+'](code, ', nil, nil, ');


        scope = $hash($symbol_3, (__a = opts.$m['[]'](opts, $symbol_3)).$m['+'](__a, $cg(self, 'INDENT')), $symbol_2, opts.$m['[]'](opts, $symbol_2), $symbol_9, self);
        (__a = self['@statements']).$m.returns(__a);
        stmt = (__a = self['@statements']).$m.generate(__a, scope, level);

        if ((__a = self['@scope_vars']).$m['empty?'](__a).$r) {
          code = code.$m['+'](code, ("function(self) {" + (__b = stmt).$m.to_s(__b)));
        } else {
          code = code.$m['+'](code, ("function(self) { var " + (__b = (__c = self['@scope_vars']).$m.join(__c, ', ')).$m.to_s(__b) + ";" + (__b = stmt).$m.to_s(__b)));
        }


        code = code.$m['+'](code, self.$m.$fix_line_number(self, opts, self['@end_line']));

        code = code.$m['+'](code, (__b = opts.$m['[]'](opts, $symbol_3)).$m['+'](__b, '}, 1)'));
        return code;
      }, 2);
        }, 0);

    $class(self, $cg(self, 'ScopeNode'), 'DefNode', function(self) {

      $defn(self, 'initialize', function(self, defn, singleton, fname, args, body, endn) {var __a;
        $super(arguments.callee, self, [nil, body]);

        self['@line'] = defn.$m['[]'](defn, $symbol_1);
        self['@singleton'] = singleton;
        self['@fname'] = fname;
        self['@args'] = args;
        self['@body'] = body;
        return self['@end_line'] = endn.$m['[]'](endn, $symbol_1);
      }, 6);

      return $defn(self, 'generate', function(self, opts, level) {var code, __a, __b, __c, method_args, pre_code, scope, args, arity, __d, stmt, block_code;self['@singleton']==undefined&&(self['@singleton']=nil);self['@fname']==undefined&&(self['@fname']=nil);self['@args']==undefined&&(self['@args']=nil);self['@body']==undefined&&(self['@body']=nil);self['@scope_vars']==undefined&&(self['@scope_vars']=nil);self['@ivars']==undefined&&(self['@ivars']=nil);self['@block_arg_name']==undefined&&(self['@block_arg_name']=nil);self['@end_line']==undefined&&(self['@end_line']=nil);
        if (self['@singleton'].$r) {
          code = ("$defs(" + (__a = (__b = self['@singleton']).$m.generate(__b, opts, level)).$m.to_s(__a) + ", ");
        } else {
          code = "$defn(self, ";
        }


        code = code.$m['+'](code, ("'" + (__b = (__c = self['@fname']).$m['[]'](__c, $symbol_10)).$m.to_s(__b) + "', "));


        method_args = [];

        pre_code = '';


        scope = $hash($symbol_3, (__a = opts.$m['[]'](opts, $symbol_3)).$m['+'](__a, $cg(self, 'INDENT')), $symbol_2, opts.$m['[]'](opts, $symbol_2), $symbol_9, self);

        args = self['@args'];


        if (args.$m['[]'](args, 0).$r) {
          ($B.f = (__a = args.$m['[]'](args, 0)).$m.each, ($B.p =function(self, arg) { var __a, __b;if (arg === undefined) { arg = nil; }
            self.$m.$param_variable(self, arg.$m['[]'](arg, $symbol_10));
            return method_args.$m['<<'](method_args, arg.$m['[]'](arg, $symbol_10));
          }).$proc =[self], $B.f)(__a);
        }

        arity = method_args.$m.length(method_args);


        if (args.$m['[]'](args, 1).$r) {
          ($B.f = (__a = args.$m['[]'](args, 1)).$m.each, ($B.p =function(self, arg) { var __a, __b, __c, __d;if (arg === undefined) { arg = nil; }
            self.$m.$param_variable(self, (__b = arg.$m['[]'](arg, 0)).$m['[]'](__b, $symbol_10));
            method_args.$m['<<'](method_args, (__b = arg.$m['[]'](arg, 0)).$m['[]'](__b, $symbol_10));
            return pre_code = pre_code.$m['+'](pre_code, ("if (" + (__b = (__c = arg.$m['[]'](arg, 0)).$m['[]'](__c, $symbol_10)).$m.to_s(__b) + " == undefined) {" + (__b = (__c = arg.$m['[]'](arg, 0)).$m['[]'](__c, $symbol_10)).$m.to_s(__b) + " = " + (__b = (__c = arg.$m['[]'](arg, 1)).$m.generate(__c, opts, $cg(self, 'LEVEL_EXPR'))).$m.to_s(__b) + ";}"));
          }).$proc =[self], $B.f)(__a);
        }


        if (args.$m['[]'](args, 2).$r) {
          if ((__a = (__b = args.$m['[]'](args, 2)).$m['[]'](__b, $symbol_10)).$m['!='](__a, "*").$r) {
            self.$m.$param_variable(self, (__b = args.$m['[]'](args, 2)).$m['[]'](__b, $symbol_10));
            method_args.$m['<<'](method_args, (__b = args.$m['[]'](args, 2)).$m['[]'](__b, $symbol_10));
            pre_code = pre_code.$m['+'](pre_code, ((__b = (__c = args.$m['[]'](args, 2)).$m['[]'](__c, $symbol_10)).$m.to_s(__b) + " = [].slice.call(arguments, " + (__b = method_args.$m.length(method_args)).$m.to_s(__b) + ");"));
          }
        }

        if (((__a = args.$m['[]'](args, 1)).$r ? __a : args.$m['[]'](args, 2)).$r) {          arity = (__a = (arity.$m['-@'](arity))).$m['-'](__a, 1);}


        if (args.$m['[]'](args, 3).$r) {
          self.$m.$param_variable(self, (__b = args.$m['[]'](args, 3)).$m['[]'](__b, $symbol_10));
          self['@block_arg_name'] = (__a = args.$m['[]'](args, 3)).$m['[]'](__a, $symbol_10);
          pre_code = pre_code.$m['+'](pre_code, ("var " + (__b = (__c = args.$m['[]'](args, 3)).$m['[]'](__c, $symbol_10)).$m.to_s(__b) + " = (($yy == $y.y) ? nil: $yy);"));
        }

        (__a = self['@body']).$m.returns(__a);
        stmt = (__a = self['@body']).$m.generate(__a, scope, $cg(self, 'LEVEL_TOP'));
        method_args.$m.unshift(method_args, 'self');

        code = code.$m['+'](code, ("function(" + (__b = method_args.$m.join(method_args, ', ')).$m.to_s(__b) + ") {"));


        if (!(__a = self['@scope_vars']).$m['empty?'](__a).$r) {
          pre_code = (__a = ("var " + (__b = (__c = self['@scope_vars']).$m.join(__c, ', ')).$m.to_s(__b) + ";")).$m['+'](__a, pre_code);
        }


        ($B.f = (__a = self['@ivars']).$m.each, ($B.p =function(self, ivar) { var __a, __b;if (ivar === undefined) { ivar = nil; }
          return pre_code = pre_code.$m['+'](pre_code, ("self['" + (__b = ivar).$m.to_s(__b) + "']==undefined&&(self['" + (__b = ivar).$m.to_s(__b) + "']=nil);"));
        }).$proc =[self], $B.f)(__a);


        if (self['@block_arg_name'].$r) {

          block_code = "var $y = $B, $yy, $ys, $yb = $y.b;";
          block_code = block_code.$m['+'](block_code, "if ($y.f == arguments.callee) { $yy = $y.p; }");
          block_code = block_code.$m['+'](block_code, "else { $yy = $y.y; }");
          block_code = block_code.$m['+'](block_code, "$y.f = nil ;$ys = $yy.$proc[0];");
          pre_code = block_code.$m['+'](block_code, pre_code);
        }

        code = code.$m['+'](code, (pre_code.$m['+'](pre_code, stmt)));


        code = code.$m['+'](code, ((__b = self.$m.$fix_line_number(self, opts, self['@end_line'])).$m['+'](__b, ("}, " + (__c = arity).$m.to_s(__c) + ")"))));

        return code;
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'BodyStatementsNode', function(self) { var __a;

      self.$m.$attr_reader(self, $symbol_14);

      $defn(self, 'initialize', function(self, stmt, optrescue, optelse, optensure) {var __a;
        self['@statements'] = stmt;
        self['@opt_rescue'] = optrescue;
        self['@opt_else'] = optelse;
        self['@opt_ensure'] = optensure;
        return self['@line'] = stmt.$m.line(stmt);
      }, 4);

      $defn(self, 'returns', function(self) {var __a;self['@statements']==undefined&&(self['@statements']=nil);
        return (__a = self['@statements']).$m.returns(__a);
      }, 0);

      return $defn(self, 'generate', function(self, opts, level) {var __a;self['@statements']==undefined&&(self['@statements']=nil);
        return (__a = self['@statements']).$m.generate(__a, opts, level);
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'OrNode', function(self) {

      $defn(self, 'initialize', function(self, node, lhs, rhs) {var __a;
        self['@line'] = node.$m['[]'](node, $symbol_1);
        self['@lhs'] = lhs;
        return self['@rhs'] = rhs;
      }, 3);

      return $defn(self, 'generate', function(self, opts, level) {var res, tmp, __a, __b, __c;self['@lhs']==undefined&&(self['@lhs']=nil);self['@rhs']==undefined&&(self['@rhs']=nil);
        res = '((';
        tmp = (__a = opts.$m['[]'](opts, $symbol_9)).$m.temp_local(__a);
        res = res.$m['+'](res, ((__b = tmp).$m.to_s(__b) + " = " + (__b = (__c = self['@lhs']).$m.generate(__c, opts, $cg(self, 'LEVEL_LIST'))).$m.to_s(__b) + ").$r ? "));
        res = res.$m['+'](res, ((__b = tmp).$m.to_s(__b) + " : " + (__b = (__c = self['@rhs']).$m.generate(__c, opts, $cg(self, 'LEVEL_LIST'))).$m.to_s(__b) + ")"));
        (__a = opts.$m['[]'](opts, $symbol_9)).$m.queue_temp(__a, tmp);
        return res;
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'AndNode', function(self) {

      $defn(self, 'initialize', function(self, node, lhs, rhs) {var __a;
        self['@line'] = node.$m['[]'](node, $symbol_1);
        self['@lhs'] = lhs;
        return self['@rhs'] = rhs;
      }, 3);

      return $defn(self, 'generate', function(self, opts, level) {var res, tmp, __a, __b, __c;self['@lhs']==undefined&&(self['@lhs']=nil);self['@rhs']==undefined&&(self['@rhs']=nil);
        res = '((';
        tmp = (__a = opts.$m['[]'](opts, $symbol_9)).$m.temp_local(__a);
        res = res.$m['+'](res, ((__b = tmp).$m.to_s(__b) + " = " + (__b = (__c = self['@lhs']).$m.generate(__c, opts, $cg(self, 'LEVEL_LIST'))).$m.to_s(__b) + ").$r ? "));
        res = res.$m['+'](res, ((__b = (__c = self['@rhs']).$m.generate(__c, opts, $cg(self, 'LEVEL_LIST'))).$m.to_s(__b) + " : " + (__b = tmp).$m.to_s(__b) + ")"));
        (__a = opts.$m['[]'](opts, $symbol_9)).$m.queue_temp(__a, tmp);
        return res;
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'ArrayNode', function(self) {

      $defn(self, 'initialize', function(self, parts, begn, endn) {var __a, __b;
        self['@line'] = ((__a = begn.$m['[]'](begn, $symbol_1)).$r ? __a : 0);
        self['@end_line'] = ((__a = endn.$m['[]'](endn, $symbol_1)).$r ? __a : 0);
        return self['@args'] = parts;
      }, 3);



      return $defn(self, 'generate', function(self, opts, level) {var parts, __a, __b, code, res, __c;self['@args']==undefined&&(self['@args']=nil);self['@end_line']==undefined&&(self['@end_line']=nil);
        parts = ($B.f = (__a = (__b = self['@args']).$m['[]'](__b, 0)).$m.map, ($B.p =function(self, arg) { var __a;if (arg === undefined) { arg = nil; }          return arg.$m.process(arg, opts, $cg(self, 'LEVEL_LIST'));}).$proc =[self], $B.f)(__a);
        code = ("[" + (__a = parts.$m.join(parts, ', ')).$m.to_s(__a) + (__a = self.$m.$fix_line_number(self, opts, self['@end_line'])).$m.to_s(__a) + "]");

        if ((__a = self['@args']).$m['[]'](__a, 1).$r) {
          res = ((__a = code).$m.to_s(__a) + ".concat(" + (__a = (__b = (__c = self['@args']).$m['[]'](__c, 1)).$m.generate(__b, opts, $cg(self, 'LEVEL_EXPR'))).$m.to_s(__a) + ")");
        } else {
          res = code;
        }

        return res;
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'HashNode', function(self) {

      $defn(self, 'initialize', function(self, parts, begn, endn) {var __a, __b;
        self['@line'] = ((__a = begn.$m['[]'](begn, $symbol_1)).$r ? __a : 0);
        self['@end_line'] = ((__a = endn.$m['[]'](endn, $symbol_1)).$r ? __a : 0);
        return self['@parts'] = parts;
      }, 3);

      return $defn(self, 'generate', function(self, opts, level) {var parts, __a, __b;self['@parts']==undefined&&(self['@parts']=nil);self['@end_line']==undefined&&(self['@end_line']=nil);
        parts = ($B.f = (__a = (__b = self['@parts']).$m.flatten(__b)).$m.map, ($B.p =function(self, part) { var __a;if (part === undefined) { part = nil; }          return part.$m.process(part, opts, $cg(self, 'LEVEL_LIST'));}).$proc =[self], $B.f)(__a);
        return ("$hash(" + (__a = parts.$m.join(parts, ', ')).$m.to_s(__a) + (__a = self.$m.$fix_line_number(self, opts, self['@end_line'])).$m.to_s(__a) + ")");
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'IfNode', function(self) {

      $defn(self, 'initialize', function(self, begn, expr, stmt, tail, endn) {var __a;
        self['@type'] = begn.$m['[]'](begn, $symbol_10);
        self['@line'] = begn.$m['[]'](begn, $symbol_1);
        self['@end_line'] = endn.$m['[]'](endn, $symbol_1);
        self['@expr'] = expr;
        self['@stmt'] = stmt;
        return self['@tail'] = tail;
      }, 5);

      $defn(self, 'returns', function(self) {var __a, __b;self['@stmt']==undefined&&(self['@stmt']=nil);self['@tail']==undefined&&(self['@tail']=nil);
        (__a = self['@stmt']).$m.returns(__a);

        ($B.f = (__a = self['@tail']).$m.each, ($B.p =function(self, tail) { var __a, __b, __c;if (tail === undefined) { tail = nil; }
          if ((__a = (__b = tail.$m['[]'](tail, 0)).$m['[]'](__b, $symbol_10)).$m['=='](__a, 'elsif').$r) {
            return (__a = tail.$m['[]'](tail, 2)).$m.returns(__a);
          } else {
            return (__a = tail.$m['[]'](tail, 1)).$m.returns(__a);
          }
        }).$proc =[self], $B.f)(__a);
        return self;
      }, 0);

      $defn(self, 'expression?', function(self) {self['@expr_level']==undefined&&(self['@expr_level']=nil);
        return self['@expr_level'];
      }, 0);

      return $defn(self, 'generate', function(self, opts, level) {var code, done_else, tail, old_indent, __a, __b, __c, stmt_level, expr;self['@expr']==undefined&&(self['@expr']=nil);self['@type']==undefined&&(self['@type']=nil);self['@stmt']==undefined&&(self['@stmt']=nil);self['@tail']==undefined&&(self['@tail']=nil);self['@force_else']==undefined&&(self['@force_else']=nil);self['@end_line']==undefined&&(self['@end_line']=nil);
        code = '';
        done_else = Qfalse;
        tail = nil;
        old_indent = opts.$m['[]'](opts, $symbol_3);

        opts.$m['[]='](opts, $symbol_3, (__b = opts.$m['[]'](opts, $symbol_3)).$m['+'](__b, $cg(self, 'INDENT')));


        stmt_level = ((level.$m['=='](level, $cg(self, 'LEVEL_EXPR')).$r ? $cg(self, 'LEVEL_TOP_CLOSURE') : $cg(self, 'LEVEL_TOP')));

        if (stmt_level.$m['=='](stmt_level, $cg(self, 'LEVEL_TOP_CLOSURE')).$r) {
          self.$m.$returns(self);
          self['@level_expr'] = Qtrue;
        }

        expr = (__a = self['@expr']).$m.generate(__a, opts, $cg(self, 'LEVEL_EXPR'));
        if ((__a = self['@expr']).$m['is_a?'](__a, $cg(self, 'NumericNode')).$r) {          expr = ("(" + (__a = expr).$m.to_s(__a) + ")");}


        code = code.$m['+'](code, ("if (" + (__b = ((__c = self['@type']).$m['=='](__c, 'if').$r ? '' : '!')).$m.to_s(__b) + (__b = expr).$m.to_s(__b) + ".$r) {" + (__b = (__c = self['@stmt']).$m.process(__c, opts, stmt_level)).$m.to_s(__b)));

        ($B.f = (__a = self['@tail']).$m.each, ($B.p =function(self, tail) { var __a, __b, __c, __d;if (tail === undefined) { tail = nil; }
          opts.$m['[]='](opts, $symbol_3, old_indent);
          code = code.$m['+'](code, self.$m.$fix_line_number(self, opts, (__c = tail.$m['[]'](tail, 0)).$m['[]'](__c, $symbol_1)));

          if ((__a = (__b = tail.$m['[]'](tail, 0)).$m['[]'](__b, $symbol_10)).$m['=='](__a, 'elsif').$r) {
            expr = (__a = tail.$m['[]'](tail, 1)).$m.generate(__a, opts, $cg(self, 'LEVEL_EXPR'));
            if ((__a = tail.$m['[]'](tail, 1)).$m['is_a?'](__a, $cg(self, 'NumericNode')).$r) {              expr = ("(" + (__a = expr).$m.to_s(__a) + ")");}
            code = code.$m['+'](code, ("} else if (" + (__b = expr).$m.to_s(__b) + ".$r) {"));

            opts.$m['[]='](opts, $symbol_3, (__b = opts.$m['[]'](opts, $symbol_3)).$m['+'](__b, $cg(self, 'INDENT')));
            return code = code.$m['+'](code, (__b = tail.$m['[]'](tail, 2)).$m.process(__b, opts, stmt_level));
          } else {
            done_else = Qtrue;
            code = code.$m['+'](code, '} else {');
            opts.$m['[]='](opts, $symbol_3, (__b = opts.$m['[]'](opts, $symbol_3)).$m['+'](__b, $cg(self, 'INDENT')));
            return code = code.$m['+'](code, (__b = tail.$m['[]'](tail, 1)).$m.process(__b, opts, stmt_level));
          }
        }).$proc =[self], $B.f)(__a);

        if (self['@force_else'].$r) {nil



        }

        opts.$m['[]='](opts, $symbol_3, old_indent);
        code = code.$m['+'](code, ((__b = self.$m.$fix_line_number(self, opts, self['@end_line'])).$m['+'](__b, '}')));


        if (level.$m['=='](level, $cg(self, 'LEVEL_EXPR')).$r) {          code = ("(function() {" + (__a = code).$m.to_s(__a) + "})()");}
        return code;
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'CaseNode', function(self) {

      $defn(self, 'initialize', function(self, begn, expr, body, endn) {var __a;
        self['@line'] = begn.$m['[]'](begn, $symbol_1);
        self['@expr'] = expr;
        self['@body'] = body;
        return self['@end_line'] = endn.$m['[]'](endn, $symbol_1);
      }, 4);

      $defn(self, 'returns', function(self) {var __a, __b;self['@body']==undefined&&(self['@body']=nil);
        ($B.f = (__a = self['@body']).$m.each, ($B.p =function(self, part) { var __a, __b, __c;if (part === undefined) { part = nil; }
          if ((__a = (__b = part.$m['[]'](part, 0)).$m['[]'](__b, $symbol_10)).$m['=='](__a, 'when').$r) {
            return (__a = part.$m['[]'](part, 2)).$m.returns(__a);
          } else {
            return (__a = part.$m['[]'](part, 1)).$m.returns(__a);
          }
        }).$proc =[self], $B.f)(__a);
        return self;
      }, 0);

      return $defn(self, 'generate', function(self, opts, level) {var code, done_else, tail, old_indent, __a, __b, __c, stmt_level, expr, case_ref;self['@expr']==undefined&&(self['@expr']=nil);self['@body']==undefined&&(self['@body']=nil);self['@end_line']==undefined&&(self['@end_line']=nil);
        code = '';
        done_else = Qfalse;
        tail = nil;
        old_indent = opts.$m['[]'](opts, $symbol_3);

        opts.$m['[]='](opts, $symbol_3, (__b = opts.$m['[]'](opts, $symbol_3)).$m['+'](__b, $cg(self, 'INDENT')));

        stmt_level = ((level.$m['=='](level, $cg(self, 'LEVEL_EXPR')).$r ? $cg(self, 'LEVEL_TOP_CLOSURE') : $cg(self, 'LEVEL_TOP')));

        if (stmt_level.$m['=='](stmt_level, $cg(self, 'LEVEL_TOP_CLOSURE')).$r) {
          self.$m.$returns(self);
          self['@level_expr'] = Qtrue;
        }

        expr = (__a = self['@expr']).$m.generate(__a, opts, $cg(self, 'LEVEL_EXPR'));
        case_ref = (__a = opts.$m['[]'](opts, $symbol_9)).$m.temp_local(__a);

        code = code.$m['+'](code, ((__b = case_ref).$m.to_s(__b) + " = " + (__b = expr).$m.to_s(__b) + ";"));

        ($B.f = (__a = self['@body']).$m.each_with_index, ($B.p =function(self, part, idx) { var __a, __b, __c, __d, parts;if (part === undefined) { part = nil; }if (idx === undefined) { idx = nil; }
          opts.$m['[]='](opts, $symbol_3, old_indent);
          code = code.$m['+'](code, self.$m.$fix_line_number(self, opts, (__c = part.$m['[]'](part, 0)).$m['[]'](__c, $symbol_1)));

          if ((__a = (__b = part.$m['[]'](part, 0)).$m['[]'](__b, $symbol_10)).$m['=='](__a, 'when').$r) {
            code = code.$m['+'](code, ((idx.$m['=='](idx, 0).$r ? "if" : "} else if")));
            parts = ($B.f = (__a = part.$m['[]'](part, 1)).$m.map, ($B.p =function(self, expr) { var __a, __b, __c, __d;if (expr === undefined) { expr = nil; }
              return (__a = (__b = (__c = $cg(self, 'CallNode')).$m['new'](__c, expr, $hash(
              $symbol_10, '==='), [
              [(__d = $cg(self, 'TempNode')).$m['new'](__d, case_ref)]])).$m.generate(__b, opts, $cg(self, 'LEVEL_EXPR'))).$m['+'](__a, '.$r');

            }).$proc =[self], $B.f)(__a);
            opts.$m['[]='](opts, $symbol_3, (__b = opts.$m['[]'](opts, $symbol_3)).$m['+'](__b, $cg(self, 'INDENT')));
            return code = code.$m['+'](code, (" (" + (__b = parts.$m.join(parts, ' || ')).$m.to_s(__b) + ") {" + (__b = (__c = part.$m['[]'](part, 2)).$m.process(__c, opts, stmt_level)).$m.to_s(__b)));
          } else {
            return code = code.$m['+'](code, ("} else {" + (__b = (__c = part.$m['[]'](part, 1)).$m.process(__c, opts, stmt_level)).$m.to_s(__b)));
          }
        }).$proc =[self], $B.f)(__a);

        opts.$m['[]='](opts, $symbol_3, old_indent);

        (__a = opts.$m['[]'](opts, $symbol_9)).$m.queue_temp(__a, case_ref);
        code = code.$m['+'](code, ((__b = self.$m.$fix_line_number(self, opts, self['@end_line'])).$m['+'](__b, '}')));

        if (level.$m['=='](level, $cg(self, 'LEVEL_EXPR')).$r) {          code = ("(function() {" + (__a = code).$m.to_s(__a) + ")()");}
        return code;
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'TempNode', function(self) {

      $defn(self, 'initialize', function(self, val) {
        self['@val'] = val;
        return self['@line'] = 0;
      }, 1);

      return $defn(self, 'generate', function(self, opts, level) {self['@val']==undefined&&(self['@val']=nil);
        return self['@val'];
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'ConstantNode', function(self) {

      $defn(self, 'initialize', function(self, name) {var __a;
        self['@line'] = name.$m['[]'](name, $symbol_1);
        return self['@name'] = name.$m['[]'](name, $symbol_10);
      }, 1);

      $defn(self, 'value', function(self) {self['@name']==undefined&&(self['@name']=nil);
        return self['@name'];
      }, 0);

      return $defn(self, 'generate', function(self, opts, level) {var __a, __b, __c;self['@name']==undefined&&(self['@name']=nil);
        return ("$cg(" + (__a = (__b = (__c = $cg(self, 'SelfNode')).$m['new'](__c)).$m.generate(__b, opts, level)).$m.to_s(__a) + ", '" + (__a = self['@name']).$m.to_s(__a) + "')");
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'Colon2Node', function(self) {

      $defn(self, 'initialize', function(self, lhs, name) {var __a;
        self['@lhs'] = lhs;
        self['@line'] = name.$m['[]'](name, $symbol_1);
        return self['@name'] = name.$m['[]'](name, $symbol_10);
      }, 2);

      return $defn(self, 'generate', function(self, opts, level) {var __a, __b;self['@lhs']==undefined&&(self['@lhs']=nil);self['@name']==undefined&&(self['@name']=nil);

        return ("$cg(" + (__a = (__b = self['@lhs']).$m.generate(__b, opts, level)).$m.to_s(__a) + ", '" + (__a = self['@name']).$m.to_s(__a) + "')");
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'Colon3Node', function(self) {

      $defn(self, 'initialize', function(self, name) {var __a;
        self['@line'] = name.$m['[]'](name, $symbol_1);
        return self['@name'] = name.$m['[]'](name, $symbol_10);
      }, 1);

      return $defn(self, 'generate', function(self, opts, level) {var __a;self['@name']==undefined&&(self['@name']=nil);
        return ("rm_vm_cg($opal.Object, '" + (__a = self['@name']).$m.to_s(__a) + "')");
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'AssignNode', function(self) {

      $defn(self, 'initialize', function(self, lhs, rhs, assign) {var __a;if (assign == undefined) {assign = $hash();}
        self['@line'] = lhs.$m.line(lhs);
        self['@lhs'] = lhs;
        return self['@rhs'] = rhs;
      }, -3);

      return $defn(self, 'generate', function(self, opts, level) {var __a, __b, __c, __d;self['@lhs']==undefined&&(self['@lhs']=nil);self['@rhs']==undefined&&(self['@rhs']=nil);self['@line']==undefined&&(self['@line']=nil);
        if ((__a = self['@lhs']).$m['is_a?'](__a, $cg(self, 'IvarNode')).$r) {
          return ((__a = (__b = (__c = $cg(self, 'SelfNode')).$m['new'](__c)).$m.generate(__b, opts, level)).$m.to_s(__a) + "['" + (__a = (__b = self['@lhs']).$m.value(__b)).$m.to_s(__a) + "'] = " + (__a = (__b = self['@rhs']).$m.generate(__b, opts, $cg(self, 'LEVEL_EXPR'))).$m.to_s(__a));

        } else if ((__a = self['@lhs']).$m['is_a?'](__a, $cg(self, 'GvarNode')).$r) {
          return ("$rb.gs('" + (__a = (__b = self['@lhs']).$m.value(__b)).$m.to_s(__a) + "', " + (__a = (__b = self['@rhs']).$m.generate(__b, opts, $cg(self, 'LEVEL_EXPR'))).$m.to_s(__a) + ")");

        } else if ((__a = self['@lhs']).$m['is_a?'](__a, $cg(self, 'IdentifierNode')).$r) {
          (__a = opts.$m['[]'](opts, $symbol_9)).$m.ensure_variable(__a, (__b = self['@lhs']).$m.value(__b));


          if (((__a = (__b = self['@rhs']).$m['is_a?'](__b, $cg(self, 'YieldNode'))).$r ? level.$m['=='](level, $cg(self, 'LEVEL_TOP')) : __a).$r) {
            return (__a = self['@rhs']).$m.generate_assign(__a, opts, self['@lhs']);
          }
          return (__a = (__b = (__c = self['@lhs']).$m.value(__c)).$m['+'](__b, " = ")).$m['+'](__a, (__b = self['@rhs']).$m.generate(__b, opts, $cg(self, 'LEVEL_EXPR')));

        } else if ((__a = self['@lhs']).$m['is_a?'](__a, $cg(self, 'ArefNode')).$r) {
          return (__a = (__b = $cg(self, 'AsetNode')).$m['new'](__b, (__c = self['@lhs']).$m.recv(__c), (__c = self['@lhs']).$m.arefs(__c), self['@rhs'])).$m.process(__a, opts, level);

        } else if ((__a = self['@lhs']).$m['is_a?'](__a, $cg(self, 'ConstantNode')).$r) {
          return ("$rb.cs(self, '" + (__a = (__b = self['@lhs']).$m.value(__b)).$m.to_s(__a) + "', " + (__a = (__b = self['@rhs']).$m.generate(__b, opts, $cg(self, 'LEVEL_EXPR'))).$m.to_s(__a) + ")");

        } else if ((__a = self['@lhs']).$m['is_a?'](__a, $cg(self, 'CallNode')).$r) {
          return (__a = (__b = $cg(self, 'CallNode')).$m['new'](__b, (__c = self['@lhs']).$m.recv(__c), $hash($symbol_10, (__c = (__d = self['@lhs']).$m.mid(__d)).$m['+'](__c, '='), $symbol_1, self['@line']), [[self['@rhs']]])).$m.generate(__a, opts, level);

        } else {
          return self.$m.$raise(self, ("Bad lhs for assign on " + (__b = self['@line']).$m.to_s(__b)));
        }
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'MlhsAssignNode', function(self) {

      $defn(self, 'initialize', function(self, node, lhs, rhs) {var __a;
        self['@line'] = node.$m['[]'](node, $symbol_1);
        self['@lhs'] = lhs;
        return self['@rhs'] = rhs;
      }, 3);

      $defn(self, 'generate', function(self, opts, level) {var __a, __b, __c;self['@lhs']==undefined&&(self['@lhs']=nil);self['@rhs']==undefined&&(self['@rhs']=nil);
        (__a = self['@lhs']).$m.inspect(__a);
        self['@generator_opts'] = opts;
        return (__a = (__b = '(').$m['+'](__b, self.$m.$generate_mlhs_context(self, self['@lhs'], self['@rhs']))).$m['+'](__a, ')');
      }, 2);

      return $defn(self, 'generate_mlhs_context', function(self, arr, rhs) {var __a, parts, tmp_recv, __b, tmp_len, rhs_code;self['@generator_opts']==undefined&&(self['@generator_opts']=nil);
        self.$m.$puts(self, ("mlhs node at " + "#@line"));
        parts = [];

        tmp_recv = (__a = (__b = self['@generator_opts']).$m['[]'](__b, $symbol_9)).$m.temp_local(__a);
        tmp_len = (__a = (__b = self['@generator_opts']).$m['[]'](__b, $symbol_9)).$m.temp_local(__a);
        rhs_code = rhs.$m.generate(rhs, self['@generator_opts'], $cg(self, 'LEVEL_EXPR'));

        parts.$m['<<'](parts, ((__b = tmp_recv).$m.to_s(__b) + " = " + (__b = rhs_code).$m.to_s(__b)));
        parts.$m['<<'](parts, ("(" + (__b = tmp_recv).$m.to_s(__b) + ".$flags & $rb.T_ARRAY) || (" + (__b = tmp_recv).$m.to_s(__b) + " = [" + (__b = tmp_recv).$m.to_s(__b) + "])"));
        parts.$m['<<'](parts, ((__b = tmp_len).$m.to_s(__b) + " = " + (__b = tmp_recv).$m.to_s(__b) + ".length"));

        if (arr.$m['[]'](arr, 0).$r) {
          ($B.f = (__a = arr.$m['[]'](arr, 0)).$m.each_with_index, ($B.p =function(self, part, idx) { var __a, __b, assign, __c, code;if (part === undefined) { part = nil; }if (idx === undefined) { idx = nil; }
            if (part.$m['is_a?'](part, $cg(self, 'Array')).$r) {
              return parts.$m.push(parts, self.$m.$generate_mlhs_context(self, part, rhs));
            } else {
              assign = (__a = $cg(self, 'AssignNode')).$m['new'](__a, part, (__b = $cg(self, 'TempNode')).$m['new'](__b, ((__c = tmp_recv).$m.to_s(__c) + "[" + (__c = idx).$m.to_s(__c) + "]")));
              code = assign.$m.generate(assign, self['@generator_opts'], $cg(self, 'LEVEL_EXPR'));
              return parts.$m.push(parts, ((__b = idx).$m.to_s(__b) + " < " + (__b = tmp_len).$m.to_s(__b) + " ? " + (__b = code).$m.to_s(__b) + " : nil"));

            }
          }).$proc =[self], $B.f)(__a);
        }

        parts.$m['<<'](parts, tmp_recv);

        (__a = (__b = self['@generator_opts']).$m['[]'](__b, $symbol_9)).$m.queue_temp(__a, tmp_recv);
        (__a = (__b = self['@generator_opts']).$m['[]'](__b, $symbol_9)).$m.queue_temp(__a, tmp_len);

        return parts.$m.join(parts, ', ');
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'OpAsgnNode', function(self) {

      $defn(self, 'initialize', function(self, asgn, lhs, rhs) {var __a;
        self['@line'] = asgn.$m['[]'](asgn, $symbol_1);
        self['@lhs'] = lhs;
        self['@rhs'] = rhs;
        return self['@asgn'] = asgn.$m['[]'](asgn, $symbol_10);
      }, 3);

      return $defn(self, 'generate', function(self, opts, level) {var assign, __a, __b;self['@asgn']==undefined&&(self['@asgn']=nil);self['@line']==undefined&&(self['@line']=nil);self['@lhs']==undefined&&(self['@lhs']=nil);self['@rhs']==undefined&&(self['@rhs']=nil);
        assign = nil;

        if ((__a = self['@asgn']).$m['=='](__a, '||').$r) {
          assign = (__a = $cg(self, 'OrNode')).$m['new'](__a, $hash($symbol_10, '||', $symbol_1, self['@line']), self['@lhs'], (__b = $cg(self, 'AssignNode')).$m['new'](__b, self['@lhs'], self['@rhs']));
        } else if ((__a = ["+", "-", "/", "*"]).$m['include?'](__a, self['@asgn']).$r) {
          assign = (__a = $cg(self, 'AssignNode')).$m['new'](__a, self['@lhs'], (__b = $cg(self, 'CallNode')).$m['new'](__b, self['@lhs'], $hash($symbol_10, self['@asgn'], $symbol_1, self['@line']), [[self['@rhs']]]));
        } else {
          self.$m.$raise(self, ("Bas op asgn type: " + (__b = self['@asgn']).$m.to_s(__b)));
        }
        return assign.$m.generate(assign, opts, level);
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'IvarNode', function(self) { var __a;

      self.$m.$attr_reader(self, $symbol_10);

      $defn(self, 'initialize', function(self, val) {var __a;
        self['@line'] = val.$m['[]'](val, $symbol_1);
        return self['@value'] = val.$m['[]'](val, $symbol_10);
      }, 1);

      return $defn(self, 'generate', function(self, opts, level) {var __a, __b, __c;self['@value']==undefined&&(self['@value']=nil);
        (__a = opts.$m['[]'](opts, $symbol_9)).$m.ensure_ivar(__a, self['@value']);
        return ((__a = (__b = (__c = $cg(self, 'SelfNode')).$m['new'](__c)).$m.generate(__b, opts, level)).$m.to_s(__a) + "['" + (__a = self['@value']).$m.to_s(__a) + "']");
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'IdentifierNode', function(self) { var __a;
      self.$m.$attr_reader(self, $symbol_10);

      $defn(self, 'initialize', function(self, val) {var __a;
        self['@line'] = val.$m['[]'](val, $symbol_1);
        return self['@value'] = val.$m['[]'](val, $symbol_10);
      }, 1);

      $defn(self, 'local_variable?', function(self, opts) {var __a, __b;self['@value']==undefined&&(self['@value']=nil);
        return ((__a = opts.$m['[]'](opts, $symbol_9)).$m.find_variable(__a, self['@value']).$r ? Qtrue : Qfalse);
      }, 1);

      return $defn(self, 'generate', function(self, opts, level) {var __a, __b;self['@value']==undefined&&(self['@value']=nil);self['@line']==undefined&&(self['@line']=nil);
        if ((__a = opts.$m['[]'](opts, $symbol_9)).$m.find_variable(__a, self['@value']).$r) {
          return self['@value'];
        } else {
          return (__a = (__b = $cg(self, 'CallNode')).$m['new'](__b, nil, $hash($symbol_10, self['@value'], $symbol_1, self['@line']), [[]])).$m.generate(__a, opts, level);
        }
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'FuncReturnNode', function(self) {

      $defn(self, 'initialize', function(self, val) {var __a;
        self['@value'] = val;
        return self['@line'] = val.$m.line(val);
      }, 1);

      return $defn(self, 'generate', function(self, opts, level) {var __a, __b;self['@value']==undefined&&(self['@value']=nil);
        return ("return " + (__a = (__b = self['@value']).$m.generate(__b, opts, level)).$m.to_s(__a));
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'StringNode', function(self) {

      $defn(self, 'initialize', function(self, parts, endn) {var __a;
        self['@line'] = endn.$m['[]'](endn, $symbol_1);
        self['@parts'] = parts;
        return self['@join'] = endn.$m['[]'](endn, $symbol_10);
      }, 2);

      return $defn(self, 'generate', function(self, opts, level) {var __a, __b, __c, __d, __e, parts;self['@parts']==undefined&&(self['@parts']=nil);self['@join']==undefined&&(self['@join']=nil);
        if ((__a = (__b = self['@parts']).$m.length(__b)).$m['=='](__a, 0).$r) {
          return "''";
        } else if ((__a = (__b = self['@parts']).$m.length(__b)).$m['=='](__a, 1).$r) {
          if ((__a = (__b = (__c = self['@parts']).$m['[]'](__c, 0)).$m['[]'](__b, 0)).$m['=='](__a, 'string_content').$r) {
            return (__a = (__b = self['@join']).$m['+'](__b, (__c = (__d = (__e = self['@parts']).$m['[]'](__e, 0)).$m['[]'](__d, 1)).$m['[]'](__c, $symbol_10))).$m['+'](__a, self['@join']);
          } else if ((__a = (__b = (__c = self['@parts']).$m['[]'](__c, 0)).$m['[]'](__b, 0)).$m['=='](__a, 'string_dbegin').$r) {
            return (__a = (__b = $cg(self, 'CallNode')).$m['new'](__b, (__c = (__d = self['@parts']).$m['[]'](__d, 0)).$m['[]'](__c, 1), $hash($symbol_10, 'to_s', $symbol_1, 0), [[]])).$m.generate(__a, opts, level);
          }

        } else {
          parts = ($B.f = (__a = self['@parts']).$m.map, ($B.p =function(self, part) { var __a, __b, __c, __d;if (part === undefined) { part = nil; }
            if ((__a = part.$m['[]'](part, 0)).$m['=='](__a, 'string_content').$r) {
              return (__a = (__b = self['@join']).$m['+'](__b, (__c = part.$m['[]'](part, 1)).$m['[]'](__c, $symbol_10))).$m['+'](__a, self['@join']);
            } else if ((__a = part.$m['[]'](part, 0)).$m['=='](__a, 'string_dbegin').$r) {
              return (__a = (__b = $cg(self, 'CallNode')).$m['new'](__b, part.$m['[]'](part, 1), $hash($symbol_10, 'to_s', $symbol_1, 0), [[]])).$m.generate(__a, opts, level);
            }
          }).$proc =[self], $B.f)(__a);

          return (__a = (__b = '(').$m['+'](__b, parts.$m.join(parts, ' + '))).$m['+'](__a, ')');
        }
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'TrueNode', function(self) {

      $defn(self, 'initialize', function(self, val) {var __a;
        return self['@line'] = val.$m['[]'](val, $symbol_1);
      }, 1);

      return $defn(self, 'generate', function(self, opts, level) {
        return "Qtrue";
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'FalseNode', function(self) {

      $defn(self, 'initialize', function(self, val) {var __a;
        return self['@line'] = val.$m['[]'](val, $symbol_1);
      }, 1);

      return $defn(self, 'generate', function(self, opts, level) {
        return "Qfalse";
      }, 2);
        }, 0);

    $class(self, $cg(self, 'ScopeNode'), 'BlockNode', function(self) {

      $defn(self, 'initialize', function(self, start, vars, stmt, endn) {var __a;
        $super(arguments.callee, self, [nil, stmt]);
        self['@line'] = start.$m['[]'](start, $symbol_1);
        self['@args'] = vars;
        self['@stmt'] = stmt;
        return self['@end_line'] = endn.$m['[]'](endn, $symbol_1);
      }, 4);

      return $defn(self, 'generate', function(self, opts, level) {var __a, pre_code, code, scope, __b, args, method_args, __c, rest_arg_name, stmt, block_var, __d;self['@args']==undefined&&(self['@args']=nil);self['@stmt']==undefined&&(self['@stmt']=nil);self['@scope_vars']==undefined&&(self['@scope_vars']=nil);self['@block_arg_name']==undefined&&(self['@block_arg_name']=nil);self['@end_line']==undefined&&(self['@end_line']=nil);
        self['@parent'] = opts.$m['[]'](opts, $symbol_9);
        pre_code = '';
        code = '';

        scope = $hash($symbol_9, self, $symbol_2, opts.$m['[]'](opts, $symbol_2), $symbol_3, (__a = opts.$m['[]'](opts, $symbol_3)).$m['+'](__a, $cg(self, 'INDENT')));
        args = (__a = self['@args']).$m['[]'](__a, 0);
        method_args = [];

        if (args.$r) {

          if (args.$m['[]'](args, 0).$r) {
            ($B.f = (__a = args.$m['[]'](args, 0)).$m.each, ($B.p =function(self, arg) { var __a, __b, __c;if (arg === undefined) { arg = nil; }
              self.$m.$param_variable(self, arg.$m['[]'](arg, $symbol_10));
              method_args.$m['<<'](method_args, arg.$m['[]'](arg, $symbol_10));









              if (Qtrue.$r) {
                return pre_code = pre_code.$m['+'](pre_code, ("if (" + (__b = arg.$m['[]'](arg, $symbol_10)).$m.to_s(__b) + " === undefined) { " + (__b = arg.$m['[]'](arg, $symbol_10)).$m.to_s(__b) + " = nil; }"));
              }
            }).$proc =[self], $B.f)(__a);
          }


          if (args.$m['[]'](args, 1).$r) {
            ($B.f = (__a = args.$m['[]'](args, 1)).$m.each, ($B.p =function(self, arg) { var opt_arg_name, __a, __b, __c, __d;if (arg === undefined) { arg = nil; }
              opt_arg_name = (__a = arg.$m['[]'](arg, 0)).$m['[]'](__a, $symbol_10);
              self.$m.$param_variable(self, opt_arg_name);
              method_args.$m['<<'](method_args, (__b = arg.$m['[]'](arg, 0)).$m['[]'](__b, $symbol_10));
              return pre_code = pre_code.$m['+'](pre_code, ("if (" + (__b = opt_arg_name).$m.to_s(__b) + " === undefined) { " + (__b = opt_arg_name).$m.to_s(__b) + " = " + (__b = (__c = arg.$m['[]'](arg, 1)).$m.generate(__c, opts, level)).$m.to_s(__b) + ";}"));
            }).$proc =[self], $B.f)(__a);
          }


          if (args.$m['[]'](args, 2).$r) {

            if (!(__a = (__b = args.$m['[]'](args, 2)).$m['[]'](__b, $symbol_10)).$m['=='](__a, '*').$r) {
              rest_arg_name = (__a = args.$m['[]'](args, 2)).$m['[]'](__a, $symbol_10);

              self.$m.$param_variable(self, rest_arg_name);
              method_args.$m['<<'](method_args, rest_arg_name);
              pre_code = pre_code.$m['+'](pre_code, ((__b = rest_arg_name).$m.to_s(__b) + " = [].slice.call($A, " + (__b = method_args.$m.length(method_args)).$m.to_s(__b) + ");"));
            }
          }


          if (args.$m['[]'](args, 3).$r) {
            self.$m.$param_variable(self, (__b = args.$m['[]'](args, 3)).$m['[]'](__b, $symbol_10));
            self['@block_arg_name'] = (__a = args.$m['[]'](args, 3)).$m['[]'](__a, $symbol_10);
          }
        }

        (__a = self['@stmt']).$m.returns(__a);
        stmt = (__a = self['@stmt']).$m.process(__a, scope, $cg(self, 'LEVEL_TOP'));
        method_args.$m.unshift(method_args, 'self');

        block_var = (__a = opts.$m['[]'](opts, $symbol_9)).$m.temp_local(__a);


        code = code.$m['+'](code, ("function(" + (__b = method_args.$m.join(method_args, ', ')).$m.to_s(__b) + ") {"));

        if (!(__a = self['@scope_vars']).$m['empty?'](__a).$r) {
          code = code.$m['+'](code, (" var " + (__b = (__c = self['@scope_vars']).$m.join(__c, ', ')).$m.to_s(__b) + ";"));
        }


        if (self['@block_arg_name'].$r) {
          pre_code = pre_code.$m['+'](pre_code, ("var $yield, " + "#@block_arg_name; if ($B.f == arguments.callee && $B.p != nil) { " + "#@block_arg_name = "));
          pre_code = pre_code.$m['+'](pre_code, ("$yield = $B.p; } else { " + "#@block_arg_name = nil; "));
          pre_code = pre_code.$m['+'](pre_code, "$yield = $B.y; } $B.p = $B.f = nil;");
          pre_code = pre_code.$m['+'](pre_code, "var $yself = $yield.$proc[0];");

          stmt = (__a = "try{").$m['+'](__a, stmt);


          stmt = stmt.$m['+'](stmt, "} catch (__err__) {if(__err__.$keyword == 2) {return __err__.$value;} throw __err__;}");
        }

        code = code.$m['+'](code, ((__b = (__c = pre_code.$m['+'](pre_code, stmt)).$m['+'](__c, self.$m.$fix_line_number(self, opts, self['@end_line']))).$m['+'](__b, "}")));



        (__a = opts.$m['[]'](opts, $symbol_9)).$m.queue_temp(__a, block_var);
        return code;
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'XStringNode', function(self) {

      $defn(self, 'initialize', function(self, begn, parts, endn) {var __a;
        self['@line'] = begn.$m['[]'](begn, $symbol_1);
        self['@parts'] = parts;
        return self['@end_line'] = endn.$m['[]'](endn, $symbol_1);
      }, 3);


      $defn(self, 'returns', function(self) {
        return self;
      }, 0);



      $defn(self, 'expression?', function(self) {
        return Qfalse;
      }, 0);

      return $defn(self, 'generate', function(self, opts, level) {var parts, __a, __b;self['@parts']==undefined&&(self['@parts']=nil);
        parts = ($B.f = (__a = self['@parts']).$m.map, ($B.p =function(self, part) { var __a, __b;if (part === undefined) { part = nil; }
          if ((__a = part.$m['[]'](part, 0)).$m['=='](__a, 'string_content').$r) {
            return (__a = part.$m['[]'](part, 1)).$m['[]'](__a, $symbol_10);
          } else if ((__a = part.$m['[]'](part, 0)).$m['=='](__a, 'string_dbegin').$r) {
            return (__a = part.$m['[]'](part, 1)).$m.generate(__a, opts, $cg(self, 'LEVEL_EXPR'));
          }
        }).$proc =[self], $B.f)(__a);

        return parts.$m.join(parts, '');
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'ParenNode', function(self) {

      $defn(self, 'initialize', function(self, opening, parts, closing) {var __a;
        self['@line'] = opening.$m['[]'](opening, $symbol_1);
        self['@parts'] = parts;
        return self['@end_line'] = closing.$m['[]'](closing, $symbol_1);
      }, 3);

      return $defn(self, 'generate', function(self, opts, level) {var parts, __a, __b;self['@parts']==undefined&&(self['@parts']=nil);
        parts = ($B.f = (__a = (__b = self['@parts']).$m.nodes(__b)).$m.map, ($B.p =function(self, part) { var __a;if (part === undefined) { part = nil; }
          return part.$m.generate(part, opts, $cg(self, 'LEVEL_EXPR'));
        }).$proc =[self], $B.f)(__a);


        if (parts.$m['empty?'](parts).$r) {          parts.$m['<<'](parts, 'nil');}

        return ("(" + (__a = parts.$m.join(parts, ', ')).$m.to_s(__a) + ")");
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'ArefNode', function(self) { var __a;

      self.$m.$attr_reader(self, $symbol_12);

      self.$m.$attr_reader(self, $symbol_15);

      $defn(self, 'initialize', function(self, recv, arefs) {var __a;
        self['@line'] = recv.$m.line(recv);
        self['@recv'] = recv;
        return self['@arefs'] = arefs;
      }, 2);

      return $defn(self, 'generate', function(self, opts, level) {var __a, __b;self['@recv']==undefined&&(self['@recv']=nil);self['@line']==undefined&&(self['@line']=nil);self['@arefs']==undefined&&(self['@arefs']=nil);
        return (__a = (__b = $cg(self, 'CallNode')).$m['new'](__b, self['@recv'], $hash($symbol_1, self['@line'], $symbol_10, '[]'), self['@arefs'])).$m.generate(__a, opts, level);
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'AsetNode', function(self) {

      $defn(self, 'initialize', function(self, recv, arefs, val) {var __a;
        self['@line'] = recv.$m.line(recv);
        self['@recv'] = recv;
        self['@arefs'] = arefs;
        return self['@val'] = val;
      }, 3);

      return $defn(self, 'generate', function(self, opts, level) {var __a, __b;self['@arefs']==undefined&&(self['@arefs']=nil);self['@val']==undefined&&(self['@val']=nil);self['@recv']==undefined&&(self['@recv']=nil);self['@line']==undefined&&(self['@line']=nil);
        ((__a = (__b = self['@arefs']).$m['[]'](__b, 0)).$r ? __a : ((__b = self['@arefs']).$m['[]='](__b, 0, [])));
        (__a = (__b = self['@arefs']).$m['[]'](__b, 0)).$m['<<'](__a, self['@val']);
        return (__a = (__b = $cg(self, 'CallNode')).$m['new'](__b, self['@recv'], $hash($symbol_1, self['@line'], $symbol_10, '[]='), self['@arefs'])).$m.generate(__a, opts, level);
      }, 2);
        }, 0);


    $class(self, $cg(self, 'BaseNode'), 'IfModNode', function(self) {

      $defn(self, 'initialize', function(self, type, expr, stmt) {var __a;
        self['@line'] = type.$m['[]'](type, $symbol_1);
        self['@type'] = type.$m['[]'](type, $symbol_10);
        self['@expr'] = expr;
        return self['@stmt'] = stmt;
      }, 3);




      $defn(self, 'returns', function(self) {var __a;self['@stmt']==undefined&&(self['@stmt']=nil);
        self['@returns'] = Qtrue;
        self['@stmt'] = (__a = self['@stmt']).$m.returns(__a);
        return self;
      }, 0);

      return $defn(self, 'generate', function(self, opts, level) {var __a, r, __b, __c;self['@returns']==undefined&&(self['@returns']=nil);self['@stmt']==undefined&&(self['@stmt']=nil);self['@type']==undefined&&(self['@type']=nil);self['@expr']==undefined&&(self['@expr']=nil);

        if (self['@returns'].$r) {          (__a = self['@stmt']).$m.returns(__a);}

        r = ("if(" + (__a = ((__b = self['@type']).$m['=='](__b, 'if').$r ? '' : '!')).$m.to_s(__a) + "(" + (__a = (__b = self['@expr']).$m.generate(__b, opts, $cg(self, 'LEVEL_EXPR'))).$m.to_s(__a));
        r = r.$m['+'](r, (").$r) {" + (__b = (__c = self['@stmt']).$m.process(__c, opts, $cg(self, 'LEVEL_TOP'))).$m.to_s(__b) + "}"));


        if (self['@returns'].$r) {          r = r.$m['+'](r, " else { return nil; }");}
        return r;
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'YieldNode', function(self) {

      $defn(self, 'initialize', function(self, start, args) {var __a;
        self['@line'] = start.$m['[]'](start, $symbol_1);
        return self['@args'] = args;
      }, 2);


      $defn(self, 'yield_code', function(self, opts) {var block_code, parts, __a, __b, code, __c;self['@args']==undefined&&(self['@args']=nil);
        block_code = "$yy";

        parts = [];

        if ((__a = self['@args']).$m['[]'](__a, 0).$r) {
          ($B.f = (__a = (__b = self['@args']).$m['[]'](__b, 0)).$m.each, ($B.p =function(self, arg) { var __a, __b;if (arg === undefined) { arg = nil; }            return parts.$m['<<'](parts, arg.$m.generate(arg, opts, $cg(self, 'LEVEL_EXPR')));}).$proc =[self], $B.f)(__a);
        }

        if ((__a = self['@args']).$m['[]'](__a, 1).$r) {
          parts.$m.unshift(parts, '$ys');
          code = ((__a = block_code).$m.to_s(__a) + "(null, [" + (__a = parts.$m.join(parts, ', ')).$m.to_s(__a) + "].concat(" + (__a = (__b = (__c = self['@args']).$m['[]'](__c, 1)).$m.generate(__b, opts, $cg(self, 'LEVEL_EXPR'))).$m.to_s(__a) + "))");
        } else {
          parts.$m.unshift(parts, '$ys');
          code = ((__a = block_code).$m.to_s(__a) + "(" + (__a = parts.$m.join(parts, ', ')).$m.to_s(__a) + ")");
        }

        return code;
      }, 1);

      $defn(self, 'generate', function(self, opts, level) {var block, __a, __b, code, tmp;

        block = (__a = opts.$m['[]'](opts, $symbol_9)).$m.set_uses_block(__a);
        code = self.$m.$yield_code(self, opts);

        if (level.$m['=='](level, $cg(self, 'LEVEL_TOP')).$r) {
          return ("if (" + (__a = code).$m.to_s(__a) + " == $yb) { return $yb.$value; }");
        } else {






          tmp = (__a = opts.$m['[]'](opts, $symbol_9)).$m.temp_local(__a);
          return ("((" + (__a = tmp).$m.to_s(__a) + " = " + (__a = code).$m.to_s(__a) + ") == $yb ? $break() : " + (__a = tmp).$m.to_s(__a) + ")");
        }
      }, 2);



      return $defn(self, 'generate_assign', function(self, opts, lhs) {var __a, __b;
        return ("if ((" + (__a = lhs.$m.value(lhs)).$m.to_s(__a) + " = " + (__a = self.$m.$yield_code(self, opts)).$m.to_s(__a) + ") == $yb) { return $yb.$value; }");
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'BreakNode', function(self) {

      $defn(self, 'initialize', function(self, start, args) {var __a;
        self['@line'] = start.$m['[]'](start, $symbol_1);
        return self['@args'] = args;
      }, 2);



      $defn(self, 'returns', function(self) {
        return self;
      }, 0);

      return $defn(self, 'generate', function(self, opts, level) {var code, __a, __b, __c, __d, while_scope, tmp_break_val;self['@args']==undefined&&(self['@args']=nil);
        code = [];

        if ((__a = self['@args']).$m['[]'](__a, 0).$r) {
          ($B.f = (__a = (__b = self['@args']).$m['[]'](__b, 0)).$m.each, ($B.p =function(self, arg) { var __a, __b;if (arg === undefined) { arg = nil; }            return code.$m['<<'](code, arg.$m.generate(arg, opts, $cg(self, 'LEVEL_EXPR')));}).$proc =[self], $B.f)(__a);
        }

        __a = code.$m.length(code);
        if ((__b = (0)).$m['==='](__b, __a).$r) {
          code = "nil";
        } else if ((__b = (1)).$m['==='](__b, __a).$r) {
          code = code.$m['[]'](code, 0);
        } else {
        code = (__b = (__c = '[').$m['+'](__c, code.$m.join(code, ', '))).$m['+'](__b, ']');
        };

        if ((__a = opts.$m['[]'](opts, $symbol_9)).$m['in_while_scope?'](__a).$r) {
          while_scope = (__a = opts.$m['[]'](opts, $symbol_9)).$m.while_scope(__a);
          tmp_break_val = while_scope.$m.set_captures_break(while_scope);
          return ((__a = tmp_break_val).$m.to_s(__a) + " = " + (__a = code).$m.to_s(__a) + "; break");
        } else if ((__a = opts.$m['[]'](opts, $symbol_9)).$m['is_a?'](__a, $cg(self, 'BlockNode')).$r) {
          if (level.$m['=='](level, $cg(self, 'LEVEL_TOP')).$r) {
            return ("return ($B.b.$value = " + (__a = code).$m.to_s(__a) + ", $B.b)");
          } else {





            return ("$break(" + (__a = code).$m.to_s(__a) + ")");
          }
        } else {
          return ("$break(" + (__a = code).$m.to_s(__a) + ")");
        }
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'NextNode', function(self) {

      $defn(self, 'initialize', function(self, start, args) {var __a;
        self['@line'] = start.$m['[]'](start, $symbol_1);
        return self['@args'] = args;
      }, 2);

      $defn(self, 'returns', function(self) {
        return self;
      }, 0);

      return $defn(self, 'generate', function(self, opts, level) {var code, __a, __b, __c, __d;self['@args']==undefined&&(self['@args']=nil);
        code = [];

        if ((__a = self['@args']).$m['[]'](__a, 0).$r) {
          ($B.f = (__a = (__b = self['@args']).$m['[]'](__b, 0)).$m.each, ($B.p =function(self, arg) { var __a, __b;if (arg === undefined) { arg = nil; }            return code.$m['<<'](code, arg.$m.generate(arg, opts, $cg(self, 'LEVEL_EXPR')));}).$proc =[self], $B.f)(__a);
        }

        __a = code.$m.length(code);
        if ((__b = (0)).$m['==='](__b, __a).$r) {
          code = "nil";
        } else if ((__b = (1)).$m['==='](__b, __a).$r) {
          code = code.$m['[]'](code, 0);
        } else {
        code = (__b = (__c = '[').$m['+'](__c, code.$m.join(code, ', '))).$m['+'](__b, ']');
        };

        if ((__a = opts.$m['[]'](opts, $symbol_9)).$m['in_while_scope?'](__a).$r) {
          return "continue";
        } else {

          return ("return " + (__a = code).$m.to_s(__a));


        }
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'RedoNode', function(self) {

      $defn(self, 'initialize', function(self, start) {var __a;
        return self['@line'] = start.$m['[]'](start, $symbol_1);
      }, 1);

      return $defn(self, 'generate', function(self, opts, level) {var __a, __b, __c, __d;
        if ((__a = opts.$m['[]'](opts, $symbol_9)).$m['in_while_scope?'](__a).$r) {
          return ((__a = (__b = (__c = opts.$m['[]'](opts, $symbol_9)).$m.while_scope(__c)).$m.redo_var(__b)).$m.to_s(__a) + " = true");
        } else {
          return "REDO()";
        }
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'WhileNode', function(self) { var __a;

      self.$m.$attr_reader(self, $symbol_16);

      $defn(self, 'initialize', function(self, begn, exp, stmt, endn) {var __a;
        self['@line'] = begn.$m['[]'](begn, $symbol_1);
        self['@type'] = begn.$m['[]'](begn, $symbol_10);
        self['@expr'] = exp;
        self['@stmt'] = stmt;
        return self['@end_line'] = endn.$m['[]'](endn, $symbol_1);
      }, 4);

      $defn(self, 'returns', function(self) {
        self['@returns'] = Qtrue;
        return self;
      }, 0);

      $defn(self, 'set_captures_break', function(self) {var tmp, __a;self['@current_scope']==undefined&&(self['@current_scope']=nil);
        tmp = (__a = self['@current_scope']).$m.temp_local(__a);
        return self['@captures_break'] = tmp;
      }, 0);

      return $defn(self, 'generate', function(self, opts, level) {var __a, stmt_level, truthy, eval_expr, __b, code, return_value;self['@type']==undefined&&(self['@type']=nil);self['@expr']==undefined&&(self['@expr']=nil);self['@stmt']==undefined&&(self['@stmt']=nil);self['@end_line']==undefined&&(self['@end_line']=nil);self['@captures_break']==undefined&&(self['@captures_break']=nil);
        self['@current_scope'] = opts.$m['[]'](opts, $symbol_9);
        stmt_level = ((level.$m['=='](level, $cg(self, 'LEVEL_EXPR')).$r ? $cg(self, 'LEVEL_TOP_CLOSURE') : $cg(self, 'LEVEL_TOP')));
        truthy = ((__a = self['@type']).$m['=='](__a, 'while').$r ? '' : '!');

        if (stmt_level.$m['=='](stmt_level, $cg(self, 'LEVEL_TOP_CLOSURE')).$r) {
          self.$m.$returns(self);
          self['@level_expr'] = Qtrue;
        }

        self['@redo_var'] = eval_expr = (__a = opts.$m['[]'](opts, $symbol_9)).$m.temp_local(__a);
        code = ((__a = eval_expr).$m.to_s(__a) + " = false; while (" + (__a = eval_expr).$m.to_s(__a) + " || " + (__a = truthy).$m.to_s(__a) + "(");
        code = code.$m['+'](code, (__b = self['@expr']).$m.generate(__b, opts, $cg(self, 'LEVEL_EXPR')));
        code = code.$m['+'](code, (").$r) {" + (__b = eval_expr).$m.to_s(__b) + " = false;"));

        (__a = opts.$m['[]'](opts, $symbol_9)).$m.push_while_scope(__a, self);

        code = code.$m['+'](code, (__b = self['@stmt']).$m.process(__b, opts, $cg(self, 'LEVEL_TOP')));

        (__a = opts.$m['[]'](opts, $symbol_9)).$m.pop_while_scope(__a);

        code = code.$m['+'](code, self.$m.$fix_line_number(self, opts, self['@end_line']));
        code = code.$m['+'](code, "}");

        (__a = opts.$m['[]'](opts, $symbol_9)).$m.queue_temp(__a, eval_expr);

        return_value = "nil";

        if (self['@captures_break'].$r) {
          code = ("#@captures_break = nil; " + (__a = code).$m.to_s(__a));
          (__a = opts.$m['[]'](opts, $symbol_9)).$m.queue_temp(__a, self['@captures_break']);
          return_value = self['@captures_break'];
        }

        if (stmt_level.$m['=='](stmt_level, $cg(self, 'LEVEL_TOP_CLOSURE')).$r) {          code = ("(function() {" + (__a = code).$m.to_s(__a) + " return " + (__a = return_value).$m.to_s(__a) + ";})()");}
        return code;
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'SuperNode', function(self) {

      $defn(self, 'initialize', function(self, start, args) {var __a;
        self['@line'] = start.$m['[]'](start, $symbol_1);
        return self['@args'] = args;
      }, 2);

      return $defn(self, 'generate', function(self, opts, level) {var parts, __a, __b;self['@args']==undefined&&(self['@args']=nil);
        parts = [];

        if ((__a = self['@args']).$m['[]'](__a, 0).$r) {
          ($B.f = (__a = (__b = self['@args']).$m['[]'](__b, 0)).$m.each, ($B.p =function(self, arg) { var __a, __b;if (arg === undefined) { arg = nil; }            return parts.$m['<<'](parts, arg.$m.generate(arg, opts, $cg(self, 'LEVEL_EXPR')));}).$proc =[self], $B.f)(__a);
        }

        return ("$super(arguments.callee, self, [" + (__a = parts.$m.join(parts, ', ')).$m.to_s(__a) + "])");
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'ReturnNode', function(self) {

      $defn(self, 'initialize', function(self, ret, val) {var __a;
        self['@line'] = ret.$m['[]'](ret, $symbol_1);
        return self['@args'] = val;
      }, 2);

      $defn(self, 'returns', function(self) {
        return self;
      }, 0);

      return $defn(self, 'generate', function(self, opts, level) {var args, __a, __b, code, __c, return_func;self['@args']==undefined&&(self['@args']=nil);
        args = self['@args'];

        if ((__a = args.$m['[]'](args, 0)).$m['nil?'](__a).$r) {
          code = (__a = (__b = $cg(self, 'NilNode')).$m['new'](__b)).$m.generate(__a, opts, level);
        } else if ((__a = (__b = args.$m['[]'](args, 0)).$m.length(__b)).$m['=='](__a, 1).$r) {
          code = (__a = (__b = args.$m['[]'](args, 0)).$m['[]'](__b, 0)).$m.generate(__a, opts, level);
        } else {

          code = (__a = (__b = $cg(self, 'NilNode')).$m['new'](__b)).$m.generate(__a, opts, level);
          code = [];
          ($B.f = (__a = args.$m['[]'](args, 0)).$m.each, ($B.p =function(self, arg) { var __a, __b;if (arg === undefined) { arg = nil; }            return code.$m['<<'](code, arg.$m.generate(arg, opts, $cg(self, 'LEVEL_EXPR')));}).$proc =[self], $B.f)(__a);
          code = code = (__a = (__b = '[').$m['+'](__b, code.$m.join(code, ', '))).$m['+'](__a, ']');
        }


        if ((__a = (__b = opts.$m['[]'](opts, $symbol_9)).$m['is_a?'](__b, $cg(self, 'DefNode'))).$m['!'](__a).$r) {
          return_func = '__return_func';
          return ("$return(" + (__a = code).$m.to_s(__a) + ", " + (__a = return_func).$m.to_s(__a) + ")");


        } else if (level.$m['=='](level, $cg(self, 'LEVEL_TOP')).$r) {
          return ("return " + (__a = code).$m.to_s(__a));
        } else {
          return ("$return(" + (__a = code).$m.to_s(__a) + ")");
        }
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'BeginNode', function(self) {

      $defn(self, 'initialize', function(self, beginn, body, endn) {var __a;
        self['@line'] = beginn.$m['[]'](beginn, $symbol_1);
        self['@body'] = body;
        return self['@end_line'] = endn.$m['[]'](endn, $symbol_1);
      }, 3);

      return $defn(self, 'generate', function(self, opts, level) {var code, old_indent, __a, __b, __c;self['@body']==undefined&&(self['@body']=nil);self['@end_line']==undefined&&(self['@end_line']=nil);
        code = "try {";
        old_indent = opts.$m['[]'](opts, $symbol_3);
        opts.$m['[]='](opts, $symbol_3, (__b = opts.$m['[]'](opts, $symbol_3)).$m['+'](__b, $cg(self, 'INDENT')));

        code = code.$m['+'](code, (__b = self['@body']).$m.process(__b, opts, $cg(self, 'LEVEL_TOP')));
        code = code.$m['+'](code, "} catch (__err__) {");

        ($B.f = (__a = (__b = self['@body']).$m.opt_rescue(__b)).$m.each, ($B.p =function(self, res) { var __a, __b, __c, __d, __e;if (res === undefined) { res = nil; }
          code = code.$m['+'](code, ((__b = self.$m.$fix_line_number(self, opts, (__d = res.$m['[]'](res, 0)).$m['[]'](__d, $symbol_1))).$m.to_s(__b) + "if (true){"));
          opts.$m['[]='](opts, $symbol_3, (__b = opts.$m['[]'](opts, $symbol_3)).$m['+'](__b, $cg(self, 'INDENT')));
          if (res.$m['[]'](res, 2).$r) {            (__a = opts.$m['[]'](opts, $symbol_9)).$m.ensure_variable(__a, (__b = res.$m['[]'](res, 2)).$m.value(__b));}
          if (res.$m['[]'](res, 2).$r) {            code = code.$m['+'](code, ((__b = (__c = res.$m['[]'](res, 2)).$m.value(__c)).$m['+'](__b, " = __err__;")));}
          code = code.$m['+'](code, ((__b = (__c = res.$m['[]'](res, 3)).$m.process(__c, opts, $cg(self, 'LEVEL_TOP'))).$m.to_s(__b) + "}"));
          return opts.$m['[]='](opts, $symbol_3, old_indent.$m['+'](old_indent, $cg(self, 'INDENT')));
        }).$proc =[self], $B.f)(__a);


        opts.$m['[]='](opts, $symbol_3, old_indent);
        code = code.$m['+'](code, ((__b = self.$m.$fix_line_number(self, opts, self['@end_line'])).$m['+'](__b, "}")));
        return code;
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'TernaryNode', function(self) {

      $defn(self, 'initialize', function(self, expr, truthy, falsy) {var __a;
        self['@line'] = expr.$m.line(expr);
        self['@expr'] = expr;
        self['@true'] = truthy;
        return self['@false'] = falsy;
      }, 3);

      return $defn(self, 'generate', function(self, opts, level) {var __a, __b;self['@expr']==undefined&&(self['@expr']=nil);self['@true']==undefined&&(self['@true']=nil);self['@false']==undefined&&(self['@false']=nil);
        return ("(" + (__a = (__b = self['@expr']).$m.generate(__b, opts, $cg(self, 'LEVEL_EXPR'))).$m.to_s(__a) + ".$r ? " + (__a = (__b = self['@true']).$m.generate(__b, opts, $cg(self, 'LEVEL_EXPR'))).$m.to_s(__a) + " : " + (__a = (__b = self['@false']).$m.generate(__b, opts, $cg(self, 'LEVEL_EXPR'))).$m.to_s(__a) + ")");
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'GvarNode', function(self) { var __a;

      self.$m.$attr_reader(self, $symbol_10);

      $defn(self, 'initialize', function(self, val) {var __a;
        self['@line'] = val.$m['[]'](val, $symbol_1);
        return self['@value'] = val.$m['[]'](val, $symbol_10);
      }, 1);

      return $defn(self, 'generate', function(self, opts, level) {var __a;self['@value']==undefined&&(self['@value']=nil);
        return ("$rb.gg('" + (__a = self['@value']).$m.to_s(__a) + "')");
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'FileNode', function(self) {

      $defn(self, 'initialize', function(self, val) {var __a;
        return self['@line'] = val.$m['[]'](val, $symbol_1);
      }, 1);

      return $defn(self, 'generate', function(self, opts, level) {
        return "__FILE__";
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'LineNode', function(self) {

      $defn(self, 'initialize', function(self, val) {var __a;
        self['@line'] = val.$m['[]'](val, $symbol_1);
        return self['@val'] = val.$m['[]'](val, $symbol_10);
      }, 1);

      return $defn(self, 'generate', function(self, opts, level) {var __a;self['@val']==undefined&&(self['@val']=nil);
        return ("(" + (__a = self['@val']).$m.to_s(__a) + ")");
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'RegexpNode', function(self) {

      $defn(self, 'initialize', function(self, begn, parts) {var __a;
        self['@line'] = begn.$m['[]'](begn, $symbol_1);
        return self['@parts'] = parts;
      }, 2);

      return $defn(self, 'generate', function(self, opts, level) {var parts, __a, __b;self['@parts']==undefined&&(self['@parts']=nil);
        parts = ($B.f = (__a = self['@parts']).$m.map, ($B.p =function(self, part) { var __a, __b;if (part === undefined) { part = nil; }
          if ((__a = part.$m['[]'](part, 0)).$m['=='](__a, 'string_content').$r) {
            return (__a = part.$m['[]'](part, 1)).$m['[]'](__a, $symbol_10);
          } else if ((__a = part.$m['[]'](part, 0)).$m['=='](__a, 'string_dbegin').$r) {
            return (__a = part.$m['[]'](part, 1)).$m.generate(__a, opts, $cg(self, 'LEVEL_EXPR'));
          }
        }).$proc =[self], $B.f)(__a);

        return ("/" + (__a = parts.$m.join(parts, '')).$m.to_s(__a) + "/");
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'WordsNode', function(self) {

      $defn(self, 'initialize', function(self, begn, parts, endn) {var __a;
        self['@line'] = begn.$m['[]'](begn, $symbol_1);
        self['@parts'] = parts;
        return self['@end_line'] = endn.$m['[]'](endn, $symbol_1);
      }, 3);

      return $defn(self, 'generate', function(self, opts, level) {var parts, __a, __b, __c;self['@parts']==undefined&&(self['@parts']=nil);
        parts = ($B.f = (__a = self['@parts']).$m.map, ($B.p =function(self, part) { var __a, __b, __c;if (part === undefined) { part = nil; }
          if ((__a = part.$m['[]'](part, 0)).$m['=='](__a, 'string_content').$r) {
            return (__a = (__b = part.$m['[]'](part, 1)).$m['[]'](__b, $symbol_10)).$m.inspect(__a);
          } else {
            return (__a = (__b = $cg(self, 'CallNode')).$m['new'](__b, part.$m['[]'](part, 1), $hash($symbol_10, 'to_s', $symbol_1, self['@line']), [])).$m.generate(__a, opts, $cg(self, 'LEVEL_EXPR'));
          }
        }).$proc =[self], $B.f)(__a);

        return (__a = (__b = '[').$m['+'](__b, parts.$m.join(parts, ', '))).$m['+'](__a, ']');
      }, 2);
        }, 0);

    $class(self, $cg(self, 'BaseNode'), 'RangeNode', function(self) {

      $defn(self, 'initialize', function(self, range, beg, last) {var __a;
        self['@line'] = beg.$m.line(beg);
        self['@beg'] = beg;
        self['@last'] = last;
        self['@range'] = range.$m['[]'](range, $symbol_10);
        return self['@end_line'] = last.$m.line(last);
      }, 3);

      return $defn(self, 'generate', function(self, opts, level) {var beg, __a, last, excl;self['@beg']==undefined&&(self['@beg']=nil);self['@last']==undefined&&(self['@last']=nil);self['@range']==undefined&&(self['@range']=nil);
        beg = (__a = self['@beg']).$m.generate(__a, opts, $cg(self, 'LEVEL_EXPR'));
        last = (__a = self['@last']).$m.generate(__a, opts, $cg(self, 'LEVEL_EXPR'));
        excl = (__a = self['@range']).$m['=='](__a, '...');
        return ("$range(" + (__a = beg).$m.to_s(__a) + ", " + (__a = last).$m.to_s(__a) + ", " + (__a = excl).$m.to_s(__a) + ")");
      }, 2);
        }, 0);

    return $class(self, $cg(self, 'BaseNode'), 'UndefNode', function(self) {

      $defn(self, 'initialize', function(self, start, parts) {var __a;
        self['@line'] = start.$m['[]'](start, $symbol_1);
        return self['@parts'] = parts;
      }, 2);

      return $defn(self, 'generate', function(self, opts, level) {var parts, __a, __b;self['@parts']==undefined&&(self['@parts']=nil);
        parts = ($B.f = (__a = self['@parts']).$m.map, ($B.p =function(self, a) { var __a, __b, __c;if (a === undefined) { a = nil; }
          if (a.$m['is_a?'](a, $cg(self, 'SymbolNode')).$r) {
            return a.$m.generate(a, opts, level);
          } else {
            return (__a = (__b = '"').$m['+'](__b, a.$m['[]'](a, $symbol_10))).$m['+'](__a, '"');
          }
        }).$proc =[self], $B.f)(__a);
        parts.$m.unshift(parts, 'self');
        return ("$rb.um(" + (__a = parts.$m.join(parts, ', ')).$m.to_s(__a) + ")");
      }, 2);
        }, 0);
    }, 0);
}, 2);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G, $symbol_1 = $symbol('line'), $symbol_2 = $symbol('top'), $symbol_3 = $symbol('indent'), $symbol_4 = $symbol('variables'), $symbol_5 = $symbol('parent'), $symbol_6 = $symbol('file_helpers'), $symbol_7 = $symbol('opts'), $symbol_8 = $symbol('nodes'), $symbol_9 = $symbol('scope'), $symbol_10 = $symbol('value'), $symbol_11 = $symbol('block'), $symbol_12 = $symbol('recv'), $symbol_13 = $symbol('mid'), $symbol_14 = $symbol('opt_rescue'), $symbol_15 = $symbol('arefs'), $symbol_16 = $symbol('redo_var');$rb.mm(['attr_reader', 'new', '<=', '+', 'fix_line_number', 'generate', 'line', '[]', '<', 'times', '-', 'line=', '<<', 'pop', '>', 'last', 'include?', 'find_variable', 'variables', 'is_a?', 'parent', 'succ', 'attr_accessor', '[]=', 'to_s', 'returns', 'empty?', 'join', 'each', 'length', 'process', '==', 'expression?', 'register_symbol', 'attr_writer', '=~', 'js_reserved_words', 'value=', 'value', 'temp_local', 'register_mm_id', 'mid_to_jsid', 'local_variable?', 'unshift', 'queue_temp', 'nil?', 'param_variable', '!=', '-@', 'map', 'flatten', 'each_with_index', 'ensure_variable', 'generate_assign', 'recv', 'arefs', 'mid', 'raise', 'inspect', 'generate_mlhs_context', 'puts', 'push', 'ensure_ivar', 'nodes', 'set_uses_block', 'yield_code', '===', 'in_while_scope?', 'while_scope', 'set_captures_break', 'redo_var', 'push_while_scope', 'pop_while_scope', '!', 'opt_rescue']);return $$();
 });opal.register('opal/ruby/parser.rb', function($rb, self, __FILE__) { function $$(){
self.$m.$require(self, 'opal/ruby/ruby_parser');
self.$m.$require(self, 'opal/ruby/nodes');

self.$m.$require(self, 'strscan');

return $class(self, nil, 'Opal', function(self) { 
  return $class(self, $cg($cg(self, 'Racc'), 'Parser'), 'RubyParser', function(self) {

    $class(self, $cg(self, 'StandardError'), 'RubyLexingError', function(self) {      return nil;

        }, 0);

    $defn(self, 'initialize', function(self, source, options) {var __a;if (options == undefined) {options = $hash();}
      self['@lex_state'] = $symbol_1;

      self['@cond'] = 0;
      self['@cmdarg'] = 0;
      self['@line_number'] = 1;

      self['@string_parse_stack'] = [];

      return self['@scanner'] = (__a = $cg(self, 'StringScanner')).$m['new'](__a, source);
    }, -2);

    $defn(self, 'parse!', function(self) {var __a;
      return self.$m.$do_parse(self);
    }, 0);

    $defn(self, 'next_token', function(self) {var t, __a, __b;self['@line_number']==undefined&&(self['@line_number']=nil);
      t = self.$m.$get_next_token(self);

      t.$m['[]='](t, 1, $hash($symbol_2, t.$m['[]'](t, 1), $symbol_3, self['@line_number']));
      return t;
    }, 0);

    $defn(self, 'cond_push', function(self, n) {var __a, __b;self['@cond']==undefined&&(self['@cond']=nil);
      return self['@cond'] = (__a = ((__b = self['@cond']).$m['<<'](__b, 1))).$m['|'](__a, (n.$m['&'](n, 1)));
    }, 1);

    $defn(self, 'cond_pop', function(self) {var __a;self['@cond']==undefined&&(self['@cond']=nil);
      return self['@cond'] = (__a = self['@cond']).$m['>>'](__a, 1);
    }, 0);

    $defn(self, 'cond_lexpop', function(self) {var __a, __b;self['@cond']==undefined&&(self['@cond']=nil);
      return self['@cond'] = (__a = ((__b = self['@cond']).$m['>>'](__b, 1))).$m['|'](__a, ((__b = self['@cond']).$m['&'](__b, 1)));
    }, 0);

    $defn(self, 'cond?', function(self) {var __a, __b;self['@cond']==undefined&&(self['@cond']=nil);
      return (__a = ((__b = self['@cond']).$m['&'](__b, 1))).$m['!='](__a, 0);
    }, 0);

    $defn(self, 'cmdarg_push', function(self, n) {var __a, __b;self['@cmdarg']==undefined&&(self['@cmdarg']=nil);
      return self['@cmdarg'] = (__a = ((__b = self['@cmdarg']).$m['<<'](__b, 1))).$m['|'](__a, (n.$m['&'](n, 1)));
    }, 1);

    $defn(self, 'cmdarg_pop', function(self) {var __a;self['@cmdarg']==undefined&&(self['@cmdarg']=nil);
      return self['@cmdarg'] = (__a = self['@cmdarg']).$m['>>'](__a, 1);
    }, 0);

    $defn(self, 'cmdarg_lexpop', function(self) {var __a, __b;self['@cmdarg']==undefined&&(self['@cmdarg']=nil);
      return self['@cmdarg'] = (__a = ((__b = self['@cmdarg']).$m['>>'](__b, 1))).$m['|'](__a, ((__b = self['@cmdarg']).$m['&'](__b, 1)));
    }, 0);

    $defn(self, 'cmdarg?', function(self) {var __a, __b;self['@cmdarg']==undefined&&(self['@cmdarg']=nil);
      return (__a = ((__b = self['@cmdarg']).$m['&'](__b, 1))).$m['!='](__a, 0);
    }, 0);

    $defn(self, 'push_string_parse', function(self, hash) {var __a;self['@string_parse_stack']==undefined&&(self['@string_parse_stack']=nil);
      return (__a = self['@string_parse_stack']).$m['<<'](__a, hash);
    }, 1);

    $defn(self, 'pop_string_parse', function(self) {var __a;self['@string_parse_stack']==undefined&&(self['@string_parse_stack']=nil);
      return (__a = self['@string_parse_stack']).$m.pop(__a);
    }, 0);

    $defn(self, 'current_string_parse', function(self) {var __a;self['@string_parse_stack']==undefined&&(self['@string_parse_stack']=nil);
      return (__a = self['@string_parse_stack']).$m.last(__a);
    }, 0);

    $defn(self, 'next_string_token', function(self) {var str_parse, __a, scanner, space, interpolate, __b, __c, words, __d, result, str_buffer, complete_str;self['@scanner']==undefined&&(self['@scanner']=nil);

      str_parse = self.$m.$current_string_parse(self);
      scanner = self['@scanner'];
      space = Qfalse;


      interpolate = (((__a = (__b = str_parse.$m['[]'](str_parse, $symbol_4)).$m['!='](__b, "'")).$r ? (__b = str_parse.$m['[]'](str_parse, $symbol_4)).$m['!='](__b, 'w') : __a));

      words = (__a = ['w', 'W']).$m['include?'](__a, str_parse.$m['[]'](str_parse, $symbol_4));

      if (((__a = (__b = ['w', 'W']).$m['include?'](__b, str_parse.$m['[]'](str_parse, $symbol_4))).$r ? scanner.$m.scan(scanner, /\s+/) : __a).$r) {        space = Qtrue;}



      if (scanner.$m.scan(scanner, (__b = $cg(self, 'Regexp')).$m['new'](__b, (__c = $cg(self, 'Regexp')).$m.escape(__c, str_parse.$m['[]'](str_parse, $symbol_5)))).$r) {
        if (((__a = words).$r ? (__b = str_parse.$m['[]'](str_parse, $symbol_6)).$m['!'](__b) : __a).$r) {
          str_parse.$m['[]='](str_parse, $symbol_6, Qtrue);
          scanner.$m['pos='](scanner, (__b = scanner.$m.pos(scanner)).$m['-'](__b, 1));
          return [$symbol_7, ' '];
        }
        self.$m.$pop_string_parse(self);



        if ((__a = ['"', "'"]).$m['include?'](__a, str_parse.$m['[]'](str_parse, $symbol_4)).$r) {
          self['@lex_state'] = $symbol_8;
          return [$symbol_9, scanner.$m.matched(scanner)];

        } else if ((__a = str_parse.$m['[]'](str_parse, $symbol_4)).$m['=='](__a, '`').$r) {
          self['@lex_state'] = $symbol_8;
          return [$symbol_9, scanner.$m.matched(scanner)];

        } else if ((__a = str_parse.$m['[]'](str_parse, $symbol_4)).$m['=='](__a, '/').$r) {
          if (scanner.$m.scan(scanner, /\w+/).$r) {            result = scanner.$m.matched(scanner);}
          self['@lex_state'] = $symbol_8;
          return [$symbol_10, result];

        } else {
          self['@lex_state'] = $symbol_8;
          return [$symbol_9, scanner.$m.matched(scanner)];
        }
      }

      if (space.$r) {        return [$symbol_7, ' '];}


      str_buffer = [];

      if (scanner.$m.scan(scanner, /#(\$\@)\w+/).$r) {
        if (interpolate.$r) {
          return [$symbol_11, (__a = scanner.$m.matched(scanner)).$m.slice(__a, 2)];
        } else {
          str_buffer.$m['<<'](str_buffer, scanner.$m.matched(scanner));
        }

      } else if (scanner.$m.scan(scanner, /#\{/).$r) {
        if (interpolate.$r) {

          str_parse.$m['[]='](str_parse, $symbol_12, Qfalse);
          return [$symbol_13, scanner.$m.matched(scanner)];
        } else {
          str_buffer.$m['<<'](str_buffer, scanner.$m.matched(scanner));
        }


      } else if (scanner.$m.scan(scanner, /\#/).$r) {
        str_buffer.$m['<<'](str_buffer, '#');
      }

      self.$m.$add_string_content(self, str_buffer, str_parse);
      complete_str = str_buffer.$m.join(str_buffer, '');
      return [$symbol_14, complete_str];
    }, 0);

    $defn(self, 'add_string_content', function(self, str_buffer, str_parse) {var scanner, end_str_re, __a, __b, __c, interpolate, words, c, handled, __d, __e, __f, reg, __g, __h;self['@scanner']==undefined&&(self['@scanner']=nil);
      scanner = self['@scanner'];


      end_str_re = (__a = $cg(self, 'Regexp')).$m['new'](__a, (__b = $cg(self, 'Regexp')).$m.escape(__b, str_parse.$m['[]'](str_parse, $symbol_5)));

      interpolate = (__a = ['"', 'W', '/', '`']).$m['include?'](__a, str_parse.$m['[]'](str_parse, $symbol_4));

      words = (__a = ['W', 'w']).$m['include?'](__a, str_parse.$m['[]'](str_parse, $symbol_4));

      __d = nil; __a = false; while (__a || !(scanner.$m['eos?'](scanner)).$r) {__a = false;
      c = nil;
      handled = Qtrue;

      if (scanner.$m.check(scanner, end_str_re).$r) {

        __b = nil; break;

      } else if (((__c = words).$r ? scanner.$m.scan(scanner, /\s/) : __c).$r) {
        scanner.$m['pos='](scanner, (__d = scanner.$m.pos(scanner)).$m['-'](__d, 1));
        __c = nil; break;

      } else if (((__d = interpolate).$r ? scanner.$m.check(scanner, /#(?=[\@\{])/) : __d).$r) {
        __d = nil; break;

      } else if (scanner.$m.scan(scanner, /\\\\/).$r) {
        c = scanner.$m.matched(scanner);

      } else if (scanner.$m.scan(scanner, /\\/).$r) {
        c = scanner.$m.matched(scanner);
        if (scanner.$m.scan(scanner, end_str_re).$r) {          c = c.$m['+'](c, scanner.$m.matched(scanner));}

      } else {
        handled = Qfalse;
      }

      if (!handled.$r) {
        reg = (words.$r ? (__e = $cg(self, 'Regexp')).$m['new'](__e, ("[^" + (__f = (__g = $cg(self, 'Regexp')).$m.escape(__g, str_parse.$m['[]'](str_parse, $symbol_5))).$m.to_s(__f) + "\#\0\n\ \\\\]+|.")) : (__e = $cg(self, 'Regexp')).$m['new'](__e, ("[^" + (__f = (__g = $cg(self, 'Regexp')).$m.escape(__g, str_parse.$m['[]'](str_parse, $symbol_5))).$m.to_s(__f) + "\#\0\\\\]+|.")));
        scanner.$m.scan(scanner, reg);
        c = scanner.$m.matched(scanner);
      }

      ((__e = c).$r ? __e : c = scanner.$m.matched(scanner));
      str_buffer.$m['<<'](str_buffer, c);
      };

      if (scanner.$m['eos?'](scanner).$r) {        return self.$m.$raise(self, "reached EOF while in string");}
    }, 2);

    return $defn(self, 'get_next_token', function(self) {var string_scanner, __a, __b, scanner, space_seen, cmd_start, c, __c, __d, start_word, end_word, result, __e, sign, matched;self['@scanner']==undefined&&(self['@scanner']=nil);self['@line_number']==undefined&&(self['@line_number']=nil);self['@lex_state']==undefined&&(self['@lex_state']=nil);
      string_scanner = self.$m.$current_string_parse(self);

      if (((__a = string_scanner).$r ? string_scanner.$m['[]'](string_scanner, $symbol_12) : __a).$r) {
        return self.$m.$next_string_token(self);
      }


      scanner = self['@scanner'];
      space_seen = Qfalse;
      cmd_start = Qfalse;
      c = '';

      __a = false; while (__a || (Qtrue).$r) {__a = false;
      if (scanner.$m.scan(scanner, /\ |\t|\r/).$r) {
        space_seen = Qtrue;
        continue;

      } else if (scanner.$m.scan(scanner, /(\n|#)/).$r) {
        c = scanner.$m.matched(scanner);
        if (c.$m['=='](c, '#').$r) {          scanner.$m.scan(scanner, /(.*)/);} else {          self['@line_number'] = (__b = self['@line_number']).$m['+'](__b, 1);}

        scanner.$m.scan(scanner, /(\n+)/);
        if (scanner.$m.matched(scanner).$r) {          self['@line_number'] = (__b = self['@line_number']).$m['+'](__b, (__c = scanner.$m.matched(scanner)).$m.length(__c));}

        if ((__b = [$symbol_1, $symbol_15]).$m['include?'](__b, self['@lex_state']).$r) {          continue;}

        cmd_start = Qtrue;
        self['@lex_state'] = $symbol_1;
        return ['\\n', '\\n'];

      } else if (scanner.$m.scan(scanner, /\;/).$r) {
        self['@lex_state'] = $symbol_1;
        return [';', ';'];

      } else if (scanner.$m.scan(scanner, /\"/).$r) {
        self.$m.$push_string_parse(self, $hash($symbol_4, '"', $symbol_12, Qtrue, $symbol_5, '"'));
        return [$symbol_16, scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\'/).$r) {
        self.$m.$push_string_parse(self, $hash($symbol_4, "'", $symbol_12, Qtrue, $symbol_5, "'"));
        return [$symbol_16, scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\`/).$r) {
        self.$m.$push_string_parse(self, $hash($symbol_4, "`", $symbol_12, Qtrue, $symbol_5, "`"));
        return [$symbol_17, scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\%W/).$r) {
        start_word = scanner.$m.scan(scanner, /./);
        end_word = ((__b = (__c = $hash('(', ')', '[', ']', '{', '}')).$m['[]'](__c, start_word)).$r ? __b : start_word);
        self.$m.$push_string_parse(self, $hash($symbol_4, 'W', $symbol_12, Qtrue, $symbol_5, end_word));
        return [$symbol_18, scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\%w/).$r) {
        start_word = scanner.$m.scan(scanner, /./);
        end_word = ((__b = (__c = $hash('(', ')', '[', ']', '{', '}')).$m['[]'](__c, start_word)).$r ? __b : start_word);
        self.$m.$push_string_parse(self, $hash($symbol_4, 'w', $symbol_12, Qtrue, $symbol_5, end_word));
        return [$symbol_19, scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\%[Qq]/).$r) {
        start_word = scanner.$m.scan(scanner, /./);
        end_word = ((__b = (__c = $hash('(', ')', '[', ']', '{', '}')).$m['[]'](__c, start_word)).$r ? __b : start_word);
        self.$m.$push_string_parse(self, $hash($symbol_4, start_word, $symbol_12, Qtrue, $symbol_5, end_word));
        return [$symbol_16, scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\//).$r) {
        if ((__b = [$symbol_1, $symbol_20]).$m['include?'](__b, self['@lex_state']).$r) {
          self.$m.$push_string_parse(self, $hash($symbol_4, '/', $symbol_12, Qtrue, $symbol_5, '/'));
          return [$symbol_21, scanner.$m.matched(scanner)];
        } else if (scanner.$m.scan(scanner, /\=/).$r) {
          self['@lex_state'] = $symbol_1;
          return [$symbol_22, '/'];
        } else if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
          self['@lex_state'] = $symbol_8;
        }

        return ['/', '/'];

      } else if (scanner.$m.scan(scanner, /\%/).$r) {
        self['@lex_state'] = ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r ? $symbol_8 : $symbol_1);
        return ['%', '%'];

      } else if (scanner.$m.scan(scanner, /\(/).$r) {
        result = scanner.$m.matched(scanner);
        if ((__b = [$symbol_1, $symbol_20]).$m['include?'](__b, self['@lex_state']).$r) {
          result = $symbol_24;
        } else if (space_seen.$r) {
          result = '(';
        }

        self['@lex_state'] = $symbol_1;
        self.$m.$cond_push(self, 0);
        self.$m.$cmdarg_push(self, 0);

        return [result, scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\)/).$r) {
        self.$m.$cond_lexpop(self);
        self.$m.$cmdarg_lexpop(self);
        self['@lex_state'] = $symbol_8;
        return [')', scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\[/).$r) {
        result = scanner.$m.matched(scanner);

        if ((__b = [$symbol_23, $symbol_15]).$m['include?'](__b, self['@lex_state']).$r) {
          self['@lex_state'] = $symbol_25;
          if (scanner.$m.scan(scanner, /\]=/).$r) {
            return ['[]=', '[]='];
          } else if (scanner.$m.scan(scanner, /\]/).$r) {
            return ['[]', '[]'];
          } else {
            self.$m.$raise(self, "Unexpected '[' token");
          }
        } else if (((__b = (__c = [$symbol_1, $symbol_20]).$m['include?'](__c, self['@lex_state'])).$r ? __b : space_seen).$r) {
          self['@lex_state'] = $symbol_1;
          self.$m.$cond_push(self, 0);
          self.$m.$cmdarg_push(self, 0);
          return ['[', scanner.$m.matched(scanner)];
        } else {
          self['@lex_state'] = $symbol_1;
          self.$m.$cond_push(self, 0);
          self.$m.$cmdarg_push(self, 0);
          return ['[@', scanner.$m.matched(scanner)];
        }

      } else if (scanner.$m.scan(scanner, /\]/).$r) {
        self.$m.$cond_lexpop(self);
        self.$m.$cmdarg_lexpop(self);
        self['@lex_state'] = $symbol_8;
        return [']', scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\}/).$r) {
        self.$m.$cond_lexpop(self);
        self.$m.$cmdarg_lexpop(self);
        self['@lex_state'] = $symbol_8;

        if (self.$m.$current_string_parse(self).$r) {          (__b = self.$m.$current_string_parse(self)).$m['[]='](__b, $symbol_12, Qtrue);}
        return ['}', scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\.\.\./).$r) {
        self['@lex_state'] = $symbol_1;
        return ['...', scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\.\./).$r) {
        self['@lex_state'] = $symbol_1;
        return ['..', scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\./).$r) {
        if(!((__b = self['@lex_state']).$m['=='](__b, $symbol_23)).$r) {self['@lex_state'] = $symbol_15};
        return ['.', scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\*\*\=/).$r) {
        self['@lex_state'] = $symbol_1;
        return [$symbol_22, '**'];

      } else if (scanner.$m.scan(scanner, /\*\*/).$r) {
        return ['**', '**'];

      } else if (scanner.$m.scan(scanner, /\*\=/).$r) {
        self['@lex_state'] = $symbol_1;
        return [$symbol_22, '*'];

      } else if (scanner.$m.scan(scanner, /\*/).$r) {
        result = scanner.$m.matched(scanner);
        if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
          self['@lex_state'] = $symbol_8;
          return ['*', result];
        } else if (((__b = space_seen).$r ? scanner.$m.check(scanner, /\S/) : __b).$r) {
          self['@lex_state'] = $symbol_1;
          return [$symbol_26, result];
        } else if ((__b = [$symbol_1, $symbol_20]).$m['include?'](__b, self['@lex_state']).$r) {
          self['@lex_state'] = $symbol_1;
          return [$symbol_26, result];
        } else {
          self['@lex_state'] = $symbol_1;
          return ['*', result];
        }

      } else if (scanner.$m.scan(scanner, /\:\:/).$r) {
        if ((__b = [$symbol_1, $symbol_20, $symbol_27]).$m['include?'](__b, self['@lex_state']).$r) {
          self['@lex_state'] = $symbol_1;
          return ['::@', scanner.$m.matched(scanner)];
        }

        self['@lex_state'] = $symbol_15;
        return ['::', scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\:/).$r) {
        if (((__b = (__c = [$symbol_8, $symbol_28]).$m['include?'](__c, self['@lex_state'])).$r ? __b : scanner.$m.check(scanner, /\s/)).$r) {
          if (!scanner.$m.check(scanner, /\w/).$r) {
            self['@lex_state'] = $symbol_1;
            return [':', ':'];
          }

          self['@lex_state'] = $symbol_23;
          return [$symbol_29, ':'];
        }

        if (scanner.$m.scan(scanner, /\'/).$r) {
          self.$m.$push_string_parse(self, $hash($symbol_4, "'", $symbol_12, Qtrue, $symbol_5, "'"));
        } else if (scanner.$m.scan(scanner, /\"/).$r) {
          self.$m.$push_string_parse(self, $hash($symbol_4, '"', $symbol_12, Qtrue, $symbol_5, '"'));
        }

        self['@lex_state'] = $symbol_23;
        return [$symbol_29, ':'];

      } else if (scanner.$m.check(scanner, /\|/).$r) {
        if (scanner.$m.scan(scanner, /\|\|\=/).$r) {
          self['@lex_state'] = $symbol_1;
          return [$symbol_22, '||'];
        } else if (scanner.$m.scan(scanner, /\|\|/).$r) {
          self['@lex_state'] = $symbol_1;
          return ['||', '||'];
        } else if (scanner.$m.scan(scanner, /\|\=/).$r) {
          self['@lex_state'] = $symbol_1;
          return [$symbol_22, '|'];
        } else if (scanner.$m.scan(scanner, /\|/).$r) {
          if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
            self['@lex_state'] = $symbol_8;
            return ['|', scanner.$m.matched(scanner)];
          } else {
            self['@lex_state'] = $symbol_1;
            return ['|', scanner.$m.matched(scanner)];
          }
        }

      } else if (scanner.$m.scan(scanner, /\^/).$r) {
        if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
          self['@lex_state'] = $symbol_8;
          return ['^', scanner.$m.matched(scanner)];
        }

        self['@lex_state'] = $symbol_1;
        return ['^', scanner.$m.matched(scanner)];

      } else if (scanner.$m.check(scanner, /\&/).$r) {
        if (scanner.$m.scan(scanner, /\&\&\=/).$r) {
          self['@lex_state'] = $symbol_1;
          return [$symbol_22, '&&'];
        } else if (scanner.$m.scan(scanner, /\&\&/).$r) {
          self['@lex_state'] = $symbol_1;
          return ['&&', scanner.$m.matched(scanner)];
        } else if (scanner.$m.scan(scanner, /\&\=/).$r) {
          self['@lex_state'] = $symbol_1;
          return [$symbol_22, '&'];
        } else if (scanner.$m.scan(scanner, /\&/).$r) {
          if (((__b = ((__c = space_seen).$r ? (__d = scanner.$m.check(scanner, /\s/)).$m['!'](__d) : __c)).$r ? (__c = self['@lex_state']).$m['=='](__c, $symbol_30) : __b).$r) {
            return ['&@', '&'];
          } else if ((__b = [$symbol_1, $symbol_20]).$m['include?'](__b, self['@lex_state']).$r) {
            return ['&@', '&'];
          } else {
            return ['&', '&'];
          }
        }

      } else if (scanner.$m.check(scanner, /\</).$r) {
        if (scanner.$m.scan(scanner, /\<\<\=/).$r) {
          self['@lex_state'] = $symbol_1;
          return [$symbol_22, '<<'];
        } else if (scanner.$m.scan(scanner, /\<\</).$r) {
          if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
            self['@lex_state'] = $symbol_8;
            return ['<<', '<<'];
          } else if (((__b = (__c = (__d = [$symbol_8, $symbol_15, $symbol_28, $symbol_27]).$m['include?'](__d, self['@lex_state'])).$m['!'](__c)).$r ? space_seen : __b).$r) {
            self['@lex_state'] = $symbol_1;
            return ['<<', '<<'];
          }
          self['@lex_state'] = $symbol_1;
          return ['<<', '<<'];
        } else if (scanner.$m.scan(scanner, /\<\=\>/).$r) {
          if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
            self['@lex_state'] = $symbol_8;
          } else {
            self['@lex_state'] = $symbol_1;
          }
          return ['<=>', '<=>'];
        } else if (scanner.$m.scan(scanner, /\<\=/).$r) {
          if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
            self['@lex_state'] = $symbol_8;
          } else {
            self['@lex_state'] = $symbol_1;
          }
          return ['<=', '<='];
        } else if (scanner.$m.scan(scanner, /\</).$r) {
          if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
            self['@lex_state'] = $symbol_8;
          } else {
            self['@lex_state'] = $symbol_1;
          }
          return ['<', '<'];
        }

      } else if (scanner.$m.check(scanner, /\>/).$r) {
        if (scanner.$m.scan(scanner, /\>\>\=/).$r) {
          return [$symbol_22, '>>'];
        } else if (scanner.$m.scan(scanner, /\>\>/).$r) {
          return ['>>', '>>'];
        } else if (scanner.$m.scan(scanner, /\>\=/).$r) {
          if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
            self['@lex_state'] = $symbol_8;
          } else {
            self['@lex_state'] = $symbol_1;
          }
          return ['>=', scanner.$m.matched(scanner)];
        } else if (scanner.$m.scan(scanner, /\>/).$r) {
          if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
            self['@lex_state'] = $symbol_8;
          } else {
            self['@lex_state'] = $symbol_1;
          }
          return ['>', '>'];
        }

      } else if (scanner.$m.scan(scanner, /[+-]/).$r) {
        result = scanner.$m.matched(scanner);
        sign = result.$m['+'](result, '@');

        if (((__b = (__c = self['@lex_state']).$m['=='](__c, $symbol_1)).$r ? __b : (__c = self['@lex_state']).$m['=='](__c, $symbol_20)).$r) {
          self['@lex_state'] = $symbol_8;
          return [sign, sign];
        } else if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
          self['@lex_state'] = $symbol_8;
          if (scanner.$m.scan(scanner, /@/).$r) {            return [$symbol_31, result.$m['+'](result, scanner.$m.matched(scanner))];}
          return [result, result];
        }

        if (scanner.$m.scan(scanner, /\=/).$r) {
          self['@lex_state'] = $symbol_1;
          return [$symbol_22, result];
        }

        self['@lex_state'] = $symbol_1;
        return [result, result];

      } else if (scanner.$m.scan(scanner, /\?/).$r) {
        if ((__b = [$symbol_8, $symbol_28]).$m['include?'](__b, self['@lex_state']).$r) {          self['@lex_state'] = $symbol_1;}
        return ['?', scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\=\=\=/).$r) {
        if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
          self['@lex_state'] = $symbol_8;
          return ['===', '==='];
        }
        self['@lex_state'] = $symbol_1;
        return ['===', '==='];

      } else if (scanner.$m.scan(scanner, /\=\=/).$r) {
        if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
          self['@lex_state'] = $symbol_8;
          return ['==', '=='];
        }
        self['@lex_state'] = $symbol_1;
        return ['==', '=='];

      } else if (scanner.$m.scan(scanner, /\=\~/).$r) {
        if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
          self['@lex_state'] = $symbol_8;
          return ['=~', '=~'];
        }
        self['@lex_state'] = $symbol_1;
        return ['=~', '=~'];

      } else if (scanner.$m.scan(scanner, /\=\>/).$r) {
        self['@lex_state'] = $symbol_1;
        return ['=>', '=>'];

      } else if (scanner.$m.scan(scanner, /\=/).$r) {
        self['@lex_state'] = $symbol_1;
        return ['=', '='];

      } else if (scanner.$m.scan(scanner, /\!\=/).$r) {
        if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
          (__b = self['@lex_state']).$m['=='](__b, $symbol_8);
          return ['!=', '!='];
        }
        self['@lex_state'] = $symbol_1;
        return ['!=', '!='];

      } else if (scanner.$m.scan(scanner, /\!\~/).$r) {
        self['@lex_state'] = $symbol_1;
        return ['!~', '!~'];

      } else if (scanner.$m.scan(scanner, /\!/).$r) {
        if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
          self['@lex_state'] = $symbol_8;
          return ['!', '!'];
        }
        self['@lex_state'] = $symbol_1;
        return ['!', '!'];

      } else if (scanner.$m.scan(scanner, /\~/).$r) {
        if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
          self['@lex_state'] = $symbol_8;
          return ['~', '~'];
        }
        self['@lex_state'] = $symbol_1;
        return ['~', '~'];

      } else if (scanner.$m.scan(scanner, /\$[\+\'\`\&!@\"~*$?\/\\:;=.,<>_]/).$r) {
        self['@lex_state'] = $symbol_8;
        return [$symbol_32, scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\$\w+/).$r) {
        self['@lex_state'] = $symbol_8;
        return [$symbol_32, scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\@\@\w*/).$r) {
        self['@lex_state'] = $symbol_8;
        return [$symbol_33, scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\@\w*/).$r) {
        self['@lex_state'] = $symbol_8;
        return [$symbol_34, scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\,/).$r) {
        self['@lex_state'] = $symbol_1;
        return [',', scanner.$m.matched(scanner)];

      } else if (scanner.$m.scan(scanner, /\{/).$r) {
        if ((__b = [$symbol_8, $symbol_30]).$m['include?'](__b, self['@lex_state']).$r) {
          result = '{@';
        } else if ((__b = self['@lex_state']).$m['=='](__b, $symbol_28).$r) {
          result = 'LBRACE_ARG';
        } else {
          result = '{';
        }

        self['@lex_state'] = $symbol_1;
        self.$m.$cond_push(self, 0);
        self.$m.$cmdarg_push(self, 0);
        return [result, scanner.$m.matched(scanner)];

      } else if (scanner.$m.check(scanner, /[0-9]/).$r) {
        self['@lex_state'] = $symbol_8;
        if (scanner.$m.scan(scanner, /[\d_]+\.[\d_]+\b/).$r) {
          return [$symbol_35, (__b = scanner.$m.matched(scanner)).$m.gsub(__b, /_/, '')];
        } else if (scanner.$m.scan(scanner, /[\d_]+\b/).$r) {
          return [$symbol_36, (__b = scanner.$m.matched(scanner)).$m.gsub(__b, /_/, '')];
        } else if (scanner.$m.scan(scanner, /0(x|X)(\d|[a-f]|[A-F])+/).$r) {
          return [$symbol_36, scanner.$m.matched(scanner)];
        } else {
          self.$m.$raise(self, ("Lexing error on numeric type: `" + (__c = scanner.$m.peek(scanner, 5)).$m.to_s(__c) + "`"));
        }

      } else if (scanner.$m.scan(scanner, /(\w)+[\?\!]?/).$r) {
        __b = scanner.$m.matched(scanner);
        if ((__c = 'class').$m['==='](__c, __b).$r) {
          if ((__c = self['@lex_state']).$m['=='](__c, $symbol_15).$r) {
            self['@lex_state'] = $symbol_8;
            return [$symbol_31, scanner.$m.matched(scanner)];
          }
          self['@lex_state'] = $symbol_27;
          return [$symbol_37, scanner.$m.matched(scanner)];

        } else if ((__c = 'module').$m['==='](__c, __b).$r) {
          if ((__c = self['@lex_state']).$m['=='](__c, $symbol_15).$r) {            return [$symbol_31, scanner.$m.matched(scanner)];}
          self['@lex_state'] = $symbol_27;
          return [$symbol_38, scanner.$m.matched(scanner)];

        } else if ((__c = 'def').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_23;
          return [$symbol_39, scanner.$m.matched(scanner)];

        } else if ((__c = 'undef').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_23;
          return [$symbol_40, scanner.$m.matched(scanner)];

        } else if ((__c = 'end').$m['==='](__c, __b).$r) {
          if ((__c = [$symbol_15, $symbol_23]).$m['include?'](__c, self['@lex_state']).$r) {
            self['@lex_state'] = $symbol_8;
            return [$symbol_31, scanner.$m.matched(scanner)];
          }

          self['@lex_state'] = $symbol_8;
          return [$symbol_41, scanner.$m.matched(scanner)];

        } else if ((__c = 'do').$m['==='](__c, __b).$r) {
          if (self.$m['$cond?'](self).$r) {
            self['@lex_state'] = $symbol_1;
            return [$symbol_42, scanner.$m.matched(scanner)];
          } else if (((__c = self.$m['$cmdarg?'](self)).$r ? (__d = self['@lex_state']).$m['!='](__d, $symbol_30) : __c).$r) {
            self['@lex_state'] = $symbol_1;
            return [$symbol_43, scanner.$m.matched(scanner)];
          } else if ((__c = self['@lex_state']).$m['=='](__c, $symbol_28).$r) {
            return [$symbol_43, scanner.$m.matched(scanner)];
          } else {
            self['@lex_state'] = $symbol_1;
            return [$symbol_44, scanner.$m.matched(scanner)];
          }

        } else if ((__c = 'if').$m['==='](__c, __b).$r) {
          if ((__c = self['@lex_state']).$m['=='](__c, $symbol_1).$r) {            return [$symbol_45, scanner.$m.matched(scanner)];}
          self['@lex_state'] = $symbol_1;
          return [$symbol_46, scanner.$m.matched(scanner)];

        } else if ((__c = 'unless').$m['==='](__c, __b).$r) {
          if ((__c = self['@lex_state']).$m['=='](__c, $symbol_1).$r) {            return [$symbol_47, scanner.$m.matched(scanner)];}
          return [$symbol_48, scanner.$m.matched(scanner)];

        } else if ((__c = 'else').$m['==='](__c, __b).$r) {
          return [$symbol_49, scanner.$m.matched(scanner)];

        } else if ((__c = 'elsif').$m['==='](__c, __b).$r) {
          return [$symbol_50, scanner.$m.matched(scanner)];

        } else if ((__c = 'self').$m['==='](__c, __b).$r) {
          if(!((__c = self['@lex_state']).$m['=='](__c, $symbol_23)).$r) {self['@lex_state'] = $symbol_8};
          return [$symbol_51, scanner.$m.matched(scanner)];

        } else if ((__c = 'true').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_8;
          return [$symbol_52, scanner.$m.matched(scanner)];

        } else if ((__c = 'false').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_8;
          return [$symbol_53, scanner.$m.matched(scanner)];

        } else if ((__c = 'nil').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_8;
          return [$symbol_54, scanner.$m.matched(scanner)];

        } else if ((__c = '__LINE__').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_8;
          return [$symbol_55, (__c = self['@line_number']).$m.to_s(__c)];

        } else if ((__c = '__FILE__').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_8;
          return [$symbol_56, scanner.$m.matched(scanner)];

        } else if ((__c = 'begin').$m['==='](__c, __b).$r) {
          if ((__c = [$symbol_15, $symbol_23]).$m['include?'](__c, self['@lex_state']).$r) {
            self['@lex_state'] = $symbol_8;
            return [$symbol_31, scanner.$m.matched(scanner)];
          }
          self['@lex_state'] = $symbol_1;
          return [$symbol_57, scanner.$m.matched(scanner)];

        } else if ((__c = 'rescue').$m['==='](__c, __b).$r) {
          if ((__c = [$symbol_15, $symbol_23]).$m['include?'](__c, self['@lex_state']).$r) {            return [$symbol_31, scanner.$m.matched(scanner)];}
          if ((__c = self['@lex_state']).$m['=='](__c, $symbol_1).$r) {            return [$symbol_58, scanner.$m.matched(scanner)];}
          self['@lex_state'] = $symbol_1;
          return [$symbol_59, scanner.$m.matched(scanner)];

        } else if ((__c = 'ensure').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_1;
          return [$symbol_60, scanner.$m.matched(scanner)];

        } else if ((__c = 'case').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_1;
          return [$symbol_61, scanner.$m.matched(scanner)];

        } else if ((__c = 'when').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_1;
          return [$symbol_62, scanner.$m.matched(scanner)];

        } else if ((__c = 'or').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_1;
          return [$symbol_63, scanner.$m.matched(scanner)];

        } else if ((__c = 'and').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_1;
          return [$symbol_64, scanner.$m.matched(scanner)];

        } else if ((__c = 'not').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_1;
          return [$symbol_65, scanner.$m.matched(scanner)];

        } else if ((__c = 'return').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_20;
          return [$symbol_66, scanner.$m.matched(scanner)];

        } else if ((__c = 'next').$m['==='](__c, __b).$r) {
          if (((__c = (__d = self['@lex_state']).$m['=='](__d, $symbol_15)).$r ? __c : (__d = self['@lex_state']).$m['=='](__d, $symbol_23)).$r) {
            self['@lex_state'] = $symbol_8;
            return [$symbol_31, scanner.$m.matched(scanner)];
          }

          self['@lex_state'] = $symbol_20;
          return [$symbol_67, scanner.$m.matched(scanner)];

        } else if ((__c = 'redo').$m['==='](__c, __b).$r) {
          if (((__c = (__d = self['@lex_state']).$m['=='](__d, $symbol_15)).$r ? __c : (__d = self['@lex_state']).$m['=='](__d, $symbol_23)).$r) {
            self['@lex_state'] = $symbol_8;
            return [$symbol_31, scanner.$m.matched(scanner)];
          }

          self['@lex_state'] = $symbol_20;
          return [$symbol_68, scanner.$m.matched(scanner)];

        } else if ((__c = 'break').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_20;
          return [$symbol_69, scanner.$m.matched(scanner)];

        } else if ((__c = 'super').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_25;
          return [$symbol_70, scanner.$m.matched(scanner)];

        } else if ((__c = 'then').$m['==='](__c, __b).$r) {
          return [$symbol_71, scanner.$m.matched(scanner)];

        } else if ((__c = 'while').$m['==='](__c, __b).$r) {
          if ((__c = self['@lex_state']).$m['=='](__c, $symbol_1).$r) {            return [$symbol_72, scanner.$m.matched(scanner)];}
          self['@lex_state'] = $symbol_1;
          return [$symbol_73, scanner.$m.matched(scanner)];

        } else if ((__c = 'until').$m['==='](__c, __b).$r) {
          if ((__c = self['@lex_state']).$m['=='](__c, $symbol_1).$r) {            return [$symbol_72, scanner.$m.matched(scanner)];}
          self['@lex_state'] = $symbol_1;
          return [$symbol_74, scanner.$m.matched(scanner)];

        } else if ((__c = 'yield').$m['==='](__c, __b).$r) {
          self['@lex_state'] = $symbol_25;
          return [$symbol_75, scanner.$m.matched(scanner)];
        };

        matched = scanner.$m.matched(scanner);
        if (((__b = (__c = scanner.$m.peek(scanner, 2)).$m['!='](__c, '::')).$r ? scanner.$m.scan(scanner, /\:/) : __b).$r) {          return [$symbol_76, matched];}

        if ((__b = self['@lex_state']).$m['=='](__b, $symbol_23).$r) {
          if (scanner.$m.scan(scanner, /\=/).$r) {
            self['@lex_state'] = $symbol_8;
            return [$symbol_31, matched.$m['+'](matched, scanner.$m.matched(scanner))];
          }
        }

        if ((__b = [$symbol_1, $symbol_15, $symbol_20, $symbol_25, $symbol_30]).$m['include?'](__b, self['@lex_state']).$r) {
          self['@lex_state'] = $symbol_30;
        } else {
          self['@lex_state'] = $symbol_8;
        }

        return [(matched.$m['=~'](matched, /[A-Z]/).$r ? $symbol_77 : $symbol_31), matched];

      }
      if (scanner.$m['eos?'](scanner).$r) {        return [Qfalse, Qfalse];}

      self.$m.$raise(self, $cg(self, 'RubyLexingError'), ("Unexpected content in parsing stream `" + (__c = scanner.$m.peek(scanner, 5)).$m.to_s(__c) + "`"));
      };
    }, 0);
    }, 0);
}, 2);
}
var __a;var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G, $symbol_1 = $symbol('expr_beg'), $symbol_2 = $symbol('value'), $symbol_3 = $symbol('line'), $symbol_4 = $symbol('beg'), $symbol_5 = $symbol('end'), $symbol_6 = $symbol('done_last_space'), $symbol_7 = $symbol('SPACE'), $symbol_8 = $symbol('expr_end'), $symbol_9 = $symbol('STRING_END'), $symbol_10 = $symbol('REGEXP_END'), $symbol_11 = $symbol('STRING_DVAR'), $symbol_12 = $symbol('content'), $symbol_13 = $symbol('STRING_DBEG'), $symbol_14 = $symbol('STRING_CONTENT'), $symbol_15 = $symbol('expr_dot'), $symbol_16 = $symbol('STRING_BEG'), $symbol_17 = $symbol('XSTRING_BEG'), $symbol_18 = $symbol('WORDS_BEG'), $symbol_19 = $symbol('AWORDS_BEG'), $symbol_20 = $symbol('expr_mid'), $symbol_21 = $symbol('REGEXP_BEG'), $symbol_22 = $symbol('OP_ASGN'), $symbol_23 = $symbol('expr_fname'), $symbol_24 = $symbol('PAREN_BEG'), $symbol_25 = $symbol('expr_arg'), $symbol_26 = $symbol('SPLAT'), $symbol_27 = $symbol('expr_class'), $symbol_28 = $symbol('expr_endarg'), $symbol_29 = $symbol('SYMBOL_BEG'), $symbol_30 = $symbol('expr_cmdarg'), $symbol_31 = $symbol('IDENTIFIER'), $symbol_32 = $symbol('GVAR'), $symbol_33 = $symbol('CVAR'), $symbol_34 = $symbol('IVAR'), $symbol_35 = $symbol('FLOAT'), $symbol_36 = $symbol('INTEGER'), $symbol_37 = $symbol('CLASS'), $symbol_38 = $symbol('MODULE'), $symbol_39 = $symbol('DEF'), $symbol_40 = $symbol('UNDEF'), $symbol_41 = $symbol('END'), $symbol_42 = $symbol('DO_COND'), $symbol_43 = $symbol('DO_BLOCK'), $symbol_44 = $symbol('DO'), $symbol_45 = $symbol('IF'), $symbol_46 = $symbol('IF_MOD'), $symbol_47 = $symbol('UNLESS'), $symbol_48 = $symbol('UNLESS_MOD'), $symbol_49 = $symbol('ELSE'), $symbol_50 = $symbol('ELSIF'), $symbol_51 = $symbol('SELF'), $symbol_52 = $symbol('TRUE'), $symbol_53 = $symbol('FALSE'), $symbol_54 = $symbol('NIL'), $symbol_55 = $symbol('LINE'), $symbol_56 = $symbol('FILE'), $symbol_57 = $symbol('BEGIN'), $symbol_58 = $symbol('RESCUE'), $symbol_59 = $symbol('RESCUE_MOD'), $symbol_60 = $symbol('ENSURE'), $symbol_61 = $symbol('CASE'), $symbol_62 = $symbol('WHEN'), $symbol_63 = $symbol('OR'), $symbol_64 = $symbol('AND'), $symbol_65 = $symbol('NOT'), $symbol_66 = $symbol('RETURN'), $symbol_67 = $symbol('NEXT'), $symbol_68 = $symbol('REDO'), $symbol_69 = $symbol('BREAK'), $symbol_70 = $symbol('SUPER'), $symbol_71 = $symbol('THEN'), $symbol_72 = $symbol('WHILE'), $symbol_73 = $symbol('WHILE_MOD'), $symbol_74 = $symbol('UNTIL_MOD'), $symbol_75 = $symbol('YIELD'), $symbol_76 = $symbol('LABEL'), $symbol_77 = $symbol('CONSTANT');$rb.mm(['require', 'new', 'do_parse', 'get_next_token', '[]=', '[]', '|', '<<', '&', '>>', '!=', 'pop', 'last', 'current_string_parse', 'include?', 'scan', 'escape', '!', 'pos=', '-', 'pos', 'pop_string_parse', 'matched', '==', 'slice', 'add_string_content', 'join', 'eos?', 'check', '+', 'to_s', 'raise', 'next_string_token', 'length', 'push_string_parse', 'cond_push', 'cmdarg_push', 'cond_lexpop', 'cmdarg_lexpop', 'gsub', 'peek', '===', 'cond?', 'cmdarg?', '=~']);return $$();
 });opal.register('opal/ruby/ruby_parser.rb', function($rb, self, __FILE__) { function $$(){





self.$m.$require(self, 'racc/parser.rb');
return $class(self, nil, 'Opal', function(self) { 
  return $class(self, $cg($cg(self, 'Racc'), 'Parser'), 'RubyParser', function(self) { var clist, racc_action_table, arr, __a, idx, __b, racc_action_check, racc_action_pointer, racc_action_default, racc_goto_table, racc_goto_check, racc_goto_pointer, racc_goto_default, racc_reduce_table, racc_reduce_n, racc_shift_n, racc_token_table, racc_nt_base, racc_use_result_var;




    clist = [
    '62,63,64,7,51,665,545,261,56,57,196,197,261,60,575,58,59,61,23,24,65', 
    '66,563,457,420,841,22,28,27,88,87,89,90,-271,-58,17,196,197,196,197', 
    '-271,6,41,8,9,92,91,82,50,84,83,85,86,93,94,475,80,81,665,38,39,37,665', 
    '742,196,197,-408,737,620,-84,487,-66,-81,-408,256,621,574,488,-80,519', 
    '736,36,565,564,30,519,72,52,474,-271,260,709,32,519,73,260,40,99,620', 
    '519,-79,99,98,664,18,621,98,519,544,78,72,74,75,76,77,293,261,751,73', 
    '79,62,63,64,293,51,293,486,99,56,57,53,54,98,60,744,58,59,61,247,248', 
    '65,66,650,244,526,293,246,277,281,88,87,89,90,-465,99,-71,664,-412,99', 
    '98,664,-417,41,98,-412,92,91,82,50,84,83,85,86,93,94,563,80,81,256,38', 
    '39,37,-81,493,-81,563,746,-81,-80,99,-80,518,-71,-80,98,99,-71,518,726', 
    '260,98,201,563,99,205,518,-77,52,98,99,-79,518,-79,563,98,-79,40,99', 
    '563,518,416,568,98,507,208,747,506,417,-83,78,72,74,75,76,77,565,564', 
    '561,73,79,62,63,64,-81,51,565,564,566,56,57,53,54,525,60,526,58,59,61', 
    '247,248,65,66,565,564,576,584,246,277,281,88,87,89,90,565,564,570,418', 
    '-265,565,564,725,585,41,748,-265,92,91,82,50,84,83,85,86,93,94,253,80', 
    '81,796,38,39,37,254,749,475,-405,-71,-270,-415,-265,-79,-416,-405,-413', 
    '-270,-415,-265,457,-416,-466,-413,201,-73,475,205,-79,-81,52,-306,196', 
    '197,750,882,-265,244,-306,40,474,-272,845,496,-271,421,-78,208,-272', 
    '846,497,-271,78,72,74,75,76,77,457,474,256,73,79,62,63,64,-270,51,-265', 
    '250,-416,56,57,53,54,733,60,422,58,59,61,247,248,65,66,256,-417,-306', 
    '-73,246,277,281,88,87,89,90,-416,-272,844,418,-271,99,475,-416,451,41', 
    '98,216,92,91,82,50,84,83,85,86,93,94,680,80,81,-411,38,39,37,-73,216', 
    '-69,-411,-73,-271,-77,-272,193,-270,474,216,-271,213,-272,194,-270,215', 
    '214,201,728,-466,205,-414,-270,52,541,-416,-410,507,-414,-270,512,776', 
    '40,-410,-466,541,330,329,333,332,208,507,539,753,509,78,72,74,75,76', 
    '77,195,493,454,73,79,62,63,64,-271,51,-272,192,-270,56,57,53,54,-253', 
    '60,757,58,59,61,247,248,65,66,-270,787,540,457,246,277,281,88,87,89', 
    '90,715,463,540,-76,-75,-465,-72,-84,-83,41,787,650,92,91,82,50,84,83', 
    '85,86,93,94,558,80,81,99,38,39,37,559,98,507,196,197,509,330,329,333', 
    '332,216,766,-70,767,-72,99,-78,768,-72,201,98,463,205,762,650,52,330', 
    '329,333,332,463,99,491,492,40,323,98,327,325,324,326,213,208,762,650', 
    '215,214,78,72,74,75,76,77,286,287,386,73,79,62,63,64,7,51,333,332,99', 
    '56,57,53,54,98,60,772,58,59,61,23,24,65,66,330,329,333,332,22,28,27', 
    '88,87,89,90,630,216,17,101,102,103,104,105,6,41,8,9,92,91,82,50,84,83', 
    '85,86,93,94,533,80,81,533,38,39,37,534,704,705,213,706,93,94,215,214', 
    '211,212,383,-57,777,711,385,384,-465,778,36,779,700,30,533,782,52,293', 
    '697,695,481,32,691,791,482,40,555,483,327,325,324,326,-254,18,374,489', 
    '668,526,78,72,74,75,76,77,265,660,365,73,79,62,63,64,7,51,362,293,256', 
    '56,57,53,54,655,60,797,58,59,61,23,24,65,66,330,329,333,332,22,28,27', 
    '88,87,89,90,216,610,17,101,102,103,104,105,6,41,8,9,92,91,82,50,84,83', 
    '85,86,93,94,650,80,81,610,38,39,37,801,256,213,256,494,235,215,214,211', 
    '212,495,216,610,499,501,636,293,-66,817,36,635,819,30,285,634,52,284', 
    '502,293,235,32,622,827,828,40,323,829,327,325,324,326,533,18,533,700', 
    '293,680,78,72,74,75,76,77,834,617,235,73,79,62,63,64,610,51,836,838', 
    '511,56,57,53,54,419,60,216,58,59,61,247,248,65,66,330,329,333,332,246', 
    '28,27,88,87,89,90,330,329,333,332,216,216,216,847,514,41,256,849,92', 
    '91,82,50,84,83,85,86,93,94,850,80,81,191,38,39,37,376,533,-466,583,858', 
    '-253,190,610,189,610,501,188,527,581,579,187,578,533,573,201,876,569', 
    '205,878,528,52,530,533,537,534,301,880,610,536,40,323,610,327,325,324', 
    '326,535,208,95,610,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,250,,56', 
    '57,53,54,,60,,58,59,61,247,248,65,66,330,329,333,332,246,277,281,88', 
    '87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37', 
    ',,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,863,,244,,40,555,,327,325,324', 
    '326,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,250,,56,57,53', 
    '54,,60,,58,59,61,247,248,65,66,330,329,333,332,246,277,281,88,87,89', 
    '90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,216', 
    '-487,-487,-487,-487,222,224,,,-487,-487,,,,,,230,231,,201,,,205,,,52', 
    ',,,,860,213,244,219,40,215,214,211,212,223,221,217,208,218,,,,78,72', 
    '74,75,76,77,,,,73,79,62,63,64,,51,,250,,56,57,53,54,,60,,58,59,61,247', 
    '248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83', 
    '85,86,93,94,,80,81,,38,39,37,216,220,225,226,227,222,224,232,233,228', 
    '229,,-487,-487,,,230,231,,201,,,205,,,52,,,,,,213,,219,40,215,214,211', 
    '212,223,221,217,208,218,,,,78,72,74,75,76,77,,,,73,79,62,63,64,7,51', 
    ',,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,', 
    '17,,,,,,6,41,8,9,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,216', 
    '-487,-487,-487,-487,222,224,,,-487,-487,,,,,,230,231,,36,,,30,,,52,', 
    ',,,32,213,,219,40,215,214,211,212,223,221,217,18,218,,,,78,72,74,75', 
    '76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65', 
    '66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86', 
    '93,94,,80,81,,38,39,37,216,,,,,,,,,,,,,,,,230,231,,201,,,205,,,52,,', 
    ',,,213,,219,40,215,214,211,212,,,217,208,218,,,,78,72,74,75,76,77,,', 
    ',73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246', 
    '277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80', 
    '81,,38,39,37,216,,,,,,,,,,,,,,,,230,231,,201,,,205,,,52,,,,,,213,,219', 
    '40,215,214,211,212,,,217,208,218,,,,78,72,74,75,76,77,,,,73,79,62,63', 
    '64,,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89', 
    '90,,,17,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,216', 
    ',,,,,,,,,,,,,,,230,231,,201,,,205,,,52,,,,,,213,,219,40,215,214,211', 
    '212,,,217,18,218,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57', 
    '53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,,,,,,,,41', 
    ',,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,216,,,,,,,,,,,,,,,', 
    '230,231,,201,,,205,,,52,,,,,,213,,219,40,215,214,211,212,,,217,208,218', 
    ',,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59', 
    '61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82', 
    '50,84,83,85,86,93,94,,80,81,,38,39,37,216,220,225,226,227,222,224,232', 
    ',228,229,,,,,,230,231,,201,,,205,,,52,,,,,,213,,219,40,215,214,211,212', 
    '223,221,217,208,218,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56', 
    '57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,', 
    ',,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,216,220,225', 
    '226,227,222,224,,,228,229,,,,,,230,231,,201,,,205,,,52,,,,,,213,,219', 
    '40,215,214,211,212,223,221,217,208,218,,,,78,72,74,75,76,77,,,,73,79', 
    '62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,28,27', 
    '88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39', 
    '37,216,-487,-487,-487,-487,222,224,,,-487,-487,,,,,,230,231,,201,,,205', 
    ',,52,,,,,242,213,244,219,40,215,214,211,212,223,221,217,208,218,,,,78', 
    '72,74,75,76,77,,,,73,79,62,63,64,,51,,250,,56,57,53,54,,60,,58,59,61', 
    '247,248,65,66,,,,,246,28,27,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84', 
    '83,85,86,93,94,,80,81,,38,39,37,216,-487,-487,-487,-487,222,224,,,-487', 
    '-487,,,,,,230,231,,201,,,205,,,52,,,,,242,213,244,219,40,215,214,211', 
    '212,223,221,217,208,218,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,', 
    '250,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,28,27,88,87,89', 
    '90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,216', 
    '-487,-487,-487,-487,222,224,,,-487,-487,,,,,,230,231,,201,,,205,,,52', 
    ',,,,242,213,244,219,40,215,214,211,212,223,221,217,208,218,,,,78,72', 
    '74,75,76,77,,,,73,79,62,63,64,7,51,,250,,56,57,53,54,,60,,58,59,61,23', 
    '24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,6,41,8,9,92,91,82,50,84', 
    '83,85,86,93,94,,80,81,,38,39,37,216,-487,-487,-487,-487,222,224,,,-487', 
    '-487,,,,,,230,231,,36,,,30,,,52,,,,,32,213,,219,40,215,214,211,212,223', 
    '221,217,18,218,,,,78,72,74,75,76,77,,,,73,79,62,63,64,7,51,,,,56,57', 
    '53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,6', 
    '41,8,9,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,216,220,225,226', 
    '227,222,224,232,233,228,229,,-487,-487,,,230,231,,36,,,30,,,52,,,,,32', 
    '213,,219,40,215,214,211,212,223,221,217,18,218,,,,78,72,74,75,76,77', 
    ',,,73,79,-245,-245,-245,,-245,,,,-245,-245,53,54,,-245,,-245,-245,-245', 
    '-245,-245,-245,-245,,,,,-245,-245,-245,-245,-245,-245,-245,,,,,,,,,', 
    '-245,,,-245,-245,-245,-245,-245,-245,-245,-245,-245,-245,,-245,-245', 
    ',-245,-245,-245,216,,,,,,,,,,,,,,,,230,231,,-245,,,-245,256,,-245,,', 
    ',,-245,213,-245,219,-245,215,214,211,212,,,,-245,,,,-278,-245,-245,-245', 
    '-245,-245,-245,-278,-278,-278,-245,-245,-278,-278,-278,216,-278,,-245', 
    ',,,-245,-245,,,-278,-278,,,,230,231,,,-278,-278,,-278,-278,-278,-278', 
    '-278,,,,213,,219,,215,214,211,212,,,,,,,,,,,-278,-278,-278,-278,-278', 
    '-278,-278,-278,-278,-278,-278,-278,-278,-278,,,-278,-278,-278,,,-278', 
    ',265,-278,,,-278,,-278,,-278,,-278,,-278,-278,-278,-278,-278,-278,-278', 
    ',-278,,-278,,,,,,,,,,,,,-278,-278,-278,-278,,-278,,,,-278,62,63,64,7', 
    '51,,,,56,57,,,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17', 
    ',,,,,6,41,8,9,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,216,,,', 
    ',,,,,,,,,,,,230,231,,36,,,267,,,52,,,,,32,213,,,40,215,214,211,212,', 
    ',,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60', 
    ',58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,278,,,92', 
    '91,82,50,84,83,85,86,93,94,,80,81,,,555,282,327,325,324,326,,,,,,,,', 
    ',,,,,,,275,,,272,,,52,,,,,271,,,,,,549,,,,,,,330,329,333,332,78,72,74', 
    '75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248', 
    '65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,278,,,92,91,82,50,84,83,85', 
    '86,93,94,,80,81,,,555,282,327,325,324,326,,,,,,,,,,,,,,,,275,,,205,', 
    ',52,,,,,,,,,,,549,,,,,,,330,329,333,332,78,72,74,75,76,77,,,,73,79,62', 
    '63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281', 
    '88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39', 
    '37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,822,,,,40,,,,,,,,208,,,,,78', 
    '72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,23', 
    '24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,,41,,,92,91,82,50,84,83', 
    '85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,', 
    ',,,40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,7,51,,,,56,57', 
    '53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,6', 
    '41,8,9,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,', 
    ',,,,,36,,,30,,,52,,,,,32,,,,40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73', 
    '79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27', 
    '88,87,89,90,,,17,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38', 
    '39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,18,,,,,78', 
    '72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247', 
    '248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83', 
    '85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,', 
    ',,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57', 
    '53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,', 
    ',,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,', 
    ',,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,', 
    '73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246', 
    '277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80', 
    '81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208', 
    ',,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59', 
    '61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,278,,,92,91,82', 
    '50,84,83,85,86,93,94,,80,81,,,,282,,,,,,,,,,,,,,,,,,,,813,,,205,,,52', 
    ',,,,,,,,,,,,,,,,,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,7,51,,,,56', 
    '57,53,54,,60,,58,59,61,23,24,65,66,,-463,,,22,28,27,88,87,89,90,,,17', 
    ',,,,,6,41,8,9,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,', 
    ',,,,-408,,,,,,,-408,36,,,30,-463,,52,,,,,32,,,,40,,,,,,,,18,,-463,,-266', 
    '78,72,74,75,76,77,-266,-266,-266,73,79,-266,-266,-266,,-266,,,,,-408', 
    '53,54,-266,,-266,-266,,,,,,,,-266,-266,,-266,-266,-266,-266,-266,,,', 
    ',,,,,,,,,,,,,,,,,,-266,-266,-266,-266,-266,-266,-266,-266,-266,-266', 
    '-266,-266,-266,-266,,,-266,-266,-266,,,-266,,,-266,,,-266,,-266,,-266', 
    ',-266,,-266,-266,-266,-266,-266,-266,-266,,-266,,-266,,,,,,,,,,,,,-266', 
    '-266,-266,-266,,-266,,,,-266,62,63,64,7,51,,,,56,57,,,,60,,58,59,61', 
    '23,24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,6,41,8,9,92,91,82,50', 
    '84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,36,,,30,,,52,', 
    ',,,32,,,,40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,', 
    ',56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17', 
    ',,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,', 
    ',,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,18,,,,,78,72,74,75,76,77,', 
    ',,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,', 
    '246,28,27,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80', 
    '81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,301,,,,40,,,,,,,', 
    '208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,250,,56,57,53,54,,60', 
    ',58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92', 
    '91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,', 
    ',205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63', 
    '64,,51,,250,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281', 
    '88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39', 
    '37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,807,,244,,40,,,,,,,,208,,,', 
    ',78,72,74,75,76,77,,,,73,79,62,63,64,,51,,250,,56,57,53,54,,60,,58,59', 
    '61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,,41,,,92,91,82,50', 
    '84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52', 
    ',,,,,,,,40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,', 
    '56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17', 
    ',,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,', 
    ',,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,18,,,,,78,72,74,75,76,77,', 
    ',,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22', 
    '28,27,88,87,89,90,,,17,,,,,580,,41,,,92,91,82,50,84,83,85,86,93,94,', 
    '80,81,,38,39,37,216,220,225,226,227,222,224,232,233,228,229,,209,210', 
    ',,230,231,,201,,,205,,,52,,,,,,213,,219,40,215,214,211,212,223,221,217', 
    '18,218,,,,78,72,74,75,76,77,,,,73,79,99,234,,-211,,98,,,,,53,54,62,63', 
    '64,,51,,,,56,57,,,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87', 
    '89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,', 
    ',,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,805,,244,,40,,,,,,,,208,,,,,78', 
    '72,74,75,76,77,,,,73,79,62,63,64,,51,,250,,56,57,53,54,,60,,58,59,61', 
    '247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,278,,,92,91,82,50', 
    '84,83,335,86,93,94,,80,81,,,,282,,,,,,,,,,,,,,,,,341,,,336,,,205,,,52', 
    ',,,,,,,,,,,,,,,,,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57', 
    '53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,', 
    ',,,278,,,92,91,82,50,84,83,335,86,93,94,,80,81,,,,282,,,,,,,,,,,,,,', 
    ',,,,,336,,,205,,,52,,,,,,,,,,,,,,,,,,,,,,78,72,74,75,76,77,,,,73,79', 
    '62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277', 
    '281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,', 
    '38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,799,,244,,40,,,,,,,,208', 
    ',,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,250,,56,57,53,54,,60,,58', 
    '59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91', 
    '82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205', 
    ',,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,', 
    '51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87', 
    '89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,', 
    ',,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74', 
    '75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248', 
    '65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85', 
    '86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,', 
    '40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53', 
    '54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,,,,,,,,41,,', 
    '92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201', 
    ',,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,-462', 
    '-462,-462,,-462,,,,-462,-462,53,54,,-462,,-462,-462,-462,-462,-462,-462', 
    '-462,,-462,,,-462,-462,-462,-462,-462,-462,-462,,,,,,,,,,-462,,,-462', 
    '-462,-462,-462,-462,-462,-462,-462,-462,-462,,-462,-462,,-462,-462,-462', 
    ',,,,,,,,,,,,,,,,,,,-462,,,-462,-462,,-462,,,,,-462,,-462,,-462,,,,,', 
    ',,-462,,-462,,,-462,-462,-462,-462,-462,-462,,,,-462,-462,-463,-463', 
    '-463,,-463,,-462,,-463,-463,-462,-462,,-463,,-463,-463,-463,-463,-463', 
    '-463,-463,,-463,,,-463,-463,-463,-463,-463,-463,-463,,,,,,,,,,-463,', 
    ',-463,-463,-463,-463,-463,-463,-463,-463,-463,-463,,-463,-463,,-463', 
    '-463,-463,,,,,,,,,,,,,,,,,,,,-463,,,-463,-463,,-463,,,,,-463,,-463,', 
    '-463,,,,,,,,-463,,-463,,,-463,-463,-463,-463,-463,-463,,,,-463,-463', 
    '62,63,64,,51,,-463,,56,57,-463,-463,,60,,58,59,61,247,248,65,66,,,,', 
    '246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94', 
    ',80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,', 
    ',208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,7,51,,,,56,57,53,54,,60', 
    ',58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,6,41,8,9,92', 
    '91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,36,,', 
    '30,,,52,,,,,32,,,,40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63', 
    '64,,51,376,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87', 
    '89,90,,,17,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37', 
    ',,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,18,,,,,78,72,74', 
    '75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,23,24,65', 
    '66,,,,,22,28,27,88,87,89,90,,,17,,,,,,,41,,,92,91,82,50,84,83,85,86', 
    '93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40', 
    ',,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54', 
    ',60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,,41,,,92', 
    '91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,', 
    ',205,,,52,,,,,,,,,40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63', 
    '64,,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89', 
    '90,,,17,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,', 
    ',,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,18,,,,,78,72,74,75', 
    '76,77,,,,73,79,62,63,64,7,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66', 
    ',,,,22,28,27,88,87,89,90,,,17,,,,,,6,41,8,9,92,91,82,50,84,83,85,86', 
    '93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,36,,,30,,,52,,,,,32,,,,40', 
    ',,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,7,51,,,,56,57,53,54', 
    ',60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,6,41,8', 
    '9,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,', 
    '36,,,30,,,52,,,,,32,,,,40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62', 
    '63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281', 
    '88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39', 
    '37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72', 
    '74,75,76,77,,,,73,79,62,63,64,7,51,,,,56,57,53,54,,60,,58,59,61,23,24', 
    '65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,6,41,8,9,92,91,82,50,84,83', 
    '85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,36,,,30,,,52,,,,,32', 
    ',,,40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57', 
    '53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,', 
    '41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,', 
    ',,,201,,,205,,,52,,,,,,,,,40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79', 
    '62,63,64,7,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27', 
    '88,87,89,90,,,17,,,,,,6,41,8,9,92,91,82,50,84,83,85,86,93,94,,80,81', 
    ',38,39,37,,,,,,,,,,,,,,,,,,,,36,,,30,,,52,,,,,32,,,,40,,,,,,,,18,,,', 
    ',78,72,74,75,76,77,,,,73,79,62,63,64,7,51,,,,56,57,53,54,,60,,58,59', 
    '61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,6,41,8,9,92,91,82', 
    '50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,36,,,30,,,52', 
    ',,,,32,,,,40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,', 
    ',,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,', 
    ',,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,', 
    ',,,,,,,,,201,,,205,,,52,,,,,394,,,,40,,,,,,,,208,,,,,78,72,74,75,76', 
    '77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,', 
    ',,22,28,27,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,', 
    '80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,394,,,,40,,,,', 
    ',,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60', 
    ',58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,,,,,,,,41,,,92,91,82', 
    '50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,', 
    ',52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51', 
    ',,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,28,27,88,87,89,90', 
    ',,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,', 
    ',,,,,,,,,,,,201,,,205,,,52,,,,,301,,,,40,,,,,,,,208,,,,,78,72,74,75', 
    '76,77,,,,73,79,62,63,64,,51,,250,,56,57,53,54,,60,,58,59,61,247,248', 
    '65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85', 
    '86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,', 
    '40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53', 
    '54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,', 
    '41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,', 
    ',,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73', 
    '79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27', 
    '88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39', 
    '37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72', 
    '74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,23,24', 
    '65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,,41,,,92,91,82,50,84,83,85', 
    '86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,', 
    '40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53', 
    '54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,,41', 
    ',,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,', 
    '201,,,205,,,52,,,,,,,,,40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62', 
    '63,64,7,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88', 
    '87,89,90,,,17,,,,,,6,41,8,9,92,91,82,50,84,83,85,86,93,94,,80,81,,38', 
    '39,37,,,,,,,,,,,,,,,,,,,,36,,,30,,,52,,,,,32,,,,40,,,,,,,,18,,,,,78', 
    '72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247', 
    '248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83', 
    '85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,', 
    ',,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57', 
    '53,54,,60,,58,59,61,247,248,65,66,,,,,246,28,27,88,87,89,90,,,,,,,,', 
    ',41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,', 
    ',,,,201,,,205,,,52,,,,,602,,244,,40,,,,,,,,208,,,,,78,72,74,75,76,77', 
    ',,,73,79,62,63,64,7,51,,250,,56,57,53,54,,60,,58,59,61,23,24,65,66,', 
    ',,,22,28,27,88,87,89,90,,,17,,,,,,6,41,8,9,92,91,82,50,84,83,85,86,93', 
    '94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,36,,,30,,,52,,,,,32,,,,40,,,', 
    ',,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60', 
    ',58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92', 
    '91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,', 
    ',205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63', 
    '64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88', 
    '87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37', 
    ',,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74', 
    '75,76,77,,,,73,79,62,63,64,7,51,,,,56,57,53,54,,60,,58,59,61,23,24,65', 
    '66,,,,,22,28,27,88,87,89,90,,,17,,,,,,6,41,8,9,92,91,82,50,84,83,85', 
    '86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,36,,,30,,,52,,,,,32,,,', 
    '40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53', 
    '54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,', 
    '41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,', 
    ',,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73', 
    '79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277', 
    '281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,', 
    '38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,', 
    ',78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61', 
    '247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50', 
    '84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52', 
    ',,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,', 
    ',56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90', 
    ',,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,', 
    ',,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76', 
    '77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66', 
    ',,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93', 
    '94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,', 
    ',,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,', 
    '60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,', 
    ',92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201', 
    ',,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63', 
    '64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88', 
    '87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37', 
    ',,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74', 
    '75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248', 
    '65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85', 
    '86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,', 
    '40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53', 
    '54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,', 
    '41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,', 
    ',,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73', 
    '79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277', 
    '281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,', 
    '38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,', 
    ',78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61', 
    '247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50', 
    '84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52', 
    ',,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,', 
    ',56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90', 
    ',,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,', 
    ',,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76', 
    '77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66', 
    ',,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93', 
    '94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,', 
    ',,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,', 
    '60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,', 
    ',92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201', 
    ',,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63', 
    '64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88', 
    '87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37', 
    ',,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74', 
    '75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248', 
    '65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85', 
    '86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,', 
    '40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53', 
    '54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,', 
    '41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,', 
    ',,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73', 
    '79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277', 
    '281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,', 
    '38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,', 
    ',78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61', 
    '247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50', 
    '84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52', 
    ',,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,', 
    ',56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90', 
    ',,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,', 
    ',,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76', 
    '77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66', 
    ',,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93', 
    '94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,', 
    ',,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,', 
    '60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,', 
    ',92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201', 
    ',,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63', 
    '64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88', 
    '87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37', 
    ',,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74', 
    '75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248', 
    '65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85', 
    '86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,', 
    '40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53', 
    '54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,', 
    '41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,', 
    ',,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73', 
    '79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277', 
    '281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,', 
    '38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,', 
    ',78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61', 
    '247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50', 
    '84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52', 
    ',,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,7,51,', 
    ',,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17', 
    ',,,,,6,41,8,9,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,', 
    ',,,,,,,,,,,,36,,,30,,,52,,,,,32,,,,40,,,,,,,,18,,,,,78,72,74,75,76,77', 
    ',,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,', 
    ',246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94', 
    ',80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,', 
    ',208,,,,-270,78,72,74,75,76,77,-270,-270,-270,73,79,-270,-270,-270,', 
    '-270,,,,,,53,54,,,-270,-270,,,,,,,,-270,-270,,-270,-270,-270,-270,-270', 
    ',,,,,,,,,,,,,,,,,,,,,-270,-270,-270,-270,-270,-270,-270,-270,-270,-270', 
    '-270,-270,-270,-270,,,-270,-270,-270,,593,-270,,,-270,,,-270,,-270,', 
    '-270,,-270,,-270,-270,-270,-270,-270,-270,-270,,-270,,-270,,,,,,,,,', 
    ',,,-270,-270,-270,-270,,-270,,-82,,-270,62,63,64,,51,,,,56,57,,,,60', 
    ',58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92', 
    '91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,', 
    ',205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63', 
    '64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88', 
    '87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37', 
    ',,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74', 
    '75,76,77,,,,73,79,-465,-465,-465,,-465,,,,-465,-465,53,54,,-465,,-465', 
    '-465,-465,-465,-465,-465,-465,,,,,-465,-465,-465,-465,-465,-465,-465', 
    ',,,,,,,,,-465,,,-465,-465,-465,-465,-465,-465,-465,-465,-465,-465,,-465', 
    '-465,,-465,-465,-465,,,,,,,,,,,,,,,,,,,,-465,727,,-465,-465,,-465,,', 
    ',,-465,,-465,,-465,,,,,,,,-465,,,,,-465,-465,-465,-465,-465,-465,,,', 
    '-465,-465,62,63,64,,51,,-465,-80,56,57,-465,-465,,60,,58,59,61,247,248', 
    '65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85', 
    '86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,', 
    '40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53', 
    '54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,', 
    '41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,', 
    ',,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73', 
    '79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27', 
    '88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39', 
    '37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72', 
    '74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,23,24', 
    '65,66,,,,,22,28,27,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86', 
    '93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40', 
    ',,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54', 
    ',60,,58,59,61,247,248,65,66,,,,,246,28,27,88,87,89,90,,,,,,,,,,41,,', 
    '92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201', 
    ',,205,,,52,,,,,242,,244,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79', 
    '62,63,64,,51,,250,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,28', 
    '27,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38', 
    '39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,472,,,,,242,,244,,40,,,,,,,,208', 
    ',,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,250,,56,57,53,54,,60,,58', 
    '59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,,,,,,,,41,,,92,91,82,50', 
    '84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52', 
    ',,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,', 
    ',56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90', 
    ',,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,', 
    ',,,,,,,,,,,,201,,,205,,,52,,,,,714,,,,40,,,,,,,,208,,,,,78,72,74,75', 
    '76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65', 
    '66,,,,,246,28,27,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93', 
    '94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,479,52,,,,,242,,244', 
    ',40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,250,,56', 
    '57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,', 
    ',,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,', 
    ',,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77', 
    ',,,73,79,62,63,64,7,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,', 
    '22,28,27,88,87,89,90,,,17,,,,,,6,41,8,9,92,91,82,50,84,83,85,86,93,94', 
    ',80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,36,,,267,,,52,,,,,32,,,,40,,,,,', 
    ',,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,7,51,,,,56,57,53,54,,60', 
    ',58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,6,41,8,9,92', 
    '91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,36,,', 
    '30,,,52,,,,,32,,,,40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63', 
    '64,,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89', 
    '90,,,17,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,', 
    ',,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,18,,,,,78,72,74,75', 
    '76,77,,,,73,79,62,63,64,7,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66', 
    ',,,,22,28,27,88,87,89,90,,,17,,,,,,6,41,8,9,92,91,82,50,84,83,85,86', 
    '93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,36,,,30,,,52,,,,,32,,,,40', 
    ',,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54', 
    ',60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,278', 
    ',,92,91,82,50,84,83,85,86,93,94,,80,81,,,,282,,,,,,,,,,,,,,,,,,,,275', 
    ',,205,,,52,,,,,,,,,,,,,,,,,,,,,,78,72,74,75,76,77,,,,73,79,62,63,64', 
    '7,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89', 
    '90,,,17,,,,,,6,41,8,9,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37', 
    ',,,,,,,,,,,,,,,,,,,36,,,267,,,52,,,,,32,,,,40,,,,,,,,18,,,,,78,72,74', 
    '75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248', 
    '65,66,,,,,246,28,27,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86', 
    '93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,301,,,', 
    '40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,250,,56,57', 
    '53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,', 
    ',,,278,,,92,91,82,50,84,83,85,86,93,94,,80,81,,,,282,,,,,,,,,,,,,,,', 
    ',,,,682,,,205,,,52,,,,,,,,,,,,,,,,,,,,,,78,72,74,75,76,77,,,,73,79,62', 
    '63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281', 
    '88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39', 
    '37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,672,,,,40,,,,,,,,208,,,,,78', 
    '72,74,75,76,77,,,,73,79,62,63,64,7,51,,,,56,57,53,54,,60,,58,59,61,23', 
    '24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,6,41,8,9,92,91,82,50,84', 
    '83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,36,,,30,,,52,,,,', 
    '32,,,,40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,7,51,,,,56', 
    '57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,', 
    ',,6,41,8,9,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,', 
    ',,,,,,,,,36,,,30,,,52,,,,,32,,,,40,,,,,,,,18,,,,,78,72,74,75,76,77,', 
    ',,73,79,62,63,64,7,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22', 
    '28,27,88,87,89,90,,,17,,,,,,6,41,8,9,92,91,82,50,84,83,85,86,93,94,', 
    '80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,36,,,30,,,52,,,,,32,,,,40,,,,,,,', 
    '18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58', 
    '59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91', 
    '82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205', 
    ',,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,', 
    '51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87', 
    '89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,', 
    ',,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74', 
    '75,76,77,,,,73,79,62,63,64,,51,,250,,56,57,53,54,,60,,58,59,61,247,248', 
    '65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85', 
    '86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,656', 
    ',,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57', 
    '53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,', 
    ',,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,', 
    ',,,,,,201,,,205,,,52,,,,,394,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77', 
    ',,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22', 
    '28,27,88,87,89,90,,,17,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80', 
    '81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,18', 
    ',,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59', 
    '61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82', 
    '50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,', 
    ',52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51', 
    ',,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89', 
    '90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,', 
    ',,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75', 
    '76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65', 
    '66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86', 
    '93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40', 
    ',,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54', 
    ',60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41', 
    ',,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,', 
    '201,,,205,499,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73', 
    '79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,28', 
    '27,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38', 
    '39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,301,,,,40,,,,,,,,208,,,', 
    ',78,72,74,75,76,77,,,,73,79,62,63,64,7,51,,250,,56,57,53,54,,60,,58', 
    '59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,6,41,8,9,92,91', 
    '82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,36,,,30', 
    ',,52,,,,,32,,,,40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64', 
    '7,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89', 
    '90,,,17,,,,,,6,41,8,9,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37', 
    ',,,,,,,,,,,,,,,,,,,36,,,30,,,52,,,,,32,,,,40,,,,,,,,18,,,,,78,72,74', 
    '75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,23,24,65', 
    '66,,,,,22,28,27,88,87,89,90,,,17,,,,,,,41,,,92,91,82,50,84,83,85,86', 
    '93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,628,52,,,,,626', 
    ',244,,40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,250', 
    ',56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90', 
    ',,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,', 
    ',,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76', 
    '77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66', 
    ',,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93', 
    '94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,606,,244,', 
    '40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,250,,56,57', 
    '53,54,,60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,', 
    ',,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,', 
    ',,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,', 
    '73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246', 
    '277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80', 
    '81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,602,,244,,40,,,,', 
    ',,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,250,,56,57,53,54', 
    ',60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41', 
    ',,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,', 
    '201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79', 
    '62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,277', 
    '281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,', 
    '38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,', 
    ',78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59,61', 
    '247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41,,,92,91,82,50', 
    '84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52', 
    ',,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,', 
    ',56,57,53,54,,60,,58,59,61,247,248,65,66,,,,,246,28,27,88,87,89,90,', 
    ',,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,', 
    ',,,,,,,,,,,201,,,205,,,52,,,,,301,,,,40,,,,,,,,208,,,,,78,72,74,75,76', 
    '77,,,,73,79,-468,-468,-468,,-468,,250,,-468,-468,53,54,,-468,,-468,-468', 
    '-468,-468,-468,-468,-468,,,,,-468,-468,-468,-468,-468,-468,-468,,,,', 
    ',,,,,-468,,,-468,-468,-468,-468,-468,-468,-468,-468,-468,-468,,-468', 
    '-468,,-468,-468,-468,,,,,,,,,,,,,,,,,,,,-468,,,-468,-468,,-468,,,,,-468', 
    ',-468,,-468,,,,,,,,-468,,,,,-468,-468,-468,-468,-468,-468,,,,-468,-468', 
    '-467,-467,-467,,-467,,-468,,-467,-467,-468,-468,,-467,,-467,-467,-467', 
    '-467,-467,-467,-467,,,,,-467,-467,-467,-467,-467,-467,-467,,,,,,,,,', 
    '-467,,,-467,-467,-467,-467,-467,-467,-467,-467,-467,-467,,-467,-467', 
    ',-467,-467,-467,,,,,,,,,,,,,,,,,,,,-467,,,-467,-467,,-467,,,,,-467,', 
    '-467,,-467,,,,,,,,-467,,,,,-467,-467,-467,-467,-467,-467,,,,-467,-467', 
    '62,63,64,,51,,-467,,56,57,-467,-467,,60,,58,59,61,23,24,65,66,,,,,22', 
    '28,27,88,87,89,90,,,17,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80', 
    '81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,18', 
    ',,,,78,72,74,75,76,77,,,,73,79,62,63,64,,51,,,,56,57,53,54,,60,,58,59', 
    '61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,,41,,,92,91,82,50', 
    '84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,201,,,205,-270', 
    ',52,,,,,-270,-270,-270,,40,,-270,-270,,-270,,,18,,,,,78,72,74,75,76', 
    '77,,,,73,79,-270,-270,,-270,-270,-270,-270,-270,,,53,54,,,,,,,,,,,,', 
    ',,,,,-270,-270,-270,-270,-270,-270,-270,-270,-270,-270,-270,-270,-270', 
    '-270,,,-270,-270,-270,,593,,,,-270,,,,,,,-270,,-270,,-270,-270,-270', 
    '-270,-270,-270,-270,,-270,,-270,,,,,,,,,,,,,-270,-270,,-74,-469,-270', 
    ',-82,,-270,,-469,-469,-469,,,,-469,-469,,-469,,,,,,,,,-469,,,,,,,,,', 
    '-469,-469,,-469,-469,-469,-469,-469,,,,,,,,,,,,,,,,,,,,,,-469,-469,-469', 
    '-469,-469,-469,-469,-469,-469,-469,-469,-469,-469,-469,,,-469,-469,-469', 
    ',590,,,,-469,,,,,,,-469,,-469,,-469,-469,-469,-469,-469,-469,-469,,-469', 
    '-469,-469,,,,,,,,,,,,,-469,-469,,-72,,-469,,-80,,-469,-245,-245,-245', 
    ',-245,,,,-245,-245,,,,-245,,-245,-245,-245,-245,-245,-245,-245,,,,,-245', 
    '-245,-245,-245,-245,-245,-245,,,,,,,,,,-245,,,-245,-245,-245,-245,-245', 
    '-245,-245,-245,-245,-245,,-245,-245,,-245,-245,-245,,,,,,,,,,,,,,,,', 
    ',,,-245,,,-245,256,,-245,,,,,-245,,-245,,-245,,,,,,,,-245,,,,,-245,-245', 
    '-245,-245,-245,-245,,,,-245,-245,62,63,64,,51,,-245,,56,57,-245,-245', 
    ',60,,58,59,61,247,248,65,66,,,,,246,277,281,88,87,89,90,,,,,,,,,,41', 
    ',,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,', 
    '201,,,205,,,52,,,,,,,,,40,,,,,,,,208,,,,,78,72,74,75,76,77,,,,73,79', 
    '62,63,64,,51,,,,56,57,53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88', 
    '87,89,90,,,17,,,,,,,41,,,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39', 
    '37,,,,,,,,,,,,,,,,,,,,201,,,205,,,52,,,,,,,,,40,,,,,,,,18,,,,,78,72', 
    '74,75,76,77,,,,73,79,62,63,64,7,51,,,,56,57,53,54,,60,,58,59,61,23,24', 
    '65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,6,41,8,9,92,91,82,50,84,83', 
    '85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,,,,,,,36,,,30,,,52,,,,,32', 
    ',,,40,,,,,,,,18,,,,,78,72,74,75,76,77,,,,73,79,62,63,64,7,51,,,,56,57', 
    '53,54,,60,,58,59,61,23,24,65,66,,,,,22,28,27,88,87,89,90,,,17,,,,,,6', 
    '41,8,9,92,91,82,50,84,83,85,86,93,94,,80,81,,38,39,37,,,,,,,,,,,,,,', 
    ',,,,,36,,,30,,,52,,,,,32,,,,40,,,,,,,,18,,,,-485,78,72,74,75,76,77,-485', 
    '-485,-485,73,79,-485,-485,-485,,-485,,,,,,53,54,,,-485,,,,,,,,,-485', 
    '-485,,-485,-485,-485,-485,-485,,,,,,,,,,,,-485,,,,,,,-485,-485,-485', 
    ',,-485,-485,-485,,-485,,,,,-485,,,,,-485,,-485,,,,,256,-485,-485,-485', 
    ',-485,-485,-485,-485,-485,,,,,,,,,,,,,-485,,,,,,,,,,,,,-485,,-485,,', 
    '-485,,-485,,,,,,,-485,,,,,256,-485,,,,,,,,,,,,,,,,,,,,,-485,,,,,,,,', 
    ',,,,-485,,-485,,,-485,152,163,153,176,149,169,159,158,,,174,157,156', 
    '151,177,,,161,150,164,168,170,162,155,,,171,178,173,172,165,175,160', 
    '148,167,166,179,180,181,182,183,147,154,145,146,143,144,108,110,,,109', 
    ',,,,,,,136,137,,134,118,119,120,142,123,125,,,121,,,,,138,139,126,127', 
    ',,,,,,,,,,,,131,130,,117,135,133,132,128,129,124,122,115,141,116,,,140', 
    '184,152,163,153,176,149,169,159,158,,79,174,157,156,151,177,,,161,150', 
    '164,168,170,162,155,,,171,178,173,172,165,175,160,148,167,166,179,180', 
    '181,182,183,147,154,145,146,143,144,108,110,,,109,,,,,,,,136,137,,134', 
    '118,119,120,142,123,125,,,121,,,,,138,139,126,127,,,,,,,,,,,,,131,130', 
    ',117,135,133,132,128,129,124,122,115,141,116,,,140,184,152,163,153,176', 
    '149,169,159,158,,79,174,157,156,151,177,,,161,150,164,168,170,162,155', 
    ',,171,178,173,172,165,175,160,148,167,166,179,180,181,182,183,147,154', 
    '145,146,143,144,108,110,107,,109,,,,,,,,136,137,,134,118,119,120,142', 
    '123,125,,,121,,,,,138,139,126,127,,,,,,,,,,,,,131,130,,117,135,133,132', 
    '128,129,124,122,115,141,116,,,140,184,152,163,153,176,149,169,159,158', 
    ',79,174,157,156,151,177,,,161,150,164,168,170,162,155,,,171,178,173', 
    '172,165,175,160,148,167,166,179,180,181,182,183,147,154,145,146,143', 
    '144,108,110,,,109,,,,,,,,136,137,,134,118,119,120,142,123,125,,,121', 
    ',,,,138,139,126,127,,,,,,,,,,,,,131,130,,117,135,133,132,128,129,124', 
    '122,115,141,116,,,140,184,152,163,153,176,149,169,159,158,,79,174,157', 
    '156,151,177,,,161,150,164,168,170,162,155,,,171,178,173,172,165,175', 
    '160,148,167,166,179,180,181,182,183,147,154,145,146,143,144,108,110', 
    ',,109,,,,,,,,136,137,,134,118,119,120,142,123,125,,,121,,,,,138,139', 
    '126,127,,,,,,,,,,,,,131,130,,117,135,133,132,128,129,124,122,115,141', 
    '116,,,140,152,163,153,176,149,169,159,158,,,174,157,156,151,177,,,161', 
    '150,164,168,170,162,155,,,171,178,173,350,349,351,348,148,167,166,179', 
    '180,181,182,183,147,154,145,146,346,347,344,110,84,83,345,86,,,,,,,136', 
    '137,,134,118,119,120,142,123,125,,,121,,,,,138,139,126,127,,,,,,355', 
    ',,,,,,131,130,,117,135,133,132,128,129,124,122,115,141,116,,,140,152', 
    '163,153,176,149,169,159,158,,,174,157,156,151,177,,,161,150,164,168', 
    '170,162,155,,,171,178,173,172,165,175,160,148,167,166,179,180,181,182', 
    '183,147,154,145,146,143,144,108,110,372,371,109,373,,,,,,,136,137,,134', 
    '118,119,120,142,123,125,,,121,,,,,138,139,126,127,,,,,,,,,,,,,131,130', 
    ',117,135,133,132,128,129,124,122,115,141,116,,,140,152,163,153,176,149', 
    '169,159,158,,,174,157,156,151,177,,,161,150,164,168,170,162,155,,,171', 
    '178,173,172,165,175,160,148,167,166,179,180,181,182,183,147,154,145', 
    '146,143,144,108,110,372,371,109,373,,,,,,,136,137,,134,118,119,120,142', 
    '123,125,,,121,,,,,138,139,126,127,,,,,,,,580,,,,,131,130,,117,135,133', 
    '132,128,129,124,122,115,141,116,,,140,216,220,225,226,227,222,224,232', 
    '233,228,229,,209,210,,,230,231,,,,,,,,,,,,,,213,,219,,215,214,211,212', 
    '223,221,217,,218,,460,404,,,461,,,,,,,,136,137,234,134,118,119,120,142', 
    '123,125,,,121,,,,,138,139,126,127,,,,,,,,,,,,,131,130,,117,135,133,132', 
    '128,129,124,122,115,141,116,460,404,140,,461,,,,,,,,136,137,,134,118', 
    '119,120,142,123,125,,,121,,,,,138,139,126,127,,,,,,,,,,,,,131,130,,117', 
    '135,133,132,128,129,124,122,115,141,116,460,404,140,,461,,,,,,,,136', 
    '137,,134,118,119,120,142,123,125,,,121,,,,,138,139,126,127,,,,,,,,,', 
    ',,,131,130,,117,135,133,132,128,129,124,122,115,141,116,,,140,216,220', 
    '225,226,227,222,224,232,233,228,229,,209,210,,,230,231,,,,-211,,,,,', 
    ',,,,213,,219,,215,214,211,212,223,221,217,,218,,,,,,,638,404,,,639,', 
    ',,,234,,-211,136,137,,134,118,119,120,142,123,125,,,121,,,,,138,139', 
    '126,127,,,,,,,,,,,,,131,130,,117,135,133,132,128,129,124,122,115,141', 
    '116,594,404,140,,595,,,,,,,,136,137,,134,118,119,120,142,123,125,,,121', 
    ',,,,138,139,126,127,,,,,,,,,,,,,131,130,,117,135,133,132,128,129,124', 
    '122,115,141,116,,,140,216,220,225,226,227,222,224,232,233,228,229,,209', 
    '210,,,230,231,,,,,,,,,,,,,,213,,219,,215,214,211,212,223,221,217,,218', 
    ',,,,,,867,404,,,868,,,,,234,,610,136,137,,134,118,119,120,142,123,125', 
    ',,121,,,,,138,139,126,127,,,,,,,,,,,,,131,130,,117,135,133,132,128,129', 
    '124,122,115,141,116,685,410,140,,826,,,,,,,,136,137,,134,118,119,120', 
    '142,123,125,,,121,,,,,138,139,126,127,,,,,,,,,,,,,131,130,,117,135,133', 
    '132,128,129,124,122,115,141,116,594,404,140,,595,,,,,,,,136,137,,134', 
    '118,119,120,142,123,125,,,121,,,,,138,139,126,127,,,,,,,,,,,,,131,130', 
    ',117,135,133,132,128,129,124,122,115,141,116,596,410,140,,597,,,,,,', 
    ',136,137,,134,118,119,120,142,123,125,,,121,,,,,138,139,126,127,,,,', 
    ',,,,,,,,131,130,,117,135,133,132,128,129,124,122,115,141,116,596,410', 
    '140,,597,,,,,,,,136,137,,134,118,119,120,142,123,125,,,121,,,,,138,139', 
    '126,127,,,,,,,,,,,,,131,130,,117,135,133,132,128,129,124,122,115,141', 
    '116,460,404,140,,461,,,,,,,,136,137,,134,118,119,120,142,123,125,,,121', 
    ',,,,138,139,126,127,,,,,,,,,,,,,131,130,,117,135,133,132,128,129,124', 
    '122,115,141,116,869,410,140,,870,,,,,,,,136,137,,134,118,119,120,142', 
    '123,125,,,121,,,,,138,139,126,127,,,,,,,,,,,,,131,130,,117,135,133,132', 
    '128,129,124,122,115,141,116,685,410,140,,683,,,,,,,,136,137,,134,118', 
    '119,120,142,123,125,,,121,,,,,138,139,126,127,,,,,,,,,,,,,131,130,,117', 
    '135,133,132,128,129,124,122,115,141,116,401,404,140,,402,,,,,,,,136', 
    '137,,134,118,119,120,142,123,125,,,121,,,,,138,139,126,127,,,,,,,,,', 
    ',,,131,130,,117,135,133,132,128,129,124,122,115,141,116,406,410,140', 
    ',408,,,,,,,,136,137,,134,118,119,120,142,123,125,,,121,,,,,138,139,126', 
    '127,,,,,,,,,,,,,131,130,,117,135,133,132,128,129,124,122,115,141,116', 
    '460,404,140,,461,,,,,,,,136,137,,134,118,119,120,142,123,125,,,121,', 
    ',,,138,139,126,127,,,,,,,,,,,,,131,130,,117,135,133,132,128,129,124', 
    '122,115,141,116,641,410,140,,642,,,,,,,,136,137,,134,118,119,120,142', 
    '123,125,,,121,,,,,138,139,126,127,,,,,,,,,,,,,131,130,,117,135,133,132', 
    '128,129,124,122,115,141,116,,,140,216,220,225,226,227,222,224,232,233', 
    '228,229,,209,210,,,230,231,,,,,,,,,,,,,,213,,219,,215,214,211,212,223', 
    '221,217,,218,,216,220,225,226,227,222,224,232,233,228,229,,209,210,234', 
    '600,230,231,,,,,,,,,,,,,,213,,219,,215,214,211,212,223,221,217,,218', 
    '216,220,225,226,227,222,224,232,233,228,229,,209,210,,234,230,231,,', 
    ',,,,,,,,,,,213,,219,,215,214,211,212,223,221,217,,218,216,220,225,226', 
    '227,222,224,232,233,228,229,,209,210,,234,230,231,,,,,,,,,,,,,,213,', 
    '219,,215,214,211,212,223,221,217,,218,216,220,225,226,227,222,224,232', 
    '233,228,229,,209,210,,234,230,231,,,,,,,,,,,,,,213,,219,,215,214,211', 
    '212,223,221,217,,218,216,220,225,226,227,222,224,232,233,228,229,,209', 
    '210,,234,230,231,,,,,,,,,,,,,,213,,219,,215,214,211,212,223,221,217', 
    ',218,216,220,225,226,227,222,224,232,233,228,229,,209,210,,234,230,231', 
    ',,,,,,,,,,,,,213,,219,,215,214,211,212,223,221,217,,218,216,220,225', 
    '226,227,222,224,232,233,228,229,,209,210,,234,230,231,,,,,,,,,,,,,,213', 
    ',219,,215,214,211,212,223,221,217,,218,216,220,225,226,227,222,224,232', 
    '233,228,229,,209,210,293,234,230,231,,,,,,,,,,,,,,213,,219,,215,214', 
    '211,212,223,221,217,,218,216,220,225,226,227,222,224,232,233,228,229', 
    ',209,210,293,234,230,231,,,,,,,,,,,,,,213,,219,,215,214,211,212,223', 
    '221,217,,218,216,220,225,226,227,222,224,232,233,228,229,,209,210,,234', 
    '230,231,,,,,,,,,,,,,,213,,219,,215,214,211,212,223,221,217,,218,216', 
    '220,225,226,227,222,224,232,233,228,229,,209,210,,234,230,231,,,,,,', 
    ',,,,,,,213,,219,,215,214,211,212,223,221,217,,218,216,220,225,226,227', 
    '222,224,232,233,228,229,,209,210,,234,230,231,,,,,,,,,,,,,,213,,219', 
    ',215,214,211,212,223,221,217,,218,216,220,225,226,227,222,224,232,233', 
    '228,229,,209,210,,234,230,231,,,,,,,,,,,,,,213,,219,,215,214,211,212', 
    '223,221,217,,218,216,220,225,226,227,222,224,232,233,228,229,,209,210', 
    ',234,230,231,,,,,,,,,,,,,,213,,219,,215,214,211,212,223,221,217,,218', 
    '216,220,225,226,227,222,224,232,233,228,229,,209,210,,234,230,231,,', 
    ',,,,,,,,,,,213,,219,,215,214,211,212,223,221,217,,218,,,,,,,,,,,,,,', 
    ',234'];
    racc_action_table = arr = (__a = $cg(self, 'Array')).$m['new'](__a, 23559, nil);
    idx = 0;
    ($B.f = clist.$m.each, ($B.p =function(self, str) { var __a, __b;if (str === undefined) { str = nil; }
      return ($B.f = (__a = str.$m.split(str, ',', -1)).$m.each, ($B.p =function(self, i) { var __a, __b;if (i === undefined) { i = nil; }
        if(!(i.$m['empty?'](i)).$r) {arr.$m['[]='](arr, idx, i.$m.to_i(i))};
        return idx = idx.$m['+'](idx, 1);
      }).$proc =[self], $B.f)(__a);
    }).$proc =[self], $B.f)(clist);

    clist = [
    '0,0,0,0,0,522,340,55,0,0,546,546,26,0,366,0,0,0,0,0,0,0,571,624,202', 
    '806,0,0,0,0,0,0,0,537,635,0,296,296,560,560,537,0,0,0,0,0,0,0,0,0,0', 
    '0,0,0,0,260,0,0,521,0,0,0,771,624,647,647,345,619,740,202,274,635,868', 
    '345,26,740,366,274,869,818,618,0,571,571,0,309,70,0,260,537,55,571,0', 
    '671,70,26,0,546,467,310,867,522,546,522,0,467,522,756,340,0,0,0,0,0', 
    '0,740,279,647,0,0,882,882,882,296,882,560,274,340,882,882,0,0,340,882', 
    '625,882,882,882,882,882,882,882,823,610,823,467,882,882,882,882,882', 
    '882,882,869,521,638,521,351,771,521,771,200,882,771,351,882,882,882', 
    '882,882,882,882,882,882,882,357,882,882,279,882,882,882,868,419,868', 
    '359,629,868,869,818,869,818,638,869,818,309,638,309,595,279,309,882', 
    '368,671,882,671,200,882,671,310,867,310,867,363,310,867,882,756,361', 
    '756,199,361,756,299,882,631,299,199,419,882,882,882,882,882,882,357', 
    '357,357,882,882,876,876,876,595,876,359,359,359,876,876,882,882,314', 
    '876,314,876,876,876,876,876,876,876,368,368,368,401,876,876,876,876', 
    '876,876,876,363,363,363,199,276,361,361,594,402,876,632,276,876,876', 
    '876,876,876,876,876,876,876,876,25,876,876,728,876,876,876,25,633,261', 
    '344,401,642,346,814,401,273,344,348,642,346,814,608,273,642,348,876', 
    '402,449,876,594,402,876,42,15,15,637,876,276,876,42,876,261,750,812', 
    '288,489,203,728,876,750,812,288,489,876,876,876,876,876,876,605,449', 
    '640,876,876,863,863,863,642,863,814,876,273,863,863,876,876,603,863', 
    '204,863,863,863,863,863,863,863,643,35,42,639,863,863,863,863,863,863', 
    '863,811,750,812,288,489,3,463,811,240,863,3,425,863,863,863,863,863', 
    '863,863,863,863,863,772,863,863,350,863,863,863,639,645,35,350,639,847', 
    '35,878,13,870,463,646,847,425,878,13,870,425,425,863,598,870,863,347', 
    '683,863,681,811,349,303,347,683,303,681,863,349,683,338,772,772,772', 
    '772,863,306,338,648,306,863,863,863,863,863,863,14,285,241,863,863,860', 
    '860,860,847,860,878,13,870,860,860,863,863,651,860,652,860,860,860,860', 
    '860,860,860,683,697,681,245,860,860,860,860,860,860,860,583,591,338', 
    '14,285,641,641,14,285,860,829,661,860,860,860,860,860,860,860,860,860', 
    '860,353,860,860,550,860,860,860,353,550,300,308,308,300,697,697,697', 
    '697,426,667,583,669,641,313,583,670,641,860,313,586,860,871,871,860', 
    '829,829,829,829,255,545,282,282,860,474,545,474,474,474,474,426,860', 
    '659,659,426,426,860,860,860,860,860,860,37,37,185,860,860,855,855,855', 
    '855,855,533,533,688,855,855,860,860,688,855,674,855,855,855,855,855', 
    '855,855,474,474,474,474,855,855,855,855,855,855,855,474,445,855,5,5', 
    '5,5,5,855,855,855,855,855,855,855,855,855,855,855,855,855,855,675,855', 
    '855,678,855,855,855,680,564,564,445,564,564,564,445,445,445,445,107', 
    '266,682,575,107,107,685,686,855,687,555,855,553,692,855,693,552,551', 
    '268,855,547,702,269,855,549,270,549,549,549,549,713,855,95,275,524,523', 
    '855,855,855,855,855,855,277,517,77,855,855,848,848,848,848,848,76,278', 
    '281,848,848,855,855,503,848,730,848,848,848,848,848,848,848,549,549', 
    '549,549,848,848,848,848,848,848,848,444,731,848,375,375,375,375,375', 
    '848,848,848,848,848,848,848,848,848,848,848,848,848,848,500,848,848', 
    '734,848,848,848,735,738,444,739,286,741,444,444,444,444,287,290,745', 
    '490,294,485,41,481,760,848,480,763,848,36,478,848,34,295,298,469,848', 
    '468,781,783,848,61,784,61,61,61,61,785,848,786,787,466,530,848,848,848', 
    '848,848,848,792,465,20,848,848,844,844,844,455,844,802,803,302,844,844', 
    '848,848,201,844,430,844,844,844,844,844,844,844,61,61,61,61,844,844', 
    '844,844,844,844,844,530,530,530,530,429,428,427,813,304,844,407,820', 
    '844,844,844,844,844,844,844,844,844,844,821,844,844,12,844,844,844,315', 
    '825,826,400,833,396,11,839,10,842,843,9,316,393,388,8,387,857,365,844', 
    '861,362,844,866,318,844,319,320,336,323,844,872,874,334,844,528,877', 
    '528,528,528,528,331,844,1,884,,,844,844,844,844,844,844,,,,844,844,841', 
    '841,841,,841,,844,,841,841,844,844,,841,,841,841,841,841,841,841,841', 
    '528,528,528,528,841,841,841,841,841,841,841,,,,,,,,,,841,,,841,841,841', 
    '841,841,841,841,841,841,841,,841,841,,841,841,841,,,,,,,,,,,,,,,,,,', 
    ',841,,,841,,,841,,,,,841,,841,,841,695,,695,695,695,695,,841,,,,,841', 
    '841,841,841,841,841,,,,841,841,838,838,838,,838,,841,,838,838,841,841', 
    ',838,,838,838,838,838,838,838,838,695,695,695,695,838,838,838,838,838', 
    '838,838,,,,,,,,,,838,,,838,838,838,838,838,838,838,838,838,838,,838', 
    '838,,838,838,838,443,443,443,443,443,443,443,,,443,443,,,,,,443,443', 
    ',838,,,838,,,838,,,,,838,443,838,443,838,443,443,443,443,443,443,443', 
    '838,443,,,,838,838,838,838,838,838,,,,838,838,822,822,822,,822,,838', 
    ',822,822,838,838,,822,,822,822,822,822,822,822,822,,,,,822,822,822,822', 
    '822,822,822,,,,,,,,,,822,,,822,822,822,822,822,822,822,822,822,822,', 
    '822,822,,822,822,822,423,423,423,423,423,423,423,423,423,423,423,,423', 
    '423,,,423,423,,822,,,822,,,822,,,,,,423,,423,822,423,423,423,423,423', 
    '423,423,822,423,,,,822,822,822,822,822,822,,,,822,822,810,810,810,810', 
    '810,,,,810,810,822,822,,810,,810,810,810,810,810,810,810,,,,,810,810', 
    '810,810,810,810,810,,,810,,,,,,810,810,810,810,810,810,810,810,810,810', 
    '810,810,810,810,,810,810,,810,810,810,434,434,434,434,434,434,434,,', 
    '434,434,,,,,,434,434,,810,,,810,,,810,,,,,810,434,,434,810,434,434,434', 
    '434,434,434,434,810,434,,,,810,810,810,810,810,810,,,,810,810,807,807', 
    '807,,807,,,,807,807,810,810,,807,,807,807,807,807,807,807,807,,,,,807', 
    '807,807,807,807,807,807,,,,,,,,,,807,,,807,807,807,807,807,807,807,807', 
    '807,807,,807,807,,807,807,807,435,,,,,,,,,,,,,,,,435,435,,807,,,807', 
    ',,807,,,,,,435,,435,807,435,435,435,435,,,435,807,435,,,,807,807,807', 
    '807,807,807,,,,807,807,805,805,805,,805,,,,805,805,807,807,,805,,805', 
    '805,805,805,805,805,805,,,,,805,805,805,805,805,805,805,,,,,,,,,,805', 
    ',,805,805,805,805,805,805,805,805,805,805,,805,805,,805,805,805,436', 
    ',,,,,,,,,,,,,,,436,436,,805,,,805,,,805,,,,,,436,,436,805,436,436,436', 
    '436,,,436,805,436,,,,805,805,805,805,805,805,,,,805,805,17,17,17,,17', 
    ',,,17,17,805,805,,17,,17,17,17,17,17,17,17,,,,,17,17,17,17,17,17,17', 
    ',,17,,,,,,,17,,,17,17,17,17,17,17,17,17,17,17,,17,17,,17,17,17,437,', 
    ',,,,,,,,,,,,,,437,437,,17,,,17,,,17,,,,,,437,,437,17,437,437,437,437', 
    ',,437,17,437,,,,17,17,17,17,17,17,,,,17,17,18,18,18,,18,,,,18,18,17', 
    '17,,18,,18,18,18,18,18,18,18,,,,,18,18,18,18,18,18,18,,,,,,,,,,18,,', 
    '18,18,18,18,18,18,18,18,18,18,,18,18,,18,18,18,438,,,,,,,,,,,,,,,,438', 
    '438,,18,,,18,,,18,,,,,,438,,438,18,438,438,438,438,,,438,18,438,,,,18', 
    '18,18,18,18,18,,,,18,18,799,799,799,,799,,,,799,799,18,18,,799,,799', 
    '799,799,799,799,799,799,,,,,799,799,799,799,799,799,799,,,,,,,,,,799', 
    ',,799,799,799,799,799,799,799,799,799,799,,799,799,,799,799,799,447', 
    '447,447,447,447,447,447,447,,447,447,,,,,,447,447,,799,,,799,,,799,', 
    ',,,,447,,447,799,447,447,447,447,447,447,447,799,447,,,,799,799,799', 
    '799,799,799,,,,799,799,796,796,796,,796,,,,796,796,799,799,,796,,796', 
    '796,796,796,796,796,796,,,,,796,796,796,796,796,796,796,,,,,,,,,,796', 
    ',,796,796,796,796,796,796,796,796,796,796,,796,796,,796,796,796,446', 
    '446,446,446,446,446,446,,,446,446,,,,,,446,446,,796,,,796,,,796,,,,', 
    ',446,,446,796,446,446,446,446,446,446,446,796,446,,,,796,796,796,796', 
    '796,796,,,,796,796,22,22,22,,22,,,,22,22,796,796,,22,,22,22,22,22,22', 
    '22,22,,,,,22,22,22,22,22,22,22,,,,,,,,,,22,,,22,22,22,22,22,22,22,22', 
    '22,22,,22,22,,22,22,22,439,439,439,439,439,439,439,,,439,439,,,,,,439', 
    '439,,22,,,22,,,22,,,,,22,439,22,439,22,439,439,439,439,439,439,439,22', 
    '439,,,,22,22,22,22,22,22,,,,22,22,23,23,23,,23,,22,,23,23,22,22,,23', 
    ',23,23,23,23,23,23,23,,,,,23,23,23,23,23,23,23,,,,,,,,,,23,,,23,23,23', 
    '23,23,23,23,23,23,23,,23,23,,23,23,23,440,440,440,440,440,440,440,,', 
    '440,440,,,,,,440,440,,23,,,23,,,23,,,,,23,440,23,440,23,440,440,440', 
    '440,440,440,440,23,440,,,,23,23,23,23,23,23,,,,23,23,24,24,24,,24,,23', 
    ',24,24,23,23,,24,,24,24,24,24,24,24,24,,,,,24,24,24,24,24,24,24,,,,', 
    ',,,,,24,,,24,24,24,24,24,24,24,24,24,24,,24,24,,24,24,24,441,441,441', 
    '441,441,441,441,,,441,441,,,,,,441,441,,24,,,24,,,24,,,,,24,441,24,441', 
    '24,441,441,441,441,441,441,441,24,441,,,,24,24,24,24,24,24,,,,24,24', 
    '790,790,790,790,790,,24,,790,790,24,24,,790,,790,790,790,790,790,790', 
    '790,,,,,790,790,790,790,790,790,790,,,790,,,,,,790,790,790,790,790,790', 
    '790,790,790,790,790,790,790,790,,790,790,,790,790,790,442,442,442,442', 
    '442,442,442,,,442,442,,,,,,442,442,,790,,,790,,,790,,,,,790,442,,442', 
    '790,442,442,442,442,442,442,442,790,442,,,,790,790,790,790,790,790,', 
    ',,790,790,769,769,769,769,769,,,,769,769,790,790,,769,,769,769,769,769', 
    '769,769,769,,,,,769,769,769,769,769,769,769,,,769,,,,,,769,769,769,769', 
    '769,769,769,769,769,769,769,769,769,769,,769,769,,769,769,769,424,424', 
    '424,424,424,424,424,424,424,424,424,,424,424,,,424,424,,769,,,769,,', 
    '769,,,,,769,424,,424,769,424,424,424,424,424,424,424,769,424,,,,769', 
    '769,769,769,769,769,,,,769,769,27,27,27,,27,,,,27,27,769,769,,27,,27', 
    '27,27,27,27,27,27,,,,,27,27,27,27,27,27,27,,,,,,,,,,27,,,27,27,27,27', 
    '27,27,27,27,27,27,,27,27,,27,27,27,431,,,,,,,,,,,,,,,,431,431,,27,,', 
    '27,27,,27,,,,,27,431,27,431,27,431,431,431,431,,,,27,,,,28,27,27,27', 
    '27,27,27,28,28,28,27,27,28,28,28,432,28,,27,,,,27,27,,,28,28,,,,432', 
    '432,,,28,28,,28,28,28,28,28,,,,432,,432,,432,432,432,432,,,,,,,,,,,28', 
    '28,28,28,28,28,28,28,28,28,28,28,28,28,,,28,28,28,,,28,,28,28,,,28,', 
    '28,,28,,28,,28,28,28,28,28,28,28,,28,,28,,,,,,,,,,,,,28,28,28,28,,28', 
    ',,,28,30,30,30,30,30,,,,30,30,,,,30,,30,30,30,30,30,30,30,,,,,30,30', 
    '30,30,30,30,30,,,30,,,,,,30,30,30,30,30,30,30,30,30,30,30,30,30,30,', 
    '30,30,,30,30,30,433,,,,,,,,,,,,,,,,433,433,,30,,,30,,,30,,,,,30,433', 
    ',,30,433,433,433,433,,,,30,,,,,30,30,30,30,30,30,,,,30,30,31,31,31,', 
    '31,,,,31,31,30,30,,31,,31,31,31,31,31,31,31,,,,,31,31,31,31,31,31,31', 
    ',,,,,,,,,31,,,31,31,31,31,31,31,31,31,31,31,,31,31,,,352,31,352,352', 
    '352,352,,,,,,,,,,,,,,,,31,,,31,,,31,,,,,31,,,,,,352,,,,,,,352,352,352', 
    '352,31,31,31,31,31,31,,,,31,31,32,32,32,,32,,,,32,32,31,31,,32,,32,32', 
    '32,32,32,32,32,,,,,32,32,32,32,32,32,32,,,,,,,,,,32,,,32,32,32,32,32', 
    '32,32,32,32,32,,32,32,,,701,32,701,701,701,701,,,,,,,,,,,,,,,,32,,,32', 
    ',,32,,,,,,,,,,,701,,,,,,,701,701,701,701,32,32,32,32,32,32,,,,32,32', 
    '768,768,768,,768,,,,768,768,32,32,,768,,768,768,768,768,768,768,768', 
    ',,,,768,768,768,768,768,768,768,,,,,,,,,,768,,,768,768,768,768,768,768', 
    '768,768,768,768,,768,768,,768,768,768,,,,,,,,,,,,,,,,,,,,768,,,768,', 
    ',768,,,,,768,,,,768,,,,,,,,768,,,,,768,768,768,768,768,768,,,,768,768', 
    '341,341,341,,341,,,,341,341,768,768,,341,,341,341,341,341,341,341,341', 
    ',,,,341,341,341,341,341,341,341,,,341,,,,,,,341,,,341,341,341,341,341', 
    '341,341,341,341,341,,341,341,,341,341,341,,,,,,,,,,,,,,,,,,,,341,,,341', 
    ',,341,,,,,,,,,341,,,,,,,,341,,,,,341,341,341,341,341,341,,,,341,341', 
    '764,764,764,764,764,,,,764,764,341,341,,764,,764,764,764,764,764,764', 
    '764,,,,,764,764,764,764,764,764,764,,,764,,,,,,764,764,764,764,764,764', 
    '764,764,764,764,764,764,764,764,,764,764,,764,764,764,,,,,,,,,,,,,,', 
    ',,,,,764,,,764,,,764,,,,,764,,,,764,,,,,,,,764,,,,,764,764,764,764,764', 
    '764,,,,764,764,762,762,762,,762,,,,762,762,764,764,,762,,762,762,762', 
    '762,762,762,762,,,,,762,762,762,762,762,762,762,,,762,,,,,,,762,,,762', 
    '762,762,762,762,762,762,762,762,762,,762,762,,762,762,762,,,,,,,,,,', 
    ',,,,,,,,,762,,,762,,,762,,,,,,,,,762,,,,,,,,762,,,,,762,762,762,762', 
    '762,762,,,,762,762,38,38,38,,38,,,,38,38,762,762,,38,,38,38,38,38,38', 
    '38,38,,,,,38,38,38,38,38,38,38,,,,,,,,,,38,,,38,38,38,38,38,38,38,38', 
    '38,38,,38,38,,38,38,38,,,,,,,,,,,,,,,,,,,,38,,,38,,,38,,,,,,,,,38,,', 
    ',,,,,38,,,,,38,38,38,38,38,38,,,,38,38,39,39,39,,39,,,,39,39,38,38,', 
    '39,,39,39,39,39,39,39,39,,,,,39,39,39,39,39,39,39,,,,,,,,,,39,,,39,39', 
    '39,39,39,39,39,39,39,39,,39,39,,39,39,39,,,,,,,,,,,,,,,,,,,,39,,,39', 
    ',,39,,,,,,,,,39,,,,,,,,39,,,,,39,39,39,39,39,39,,,,39,39,40,40,40,,40', 
    ',,,40,40,39,39,,40,,40,40,40,40,40,40,40,,,,,40,40,40,40,40,40,40,,', 
    ',,,,,,,40,,,40,40,40,40,40,40,40,40,40,40,,40,40,,40,40,40,,,,,,,,,', 
    ',,,,,,,,,,40,,,40,,,40,,,,,,,,,40,,,,,,,,40,,,,,40,40,40,40,40,40,,', 
    ',40,40,757,757,757,,757,,,,757,757,40,40,,757,,757,757,757,757,757,757', 
    '757,,,,,757,757,757,757,757,757,757,,,,,,,,,,757,,,757,757,757,757,757', 
    '757,757,757,757,757,,757,757,,,,757,,,,,,,,,,,,,,,,,,,,757,,,757,,,757', 
    ',,,,,,,,,,,,,,,,,,,,,757,757,757,757,757,757,,,,757,757,753,753,753', 
    '753,753,,,,753,753,757,757,,753,,753,753,753,753,753,753,753,,335,,', 
    '753,753,753,753,753,753,753,,,753,,,,,,753,753,753,753,753,753,753,753', 
    '753,753,753,753,753,753,,753,753,,753,753,753,,,,,,,,,,,,335,,,,,,,335', 
    '753,,,753,335,,753,,,,,753,,,,753,,,,,,,,753,,335,,50,753,753,753,753', 
    '753,753,50,50,50,753,753,50,50,50,,50,,,,,335,753,753,50,,50,50,,,,', 
    ',,,50,50,,50,50,50,50,50,,,,,,,,,,,,,,,,,,,,,,50,50,50,50,50,50,50,50', 
    '50,50,50,50,50,50,,,50,50,50,,,50,,,50,,,50,,50,,50,,50,,50,50,50,50', 
    '50,50,50,,50,,50,,,,,,,,,,,,,50,50,50,50,,50,,,,50,51,51,51,51,51,,', 
    ',51,51,,,,51,,51,51,51,51,51,51,51,,,,,51,51,51,51,51,51,51,,,51,,,', 
    ',,51,51,51,51,51,51,51,51,51,51,51,51,51,51,,51,51,,51,51,51,,,,,,,', 
    ',,,,,,,,,,,,51,,,51,,,51,,,,,51,,,,51,,,,,,,,51,,,,,51,51,51,51,51,51', 
    ',,,51,51,52,52,52,,52,,,,52,52,51,51,,52,,52,52,52,52,52,52,52,,,,,52', 
    '52,52,52,52,52,52,,,52,,,,,,,52,,,52,52,52,52,52,52,52,52,52,52,,52', 
    '52,,52,52,52,,,,,,,,,,,,,,,,,,,,52,,,52,,,52,,,,,,,,,52,,,,,,,,52,,', 
    ',,52,52,52,52,52,52,,,,52,52,53,53,53,,53,,,,53,53,52,52,,53,,53,53', 
    '53,53,53,53,53,,,,,53,53,53,53,53,53,53,,,,,,,,,,53,,,53,53,53,53,53', 
    '53,53,53,53,53,,53,53,,53,53,53,,,,,,,,,,,,,,,,,,,,53,,,53,,,53,,,,', 
    '53,,,,53,,,,,,,,53,,,,,53,53,53,53,53,53,,,,53,53,54,54,54,,54,,53,', 
    '54,54,53,53,,54,,54,54,54,54,54,54,54,,,,,54,54,54,54,54,54,54,,,,,', 
    ',,,,54,,,54,54,54,54,54,54,54,54,54,54,,54,54,,54,54,54,,,,,,,,,,,,', 
    ',,,,,,,54,,,54,,,54,,,,,,,,,54,,,,,,,,54,,,,,54,54,54,54,54,54,,,,54', 
    '54,744,744,744,,744,,54,,744,744,54,54,,744,,744,744,744,744,744,744', 
    '744,,,,,744,744,744,744,744,744,744,,,,,,,,,,744,,,744,744,744,744,744', 
    '744,744,744,744,744,,744,744,,744,744,744,,,,,,,,,,,,,,,,,,,,744,,,744', 
    ',,744,,,,,744,,744,,744,,,,,,,,744,,,,,744,744,744,744,744,744,,,,744', 
    '744,56,56,56,,56,,744,,56,56,744,744,,56,,56,56,56,56,56,56,56,,,,,56', 
    '56,56,56,56,56,56,,,56,,,,,,,56,,,56,56,56,56,56,56,56,56,56,56,,56', 
    '56,,56,56,56,,,,,,,,,,,,,,,,,,,,56,,,56,,,56,,,,,,,,,56,,,,,,,,56,,', 
    ',,56,56,56,56,56,56,,,,56,56,57,57,57,,57,,,,57,57,56,56,,57,,57,57', 
    '57,57,57,57,57,,,,,57,57,57,57,57,57,57,,,57,,,,,,,57,,,57,57,57,57', 
    '57,57,57,57,57,57,,57,57,,57,57,57,,,,,,,,,,,,,,,,,,,,57,,,57,,,57,', 
    ',,,,,,,57,,,,,,,,57,,,,,57,57,57,57,57,57,,,,57,57,60,60,60,,60,,,,60', 
    '60,57,57,,60,,60,60,60,60,60,60,60,,,,,60,60,60,60,60,60,60,,,60,,,', 
    ',391,,60,,,60,60,60,60,60,60,60,60,60,60,,60,60,,60,60,60,391,391,391', 
    '391,391,391,391,391,391,391,391,,391,391,,,391,391,,60,,,60,,,60,,,', 
    ',,391,,391,60,391,391,391,391,391,391,391,60,391,,,,60,60,60,60,60,60', 
    ',,,60,60,60,391,,391,,60,,,,,60,60,742,742,742,,742,,,,742,742,,,,742', 
    ',742,742,742,742,742,742,742,,,,,742,742,742,742,742,742,742,,,,,,,', 
    ',,742,,,742,742,742,742,742,742,742,742,742,742,,742,742,,742,742,742', 
    ',,,,,,,,,,,,,,,,,,,742,,,742,,,742,,,,,742,,742,,742,,,,,,,,742,,,,', 
    '742,742,742,742,742,742,,,,742,742,62,62,62,,62,,742,,62,62,742,742', 
    ',62,,62,62,62,62,62,62,62,,,,,62,62,62,62,62,62,62,,,,,,,,,,62,,,62', 
    '62,62,62,62,62,62,62,62,62,,62,62,,,,62,,,,,,,,,,,,,,,,,62,,,62,,,62', 
    ',,62,,,,,,,,,,,,,,,,,,,,,,62,62,62,62,62,62,,,,62,62,63,63,63,,63,,', 
    ',63,63,62,62,,63,,63,63,63,63,63,63,63,,,,,63,63,63,63,63,63,63,,,,', 
    ',,,,,63,,,63,63,63,63,63,63,63,63,63,63,,63,63,,,,63,,,,,,,,,,,,,,,', 
    ',,,,63,,,63,,,63,,,,,,,,,,,,,,,,,,,,,,63,63,63,63,63,63,,,,63,63,733', 
    '733,733,,733,,,,733,733,63,63,,733,,733,733,733,733,733,733,733,,,,', 
    '733,733,733,733,733,733,733,,,,,,,,,,733,,,733,733,733,733,733,733,733', 
    '733,733,733,,733,733,,733,733,733,,,,,,,,,,,,,,,,,,,,733,,,733,,,733', 
    ',,,,733,,733,,733,,,,,,,,733,,,,,733,733,733,733,733,733,,,,733,733', 
    '727,727,727,,727,,733,,727,727,733,733,,727,,727,727,727,727,727,727', 
    '727,,,,,727,727,727,727,727,727,727,,,,,,,,,,727,,,727,727,727,727,727', 
    '727,727,727,727,727,,727,727,,727,727,727,,,,,,,,,,,,,,,,,,,,727,,,727', 
    ',,727,,,,,,,,,727,,,,,,,,727,,,,,727,727,727,727,727,727,,,,727,727', 
    '726,726,726,,726,,,,726,726,727,727,,726,,726,726,726,726,726,726,726', 
    ',,,,726,726,726,726,726,726,726,,,,,,,,,,726,,,726,726,726,726,726,726', 
    '726,726,726,726,,726,726,,726,726,726,,,,,,,,,,,,,,,,,,,,726,,,726,', 
    ',726,,,,,,,,,726,,,,,,,,726,,,,,726,726,726,726,726,726,,,,726,726,725', 
    '725,725,,725,,,,725,725,726,726,,725,,725,725,725,725,725,725,725,,', 
    ',,725,725,725,725,725,725,725,,,,,,,,,,725,,,725,725,725,725,725,725', 
    '725,725,725,725,,725,725,,725,725,725,,,,,,,,,,,,,,,,,,,,725,,,725,', 
    ',725,,,,,,,,,725,,,,,,,,725,,,,,725,725,725,725,725,725,,,,725,725,715', 
    '715,715,,715,,,,715,715,725,725,,715,,715,715,715,715,715,715,715,,', 
    ',,715,715,715,715,715,715,715,,,,,,,,,,715,,,715,715,715,715,715,715', 
    '715,715,715,715,,715,715,,715,715,715,,,,,,,,,,,,,,,,,,,,715,,,715,', 
    ',715,,,,,,,,,715,,,,,,,,715,,,,,715,715,715,715,715,715,,,,715,715,82', 
    '82,82,,82,,,,82,82,715,715,,82,,82,82,82,82,82,82,82,,82,,,82,82,82', 
    '82,82,82,82,,,,,,,,,,82,,,82,82,82,82,82,82,82,82,82,82,,82,82,,82,82', 
    '82,,,,,,,,,,,,,,,,,,,,82,,,82,82,,82,,,,,82,,82,,82,,,,,,,,82,,82,,', 
    '82,82,82,82,82,82,,,,82,82,85,85,85,,85,,82,,85,85,82,82,,85,,85,85', 
    '85,85,85,85,85,,85,,,85,85,85,85,85,85,85,,,,,,,,,,85,,,85,85,85,85', 
    '85,85,85,85,85,85,,85,85,,85,85,85,,,,,,,,,,,,,,,,,,,,85,,,85,85,,85', 
    ',,,,85,,85,,85,,,,,,,,85,,85,,,85,85,85,85,85,85,,,,85,85,714,714,714', 
    ',714,,85,,714,714,85,85,,714,,714,714,714,714,714,714,714,,,,,714,714', 
    '714,714,714,714,714,,,,,,,,,,714,,,714,714,714,714,714,714,714,714,714', 
    '714,,714,714,,714,714,714,,,,,,,,,,,,,,,,,,,,714,,,714,,,714,,,,,,,', 
    ',714,,,,,,,,714,,,,,714,714,714,714,714,714,,,,714,714,97,97,97,97,97', 
    ',,,97,97,714,714,,97,,97,97,97,97,97,97,97,,,,,97,97,97,97,97,97,97', 
    ',,97,,,,,,97,97,97,97,97,97,97,97,97,97,97,97,97,97,,97,97,,97,97,97', 
    ',,,,,,,,,,,,,,,,,,,97,,,97,,,97,,,,,97,,,,97,,,,,,,,97,,,,,97,97,97', 
    '97,97,97,,,,97,97,101,101,101,,101,97,,,101,101,97,97,,101,,101,101', 
    '101,101,101,101,101,,,,,101,101,101,101,101,101,101,,,101,,,,,,,101', 
    ',,101,101,101,101,101,101,101,101,101,101,,101,101,,101,101,101,,,,', 
    ',,,,,,,,,,,,,,,101,,,101,,,101,,,,,,,,,101,,,,,,,,101,,,,,101,101,101', 
    '101,101,101,,,,101,101,102,102,102,,102,,,,102,102,101,101,,102,,102', 
    '102,102,102,102,102,102,,,,,102,102,102,102,102,102,102,,,102,,,,,,', 
    '102,,,102,102,102,102,102,102,102,102,102,102,,102,102,,102,102,102', 
    ',,,,,,,,,,,,,,,,,,,102,,,102,,,102,,,,,,,,,102,,,,,,,,102,,,,,102,102', 
    '102,102,102,102,,,,102,102,103,103,103,,103,,,,103,103,102,102,,103', 
    ',103,103,103,103,103,103,103,,,,,103,103,103,103,103,103,103,,,103,', 
    ',,,,,103,,,103,103,103,103,103,103,103,103,103,103,,103,103,,103,103', 
    '103,,,,,,,,,,,,,,,,,,,,103,,,103,,,103,,,,,,,,,103,,,,,,,,103,,,,,103', 
    '103,103,103,103,103,,,,103,103,104,104,104,,104,,,,104,104,103,103,', 
    '104,,104,104,104,104,104,104,104,,,,,104,104,104,104,104,104,104,,,104', 
    ',,,,,,104,,,104,104,104,104,104,104,104,104,104,104,,104,104,,104,104', 
    '104,,,,,,,,,,,,,,,,,,,,104,,,104,,,104,,,,,,,,,104,,,,,,,,104,,,,,104', 
    '104,104,104,104,104,,,,104,104,105,105,105,105,105,,,,105,105,104,104', 
    ',105,,105,105,105,105,105,105,105,,,,,105,105,105,105,105,105,105,,', 
    '105,,,,,,105,105,105,105,105,105,105,105,105,105,105,105,105,105,,105', 
    '105,,105,105,105,,,,,,,,,,,,,,,,,,,,105,,,105,,,105,,,,,105,,,,105,', 
    ',,,,,,105,,,,,105,105,105,105,105,105,,,,105,105,708,708,708,708,708', 
    ',,,708,708,105,105,,708,,708,708,708,708,708,708,708,,,,,708,708,708', 
    '708,708,708,708,,,708,,,,,,708,708,708,708,708,708,708,708,708,708,708', 
    '708,708,708,,708,708,,708,708,708,,,,,,,,,,,,,,,,,,,,708,,,708,,,708', 
    ',,,,708,,,,708,,,,,,,,708,,,,,708,708,708,708,708,708,,,,708,708,700', 
    '700,700,,700,,,,700,700,708,708,,700,,700,700,700,700,700,700,700,,', 
    ',,700,700,700,700,700,700,700,,,,,,,,,,700,,,700,700,700,700,700,700', 
    '700,700,700,700,,700,700,,700,700,700,,,,,,,,,,,,,,,,,,,,700,,,700,', 
    ',700,,,,,,,,,700,,,,,,,,700,,,,,700,700,700,700,700,700,,,,700,700,690', 
    '690,690,690,690,,,,690,690,700,700,,690,,690,690,690,690,690,690,690', 
    ',,,,690,690,690,690,690,690,690,,,690,,,,,,690,690,690,690,690,690,690', 
    '690,690,690,690,690,690,690,,690,690,,690,690,690,,,,,,,,,,,,,,,,,,', 
    ',690,,,690,,,690,,,,,690,,,,690,,,,,,,,690,,,,,690,690,690,690,690,690', 
    ',,,690,690,673,673,673,,673,,,,673,673,690,690,,673,,673,673,673,673', 
    '673,673,673,,,,,673,673,673,673,673,673,673,,,673,,,,,,,673,,,673,673', 
    '673,673,673,673,673,673,673,673,,673,673,,673,673,673,,,,,,,,,,,,,,', 
    ',,,,,673,,,673,,,673,,,,,,,,,673,,,,,,,,673,,,,,673,673,673,673,673', 
    '673,,,,673,673,187,187,187,187,187,,,,187,187,673,673,,187,,187,187', 
    '187,187,187,187,187,,,,,187,187,187,187,187,187,187,,,187,,,,,,187,187', 
    '187,187,187,187,187,187,187,187,187,187,187,187,,187,187,,187,187,187', 
    ',,,,,,,,,,,,,,,,,,,187,,,187,,,187,,,,,187,,,,187,,,,,,,,187,,,,,187', 
    '187,187,187,187,187,,,,187,187,188,188,188,188,188,,,,188,188,187,187', 
    ',188,,188,188,188,188,188,188,188,,,,,188,188,188,188,188,188,188,,', 
    '188,,,,,,188,188,188,188,188,188,188,188,188,188,188,188,188,188,,188', 
    '188,,188,188,188,,,,,,,,,,,,,,,,,,,,188,,,188,,,188,,,,,188,,,,188,', 
    ',,,,,,188,,,,,188,188,188,188,188,188,,,,188,188,189,189,189,,189,,', 
    ',189,189,188,188,,189,,189,189,189,189,189,189,189,,,,,189,189,189,189', 
    '189,189,189,,,,,,,,,,189,,,189,189,189,189,189,189,189,189,189,189,', 
    '189,189,,189,189,189,,,,,,,,,,,,,,,,,,,,189,,,189,,,189,,,,,189,,,,189', 
    ',,,,,,,189,,,,,189,189,189,189,189,189,,,,189,189,190,190,190,,190,', 
    ',,190,190,189,189,,190,,190,190,190,190,190,190,190,,,,,190,190,190', 
    '190,190,190,190,,,,,,,,,,190,,,190,190,190,190,190,190,190,190,190,190', 
    ',190,190,,190,190,190,,,,,,,,,,,,,,,,,,,,190,,,190,,,190,,,,,190,,,', 
    '190,,,,,,,,190,,,,,190,190,190,190,190,190,,,,190,190,191,191,191,,191', 
    ',,,191,191,190,190,,191,,191,191,191,191,191,191,191,,,,,191,191,191', 
    '191,191,191,191,,,,,,,,,,191,,,191,191,191,191,191,191,191,191,191,191', 
    ',191,191,,191,191,191,,,,,,,,,,,,,,,,,,,,191,,,191,,,191,,,,,,,,,191', 
    ',,,,,,,191,,,,,191,191,191,191,191,191,,,,191,191,192,192,192,,192,', 
    ',,192,192,191,191,,192,,192,192,192,192,192,192,192,,,,,192,192,192', 
    '192,192,192,192,,,,,,,,,,192,,,192,192,192,192,192,192,192,192,192,192', 
    ',192,192,,192,192,192,,,,,,,,,,,,,,,,,,,,192,,,192,,,192,,,,,192,,,', 
    '192,,,,,,,,192,,,,,192,192,192,192,192,192,,,,192,192,672,672,672,,672', 
    ',192,,672,672,192,192,,672,,672,672,672,672,672,672,672,,,,,672,672', 
    '672,672,672,672,672,,,,,,,,,,672,,,672,672,672,672,672,672,672,672,672', 
    '672,,672,672,,672,672,672,,,,,,,,,,,,,,,,,,,,672,,,672,,,672,,,,,,,', 
    ',672,,,,,,,,672,,,,,672,672,672,672,672,672,,,,672,672,656,656,656,', 
    '656,,,,656,656,672,672,,656,,656,656,656,656,656,656,656,,,,,656,656', 
    '656,656,656,656,656,,,,,,,,,,656,,,656,656,656,656,656,656,656,656,656', 
    '656,,656,656,,656,656,656,,,,,,,,,,,,,,,,,,,,656,,,656,,,656,,,,,,,', 
    ',656,,,,,,,,656,,,,,656,656,656,656,656,656,,,,656,656,195,195,195,', 
    '195,,,,195,195,656,656,,195,,195,195,195,195,195,195,195,,,,,195,195', 
    '195,195,195,195,195,,,,,,,,,,195,,,195,195,195,195,195,195,195,195,195', 
    '195,,195,195,,195,195,195,,,,,,,,,,,,,,,,,,,,195,,,195,,,195,,,,,,,', 
    ',195,,,,,,,,195,,,,,195,195,195,195,195,195,,,,195,195,196,196,196,', 
    '196,,,,196,196,195,195,,196,,196,196,196,196,196,196,196,,,,,196,196', 
    '196,196,196,196,196,,,196,,,,,,,196,,,196,196,196,196,196,196,196,196', 
    '196,196,,196,196,,196,196,196,,,,,,,,,,,,,,,,,,,,196,,,196,,,196,,,', 
    ',,,,,196,,,,,,,,196,,,,,196,196,196,196,196,196,,,,196,196,197,197,197', 
    ',197,,,,197,197,196,196,,197,,197,197,197,197,197,197,197,,,,,197,197', 
    '197,197,197,197,197,,,197,,,,,,,197,,,197,197,197,197,197,197,197,197', 
    '197,197,,197,197,,197,197,197,,,,,,,,,,,,,,,,,,,,197,,,197,,,197,,,', 
    ',,,,,197,,,,,,,,197,,,,,197,197,197,197,197,197,,,,197,197,650,650,650', 
    '650,650,,,,650,650,197,197,,650,,650,650,650,650,650,650,650,,,,,650', 
    '650,650,650,650,650,650,,,650,,,,,,650,650,650,650,650,650,650,650,650', 
    '650,650,650,650,650,,650,650,,650,650,650,,,,,,,,,,,,,,,,,,,,650,,,650', 
    ',,650,,,,,650,,,,650,,,,,,,,650,,,,,650,650,650,650,650,650,,,,650,650', 
    '626,626,626,,626,,,,626,626,650,650,,626,,626,626,626,626,626,626,626', 
    ',,,,626,626,626,626,626,626,626,,,,,,,,,,626,,,626,626,626,626,626,626', 
    '626,626,626,626,,626,626,,626,626,626,,,,,,,,,,,,,,,,,,,,626,,,626,', 
    ',626,,,,,,,,,626,,,,,,,,626,,,,,626,626,626,626,626,626,,,,626,626,622', 
    '622,622,,622,,,,622,622,626,626,,622,,622,622,622,622,622,622,622,,', 
    ',,622,622,622,622,622,622,622,,,,,,,,,,622,,,622,622,622,622,622,622', 
    '622,622,622,622,,622,622,,622,622,622,,,,,,,,,,,,,,,,,,,,622,,,622,', 
    ',622,,,,,622,,622,,622,,,,,,,,622,,,,,622,622,622,622,622,622,,,,622', 
    '622,616,616,616,616,616,,622,,616,616,622,622,,616,,616,616,616,616', 
    '616,616,616,,,,,616,616,616,616,616,616,616,,,616,,,,,,616,616,616,616', 
    '616,616,616,616,616,616,616,616,616,616,,616,616,,616,616,616,,,,,,', 
    ',,,,,,,,,,,,,616,,,616,,,616,,,,,616,,,,616,,,,,,,,616,,,,,616,616,616', 
    '616,616,616,,,,616,616,606,606,606,,606,,,,606,606,616,616,,606,,606', 
    '606,606,606,606,606,606,,,,,606,606,606,606,606,606,606,,,,,,,,,,606', 
    ',,606,606,606,606,606,606,606,606,606,606,,606,606,,606,606,606,,,,', 
    ',,,,,,,,,,,,,,,606,,,606,,,606,,,,,,,,,606,,,,,,,,606,,,,,606,606,606', 
    '606,606,606,,,,606,606,602,602,602,,602,,,,602,602,606,606,,602,,602', 
    '602,602,602,602,602,602,,,,,602,602,602,602,602,602,602,,,,,,,,,,602', 
    ',,602,602,602,602,602,602,602,602,602,602,,602,602,,602,602,602,,,,', 
    ',,,,,,,,,,,,,,,602,,,602,,,602,,,,,,,,,602,,,,,,,,602,,,,,602,602,602', 
    '602,602,602,,,,602,602,205,205,205,205,205,,,,205,205,602,602,,205,', 
    '205,205,205,205,205,205,205,,,,,205,205,205,205,205,205,205,,,205,,', 
    ',,,205,205,205,205,205,205,205,205,205,205,205,205,205,205,,205,205', 
    ',205,205,205,,,,,,,,,,,,,,,,,,,,205,,,205,,,205,,,,,205,,,,205,,,,,', 
    ',,205,,,,,205,205,205,205,205,205,,,,205,205,208,208,208,,208,,,,208', 
    '208,205,205,,208,,208,208,208,208,208,208,208,,,,,208,208,208,208,208', 
    '208,208,,,,,,,,,,208,,,208,208,208,208,208,208,208,208,208,208,,208', 
    '208,,208,208,208,,,,,,,,,,,,,,,,,,,,208,,,208,,,208,,,,,,,,,208,,,,', 
    ',,,208,,,,,208,208,208,208,208,208,,,,208,208,209,209,209,,209,,,,209', 
    '209,208,208,,209,,209,209,209,209,209,209,209,,,,,209,209,209,209,209', 
    '209,209,,,,,,,,,,209,,,209,209,209,209,209,209,209,209,209,209,,209', 
    '209,,209,209,209,,,,,,,,,,,,,,,,,,,,209,,,209,,,209,,,,,,,,,209,,,,', 
    ',,,209,,,,,209,209,209,209,209,209,,,,209,209,210,210,210,,210,,,,210', 
    '210,209,209,,210,,210,210,210,210,210,210,210,,,,,210,210,210,210,210', 
    '210,210,,,,,,,,,,210,,,210,210,210,210,210,210,210,210,210,210,,210', 
    '210,,210,210,210,,,,,,,,,,,,,,,,,,,,210,,,210,,,210,,,,,,,,,210,,,,', 
    ',,,210,,,,,210,210,210,210,210,210,,,,210,210,211,211,211,,211,,,,211', 
    '211,210,210,,211,,211,211,211,211,211,211,211,,,,,211,211,211,211,211', 
    '211,211,,,,,,,,,,211,,,211,211,211,211,211,211,211,211,211,211,,211', 
    '211,,211,211,211,,,,,,,,,,,,,,,,,,,,211,,,211,,,211,,,,,,,,,211,,,,', 
    ',,,211,,,,,211,211,211,211,211,211,,,,211,211,212,212,212,,212,,,,212', 
    '212,211,211,,212,,212,212,212,212,212,212,212,,,,,212,212,212,212,212', 
    '212,212,,,,,,,,,,212,,,212,212,212,212,212,212,212,212,212,212,,212', 
    '212,,212,212,212,,,,,,,,,,,,,,,,,,,,212,,,212,,,212,,,,,,,,,212,,,,', 
    ',,,212,,,,,212,212,212,212,212,212,,,,212,212,213,213,213,,213,,,,213', 
    '213,212,212,,213,,213,213,213,213,213,213,213,,,,,213,213,213,213,213', 
    '213,213,,,,,,,,,,213,,,213,213,213,213,213,213,213,213,213,213,,213', 
    '213,,213,213,213,,,,,,,,,,,,,,,,,,,,213,,,213,,,213,,,,,,,,,213,,,,', 
    ',,,213,,,,,213,213,213,213,213,213,,,,213,213,214,214,214,,214,,,,214', 
    '214,213,213,,214,,214,214,214,214,214,214,214,,,,,214,214,214,214,214', 
    '214,214,,,,,,,,,,214,,,214,214,214,214,214,214,214,214,214,214,,214', 
    '214,,214,214,214,,,,,,,,,,,,,,,,,,,,214,,,214,,,214,,,,,,,,,214,,,,', 
    ',,,214,,,,,214,214,214,214,214,214,,,,214,214,215,215,215,,215,,,,215', 
    '215,214,214,,215,,215,215,215,215,215,215,215,,,,,215,215,215,215,215', 
    '215,215,,,,,,,,,,215,,,215,215,215,215,215,215,215,215,215,215,,215', 
    '215,,215,215,215,,,,,,,,,,,,,,,,,,,,215,,,215,,,215,,,,,,,,,215,,,,', 
    ',,,215,,,,,215,215,215,215,215,215,,,,215,215,216,216,216,,216,,,,216', 
    '216,215,215,,216,,216,216,216,216,216,216,216,,,,,216,216,216,216,216', 
    '216,216,,,,,,,,,,216,,,216,216,216,216,216,216,216,216,216,216,,216', 
    '216,,216,216,216,,,,,,,,,,,,,,,,,,,,216,,,216,,,216,,,,,,,,,216,,,,', 
    ',,,216,,,,,216,216,216,216,216,216,,,,216,216,217,217,217,,217,,,,217', 
    '217,216,216,,217,,217,217,217,217,217,217,217,,,,,217,217,217,217,217', 
    '217,217,,,,,,,,,,217,,,217,217,217,217,217,217,217,217,217,217,,217', 
    '217,,217,217,217,,,,,,,,,,,,,,,,,,,,217,,,217,,,217,,,,,,,,,217,,,,', 
    ',,,217,,,,,217,217,217,217,217,217,,,,217,217,218,218,218,,218,,,,218', 
    '218,217,217,,218,,218,218,218,218,218,218,218,,,,,218,218,218,218,218', 
    '218,218,,,,,,,,,,218,,,218,218,218,218,218,218,218,218,218,218,,218', 
    '218,,218,218,218,,,,,,,,,,,,,,,,,,,,218,,,218,,,218,,,,,,,,,218,,,,', 
    ',,,218,,,,,218,218,218,218,218,218,,,,218,218,219,219,219,,219,,,,219', 
    '219,218,218,,219,,219,219,219,219,219,219,219,,,,,219,219,219,219,219', 
    '219,219,,,,,,,,,,219,,,219,219,219,219,219,219,219,219,219,219,,219', 
    '219,,219,219,219,,,,,,,,,,,,,,,,,,,,219,,,219,,,219,,,,,,,,,219,,,,', 
    ',,,219,,,,,219,219,219,219,219,219,,,,219,219,220,220,220,,220,,,,220', 
    '220,219,219,,220,,220,220,220,220,220,220,220,,,,,220,220,220,220,220', 
    '220,220,,,,,,,,,,220,,,220,220,220,220,220,220,220,220,220,220,,220', 
    '220,,220,220,220,,,,,,,,,,,,,,,,,,,,220,,,220,,,220,,,,,,,,,220,,,,', 
    ',,,220,,,,,220,220,220,220,220,220,,,,220,220,221,221,221,,221,,,,221', 
    '221,220,220,,221,,221,221,221,221,221,221,221,,,,,221,221,221,221,221', 
    '221,221,,,,,,,,,,221,,,221,221,221,221,221,221,221,221,221,221,,221', 
    '221,,221,221,221,,,,,,,,,,,,,,,,,,,,221,,,221,,,221,,,,,,,,,221,,,,', 
    ',,,221,,,,,221,221,221,221,221,221,,,,221,221,222,222,222,,222,,,,222', 
    '222,221,221,,222,,222,222,222,222,222,222,222,,,,,222,222,222,222,222', 
    '222,222,,,,,,,,,,222,,,222,222,222,222,222,222,222,222,222,222,,222', 
    '222,,222,222,222,,,,,,,,,,,,,,,,,,,,222,,,222,,,222,,,,,,,,,222,,,,', 
    ',,,222,,,,,222,222,222,222,222,222,,,,222,222,223,223,223,,223,,,,223', 
    '223,222,222,,223,,223,223,223,223,223,223,223,,,,,223,223,223,223,223', 
    '223,223,,,,,,,,,,223,,,223,223,223,223,223,223,223,223,223,223,,223', 
    '223,,223,223,223,,,,,,,,,,,,,,,,,,,,223,,,223,,,223,,,,,,,,,223,,,,', 
    ',,,223,,,,,223,223,223,223,223,223,,,,223,223,224,224,224,,224,,,,224', 
    '224,223,223,,224,,224,224,224,224,224,224,224,,,,,224,224,224,224,224', 
    '224,224,,,,,,,,,,224,,,224,224,224,224,224,224,224,224,224,224,,224', 
    '224,,224,224,224,,,,,,,,,,,,,,,,,,,,224,,,224,,,224,,,,,,,,,224,,,,', 
    ',,,224,,,,,224,224,224,224,224,224,,,,224,224,225,225,225,,225,,,,225', 
    '225,224,224,,225,,225,225,225,225,225,225,225,,,,,225,225,225,225,225', 
    '225,225,,,,,,,,,,225,,,225,225,225,225,225,225,225,225,225,225,,225', 
    '225,,225,225,225,,,,,,,,,,,,,,,,,,,,225,,,225,,,225,,,,,,,,,225,,,,', 
    ',,,225,,,,,225,225,225,225,225,225,,,,225,225,226,226,226,,226,,,,226', 
    '226,225,225,,226,,226,226,226,226,226,226,226,,,,,226,226,226,226,226', 
    '226,226,,,,,,,,,,226,,,226,226,226,226,226,226,226,226,226,226,,226', 
    '226,,226,226,226,,,,,,,,,,,,,,,,,,,,226,,,226,,,226,,,,,,,,,226,,,,', 
    ',,,226,,,,,226,226,226,226,226,226,,,,226,226,227,227,227,,227,,,,227', 
    '227,226,226,,227,,227,227,227,227,227,227,227,,,,,227,227,227,227,227', 
    '227,227,,,,,,,,,,227,,,227,227,227,227,227,227,227,227,227,227,,227', 
    '227,,227,227,227,,,,,,,,,,,,,,,,,,,,227,,,227,,,227,,,,,,,,,227,,,,', 
    ',,,227,,,,,227,227,227,227,227,227,,,,227,227,228,228,228,,228,,,,228', 
    '228,227,227,,228,,228,228,228,228,228,228,228,,,,,228,228,228,228,228', 
    '228,228,,,,,,,,,,228,,,228,228,228,228,228,228,228,228,228,228,,228', 
    '228,,228,228,228,,,,,,,,,,,,,,,,,,,,228,,,228,,,228,,,,,,,,,228,,,,', 
    ',,,228,,,,,228,228,228,228,228,228,,,,228,228,229,229,229,,229,,,,229', 
    '229,228,228,,229,,229,229,229,229,229,229,229,,,,,229,229,229,229,229', 
    '229,229,,,,,,,,,,229,,,229,229,229,229,229,229,229,229,229,229,,229', 
    '229,,229,229,229,,,,,,,,,,,,,,,,,,,,229,,,229,,,229,,,,,,,,,229,,,,', 
    ',,,229,,,,,229,229,229,229,229,229,,,,229,229,230,230,230,,230,,,,230', 
    '230,229,229,,230,,230,230,230,230,230,230,230,,,,,230,230,230,230,230', 
    '230,230,,,,,,,,,,230,,,230,230,230,230,230,230,230,230,230,230,,230', 
    '230,,230,230,230,,,,,,,,,,,,,,,,,,,,230,,,230,,,230,,,,,,,,,230,,,,', 
    ',,,230,,,,,230,230,230,230,230,230,,,,230,230,231,231,231,,231,,,,231', 
    '231,230,230,,231,,231,231,231,231,231,231,231,,,,,231,231,231,231,231', 
    '231,231,,,,,,,,,,231,,,231,231,231,231,231,231,231,231,231,231,,231', 
    '231,,231,231,231,,,,,,,,,,,,,,,,,,,,231,,,231,,,231,,,,,,,,,231,,,,', 
    ',,,231,,,,,231,231,231,231,231,231,,,,231,231,232,232,232,,232,,,,232', 
    '232,231,231,,232,,232,232,232,232,232,232,232,,,,,232,232,232,232,232', 
    '232,232,,,,,,,,,,232,,,232,232,232,232,232,232,232,232,232,232,,232', 
    '232,,232,232,232,,,,,,,,,,,,,,,,,,,,232,,,232,,,232,,,,,,,,,232,,,,', 
    ',,,232,,,,,232,232,232,232,232,232,,,,232,232,233,233,233,,233,,,,233', 
    '233,232,232,,233,,233,233,233,233,233,233,233,,,,,233,233,233,233,233', 
    '233,233,,,,,,,,,,233,,,233,233,233,233,233,233,233,233,233,233,,233', 
    '233,,233,233,233,,,,,,,,,,,,,,,,,,,,233,,,233,,,233,,,,,,,,,233,,,,', 
    ',,,233,,,,,233,233,233,233,233,233,,,,233,233,234,234,234,,234,,,,234', 
    '234,233,233,,234,,234,234,234,234,234,234,234,,,,,234,234,234,234,234', 
    '234,234,,,,,,,,,,234,,,234,234,234,234,234,234,234,234,234,234,,234', 
    '234,,234,234,234,,,,,,,,,,,,,,,,,,,,234,,,234,,,234,,,,,,,,,234,,,,', 
    ',,,234,,,,,234,234,234,234,234,234,,,,234,234,601,601,601,601,601,,', 
    ',601,601,234,234,,601,,601,601,601,601,601,601,601,,,,,601,601,601,601', 
    '601,601,601,,,601,,,,,,601,601,601,601,601,601,601,601,601,601,601,601', 
    '601,601,,601,601,,601,601,601,,,,,,,,,,,,,,,,,,,,601,,,601,,,601,,,', 
    ',601,,,,601,,,,,,,,601,,,,,601,601,601,601,601,601,,,,601,601,600,600', 
    '600,,600,,,,600,600,601,601,,600,,600,600,600,600,600,600,600,,,,,600', 
    '600,600,600,600,600,600,,,,,,,,,,600,,,600,600,600,600,600,600,600,600', 
    '600,600,,600,600,,600,600,600,,,,,,,,,,,,,,,,,,,,600,,,600,,,600,,,', 
    ',,,,,600,,,,,,,,600,,,,597,600,600,600,600,600,600,597,597,597,600,600', 
    '597,597,597,,597,,,,,,600,600,,,597,597,,,,,,,,597,597,,597,597,597', 
    '597,597,,,,,,,,,,,,,,,,,,,,,,597,597,597,597,597,597,597,597,597,597', 
    '597,597,597,597,,,597,597,597,,597,597,,,597,,,597,,597,,597,,597,,597', 
    '597,597,597,597,597,597,,597,,597,,,,,,,,,,,,,597,597,597,597,,597,', 
    '597,,597,242,242,242,,242,,,,242,242,,,,242,,242,242,242,242,242,242', 
    '242,,,,,242,242,242,242,242,242,242,,,,,,,,,,242,,,242,242,242,242,242', 
    '242,242,242,242,242,,242,242,,242,242,242,,,,,,,,,,,,,,,,,,,,242,,,242', 
    ',,242,,,,,,,,,242,,,,,,,,242,,,,,242,242,242,242,242,242,,,,242,242', 
    '244,244,244,,244,,,,244,244,242,242,,244,,244,244,244,244,244,244,244', 
    ',,,,244,244,244,244,244,244,244,,,,,,,,,,244,,,244,244,244,244,244,244', 
    '244,244,244,244,,244,244,,244,244,244,,,,,,,,,,,,,,,,,,,,244,,,244,', 
    ',244,,,,,,,,,244,,,,,,,,244,,,,,244,244,244,244,244,244,,,,244,244,596', 
    '596,596,,596,,,,596,596,244,244,,596,,596,596,596,596,596,596,596,,', 
    ',,596,596,596,596,596,596,596,,,,,,,,,,596,,,596,596,596,596,596,596', 
    '596,596,596,596,,596,596,,596,596,596,,,,,,,,,,,,,,,,,,,,596,596,,596', 
    '596,,596,,,,,596,,596,,596,,,,,,,,596,,,,,596,596,596,596,596,596,,', 
    ',596,596,250,250,250,,250,,596,596,250,250,596,596,,250,,250,250,250', 
    '250,250,250,250,,,,,250,250,250,250,250,250,250,,,,,,,,,,250,,,250,250', 
    '250,250,250,250,250,250,250,250,,250,250,,250,250,250,,,,,,,,,,,,,,', 
    ',,,,,250,,,250,,,250,,,,,,,,,250,,,,,,,,250,,,,,250,250,250,250,250', 
    '250,,,,250,250,593,593,593,,593,,,,593,593,250,250,,593,,593,593,593', 
    '593,593,593,593,,,,,593,593,593,593,593,593,593,,,,,,,,,,593,,,593,593', 
    '593,593,593,593,593,593,593,593,,593,593,,593,593,593,,,,,,,,,,,,,,', 
    ',,,,,593,,,593,,,593,,,,,,,,,593,,,,,,,,593,,,,,593,593,593,593,593', 
    '593,,,,593,593,590,590,590,,590,,,,590,590,593,593,,590,,590,590,590', 
    '590,590,590,590,,,,,590,590,590,590,590,590,590,,,,,,,,,,590,,,590,590', 
    '590,590,590,590,590,590,590,590,,590,590,,590,590,590,,,,,,,,,,,,,,', 
    ',,,,,590,,,590,,,590,,,,,,,,,590,,,,,,,,590,,,,,590,590,590,590,590', 
    '590,,,,590,590,585,585,585,,585,,,,585,585,590,590,,585,,585,585,585', 
    '585,585,585,585,,,,,585,585,585,585,585,585,585,,,,,,,,,,585,,,585,585', 
    '585,585,585,585,585,585,585,585,,585,585,,585,585,585,,,,,,,,,,,,,,', 
    ',,,,,585,,,585,,,585,,,,,,,,,585,,,,,,,,585,,,,,585,585,585,585,585', 
    '585,,,,585,585,256,256,256,,256,,,,256,256,585,585,,256,,256,256,256', 
    '256,256,256,256,,,,,256,256,256,256,256,256,256,,,,,,,,,,256,,,256,256', 
    '256,256,256,256,256,256,256,256,,256,256,,256,256,256,,,,,,,,,,,,,,', 
    ',,,,,256,,,256,,,256,,,,,256,,256,,256,,,,,,,,256,,,,,256,256,256,256', 
    '256,256,,,,256,256,257,257,257,,257,,256,,257,257,256,256,,257,,257', 
    '257,257,257,257,257,257,,,,,257,257,257,257,257,257,257,,,,,,,,,,257', 
    ',,257,257,257,257,257,257,257,257,257,257,,257,257,,257,257,257,,,,', 
    ',,,,,,,,,,,,,,,257,,,257,,,257,,,,,257,,257,,257,,,,,,,,257,,,,,257', 
    '257,257,257,257,257,,,,257,257,584,584,584,,584,,257,,584,584,257,257', 
    ',584,,584,584,584,584,584,584,584,,,,,584,584,584,584,584,584,584,,', 
    ',,,,,,,584,,,584,584,584,584,584,584,584,584,584,584,,584,584,,584,584', 
    '584,,,,,,,,,,,,,,,,,,,,584,,,584,,,584,,,,,,,,,584,,,,,,,,584,,,,,584', 
    '584,584,584,584,584,,,,584,584,581,581,581,,581,,,,581,581,584,584,', 
    '581,,581,581,581,581,581,581,581,,,,,581,581,581,581,581,581,581,,,', 
    ',,,,,,581,,,581,581,581,581,581,581,581,581,581,581,,581,581,,581,581', 
    '581,,,,,,,,,,,,,,,,,,,,581,,,581,,,581,,,,,581,,,,581,,,,,,,,581,,,', 
    ',581,581,581,581,581,581,,,,581,581,265,265,265,,265,,,,265,265,581', 
    '581,,265,,265,265,265,265,265,265,265,,,,,265,265,265,265,265,265,265', 
    ',,,,,,,,,265,,,265,265,265,265,265,265,265,265,265,265,,265,265,,265', 
    '265,265,,,,,,,,,,,,,,,,,,,,265,,,265,,265,265,,,,,265,,265,,265,,,,', 
    ',,,265,,,,,265,265,265,265,265,265,,,,265,265,580,580,580,,580,,265', 
    ',580,580,265,265,,580,,580,580,580,580,580,580,580,,,,,580,580,580,580', 
    '580,580,580,,,,,,,,,,580,,,580,580,580,580,580,580,580,580,580,580,', 
    '580,580,,580,580,580,,,,,,,,,,,,,,,,,,,,580,,,580,,,580,,,,,,,,,580', 
    ',,,,,,,580,,,,,580,580,580,580,580,580,,,,580,580,267,267,267,267,267', 
    ',,,267,267,580,580,,267,,267,267,267,267,267,267,267,,,,,267,267,267', 
    '267,267,267,267,,,267,,,,,,267,267,267,267,267,267,267,267,267,267,267', 
    '267,267,267,,267,267,,267,267,267,,,,,,,,,,,,,,,,,,,,267,,,267,,,267', 
    ',,,,267,,,,267,,,,,,,,267,,,,,267,267,267,267,267,267,,,,267,267,548', 
    '548,548,548,548,,,,548,548,267,267,,548,,548,548,548,548,548,548,548', 
    ',,,,548,548,548,548,548,548,548,,,548,,,,,,548,548,548,548,548,548,548', 
    '548,548,548,548,548,548,548,,548,548,,548,548,548,,,,,,,,,,,,,,,,,,', 
    ',548,,,548,,,548,,,,,548,,,,548,,,,,,,,548,,,,,548,548,548,548,548,548', 
    ',,,548,548,544,544,544,,544,,,,544,544,548,548,,544,,544,544,544,544', 
    '544,544,544,,,,,544,544,544,544,544,544,544,,,544,,,,,,,544,,,544,544', 
    '544,544,544,544,544,544,544,544,,544,544,,544,544,544,,,,,,,,,,,,,,', 
    ',,,,,544,,,544,,,544,,,,,,,,,544,,,,,,,,544,,,,,544,544,544,544,544', 
    '544,,,,544,544,542,542,542,542,542,,,,542,542,544,544,,542,,542,542', 
    '542,542,542,542,542,,,,,542,542,542,542,542,542,542,,,542,,,,,,542,542', 
    '542,542,542,542,542,542,542,542,542,542,542,542,,542,542,,542,542,542', 
    ',,,,,,,,,,,,,,,,,,,542,,,542,,,542,,,,,542,,,,542,,,,,,,,542,,,,,542', 
    '542,542,542,542,542,,,,542,542,271,271,271,,271,,,,271,271,542,542,', 
    '271,,271,271,271,271,271,271,271,,,,,271,271,271,271,271,271,271,,,', 
    ',,,,,,271,,,271,271,271,271,271,271,271,271,271,271,,271,271,,,,271', 
    ',,,,,,,,,,,,,,,,,,,271,,,271,,,271,,,,,,,,,,,,,,,,,,,,,,271,271,271', 
    '271,271,271,,,,271,271,272,272,272,272,272,,,,272,272,271,271,,272,', 
    '272,272,272,272,272,272,272,,,,,272,272,272,272,272,272,272,,,272,,', 
    ',,,272,272,272,272,272,272,272,272,272,272,272,272,272,272,,272,272', 
    ',272,272,272,,,,,,,,,,,,,,,,,,,,272,,,272,,,272,,,,,272,,,,272,,,,,', 
    ',,272,,,,,272,272,272,272,272,272,,,,272,272,540,540,540,,540,,,,540', 
    '540,272,272,,540,,540,540,540,540,540,540,540,,,,,540,540,540,540,540', 
    '540,540,,,,,,,,,,540,,,540,540,540,540,540,540,540,540,540,540,,540', 
    '540,,540,540,540,,,,,,,,,,,,,,,,,,,,540,,,540,,,540,,,,,540,,,,540,', 
    ',,,,,,540,,,,,540,540,540,540,540,540,,,,540,540,534,534,534,,534,,540', 
    ',534,534,540,540,,534,,534,534,534,534,534,534,534,,,,,534,534,534,534', 
    '534,534,534,,,,,,,,,,534,,,534,534,534,534,534,534,534,534,534,534,', 
    '534,534,,,,534,,,,,,,,,,,,,,,,,,,,534,,,534,,,534,,,,,,,,,,,,,,,,,,', 
    ',,,534,534,534,534,534,534,,,,534,534,526,526,526,,526,,,,526,526,534', 
    '534,,526,,526,526,526,526,526,526,526,,,,,526,526,526,526,526,526,526', 
    ',,,,,,,,,526,,,526,526,526,526,526,526,526,526,526,526,,526,526,,526', 
    '526,526,,,,,,,,,,,,,,,,,,,,526,,,526,,,526,,,,,526,,,,526,,,,,,,,526', 
    ',,,,526,526,526,526,526,526,,,,526,526,525,525,525,525,525,,,,525,525', 
    '526,526,,525,,525,525,525,525,525,525,525,,,,,525,525,525,525,525,525', 
    '525,,,525,,,,,,525,525,525,525,525,525,525,525,525,525,525,525,525,525', 
    ',525,525,,525,525,525,,,,,,,,,,,,,,,,,,,,525,,,525,,,525,,,,,525,,,', 
    '525,,,,,,,,525,,,,,525,525,525,525,525,525,,,,525,525,520,520,520,520', 
    '520,,,,520,520,525,525,,520,,520,520,520,520,520,520,520,,,,,520,520', 
    '520,520,520,520,520,,,520,,,,,,520,520,520,520,520,520,520,520,520,520', 
    '520,520,520,520,,520,520,,520,520,520,,,,,,,,,,,,,,,,,,,,520,,,520,', 
    ',520,,,,,520,,,,520,,,,,,,,520,,,,,520,520,520,520,520,520,,,,520,520', 
    '516,516,516,516,516,,,,516,516,520,520,,516,,516,516,516,516,516,516', 
    '516,,,,,516,516,516,516,516,516,516,,,516,,,,,,516,516,516,516,516,516', 
    '516,516,516,516,516,516,516,516,,516,516,,516,516,516,,,,,,,,,,,,,,', 
    ',,,,,516,,,516,,,516,,,,,516,,,,516,,,,,,,,516,,,,,516,516,516,516,516', 
    '516,,,,516,516,512,512,512,,512,,,,512,512,516,516,,512,,512,512,512', 
    '512,512,512,512,,,,,512,512,512,512,512,512,512,,,,,,,,,,512,,,512,512', 
    '512,512,512,512,512,512,512,512,,512,512,,512,512,512,,,,,,,,,,,,,,', 
    ',,,,,512,,,512,,,512,,,,,,,,,512,,,,,,,,512,,,,,512,512,512,512,512', 
    '512,,,,512,512,509,509,509,,509,,,,509,509,512,512,,509,,509,509,509', 
    '509,509,509,509,,,,,509,509,509,509,509,509,509,,,,,,,,,,509,,,509,509', 
    '509,509,509,509,509,509,509,509,,509,509,,509,509,509,,,,,,,,,,,,,,', 
    ',,,,,509,,,509,,,509,,,,,,,,,509,,,,,,,,509,,,,,509,509,509,509,509', 
    '509,,,,509,509,506,506,506,,506,,509,,506,506,509,509,,506,,506,506', 
    '506,506,506,506,506,,,,,506,506,506,506,506,506,506,,,,,,,,,,506,,,506', 
    '506,506,506,506,506,506,506,506,506,,506,506,,506,506,506,,,,,,,,,,', 
    ',,,,,,,,,506,,,506,,,506,,,,,506,,,,506,,,,,,,,506,,,,,506,506,506,506', 
    '506,506,,,,506,506,501,501,501,,501,,,,501,501,506,506,,501,,501,501', 
    '501,501,501,501,501,,,,,501,501,501,501,501,501,501,,,,,,,,,,501,,,501', 
    '501,501,501,501,501,501,501,501,501,,501,501,,501,501,501,,,,,,,,,,', 
    ',,,,,,,,,501,,,501,,,501,,,,,501,,,,501,,,,,,,,501,,,,,501,501,501,501', 
    '501,501,,,,501,501,499,499,499,,499,,,,499,499,501,501,,499,,499,499', 
    '499,499,499,499,499,,,,,499,499,499,499,499,499,499,,,499,,,,,,,499', 
    ',,499,499,499,499,499,499,499,499,499,499,,499,499,,499,499,499,,,,', 
    ',,,,,,,,,,,,,,,499,,,499,,,499,,,,,,,,,499,,,,,,,,499,,,,,499,499,499', 
    '499,499,499,,,,499,499,495,495,495,,495,,,,495,495,499,499,,495,,495', 
    '495,495,495,495,495,495,,,,,495,495,495,495,495,495,495,,,,,,,,,,495', 
    ',,495,495,495,495,495,495,495,495,495,495,,495,495,,495,495,495,,,,', 
    ',,,,,,,,,,,,,,,495,,,495,,,495,,,,,,,,,495,,,,,,,,495,,,,,495,495,495', 
    '495,495,495,,,,495,495,494,494,494,,494,,,,494,494,495,495,,494,,494', 
    '494,494,494,494,494,494,,,,,494,494,494,494,494,494,494,,,,,,,,,,494', 
    ',,494,494,494,494,494,494,494,494,494,494,,494,494,,494,494,494,,,,', 
    ',,,,,,,,,,,,,,,494,,,494,,,494,,,,,,,,,494,,,,,,,,494,,,,,494,494,494', 
    '494,494,494,,,,494,494,493,493,493,,493,,,,493,493,494,494,,493,,493', 
    '493,493,493,493,493,493,,,,,493,493,493,493,493,493,493,,,,,,,,,,493', 
    ',,493,493,493,493,493,493,493,493,493,493,,493,493,,493,493,493,,,,', 
    ',,,,,,,,,,,,,,,493,,,493,,,493,,,,,,,,,493,,,,,,,,493,,,,,493,493,493', 
    '493,493,493,,,,493,493,292,292,292,,292,,,,292,292,493,493,,292,,292', 
    '292,292,292,292,292,292,,,,,292,292,292,292,292,292,292,,,,,,,,,,292', 
    ',,292,292,292,292,292,292,292,292,292,292,,292,292,,292,292,292,,,,', 
    ',,,,,,,,,,,,,,,292,,,292,292,,292,,,,,,,,,292,,,,,,,,292,,,,,292,292', 
    '292,292,292,292,,,,292,292,486,486,486,,486,,,,486,486,292,292,,486', 
    ',486,486,486,486,486,486,486,,,,,486,486,486,486,486,486,486,,,,,,,', 
    ',,486,,,486,486,486,486,486,486,486,486,486,486,,486,486,,486,486,486', 
    ',,,,,,,,,,,,,,,,,,,486,,,486,,,486,,,,,486,,,,486,,,,,,,,486,,,,,486', 
    '486,486,486,486,486,,,,486,486,477,477,477,477,477,,486,,477,477,486', 
    '486,,477,,477,477,477,477,477,477,477,,,,,477,477,477,477,477,477,477', 
    ',,477,,,,,,477,477,477,477,477,477,477,477,477,477,477,477,477,477,', 
    '477,477,,477,477,477,,,,,,,,,,,,,,,,,,,,477,,,477,,,477,,,,,477,,,,477', 
    ',,,,,,,477,,,,,477,477,477,477,477,477,,,,477,477,476,476,476,476,476', 
    ',,,476,476,477,477,,476,,476,476,476,476,476,476,476,,,,,476,476,476', 
    '476,476,476,476,,,476,,,,,,476,476,476,476,476,476,476,476,476,476,476', 
    '476,476,476,,476,476,,476,476,476,,,,,,,,,,,,,,,,,,,,476,,,476,,,476', 
    ',,,,476,,,,476,,,,,,,,476,,,,,476,476,476,476,476,476,,,,476,476,472', 
    '472,472,,472,,,,472,472,476,476,,472,,472,472,472,472,472,472,472,,', 
    ',,472,472,472,472,472,472,472,,,472,,,,,,,472,,,472,472,472,472,472', 
    '472,472,472,472,472,,472,472,,472,472,472,,,,,,,,,,,,,,,,,,,,472,,,472', 
    ',472,472,,,,,472,,472,,472,,,,,,,,472,,,,,472,472,472,472,472,472,,', 
    ',472,472,457,457,457,,457,,472,,457,457,472,472,,457,,457,457,457,457', 
    '457,457,457,,,,,457,457,457,457,457,457,457,,,,,,,,,,457,,,457,457,457', 
    '457,457,457,457,457,457,457,,457,457,,457,457,457,,,,,,,,,,,,,,,,,,', 
    ',457,,,457,,,457,,,,,,,,,457,,,,,,,,457,,,,,457,457,457,457,457,457', 
    ',,,457,457,454,454,454,,454,,,,454,454,457,457,,454,,454,454,454,454', 
    '454,454,454,,,,,454,454,454,454,454,454,454,,,,,,,,,,454,,,454,454,454', 
    '454,454,454,454,454,454,454,,454,454,,454,454,454,,,,,,,,,,,,,,,,,,', 
    ',454,,,454,,,454,,,,,454,,454,,454,,,,,,,,454,,,,,454,454,454,454,454', 
    '454,,,,454,454,301,301,301,,301,,454,,301,301,454,454,,301,,301,301', 
    '301,301,301,301,301,,,,,301,301,301,301,301,301,301,,,,,,,,,,301,,,301', 
    '301,301,301,301,301,301,301,301,301,,301,301,,301,301,301,,,,,,,,,,', 
    ',,,,,,,,,301,,,301,,,301,,,,,,,,,301,,,,,,,,301,,,,,301,301,301,301', 
    '301,301,,,,301,301,451,451,451,,451,,,,451,451,301,301,,451,,451,451', 
    '451,451,451,451,451,,,,,451,451,451,451,451,451,451,,,,,,,,,,451,,,451', 
    '451,451,451,451,451,451,451,451,451,,451,451,,451,451,451,,,,,,,,,,', 
    ',,,,,,,,,451,,,451,,,451,,,,,451,,451,,451,,,,,,,,451,,,,,451,451,451', 
    '451,451,451,,,,451,451,422,422,422,,422,,451,,422,422,451,451,,422,', 
    '422,422,422,422,422,422,422,,,,,422,422,422,422,422,422,422,,,,,,,,', 
    ',422,,,422,422,422,422,422,422,422,422,422,422,,422,422,,422,422,422', 
    ',,,,,,,,,,,,,,,,,,,422,,,422,,,422,,,,,,,,,422,,,,,,,,422,,,,,422,422', 
    '422,422,422,422,,,,422,422,421,421,421,,421,,,,421,421,422,422,,421', 
    ',421,421,421,421,421,421,421,,,,,421,421,421,421,421,421,421,,,,,,,', 
    ',,421,,,421,421,421,421,421,421,421,421,421,421,,421,421,,421,421,421', 
    ',,,,,,,,,,,,,,,,,,,421,,,421,,,421,,,,,,,,,421,,,,,,,,421,,,,,421,421', 
    '421,421,421,421,,,,421,421,420,420,420,,420,,,,420,420,421,421,,420', 
    ',420,420,420,420,420,420,420,,,,,420,420,420,420,420,420,420,,,,,,,', 
    ',,420,,,420,420,420,420,420,420,420,420,420,420,,420,420,,420,420,420', 
    ',,,,,,,,,,,,,,,,,,,420,,,420,,,420,,,,,,,,,420,,,,,,,,420,,,,,420,420', 
    '420,420,420,420,,,,420,420,418,418,418,,418,,,,418,418,420,420,,418', 
    ',418,418,418,418,418,418,418,,,,,418,418,418,418,418,418,418,,,,,,,', 
    ',,418,,,418,418,418,418,418,418,418,418,418,418,,418,418,,418,418,418', 
    ',,,,,,,,,,,,,,,,,,,418,,,418,,,418,,,,,418,,,,418,,,,,,,,418,,,,,418', 
    '418,418,418,418,418,,,,418,418,411,411,411,,411,,418,,411,411,418,418', 
    ',411,,411,411,411,411,411,411,411,,,,,411,411,411,411,411,411,411,,', 
    ',,,,,,,411,,,411,411,411,411,411,411,411,411,411,411,,411,411,,411,411', 
    '411,,,,,,,,,,,,,,,,,,,,411,,,411,411,,411,,,,,411,,411,,411,,,,,,,,411', 
    ',,,,411,411,411,411,411,411,,,,411,411,410,410,410,,410,,411,,410,410', 
    '411,411,,410,,410,410,410,410,410,410,410,,,,,410,410,410,410,410,410', 
    '410,,,,,,,,,,410,,,410,410,410,410,410,410,410,410,410,410,,410,410', 
    ',410,410,410,,,,,,,,,,,,,,,,,,,,410,,,410,410,,410,,,,,410,,410,,410', 
    ',,,,,,,410,,,,,410,410,410,410,410,410,,,,410,410,311,311,311,,311,', 
    '410,,311,311,410,410,,311,,311,311,311,311,311,311,311,,,,,311,311,311', 
    '311,311,311,311,,,311,,,,,,,311,,,311,311,311,311,311,311,311,311,311', 
    '311,,311,311,,311,311,311,,,,,,,,,,,,,,,,,,,,311,,,311,,,311,,,,,,,', 
    ',311,,,,,,,,311,,,,,311,311,311,311,311,311,,,,311,311,312,312,312,', 
    '312,,,,312,312,311,311,,312,,312,312,312,312,312,312,312,,,,,312,312', 
    '312,312,312,312,312,,,312,,,,,,,312,,,312,312,312,312,312,312,312,312', 
    '312,312,,312,312,,312,312,312,,,,,,,,,,,,,,,,,,,,312,,,312,408,,312', 
    ',,,,408,408,408,,312,,408,408,,408,,,312,,,,,312,312,312,312,312,312', 
    ',,,312,312,408,408,,408,408,408,408,408,,,312,312,,,,,,,,,,,,,,,,,,408', 
    '408,408,408,408,408,408,408,408,408,408,408,408,408,,,408,408,408,,408', 
    ',,,408,,,,,,,408,,408,,408,408,408,408,408,408,408,,408,,408,,,,,,,', 
    ',,,,,408,408,,408,406,408,,408,,408,,406,406,406,,,,406,406,,406,,,', 
    ',,,,,406,,,,,,,,,,406,406,,406,406,406,406,406,,,,,,,,,,,,,,,,,,,,,', 
    '406,406,406,406,406,406,406,406,406,406,406,406,406,406,,,406,406,406', 
    ',406,,,,406,,,,,,,406,,406,,406,406,406,406,406,406,406,,406,406,406', 
    ',,,,,,,,,,,,406,406,,406,,406,,406,,406,403,403,403,,403,,,,403,403', 
    ',,,403,,403,403,403,403,403,403,403,,,,,403,403,403,403,403,403,403', 
    ',,,,,,,,,403,,,403,403,403,403,403,403,403,403,403,403,,403,403,,403', 
    '403,403,,,,,,,,,,,,,,,,,,,,403,,,403,403,,403,,,,,403,,403,,403,,,,', 
    ',,,403,,,,,403,403,403,403,403,403,,,,403,403,394,394,394,,394,,403', 
    ',394,394,403,403,,394,,394,394,394,394,394,394,394,,,,,394,394,394,394', 
    '394,394,394,,,,,,,,,,394,,,394,394,394,394,394,394,394,394,394,394,', 
    '394,394,,394,394,394,,,,,,,,,,,,,,,,,,,,394,,,394,,,394,,,,,,,,,394', 
    ',,,,,,,394,,,,,394,394,394,394,394,394,,,,394,394,355,355,355,,355,', 
    ',,355,355,394,394,,355,,355,355,355,355,355,355,355,,,,,355,355,355', 
    '355,355,355,355,,,355,,,,,,,355,,,355,355,355,355,355,355,355,355,355', 
    '355,,355,355,,355,355,355,,,,,,,,,,,,,,,,,,,,355,,,355,,,355,,,,,,,', 
    ',355,,,,,,,,355,,,,,355,355,355,355,355,355,,,,355,355,343,343,343,343', 
    '343,,,,343,343,355,355,,343,,343,343,343,343,343,343,343,,,,,343,343', 
    '343,343,343,343,343,,,343,,,,,,343,343,343,343,343,343,343,343,343,343', 
    '343,343,343,343,,343,343,,343,343,343,,,,,,,,,,,,,,,,,,,,343,,,343,', 
    ',343,,,,,343,,,,343,,,,,,,,343,,,,,343,343,343,343,343,343,,,,343,343', 
    '765,765,765,765,765,,,,765,765,343,343,,765,,765,765,765,765,765,765', 
    '765,,,,,765,765,765,765,765,765,765,,,765,,,,,,765,765,765,765,765,765', 
    '765,765,765,765,765,765,765,765,,765,765,,765,765,765,,,,,,,,,,,,,,', 
    ',,,,,765,,,765,,,765,,,,,765,,,,765,,,,,,,,765,,,,459,765,765,765,765', 
    '765,765,459,459,459,765,765,459,459,459,,459,,,,,,765,765,,,459,,,,', 
    ',,,,459,459,,459,459,459,459,459,,,,,,,,,,,,462,,,,,,,462,462,462,,', 
    '462,462,462,,462,,,,,459,,,,,462,,459,,,,,459,459,462,462,,462,462,462', 
    '462,462,,,,,,,,,,,,,459,,,,,,,,,,,,,459,,459,,,459,,462,,,,,,,462,,', 
    ',,462,462,,,,,,,,,,,,,,,,,,,,,462,,,,,,,,,,,,,462,,462,,,462,106,106', 
    '106,106,106,106,106,106,,,106,106,106,106,106,,,106,106,106,106,106', 
    '106,106,,,106,106,106,106,106,106,106,106,106,106,106,106,106,106,106', 
    '106,106,106,106,106,106,106,106,,,106,,,,,,,,106,106,,106,106,106,106', 
    '106,106,106,,,106,,,,,106,106,106,106,,,,,,,,,,,,,106,106,,106,106,106', 
    '106,106,106,106,106,106,106,106,,,106,106,7,7,7,7,7,7,7,7,,106,7,7,7', 
    '7,7,,,7,7,7,7,7,7,7,,,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7', 
    ',,7,,,,,,,,7,7,,7,7,7,7,7,7,7,,,7,,,,,7,7,7,7,,,,,,,,,,,,,7,7,,7,7,7', 
    '7,7,7,7,7,7,7,7,,,7,7,6,6,6,6,6,6,6,6,,7,6,6,6,6,6,,,6,6,6,6,6,6,6,', 
    ',6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,,6,,,,,,,,6,6,,6,6', 
    '6,6,6,6,6,,,6,,,,,6,6,6,6,,,,,,,,,,,,,6,6,,6,6,6,6,6,6,6,6,6,6,6,,,6', 
    '6,386,386,386,386,386,386,386,386,,6,386,386,386,386,386,,,386,386,386', 
    '386,386,386,386,,,386,386,386,386,386,386,386,386,386,386,386,386,386', 
    '386,386,386,386,386,386,386,386,386,386,,,386,,,,,,,,386,386,,386,386', 
    '386,386,386,386,386,,,386,,,,,386,386,386,386,,,,,,,,,,,,,386,386,,386', 
    '386,386,386,386,386,386,386,386,386,386,,,386,386,557,557,557,557,557', 
    '557,557,557,,386,557,557,557,557,557,,,557,557,557,557,557,557,557,', 
    ',557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557,557', 
    '557,557,557,557,557,557,,,557,,,,,,,,557,557,,557,557,557,557,557,557', 
    '557,,,557,,,,,557,557,557,557,,,,,,,,,,,,,557,557,,557,557,557,557,557', 
    '557,557,557,557,557,557,,,557,64,64,64,64,64,64,64,64,,,64,64,64,64', 
    '64,,,64,64,64,64,64,64,64,,,64,64,64,64,64,64,64,64,64,64,64,64,64,64', 
    '64,64,64,64,64,64,64,64,64,64,64,64,64,,,,,,,64,64,,64,64,64,64,64,64', 
    '64,,,64,,,,,64,64,64,64,,,,,,64,,,,,,,64,64,,64,64,64,64,64,64,64,64', 
    '64,64,64,,,64,184,184,184,184,184,184,184,184,,,184,184,184,184,184', 
    ',,184,184,184,184,184,184,184,,,184,184,184,184,184,184,184,184,184', 
    '184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184,184', 
    '184,,,,,,,184,184,,184,184,184,184,184,184,184,,,184,,,,,184,184,184', 
    '184,,,,,,,,,,,,,184,184,,184,184,184,184,184,184,184,184,184,184,184', 
    ',,184,78,78,78,78,78,78,78,78,,,78,78,78,78,78,,,78,78,78,78,78,78,78', 
    ',,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78', 
    '78,78,78,78,78,,,,,,,78,78,,78,78,78,78,78,78,78,,,78,,,,,78,78,78,78', 
    ',,,,,,,599,,,,,78,78,,78,78,78,78,78,78,78,78,78,78,78,,,78,599,599', 
    '599,599,599,599,599,599,599,599,599,,599,599,,,599,599,,,,,,,,,,,,,', 
    '599,,599,,599,599,599,599,599,599,599,,599,,541,541,,,541,,,,,,,,541', 
    '541,599,541,541,541,541,541,541,541,,,541,,,,,541,541,541,541,,,,,,', 
    ',,,,,,541,541,,541,541,541,541,541,541,541,541,541,541,541,621,621,541', 
    ',621,,,,,,,,621,621,,621,621,621,621,621,621,621,,,621,,,,,621,621,621', 
    '621,,,,,,,,,,,,,621,621,,621,621,621,621,621,621,621,621,621,621,621', 
    '620,620,621,,620,,,,,,,,620,620,,620,620,620,620,620,620,620,,,620,', 
    ',,,620,620,620,620,,,,,,,,,,,,,620,620,,620,620,620,620,620,620,620', 
    '620,620,620,620,,,620,623,623,623,623,623,623,623,623,623,623,623,,623', 
    '623,,,623,623,,,,623,,,,,,,,,,623,,623,,623,623,623,623,623,623,623', 
    ',623,,,,,,,487,487,,,487,,,,,623,,623,487,487,,487,487,487,487,487,487', 
    '487,,,487,,,,,487,487,487,487,,,,,,,,,,,,,487,487,,487,487,487,487,487', 
    '487,487,487,487,487,487,496,496,487,,496,,,,,,,,496,496,,496,496,496', 
    '496,496,496,496,,,496,,,,,496,496,496,496,,,,,,,,,,,,,496,496,,496,496', 
    '496,496,496,496,496,496,496,496,496,,,496,835,835,835,835,835,835,835', 
    '835,835,835,835,,835,835,,,835,835,,,,,,,,,,,,,,835,,835,,835,835,835', 
    '835,835,835,835,,835,,,,,,,845,845,,,845,,,,,835,,835,845,845,,845,845', 
    '845,845,845,845,845,,,845,,,,,845,845,845,845,,,,,,,,,,,,,845,845,,845', 
    '845,845,845,845,845,845,845,845,845,845,776,776,845,,776,,,,,,,,776', 
    '776,,776,776,776,776,776,776,776,,,776,,,,,776,776,776,776,,,,,,,,,', 
    ',,,776,776,,776,776,776,776,776,776,776,776,776,776,776,416,416,776', 
    ',416,,,,,,,,416,416,,416,416,416,416,416,416,416,,,416,,,,,416,416,416', 
    '416,,,,,,,,,,,,,416,416,,416,416,416,416,416,416,416,416,416,416,416', 
    '417,417,416,,417,,,,,,,,417,417,,417,417,417,417,417,417,417,,,417,', 
    ',,,417,417,417,417,,,,,,,,,,,,,417,417,,417,417,417,417,417,417,417', 
    '417,417,417,417,497,497,417,,497,,,,,,,,497,497,,497,497,497,497,497', 
    '497,497,,,497,,,,,497,497,497,497,,,,,,,,,,,,,497,497,,497,497,497,497', 
    '497,497,497,497,497,497,497,254,254,497,,254,,,,,,,,254,254,,254,254', 
    '254,254,254,254,254,,,254,,,,,254,254,254,254,,,,,,,,,,,,,254,254,,254', 
    '254,254,254,254,254,254,254,254,254,254,846,846,254,,846,,,,,,,,846', 
    '846,,846,846,846,846,846,846,846,,,846,,,,,846,846,846,846,,,,,,,,,', 
    ',,,846,846,,846,846,846,846,846,846,846,846,846,846,846,539,539,846', 
    ',539,,,,,,,,539,539,,539,539,539,539,539,539,539,,,539,,,,,539,539,539', 
    '539,,,,,,,,,,,,,539,539,,539,539,539,539,539,539,539,539,539,539,539', 
    '193,193,539,,193,,,,,,,,193,193,,193,193,193,193,193,193,193,,,193,', 
    ',,,193,193,193,193,,,,,,,,,,,,,193,193,,193,193,193,193,193,193,193', 
    '193,193,193,193,194,194,193,,194,,,,,,,,194,194,,194,194,194,194,194', 
    '194,194,,,194,,,,,194,194,194,194,,,,,,,,,,,,,194,194,,194,194,194,194', 
    '194,194,194,194,194,194,194,253,253,194,,253,,,,,,,,253,253,,253,253', 
    '253,253,253,253,253,,,253,,,,,253,253,253,253,,,,,,,,,,,,,253,253,,253', 
    '253,253,253,253,253,253,253,253,253,253,488,488,253,,488,,,,,,,,488', 
    '488,,488,488,488,488,488,488,488,,,488,,,,,488,488,488,488,,,,,,,,,', 
    ',,,488,488,,488,488,488,488,488,488,488,488,488,488,488,,,488,448,448', 
    '448,448,448,448,448,448,448,448,448,,448,448,,,448,448,,,,,,,,,,,,,', 
    '448,,448,,448,448,448,448,448,448,448,,448,,795,795,795,795,795,795', 
    '795,795,795,795,795,,795,795,448,448,795,795,,,,,,,,,,,,,,795,,795,', 
    '795,795,795,795,795,795,795,,795,399,399,399,399,399,399,399,399,399', 
    '399,399,,399,399,,795,399,399,,,,,,,,,,,,,,399,,399,,399,399,399,399', 
    '399,399,399,,399,238,238,238,238,238,238,238,238,238,238,238,,238,238', 
    ',399,238,238,,,,,,,,,,,,,,238,,238,,238,238,238,238,238,238,238,,238', 
    '413,413,413,413,413,413,413,413,413,413,413,,413,413,,238,413,413,,', 
    ',,,,,,,,,,,413,,413,,413,413,413,413,413,413,413,,413,644,644,644,644', 
    '644,644,644,644,644,644,644,,644,644,,413,644,644,,,,,,,,,,,,,,644,', 
    '644,,644,644,644,644,644,644,644,,644,498,498,498,498,498,498,498,498', 
    '498,498,498,,498,498,,644,498,498,,,,,,,,,,,,,,498,,498,,498,498,498', 
    '498,498,498,498,,498,759,759,759,759,759,759,759,759,759,759,759,,759', 
    '759,,498,759,759,,,,,,,,,,,,,,759,,759,,759,759,759,759,759,759,759', 
    ',759,510,510,510,510,510,510,510,510,510,510,510,,510,510,759,759,510', 
    '510,,,,,,,,,,,,,,510,,510,,510,510,510,510,510,510,510,,510,19,19,19', 
    '19,19,19,19,19,19,19,19,,19,19,510,510,19,19,,,,,,,,,,,,,,19,,19,,19', 
    '19,19,19,19,19,19,,19,724,724,724,724,724,724,724,724,724,724,724,,724', 
    '724,,19,724,724,,,,,,,,,,,,,,724,,724,,724,724,724,724,724,724,724,', 
    '724,722,722,722,722,722,722,722,722,722,722,722,,722,722,,724,722,722', 
    ',,,,,,,,,,,,,722,,722,,722,722,722,722,722,722,722,,722,712,712,712', 
    '712,712,712,712,712,712,712,712,,712,712,,722,712,712,,,,,,,,,,,,,,712', 
    ',712,,712,712,712,712,712,712,712,,712,717,717,717,717,717,717,717,717', 
    '717,717,717,,717,717,,712,717,717,,,,,,,,,,,,,,717,,717,,717,717,717', 
    '717,717,717,717,,717,729,729,729,729,729,729,729,729,729,729,729,,729', 
    '729,,717,729,729,,,,,,,,,,,,,,729,,729,,729,729,729,729,729,729,729', 
    ',729,719,719,719,719,719,719,719,719,719,719,719,,719,719,,729,719,719', 
    ',,,,,,,,,,,,,719,,719,,719,719,719,719,719,719,719,,719,,,,,,,,,,,,', 
    ',,,719'];
    racc_action_check = arr = (__a = $cg(self, 'Array')).$m['new'](__a, 23559, nil);
    idx = 0;
    ($B.f = clist.$m.each, ($B.p =function(self, str) { var __a, __b;if (str === undefined) { str = nil; }
      return ($B.f = (__a = str.$m.split(str, ',', -1)).$m.each, ($B.p =function(self, i) { var __a, __b;if (i === undefined) { i = nil; }
        if(!(i.$m['empty?'](i)).$r) {arr.$m['[]='](arr, idx, i.$m.to_i(i))};
        return idx = idx.$m['+'](idx, 1);
      }).$proc =[self], $B.f)(__a);
    }).$proc =[self], $B.f)(clist);

    racc_action_pointer = [
    -2, 945, nil, 276, nil, 598, 21023, 20913, 809, 805, 
    781, 779, 814, 355, 391, 294, nil, 1678, 1798, 23171, 
    810, nil, 2158, 2278, 2398, 220, -13, 2758, 2868, nil, 
    2998, 3118, 3238, nil, 683, 299, 752, 537, 3838, 3958, 
    4078, 676, 253, nil, nil, nil, nil, nil, nil, nil, 
    4428, 4558, 4678, 4798, 4918, -18, 5158, 5278, nil, nil, 
    5398, 768, 5650, 5770, 21352, nil, nil, nil, nil, nil, 
    -26, nil, nil, nil, nil, nil, 599, 591, 21570, nil, 
    nil, nil, 6490, nil, nil, 6610, nil, nil, nil, nil, 
    nil, nil, nil, nil, nil, 705, nil, 6850, nil, nil, 
    nil, 6970, 7090, 7210, 7330, 7450, 20803, 622, nil, nil, 
    nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, 
    nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, 
    nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, 
    nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, 
    nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, 
    nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, 
    nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, 
    nil, nil, nil, nil, 21461, 472, nil, 8050, 8170, 8290, 
    8410, 8530, 8650, 22550, 22609, 9010, 9130, 9250, nil, 145, 
    77, 799, -60, 213, 290, 10090, nil, nil, 10210, 10330, 
    10450, 10570, 10690, 10810, 10930, 11050, 11170, 11290, 11410, 11530, 
    11650, 11770, 11890, 12010, 12130, 12250, 12370, 12490, 12610, 12730, 
    12850, 12970, 13090, 13210, 13330, nil, nil, nil, 22907, nil, 
    276, 352, 13810, nil, 13930, 420, nil, nil, nil, nil, 
    14170, nil, nil, 22668, 22373, 479, 14650, 14770, nil, nil, 
    -17, 232, nil, nil, nil, 15130, 586, 15370, 603, 607, 
    573, 15850, 15970, 236, -5, 653, 202, 628, 604, 91, 
    nil, 640, 516, nil, nil, 392, 722, 728, 265, nil, 
    729, nil, 17770, nil, 789, 800, 1, nil, 688, 101, 
    422, 18610, 756, 329, 772, nil, 343, nil, 510, 73, 
    87, 19570, 19690, 435, 238, 775, 890, nil, 801, 803, 
    804, nil, nil, 802, nil, nil, nil, nil, nil, nil, 
    nil, 894, nil, nil, 886, 4318, 877, nil, 384, nil, 
    5, 3478, nil, 20393, 230, -9, 233, 370, 238, 375, 
    343, 82, 3131, 460, nil, 20273, nil, 118, nil, 128, 
    nil, 161, 804, 156, nil, 801, -43, nil, 145, nil, 
    nil, nil, nil, nil, nil, 718, nil, nil, nil, nil, 
    nil, nil, nil, nil, nil, nil, 21133, 809, 807, nil, 
    nil, 5398, nil, 790, 20153, nil, 782, nil, nil, 22863, 
    814, 181, 197, 20033, nil, nil, 19903, 796, 19777, nil, 
    19450, 19330, nil, 22951, nil, nil, 22196, 22255, 19210, 99, 
    19090, 18970, 18850, 1198, 2638, 340, 488, 815, 814, 813, 
    790, 2758, 2819, 2998, 1318, 1438, 1558, 1678, 1798, 2158, 
    2278, 2398, 2518, 1078, 689, 570, 2038, 1918, 22774, 251, 
    nil, 18730, nil, nil, 18490, 718, nil, 18370, nil, 20623, 
    nil, nil, 20677, 327, nil, 748, 705, 23, 688, 784, 
    nil, nil, 18250, nil, 528, nil, 18130, 18010, 718, nil, 
    714, 674, nil, nil, nil, 709, 17890, 21907, 22727, 266, 
    708, nil, nil, 17650, 17530, 17410, 21966, 22314, 23039, 17290, 
    761, 17170, nil, 644, nil, nil, 17050, nil, nil, 16930, 
    23127, nil, 16810, nil, nil, nil, 16690, 704, nil, nil, 
    16570, 32, -21, 692, 698, 16450, 16330, nil, 888, nil, 
    779, nil, nil, 509, 16210, nil, nil, -42, nil, 22491, 
    16090, 21677, 15730, nil, 15610, 451, -25, 684, 15490, 648, 
    416, 565, 564, 560, nil, 554, nil, 21243, nil, nil, 
    3, nil, nil, nil, 612, nil, nil, nil, nil, nil, 
    nil, -35, nil, nil, nil, 550, nil, nil, nil, nil, 
    15250, 15010, nil, 429, 14890, 14530, 470, nil, nil, nil, 
    14410, 421, nil, 14290, 196, 114, 14050, 13680, 351, 21617, 
    13570, 13450, 9970, 247, nil, 270, 9850, nil, 232, nil, 
    47, nil, nil, nil, nil, nil, 9730, nil, -8, -21, 
    21795, 21736, 9610, 21842, -62, 9, 9490, nil, nil, 98, 
    nil, 120, 174, 294, nil, -54, nil, 240, 67, 297, 
    270, 431, 232, 295, 22995, 359, 369, 29, 459, nil, 
    9370, 367, 409, nil, nil, nil, 8890, nil, nil, 572, 
    nil, 510, nil, nil, nil, nil, nil, 544, nil, 546, 
    434, 81, 8770, 7930, 489, 530, nil, nil, 533, nil, 
    533, 373, 622, 371, nil, 592, 589, 673, 485, nil, 
    7810, nil, 677, 566, nil, 1008, nil, 454, nil, nil, 
    7690, 3251, 606, nil, nil, nil, nil, nil, 7570, nil, 
    nil, nil, 23303, 578, 6730, 6370, nil, 23347, nil, 23435, 
    nil, nil, 23259, nil, 23215, 6250, 6130, 6010, 214, 23391, 
    725, 629, nil, 5890, 653, 673, nil, nil, 696, 698, 
    -7, 760, 5530, nil, 5038, 669, nil, nil, nil, nil, 
    263, nil, nil, 4318, nil, nil, 95, 4198, nil, 23083, 
    791, nil, 3718, 794, 3598, 20513, nil, nil, 3358, 2638, 
    nil, 36, 366, nil, nil, nil, 22137, nil, nil, nil, 
    nil, 805, nil, 727, 693, 698, 700, 697, nil, nil, 
    2518, nil, 726, nil, nil, 22819, 2038, nil, nil, 1918, 
    nil, nil, 757, 721, nil, 1558, -100, 1438, nil, nil, 
    1318, 318, 264, 827, 234, nil, nil, nil, 67, nil, 
    875, 886, 1198, 128, nil, 778, 817, nil, nil, 474, 
    nil, nil, nil, 897, nil, 22013, nil, nil, 1078, 784, 
    nil, 958, 786, 905, 838, 22078, 22432, 352, 718, nil, 
    nil, nil, nil, nil, nil, 598, nil, 794, nil, nil, 
    478, 797, nil, 358, nil, nil, 834, 88, 60, 66, 
    356, 552, 924, nil, 809, nil, 238, 813, 354, nil, 
    nil, nil, 118, nil, 821, nil];

    racc_action_default = [
    -485, -487, -1, -474, -4, -5, -487, -487, -487, -487, 
    -487, -487, -487, -487, -265, -30, -31, -487, -487, -36, 
    -38, -39, -275, -302, -303, -43, -245, -344, -245, -55, 
    -485, -59, -64, -65, -487, -416, -487, -487, -487, -487, 
    -487, -476, -210, -258, -259, -260, -261, -262, -263, -264, 
    -464, -485, -487, -485, -485, -281, -487, -487, -285, -288, 
    -474, -487, -487, -487, -487, -304, -305, -362, -363, -364, 
    -365, -366, -485, -369, -485, -485, -485, -485, -485, -395, 
    -401, -402, -405, -406, -407, -408, -409, -410, -411, -412, 
    -413, -414, -415, -418, -419, -487, -3, -475, -481, -482, 
    -483, -487, -487, -487, -487, -487, -487, -487, -89, -90, 
    -91, -92, -93, -94, -95, -98, -99, -100, -101, -102, 
    -103, -104, -105, -106, -107, -108, -109, -110, -111, -112, 
    -113, -114, -115, -116, -117, -118, -119, -120, -121, -122, 
    -123, -124, -125, -126, -127, -128, -129, -130, -131, -132, 
    -133, -134, -135, -136, -137, -138, -139, -140, -141, -142, 
    -143, -144, -145, -146, -147, -148, -149, -150, -151, -152, 
    -153, -154, -155, -156, -157, -158, -159, -160, -161, -162, 
    -163, -164, -165, -166, -487, -11, -96, -485, -485, -487, 
    -487, -487, -485, -487, -487, -487, -487, -487, -34, -487, 
    -416, -487, -265, -487, -487, -485, -35, -202, -487, -487, 
    -487, -487, -487, -487, -487, -487, -487, -487, -487, -487, 
    -487, -487, -487, -487, -487, -487, -487, -487, -487, -487, 
    -487, -487, -487, -487, -487, -334, -336, -40, -211, -224, 
    -486, -486, -487, -232, -487, -253, -275, -302, -303, -458, 
    -487, -41, -42, -487, -487, -47, -485, -487, -280, -339, 
    -485, -485, -53, -343, -54, -487, -55, -485, -487, -487, 
    -60, -62, -485, -69, -487, -487, -76, -278, -476, -487, 
    -306, -344, -487, -63, -67, -271, -403, -404, -487, -187, 
    -188, -203, -487, -477, -354, -487, -476, -212, -476, -478, 
    -478, -487, -487, -478, -487, -455, -478, -282, -37, -487, 
    -487, -487, -487, -474, -487, -475, -487, -318, -452, -452, 
    -452, -326, -327, -438, -434, -435, -436, -437, -439, -444, 
    -445, -447, -448, -449, -487, -85, -487, -87, -487, -265, 
    -487, -487, -416, -485, -89, -90, -126, -127, -143, -148, 
    -155, -158, -433, -487, -453, -487, -367, -487, -382, -487, 
    -384, -487, -487, -487, -374, -487, -487, -380, -487, -394, 
    -396, -397, -398, -399, 886, -6, -484, -12, -13, -14, 
    -15, -16, -7, -8, -9, -10, -487, -487, -487, -19, 
    -27, -167, -253, -487, -487, -20, -28, -29, -21, -169, 
    -487, -465, -466, -485, -467, -468, -465, -245, -466, -342, 
    -470, -471, -26, -176, -32, -33, -487, -487, -485, -271, 
    -487, -487, -487, -177, -178, -179, -180, -181, -182, -183, 
    -184, -189, -190, -191, -192, -193, -194, -195, -196, -197, 
    -198, -199, -200, -201, -204, -205, -206, -207, -487, -485, 
    -225, -487, -252, -227, -487, -486, -250, -487, -461, -245, 
    -465, -466, -245, -485, -48, -487, -476, -476, -486, -224, 
    -246, -247, -487, -330, -487, -332, -485, -485, -487, -277, 
    -487, -56, -269, -68, -61, -487, -485, -487, -487, -75, 
    -487, -403, -404, -487, -487, -487, -487, -487, -208, -487, 
    -485, -485, -267, -487, -213, -214, -480, -479, -216, -480, 
    -476, -273, -480, -457, -274, -456, -485, -307, -308, -309, 
    -485, -487, -487, -487, -487, -485, -487, -294, -487, -322, 
    -487, -324, -325, -487, -487, -446, -450, -85, -86, -487, 
    -485, -487, -485, -420, -487, -487, -487, -487, -485, -433, 
    -487, -452, -452, -452, -432, -438, -442, -487, -472, -473, 
    -476, -368, -383, -386, -487, -388, -370, -385, -371, -372, 
    -373, -487, -376, -378, -379, -487, -400, -97, -17, -18, 
    -487, -487, -257, -272, -487, -487, -49, -222, -223, -340, 
    -487, -51, -341, -487, -465, -466, -469, -466, -487, -167, 
    -487, -485, -487, -486, -251, -254, -487, -459, -487, -231, 
    -487, -460, -44, -337, -45, -338, -485, -218, -487, -487, 
    -487, -487, -487, -36, -487, -486, -487, -244, -248, -487, 
    -331, -487, -487, -487, -276, -56, -66, -487, -465, -466, 
    -485, -469, -74, -487, -175, -185, -186, -487, -485, -316, 
    -485, -355, -485, -356, -357, -268, -487, -254, -217, -485, 
    -310, -485, -286, -311, -312, -313, -289, -487, -292, -487, 
    -348, -487, -487, -487, -452, -452, -440, -451, -452, -328, 
    -487, -329, -487, -85, -88, -469, -487, -487, -487, -422, 
    -485, -299, -487, -476, -424, -487, -428, -487, -430, -431, 
    -487, -433, -487, -387, -390, -391, -392, -393, -485, -375, 
    -377, -381, -168, -255, -487, -487, -23, -171, -24, -172, 
    -50, -25, -173, -52, -174, -487, -487, -487, -272, -209, 
    -487, -486, -229, -487, -486, -487, -219, -220, -485, -485, 
    -476, -487, -487, -237, -487, -486, -249, -333, -345, -346, 
    -70, -279, -2, -485, -361, -317, -487, -487, -359, -476, 
    -487, -314, -487, -487, -485, -485, -291, -293, -487, -485, 
    -350, -487, -487, -320, -321, -323, -487, -271, -272, -297, 
    -421, -487, -300, -487, -452, -452, -452, -487, -443, -441, 
    -485, -454, -487, -256, -22, -170, -487, -335, -226, -487, 
    -228, -46, -487, -486, -234, -487, -486, -487, -243, -360, 
    -485, -77, -487, -487, -84, -358, -215, -283, -487, -284, 
    -487, -487, -487, -485, -295, -452, -270, -298, -423, -487, 
    -426, -427, -429, -487, -389, -486, -221, -233, -487, -486, 
    -239, -487, -486, -354, -485, -487, -487, -83, -485, -287, 
    -290, -349, -347, -351, -352, -485, -319, -452, -301, -230, 
    -487, -486, -235, -487, -238, -353, -487, -465, -466, -469, 
    -82, -485, -487, -425, -486, -240, -487, -486, -78, -315, 
    -296, -236, -487, -241, -486, -242];

    clist = [
    '207,295,100,320,238,238,238,548,302,243,243,243,300,306,316,500,321', 
    '318,292,524,289,290,291,467,464,648,283,607,106,186,280,280,516,520', 
    '266,238,238,403,407,114,114,760,390,397,788,111,111,96,613,10,198,615', 
    '240,240,240,239,239,239,679,100,352,280,280,309,310,562,268,313,676', 
    '259,263,572,340,343,370,538,255,262,264,10,662,666,607,674,303,296,298', 
    '375,353,308,308,206,557,308,311,381,764,459,462,312,10,359,361,111,314', 
    '368,765,673,377,378,379,380,505,508,855,185,513,111,542,515,97,270,476', 
    '477,237,251,252,752,382,307,449,671,852,652,308,308,308,308,756,114', 
    '356,357,304,363,571,111,10,400,2,354,366,300,703,708,10,693,784,470', 
    '629,1,,,,,,,,,,,,391,238,399,238,,788,413,269,,370,,,,,,763,,,,207,423', 
    '424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440', 
    '441,442,443,444,445,446,447,448,,35,393,393,,,111,238,298,238,,667,414', 
    '415,,238,411,,676,10,10,238,238,,,,243,243,,,238,35,273,273,,243,879', 
    '10,490,,,,,403,407,389,395,398,484,,,412,35,280,266,,503,498,504,266', 
    ',684,710,342,342,342,510,,,468,240,,469,239,,,547,,240,,,239,,679,,', 
    '480,,,607,554,485,,,601,100,,,35,10,607,521,522,,10,259,35,263,616,', 
    '613,615,,824,640,,,,387,388,,,543,640,,,,308,308,,,853,,,,,269,653,720', 
    '790,523,466,471,723,,,,,,,478,,,,,,598,546,,238,300,,,,,,,,640,,,560', 
    '740,,,10,,769,,,,,,238,,413,599,399,35,35,,577,,603,,,,607,269,320,', 
    ',114,269,,,35,,111,,631,,321,318,625,,238,,,238,,,238,,637,,618,619', 
    '300,,,453,607,592,298,,586,623,,411,591,,627,,,,,738,739,,,238,,675', 
    ',678,,,644,645,646,,810,,,,238,,35,,658,238,273,35,238,687,,238,686', 
    ',,692,300,,,,,554,296,,,238,612,,,614,,,,,,,298,663,663,238,,,10,10', 
    '411,854,,,393,647,280,,,411,702,,,,848,,,689,690,,,,694,,688,,701,,', 
    '670,,,,,35,712,238,865,10,717,719,,10,,,722,298,10,724,,308,411,,,603', 
    '729,,238,,,,238,,,10,,,,,111,10,,,,,,,238,,,,238,,,,,,,,,,,,,,,,632', 
    '633,,,,,,,,,,,,785,759,786,781,,,,,529,531,532,,,10,,,,238,741,554,716', 
    '718,,,,609,721,659,10,,,661,,783,,,669,,,,,,,771,,238,,,,592,780,,640', 
    ',,,,35,35,238,795,,10,,806,,,,,308,717,719,722,,,,,825,238,,802,,,,', 
    ',,238,,238,,,804,,,,,35,,816,,35,10,833,,,35,,,,,,730,238,,342,,,,280', 
    '10,,,35,,,,735,,35,,,818,663,857,803,,,,,,795,,,835,,,,,,238,794,238', 
    ',,,,,308,,861,755,866,,,10,300,238,,815,,,,732,,,10,10,411,,,10,35,238', 
    ',,238,,,238,,,,26,,743,,35,,,,,10,,,238,14,,238,,26,26,,,,26,26,26,', 
    '792,,238,10,26,,,,238,,,,35,,,,,14,276,276,,298,696,698,699,26,26,26', 
    ',411,26,26,,,26,,,,14,,,10,,,,809,,,10,339,339,,35,,,,820,821,,,,823', 
    ',,,,,,,,35,26,,,,26,26,26,26,26,,,798,,14,800,,,,,,,14,,,,808,,,,,,843', 
    ',,,,,,,,,,,,35,,,,811,,,,,,,35,35,,,,35,,,,,,,,,871,,,,,773,774,872', 
    ',775,,,35,,837,,,840,,,,26,26,26,26,26,26,,,26,26,26,35,,14,14,,,,26', 
    ',,,,,,859,,,,862,,14,864,,,,,,,,,,,,,,,,,35,,875,,,,,35,,,,,,,,881,', 
    ',883,,26,26,,,,885,,,12,26,,26,,,,,26,,,,,,,,14,830,831,832,276,14,', 
    ',,,,,,,12,,,,,,,,,,,,,,,,,26,26,,,12,,,,,,,856,,,,,,,,,,,,,,,,,,,26', 
    ',26,,,,,,,,,,,873,26,14,,,,,12,,,,,,,,12,,,,,,,,13,,,,,,,,,,,,,,,,,199', 
    '199,,,,199,199,199,,,,,,13,274,274,,,,,,,,,26,,,,,,,,,,13,199,199,,', 
    '199,199,,,199,,338,338,,,,,,,,,,,12,12,,,,,,,,,,,,,,,,,12,,,26,,13,', 
    '26,26,199,199,199,199,13,,,,26,,,14,14,,,,,,,,,26,,,,,,,,,,,,,,,,,26', 
    ',,,26,,,,,26,,,,14,,12,,14,,,12,,14,,26,,26,,26,,,339,26,,,,,,,14,,', 
    ',,,14,,,13,13,199,199,199,199,,,199,199,199,,,707,,,,,13,,26,26,,,,', 
    '26,,,,,,,,,,,26,,,,,,12,,,,,,,14,,26,,,,,,26,,,,392,396,,14,,,,199,199', 
    '297,305,,,,,,199,,13,,,,274,13,26,,,,358,,360,360,364,367,360,,,14,', 
    ',,,,,,,,26,,,,,,455,,456,,,,,,458,199,199,26,,,,,,,,,,,,,14,,,,,26,', 
    ',,,,,26,,,199,,13,14,,,,,,,,,,,199,,,,,,,,12,12,,,,,,,,,,,,26,,,,,,', 
    ',,26,,26,26,14,,,26,814,,,,297,,,14,14,,12,,14,,12,,,,,12,26,,,,,199', 
    ',,,,,,,14,,,12,,,,26,,12,,,,,,,,,,,14,,,,,,,,582,,,,,,,465,,,,473,473', 
    '26,,,,26,199,,,,13,13,26,,,,,,14,,199,,12,,,14,,,,,,,,199,,,,12,,,,', 
    ',,,605,,,608,,13,611,,,13,,,,,13,,,,,,,624,,681,,,12,,,199,,13,,199', 
    ',,,13,,,,,,,,,,,,,651,,,,,657,,,608,,,657,,,,,12,,,,,,,199,199,392,', 
    ',,199,,,,,12,,,,,,13,,,,,,,587,,,,,,,,13,,,,,,199,297,,,,,,,,,,,,,,', 
    ',,12,713,,,,,,,,,13,12,12,,473,,12,,,,,,731,,587,,734,587,473,,,,,199', 
    ',,,12,,,,,605,,,,745,,,,13,297,,,,,,12,,,,,,,,649,654,,13,,,,,,,199', 
    ',,,,,,,,,,,,,,,,770,,,12,,,,,,,12,,,297,,,,,,,,13,,,,812,,,789,,199', 
    ',13,13,,,,13,,,,,793,,,,,,,,,,,,,,,,13,,,608,,,,,,,,,,,608,,,,,,13,', 
    ',,,,,,,,,,,,,,,,657,,,,,,,,,,,,,,,,199,587,,,13,,,,,754,,13,,758,,,', 
    ',,,649,839,649,842,,,,,,,,,,,,,,,851,,,,,,,,,,,,,,,,605,,,608,,,,,,', 
    ',,,,,,,,,,,,874,,,877,,,,,,,,,,,,,608,,,,,,884,587,587,,,,,,,,,,,,,', 
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,', 
    ',,649,,,,,,,,,,,,,,,,,,,,,297,,,,,,,,,,,,,,,,,,,,,,,,,,,649'];
    racc_goto_table = arr = (__a = $cg(self, 'Array')).$m['new'](__a, 2284, nil);
    idx = 0;
    ($B.f = clist.$m.each, ($B.p =function(self, str) { var __a, __b;if (str === undefined) { str = nil; }
      return ($B.f = (__a = str.$m.split(str, ',', -1)).$m.each, ($B.p =function(self, i) { var __a, __b;if (i === undefined) { i = nil; }
        if(!(i.$m['empty?'](i)).$r) {arr.$m['[]='](arr, idx, i.$m.to_i(i))};
        return idx = idx.$m['+'](idx, 1);
      }).$proc =[self], $B.f)(__a);
    }).$proc =[self], $B.f)(clist);

    clist = [
    '25,3,76,89,25,25,25,77,20,55,55,55,51,51,74,4,91,87,47,73,25,25,25,29', 
    '32,5,39,119,12,12,48,48,70,70,35,25,25,30,30,46,46,71,22,22,116,44,44', 
    '8,53,15,24,53,49,49,49,26,26,26,92,76,43,48,48,14,14,108,36,14,115,52', 
    '52,108,42,42,43,41,31,31,31,15,72,72,119,88,49,24,26,10,78,24,24,16', 
    '79,24,80,10,81,30,30,82,15,105,105,44,8,105,83,84,14,14,14,14,50,50', 
    '85,13,50,44,75,50,11,38,33,33,28,28,28,6,12,68,94,96,97,98,24,24,24', 
    '24,99,46,103,104,67,106,107,44,15,20,2,66,109,51,110,111,15,113,114', 
    '57,56,1,,,,,,,,,,,,25,25,25,25,,116,25,2,,43,,,,,,5,,,,25,25,25,25,25', 
    '25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,,40', 
    '49,49,,,44,25,26,25,,73,24,24,,25,44,,115,15,15,25,25,,,,55,55,,,25', 
    '40,40,40,,55,71,15,47,,,,,30,30,16,16,16,39,,,16,40,48,35,,47,25,47', 
    '35,,41,108,40,40,40,25,,,49,49,,26,26,,,3,,49,,,26,,92,,,36,,,119,91', 
    '36,,,33,76,,,40,15,119,14,14,,15,52,40,52,33,,53,53,,72,30,,,,2,2,,', 
    '76,30,,,,24,24,,,5,,,,,2,22,32,77,8,28,28,32,,,,,,,28,,,,,,20,24,,25', 
    '51,,,,,,,,30,,,24,29,,,15,,70,,,,,,25,,25,25,25,40,40,,12,,51,,,,119', 
    '2,89,,,46,2,,,40,,44,,74,,91,87,51,,25,,,25,,,25,,20,,47,47,51,,,54', 
    '119,52,26,,31,25,,44,31,,55,,,,,30,30,,,25,,89,,89,,,25,25,25,,70,,', 
    ',25,,40,,47,25,40,40,25,3,,25,20,,,3,51,,,,,91,24,,,25,31,,,31,,,,,', 
    ',26,76,76,25,,,15,15,44,73,,,49,24,48,,,44,47,,,,70,,,76,76,,,,76,,14', 
    ',43,,,49,,,,,40,25,25,4,15,25,25,,15,,,25,26,15,25,,24,44,,,51,25,,25', 
    ',,,25,,,15,,,,,44,15,,,,,,,25,,,,25,,,,,,,,,,,,,,,,2,2,,,,,,,,,,,,89', 
    '25,89,3,,,,,90,90,90,,,15,,,,25,26,91,16,16,,,,54,16,2,15,,,2,,47,,', 
    '2,,,,,,,14,,25,,,,52,76,,30,,,,,40,40,25,25,,15,,51,,,,,24,25,25,25', 
    ',,,,89,25,,47,,,,,,,25,,25,,,55,,,,,40,,47,,40,15,3,,,40,,,,,,2,25,', 
    '40,,,,48,15,,,40,,,,2,,40,,,14,76,89,49,,,,,,25,,,25,,,,,,25,16,25,', 
    ',,,,24,,51,2,20,,,15,51,25,,15,,,,54,,,15,15,44,,,15,40,25,,,25,,,25', 
    ',,,34,,54,,40,,,,,15,,,25,21,,25,,34,34,,,,34,34,34,,2,,25,15,34,,,', 
    '25,,,,40,,,,,21,21,21,,26,90,90,90,34,34,34,,44,34,34,,,34,,,,21,,,15', 
    ',,,2,,,15,21,21,,40,,,,2,2,,,,2,,,,,,,,,40,34,,,,34,34,34,34,34,,,54', 
    ',21,54,,,,,,,21,,,,54,,,,,,2,,,,,,,,,,,,,40,,,,40,,,,,,,40,40,,,,40', 
    ',,,,,,,,2,,,,,90,90,2,,90,,,40,,54,,,54,,,,34,34,34,34,34,34,,,34,34', 
    '34,40,,21,21,,,,34,,,,,,,54,,,,54,,21,54,,,,,,,,,,,,,,,,,40,,54,,,,', 
    '40,,,,,,,,54,,,54,,34,34,,,,54,,,18,34,,34,,,,,34,,,,,,,,21,90,90,90', 
    '21,21,,,,,,,,,18,,,,,,,,,,,,,,,,,34,34,,,18,,,,,,,90,,,,,,,,,,,,,,,', 
    ',,,34,,34,,,,,,,,,,,90,34,21,,,,,18,,,,,,,,18,,,,,,,,19,,,,,,,,,,,,', 
    ',,,,19,19,,,,19,19,19,,,,,,19,19,19,,,,,,,,,34,,,,,,,,,,19,19,19,,,19', 
    '19,,,19,,19,19,,,,,,,,,,,18,18,,,,,,,,,,,,,,,,,18,,,34,,19,,34,34,19', 
    '19,19,19,19,,,,34,,,21,21,,,,,,,,,34,,,,,,,,,,,,,,,,,34,,,,34,,,,,34', 
    ',,,21,,18,,21,,,18,,21,,34,,34,,34,,,21,34,,,,,,,21,,,,,,21,,,19,19', 
    '19,19,19,19,,,19,19,19,,,21,,,,,19,,34,34,,,,,34,,,,,,,,,,,34,,,,,,18', 
    ',,,,,,21,,34,,,,,,34,,,,23,23,,21,,,,19,19,9,9,,,,,,19,,19,,,,19,19', 
    '34,,,,9,,9,9,9,9,9,,,21,,,,,,,,,,34,,,,,,23,,23,,,,,,23,19,19,34,,,', 
    ',,,,,,,,,21,,,,,34,,,,,,,34,,,19,,19,21,,,,,,,,,,,19,,,,,,,,18,18,,', 
    ',,,,,,,,,34,,,,,,,,,34,,34,34,21,,,34,21,,,,9,,,21,21,,18,,21,,18,,', 
    ',,18,34,,,,,19,,,,,,,,21,,,18,,,,34,,18,,,,,,,,,,,21,,,,,,,,23,,,,,', 
    ',9,,,,9,9,34,,,,34,19,,,,19,19,34,,,,,,21,,19,,18,,,21,,,,,,,,19,,,', 
    '18,,,,,,,,23,,,23,,19,23,,,19,,,,,19,,,,,,,23,,19,,,18,,,19,,19,,19', 
    ',,,19,,,,,,,,,,,,,23,,,,,23,,,23,,,23,,,,,18,,,,,,,19,19,23,,,,19,,', 
    ',,18,,,,,,19,,,,,,,9,,,,,,,,19,,,,,,19,9,,,,,,,,,,,,,,,,,18,23,,,,,', 
    ',,,19,18,18,,9,,18,,,,,,23,,9,,23,9,9,,,,,19,,,,18,,,,,23,,,,23,,,,19', 
    '9,,,,,,18,,,,,,,,9,9,,19,,,,,,,19,,,,,,,,,,,,,,,,,23,,,18,,,,,,,18,', 
    ',9,,,,,,,,19,,,,19,,,23,,19,,19,19,,,,19,,,,,23,,,,,,,,,,,,,,,,19,,', 
    '23,,,,,,,,,,,23,,,,,,19,,,,,,,,,,,,,,,,,,23,,,,,,,,,,,,,,,,19,9,,,19', 
    ',,,,9,,19,,9,,,,,,,9,23,9,23,,,,,,,,,,,,,,,23,,,,,,,,,,,,,,,,23,,,23', 
    ',,,,,,,,,,,,,,,,,,23,,,23,,,,,,,,,,,,,23,,,,,,23,9,9,,,,,,,,,,,,,,,', 
    ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,', 
    '9,,,,,,,,,,,,,,,,,,,,,9,,,,,,,,,,,,,,,,,,,,,,,,,,,9'];
    racc_goto_check = arr = (__a = $cg(self, 'Array')).$m['new'](__a, 2284, nil);
    idx = 0;
    ($B.f = clist.$m.each, ($B.p =function(self, str) { var __a, __b;if (str === undefined) { str = nil; }
      return ($B.f = (__a = str.$m.split(str, ',', -1)).$m.each, ($B.p =function(self, i) { var __a, __b;if (i === undefined) { i = nil; }
        if(!(i.$m['empty?'](i)).$r) {arr.$m['[]='](arr, idx, i.$m.to_i(i))};
        return idx = idx.$m['+'](idx, 1);
      }).$proc =[self], $B.f)(__a);
    }).$proc =[self], $B.f)(clist);

    racc_goto_pointer = [
    nil, 159, 148, -50, -279, -475, -521, nil, 44, 1412, 
    -10, 117, 22, 108, 7, 49, 73, nil, 1094, 1207, 
    -45, 843, -147, 1267, 33, -18, 33, nil, 102, -233, 
    -156, 50, -231, -138, 830, 4, 36, nil, 90, -6, 
    218, -261, 10, -4, 39, nil, 33, -23, -1, 30, 
    -187, -41, 43, -411, 207, -13, -314, -100, nil, nil, 
    nil, nil, nil, nil, nil, nil, 85, 88, 74, nil, 
    -277, -618, -441, -295, -47, -222, -1, -345, 24, -261, 
    36, -566, 40, -560, -420, -710, nil, -44, -445, -58, 
    327, -45, -472, nil, -105, nil, -395, -691, -368, -514, 
    nil, nil, nil, 70, 69, 27, 67, -219, -292, 73, 
    -412, -412, nil, -394, -539, -460, -653, nil, nil, -427];

    racc_goto_default = [
    nil, nil, 294, nil, nil, 761, nil, 3, nil, 4, 
    5, 315, nil, nil, nil, 203, 16, 11, 204, 288, 
    nil, 202, nil, 245, 15, 19, 20, 21, nil, 25, 
    643, nil, nil, nil, 279, 29, nil, 31, 34, 33, 
    200, 337, nil, 113, 405, 112, 68, nil, 42, 299, 
    nil, 241, 588, 589, 450, 604, nil, nil, 257, 452, 
    43, 44, 45, 46, 47, 48, 49, nil, 258, 55, 
    nil, nil, nil, nil, nil, nil, 517, nil, nil, nil, 
    nil, nil, nil, nil, nil, nil, 317, 551, 319, 553, 
    nil, 677, 322, 236, nil, 409, nil, nil, nil, nil, 
    67, 69, 70, 71, nil, nil, nil, nil, 567, nil, 
    nil, nil, 369, 550, 552, 328, 556, 331, 334, 249];

    racc_reduce_table = [
    0, 0, $symbol_1, 
    1, 135, $symbol_2, 
    4, 137, $symbol_3, 
    2, 136, $symbol_4, 
    1, 141, $symbol_5, 
    1, 141, $symbol_6, 
    3, 141, $symbol_7, 
    3, 144, $symbol_8, 
    3, 144, $symbol_8, 
    3, 144, $symbol_8, 
    3, 144, $symbol_8, 
    2, 144, $symbol_9, 
    3, 144, $symbol_10, 
    3, 144, $symbol_11, 
    3, 144, $symbol_12, 
    3, 144, $symbol_13, 
    3, 144, $symbol_8, 
    4, 144, $symbol_8, 
    4, 144, $symbol_8, 
    3, 144, $symbol_14, 
    3, 144, $symbol_15, 
    3, 144, $symbol_16, 
    6, 144, $symbol_8, 
    5, 144, $symbol_17, 
    5, 144, $symbol_8, 
    5, 144, $symbol_8, 
    3, 144, $symbol_8, 
    3, 144, $symbol_8, 
    3, 144, $symbol_18, 
    3, 144, $symbol_19, 
    1, 144, $symbol_8, 
    1, 158, $symbol_8, 
    3, 158, $symbol_20, 
    3, 158, $symbol_21, 
    2, 158, $symbol_22, 
    2, 158, $symbol_23, 
    1, 158, $symbol_8, 
    1, 148, $symbol_8, 
    1, 150, $symbol_8, 
    1, 150, $symbol_8, 
    2, 150, $symbol_24, 
    2, 150, $symbol_25, 
    2, 150, $symbol_26, 
    1, 161, $symbol_8, 
    4, 161, $symbol_8, 
    4, 161, $symbol_8, 
    4, 166, $symbol_8, 
    2, 160, $symbol_27, 
    3, 160, $symbol_8, 
    4, 160, $symbol_28, 
    5, 160, $symbol_8, 
    4, 160, $symbol_29, 
    5, 160, $symbol_8, 
    2, 160, $symbol_30, 
    2, 160, $symbol_31, 
    1, 151, $symbol_32, 
    3, 151, $symbol_33, 
    1, 170, $symbol_34, 
    3, 170, $symbol_35, 
    1, 169, $symbol_36, 
    2, 169, $symbol_37, 
    3, 169, $symbol_8, 
    2, 169, $symbol_8, 
    2, 169, $symbol_8, 
    1, 169, $symbol_8, 
    1, 172, $symbol_38, 
    3, 172, $symbol_39, 
    2, 171, $symbol_40, 
    3, 171, $symbol_41, 
    1, 173, $symbol_8, 
    4, 173, $symbol_8, 
    3, 173, $symbol_8, 
    3, 173, $symbol_8, 
    3, 173, $symbol_8, 
    3, 173, $symbol_8, 
    2, 173, $symbol_8, 
    1, 173, $symbol_8, 
    1, 149, $symbol_8, 
    4, 149, $symbol_42, 
    3, 149, $symbol_43, 
    3, 149, $symbol_8, 
    3, 149, $symbol_8, 
    3, 149, $symbol_8, 
    2, 149, $symbol_8, 
    1, 149, $symbol_8, 
    1, 175, $symbol_8, 
    2, 176, $symbol_44, 
    1, 176, $symbol_45, 
    3, 176, $symbol_46, 
    1, 177, $symbol_8, 
    1, 177, $symbol_8, 
    1, 177, $symbol_8, 
    1, 177, $symbol_8, 
    1, 177, $symbol_8, 
    1, 146, $symbol_8, 
    1, 146, $symbol_8, 
    1, 147, $symbol_47, 
    3, 147, $symbol_48, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 178, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    1, 179, $symbol_8, 
    3, 159, $symbol_49, 
    5, 159, $symbol_8, 
    3, 159, $symbol_50, 
    6, 159, $symbol_51, 
    5, 159, $symbol_52, 
    5, 159, $symbol_8, 
    5, 159, $symbol_8, 
    5, 159, $symbol_8, 
    4, 159, $symbol_8, 
    3, 159, $symbol_8, 
    3, 159, $symbol_53, 
    3, 159, $symbol_54, 
    3, 159, $symbol_55, 
    3, 159, $symbol_56, 
    3, 159, $symbol_57, 
    3, 159, $symbol_58, 
    3, 159, $symbol_59, 
    3, 159, $symbol_60, 
    4, 159, $symbol_8, 
    4, 159, $symbol_8, 
    2, 159, $symbol_61, 
    2, 159, $symbol_62, 
    3, 159, $symbol_63, 
    3, 159, $symbol_64, 
    3, 159, $symbol_65, 
    3, 159, $symbol_66, 
    3, 159, $symbol_67, 
    3, 159, $symbol_68, 
    3, 159, $symbol_69, 
    3, 159, $symbol_70, 
    3, 159, $symbol_71, 
    3, 159, $symbol_72, 
    3, 159, $symbol_73, 
    3, 159, $symbol_74, 
    3, 159, $symbol_75, 
    2, 159, $symbol_76, 
    2, 159, $symbol_77, 
    3, 159, $symbol_78, 
    3, 159, $symbol_79, 
    3, 159, $symbol_80, 
    3, 159, $symbol_81, 
    3, 159, $symbol_8, 
    5, 159, $symbol_82, 
    1, 159, $symbol_8, 
    1, 157, $symbol_8, 
    1, 154, $symbol_83, 
    2, 154, $symbol_8, 
    2, 154, $symbol_84, 
    5, 154, $symbol_85, 
    2, 154, $symbol_86, 
    3, 154, $symbol_87, 
    3, 186, $symbol_88, 
    4, 186, $symbol_89, 
    4, 186, $symbol_8, 
    6, 186, $symbol_8, 
    1, 187, $symbol_90, 
    1, 187, $symbol_8, 
    1, 162, $symbol_91, 
    2, 162, $symbol_92, 
    5, 162, $symbol_93, 
    2, 162, $symbol_94, 
    5, 162, $symbol_95, 
    4, 162, $symbol_96, 
    7, 162, $symbol_97, 
    3, 162, $symbol_98, 
    1, 162, $symbol_99, 
    4, 190, $symbol_8, 
    3, 190, $symbol_8, 
    5, 190, $symbol_8, 
    7, 190, $symbol_8, 
    2, 190, $symbol_8, 
    5, 190, $symbol_8, 
    4, 190, $symbol_8, 
    6, 190, $symbol_8, 
    7, 190, $symbol_8, 
    9, 190, $symbol_8, 
    3, 190, $symbol_8, 
    1, 190, $symbol_8, 
    0, 192, $symbol_100, 
    2, 165, $symbol_101, 
    1, 191, $symbol_8, 
    2, 191, $symbol_102, 
    3, 191, $symbol_103, 
    2, 189, $symbol_104, 
    2, 188, $symbol_105, 
    1, 188, $symbol_106, 
    1, 183, $symbol_107, 
    3, 183, $symbol_108, 
    3, 156, $symbol_8, 
    4, 156, $symbol_8, 
    2, 156, $symbol_8, 
    1, 182, $symbol_8, 
    1, 182, $symbol_8, 
    1, 182, $symbol_8, 
    1, 182, $symbol_8, 
    1, 182, $symbol_8, 
    1, 182, $symbol_8, 
    1, 182, $symbol_8, 
    1, 182, $symbol_8, 
    1, 182, $symbol_8, 
    3, 182, $symbol_109, 
    4, 182, $symbol_8, 
    3, 182, $symbol_110, 
    3, 182, $symbol_111, 
    2, 182, $symbol_112, 
    4, 182, $symbol_113, 
    3, 182, $symbol_114, 
    3, 182, $symbol_115, 
    1, 182, $symbol_116, 
    4, 182, $symbol_117, 
    3, 182, $symbol_118, 
    1, 182, $symbol_119, 
    5, 182, $symbol_8, 
    2, 182, $symbol_120, 
    1, 182, $symbol_8, 
    2, 182, $symbol_121, 
    6, 182, $symbol_122, 
    6, 182, $symbol_123, 
    0, 214, $symbol_124, 
    0, 215, $symbol_125, 
    7, 182, $symbol_126, 
    0, 216, $symbol_127, 
    0, 217, $symbol_128, 
    7, 182, $symbol_129, 
    5, 182, $symbol_130, 
    4, 182, $symbol_131, 
    5, 182, $symbol_8, 
    0, 218, $symbol_132, 
    0, 219, $symbol_133, 
    9, 182, $symbol_8, 
    5, 182, $symbol_134, 
    6, 182, $symbol_135, 
    4, 182, $symbol_136, 
    5, 182, $symbol_137, 
    7, 182, $symbol_138, 
    1, 182, $symbol_139, 
    1, 182, $symbol_140, 
    1, 182, $symbol_141, 
    1, 182, $symbol_8, 
    1, 153, $symbol_8, 
    1, 204, $symbol_8, 
    1, 204, $symbol_8, 
    1, 204, $symbol_8, 
    2, 204, $symbol_8, 
    1, 206, $symbol_8, 
    1, 206, $symbol_8, 
    1, 206, $symbol_8, 
    1, 205, $symbol_142, 
    5, 205, $symbol_143, 
    1, 139, $symbol_144, 
    2, 139, $symbol_145, 
    1, 208, $symbol_146, 
    6, 220, $symbol_147, 
    4, 220, $symbol_148, 
    4, 220, $symbol_149, 
    2, 220, $symbol_150, 
    4, 220, $symbol_151, 
    2, 220, $symbol_152, 
    2, 220, $symbol_153, 
    1, 220, $symbol_154, 
    1, 222, $symbol_155, 
    3, 222, $symbol_156, 
    3, 226, $symbol_157, 
    1, 167, $symbol_158, 
    2, 167, $symbol_159, 
    1, 167, $symbol_160, 
    3, 167, $symbol_161, 
    0, 228, $symbol_162, 
    5, 227, $symbol_163, 
    2, 163, $symbol_164, 
    4, 163, $symbol_8, 
    4, 163, $symbol_8, 
    2, 203, $symbol_165, 
    4, 203, $symbol_166, 
    4, 203, $symbol_8, 
    3, 203, $symbol_8, 
    2, 203, $symbol_167, 
    1, 203, $symbol_168, 
    4, 202, $symbol_169, 
    4, 202, $symbol_170, 
    5, 207, $symbol_171, 
    1, 230, $symbol_172, 
    4, 230, $symbol_173, 
    2, 230, $symbol_174, 
    1, 231, $symbol_8, 
    1, 231, $symbol_8, 
    6, 138, $symbol_175, 
    0, 138, $symbol_176, 
    1, 232, $symbol_8, 
    1, 232, $symbol_8, 
    1, 232, $symbol_8, 
    2, 233, $symbol_177, 
    1, 233, $symbol_178, 
    2, 140, $symbol_8, 
    1, 140, $symbol_8, 
    1, 194, $symbol_8, 
    1, 194, $symbol_8, 
    1, 194, $symbol_8, 
    1, 195, $symbol_8, 
    1, 236, $symbol_8, 
    2, 236, $symbol_8, 
    3, 237, $symbol_179, 
    1, 237, $symbol_8, 
    3, 196, $symbol_180, 
    3, 197, $symbol_181, 
    3, 198, $symbol_182, 
    3, 198, $symbol_183, 
    1, 240, $symbol_184, 
    3, 240, $symbol_185, 
    1, 241, $symbol_186, 
    2, 241, $symbol_187, 
    3, 199, $symbol_188, 
    3, 199, $symbol_189, 
    1, 243, $symbol_190, 
    3, 243, $symbol_191, 
    1, 238, $symbol_192, 
    2, 238, $symbol_193, 
    1, 239, $symbol_194, 
    2, 239, $symbol_195, 
    1, 242, $symbol_196, 
    2, 242, $symbol_197, 
    0, 245, $symbol_198, 
    4, 242, $symbol_199, 
    1, 244, $symbol_8, 
    1, 244, $symbol_8, 
    1, 244, $symbol_8, 
    1, 244, $symbol_8, 
    2, 180, $symbol_200, 
    1, 180, $symbol_8, 
    1, 246, $symbol_8, 
    1, 246, $symbol_8, 
    1, 246, $symbol_8, 
    1, 246, $symbol_8, 
    3, 235, $symbol_201, 
    1, 234, $symbol_202, 
    1, 234, $symbol_203, 
    2, 234, $symbol_8, 
    2, 234, $symbol_8, 
    1, 174, $symbol_204, 
    1, 174, $symbol_205, 
    1, 174, $symbol_206, 
    1, 174, $symbol_207, 
    1, 174, $symbol_208, 
    1, 174, $symbol_209, 
    1, 174, $symbol_210, 
    1, 174, $symbol_211, 
    1, 174, $symbol_212, 
    1, 174, $symbol_213, 
    1, 174, $symbol_214, 
    1, 200, $symbol_8, 
    1, 152, $symbol_8, 
    1, 155, $symbol_8, 
    1, 155, $symbol_8, 
    1, 209, $symbol_215, 
    3, 209, $symbol_216, 
    2, 209, $symbol_217, 
    4, 211, $symbol_218, 
    2, 211, $symbol_219, 
    6, 247, $symbol_220, 
    4, 247, $symbol_221, 
    4, 247, $symbol_222, 
    2, 247, $symbol_223, 
    4, 247, $symbol_224, 
    2, 247, $symbol_225, 
    2, 247, $symbol_226, 
    1, 247, $symbol_227, 
    0, 247, $symbol_228, 
    1, 249, $symbol_229, 
    1, 249, $symbol_230, 
    1, 249, $symbol_231, 
    1, 249, $symbol_232, 
    1, 249, $symbol_8, 
    1, 221, $symbol_233, 
    3, 221, $symbol_234, 
    3, 250, $symbol_235, 
    1, 248, $symbol_236, 
    3, 248, $symbol_237, 
    1, 251, $symbol_8, 
    1, 251, $symbol_8, 
    2, 223, $symbol_238, 
    1, 223, $symbol_239, 
    1, 252, $symbol_8, 
    1, 252, $symbol_8, 
    2, 225, $symbol_240, 
    2, 224, $symbol_241, 
    0, 224, $symbol_242, 
    1, 212, $symbol_243, 
    4, 212, $symbol_244, 
    1, 201, $symbol_245, 
    2, 201, $symbol_246, 
    2, 201, $symbol_247, 
    1, 185, $symbol_248, 
    3, 185, $symbol_249, 
    3, 253, $symbol_250, 
    2, 253, $symbol_251, 
    1, 168, $symbol_8, 
    1, 168, $symbol_8, 
    1, 168, $symbol_8, 
    1, 164, $symbol_8, 
    1, 164, $symbol_8, 
    1, 164, $symbol_8, 
    1, 164, $symbol_8, 
    1, 229, $symbol_8, 
    1, 229, $symbol_8, 
    1, 229, $symbol_8, 
    1, 213, $symbol_8, 
    1, 213, $symbol_8, 
    0, 142, $symbol_8, 
    1, 142, $symbol_8, 
    0, 181, $symbol_8, 
    1, 181, $symbol_8, 
    0, 184, $symbol_8, 
    1, 184, $symbol_8, 
    1, 184, $symbol_8, 
    1, 210, $symbol_8, 
    1, 210, $symbol_8, 
    1, 145, $symbol_8, 
    2, 145, $symbol_8, 
    0, 143, $symbol_8, 
    0, 193, $symbol_8];

    racc_reduce_n = 487;

    racc_shift_n = 886;

    racc_token_table = $hash(
    Qfalse, 0, 
    $symbol_252, 1, 
    $symbol_253, 2, 
    $symbol_254, 3, 
    $symbol_255, 4, 
    $symbol_256, 5, 
    $symbol_257, 6, 
    $symbol_258, 7, 
    $symbol_259, 8, 
    $symbol_260, 9, 
    $symbol_261, 10, 
    $symbol_262, 11, 
    $symbol_263, 12, 
    $symbol_264, 13, 
    $symbol_265, 14, 
    $symbol_266, 15, 
    $symbol_267, 16, 
    $symbol_268, 17, 
    $symbol_269, 18, 
    $symbol_270, 19, 
    $symbol_271, 20, 
    $symbol_272, 21, 
    $symbol_273, 22, 
    $symbol_274, 23, 
    $symbol_275, 24, 
    $symbol_276, 25, 
    $symbol_277, 26, 
    $symbol_278, 27, 
    $symbol_279, 28, 
    $symbol_280, 29, 
    $symbol_281, 30, 
    $symbol_282, 31, 
    $symbol_283, 32, 
    $symbol_284, 33, 
    $symbol_285, 34, 
    $symbol_286, 35, 
    $symbol_287, 36, 
    $symbol_288, 37, 
    $symbol_289, 38, 
    $symbol_290, 39, 
    $symbol_291, 40, 
    $symbol_292, 41, 
    $symbol_293, 42, 
    $symbol_294, 43, 
    $symbol_295, 44, 
    $symbol_296, 45, 
    $symbol_297, 46, 
    $symbol_298, 47, 
    $symbol_299, 48, 
    $symbol_300, 49, 
    $symbol_301, 50, 
    $symbol_302, 51, 
    $symbol_303, 52, 
    $symbol_304, 53, 
    $symbol_305, 54, 
    $symbol_306, 55, 
    $symbol_307, 56, 
    $symbol_308, 57, 
    $symbol_309, 58, 
    $symbol_310, 59, 
    $symbol_311, 60, 
    "+@", 61, 
    "-@", 62, 
    "-@NUM", 63, 
    "**", 64, 
    "<=>", 65, 
    "==", 66, 
    "===", 67, 
    "!=", 68, 
    ">=", 69, 
    "<=", 70, 
    "&&", 71, 
    "||", 72, 
    "=~", 73, 
    "!~", 74, 
    ".", 75, 
    "..", 76, 
    "...", 77, 
    "[]", 78, 
    "[]=", 79, 
    "<<", 80, 
    ">>", 81, 
    "::", 82, 
    "::@", 83, 
    $symbol_312, 84, 
    "=>", 85, 
    $symbol_313, 86, 
    "(", 87, 
    ")", 88, 
    $symbol_314, 89, 
    $symbol_315, 90, 
    "]", 91, 
    $symbol_316, 92, 
    $symbol_317, 93, 
    $symbol_318, 94, 
    "*", 95, 
    "&@", 96, 
    "&", 97, 
    "~", 98, 
    "%", 99, 
    "/", 100, 
    "+", 101, 
    "-", 102, 
    "<", 103, 
    ">", 104, 
    "|", 105, 
    "!", 106, 
    "^", 107, 
    "{@", 108, 
    "}", 109, 
    $symbol_319, 110, 
    $symbol_320, 111, 
    $symbol_321, 112, 
    $symbol_322, 113, 
    $symbol_323, 114, 
    $symbol_324, 115, 
    $symbol_325, 116, 
    $symbol_326, 117, 
    $symbol_327, 118, 
    $symbol_328, 119, 
    $symbol_329, 120, 
    $symbol_330, 121, 
    "\\n", 122, 
    "?", 123, 
    ":", 124, 
    ",", 125, 
    $symbol_331, 126, 
    ";", 127, 
    $symbol_332, 128, 
    "=", 129, 
    $symbol_333, 130, 
    "[@", 131, 
    "[", 132, 
    "{", 133);

    racc_nt_base = 134;

    racc_use_result_var = Qtrue;

    $rb.cs(self, 'Racc_arg', [
    racc_action_table, 
    racc_action_check, 
    racc_action_default, 
    racc_action_pointer, 
    racc_goto_table, 
    racc_goto_check, 
    racc_goto_default, 
    racc_goto_pointer, 
    racc_nt_base, 
    racc_reduce_table, 
    racc_token_table, 
    racc_shift_n, 
    racc_reduce_n, 
    racc_use_result_var]);

    $rb.cs(self, 'Racc_token_to_s_table', [
    "$end", 
    "error", 
    "CLASS", 
    "MODULE", 
    "DEF", 
    "UNDEF", 
    "BEGIN", 
    "RESCUE", 
    "ENSURE", 
    "END", 
    "IF", 
    "UNLESS", 
    "THEN", 
    "ELSIF", 
    "ELSE", 
    "CASE", 
    "WHEN", 
    "WHILE", 
    "UNTIL", 
    "FOR", 
    "BREAK", 
    "NEXT", 
    "REDO", 
    "RETRY", 
    "IN", 
    "DO", 
    "DO_COND", 
    "DO_BLOCK", 
    "RETURN", 
    "YIELD", 
    "SUPER", 
    "SELF", 
    "NIL", 
    "TRUE", 
    "FALSE", 
    "AND", 
    "OR", 
    "NOT", 
    "IF_MOD", 
    "UNLESS_MOD", 
    "WHILE_MOD", 
    "UNTIL_MOD", 
    "RESCUE_MOD", 
    "ALIAS", 
    "DEFINED", 
    "klBEGIN", 
    "klEND", 
    "LINE", 
    "FILE", 
    "IDENTIFIER", 
    "FID", 
    "GVAR", 
    "IVAR", 
    "CONSTANT", 
    "CVAR", 
    "NTH_REF", 
    "BACK_REF", 
    "STRING_CONTENT", 
    "INTEGER", 
    "FLOAT", 
    "REGEXP_END", 
    "\"+@\"", 
    "\"-@\"", 
    "\"-@NUM\"", 
    "\"**\"", 
    "\"<=>\"", 
    "\"==\"", 
    "\"===\"", 
    "\"!=\"", 
    "\">=\"", 
    "\"<=\"", 
    "\"&&\"", 
    "\"||\"", 
    "\"=~\"", 
    "\"!~\"", 
    "\".\"", 
    "\"..\"", 
    "\"...\"", 
    "\"[]\"", 
    "\"[]=\"", 
    "\"<<\"", 
    "\">>\"", 
    "\"::\"", 
    "\"::@\"", 
    "OP_ASGN", 
    "\"=>\"", 
    "PAREN_BEG", 
    "\"(\"", 
    "\")\"", 
    "tLPAREN_ARG", 
    "ARRAY_BEG", 
    "\"]\"", 
    "tLBRACE", 
    "tLBRACE_ARG", 
    "SPLAT", 
    "\"*\"", 
    "\"&@\"", 
    "\"&\"", 
    "\"~\"", 
    "\"%\"", 
    "\"/\"", 
    "\"+\"", 
    "\"-\"", 
    "\"<\"", 
    "\">\"", 
    "\"|\"", 
    "\"!\"", 
    "\"^\"", 
    "\"{@\"", 
    "\"}\"", 
    "BACK_REF2", 
    "SYMBOL_BEG", 
    "STRING_BEG", 
    "XSTRING_BEG", 
    "REGEXP_BEG", 
    "WORDS_BEG", 
    "AWORDS_BEG", 
    "STRING_DBEG", 
    "STRING_DVAR", 
    "STRING_END", 
    "STRING", 
    "SYMBOL", 
    "\"\\\\n\"", 
    "\"?\"", 
    "\":\"", 
    "\",\"", 
    "SPACE", 
    "\";\"", 
    "LABEL", 
    "\"=\"", 
    "LOWEST", 
    "\"[@\"", 
    "\"[\"", 
    "\"{\"", 
    "$start", 
    "target", 
    "compstmt", 
    "bodystmt", 
    "opt_rescue", 
    "opt_else", 
    "opt_ensure", 
    "stmts", 
    "opt_terms", 
    "none", 
    "stmt", 
    "terms", 
    "fitem", 
    "undef_list", 
    "expr_value", 
    "lhs", 
    "command_call", 
    "mlhs", 
    "var_lhs", 
    "primary_value", 
    "aref_args", 
    "backref", 
    "mrhs", 
    "arg_value", 
    "expr", 
    "arg", 
    "command", 
    "block_command", 
    "call_args", 
    "block_call", 
    "operation2", 
    "command_args", 
    "cmd_brace_block", 
    "opt_block_var", 
    "operation", 
    "mlhs_basic", 
    "mlhs_entry", 
    "mlhs_head", 
    "mlhs_item", 
    "mlhs_node", 
    "variable", 
    "cname", 
    "cpath", 
    "fname", 
    "op", 
    "reswords", 
    "symbol", 
    "opt_nl", 
    "primary", 
    "args", 
    "trailer", 
    "assocs", 
    "paren_args", 
    "opt_paren_args", 
    "opt_block_arg", 
    "block_arg", 
    "call_args2", 
    "open_args", 
    "@1", 
    "none_block_pass", 
    "literal", 
    "strings", 
    "xstring", 
    "regexp", 
    "words", 
    "awords", 
    "var_ref", 
    "assoc_list", 
    "brace_block", 
    "method_call", 
    "then", 
    "if_tail", 
    "do", 
    "case_body", 
    "block_var", 
    "superclass", 
    "term", 
    "f_arglist", 
    "singleton", 
    "dot_or_colon", 
    "@2", 
    "@3", 
    "@4", 
    "@5", 
    "@6", 
    "@7", 
    "block_var_args", 
    "f_arg", 
    "f_block_optarg", 
    "f_rest_arg", 
    "opt_f_block_arg", 
    "f_block_arg", 
    "f_block_opt", 
    "do_block", 
    "@8", 
    "operation3", 
    "when_args", 
    "cases", 
    "exc_list", 
    "exc_var", 
    "numeric", 
    "dsym", 
    "string", 
    "string1", 
    "string_contents", 
    "xstring_contents", 
    "word_list", 
    "word", 
    "string_content", 
    "qword_list", 
    "string_dvar", 
    "@9", 
    "sym", 
    "f_args", 
    "f_optarg", 
    "f_norm_arg", 
    "f_opt", 
    "restarg_mark", 
    "blkarg_mark", 
    "assoc"]);

    $rb.cs(self, 'Racc_debug_parser', Qfalse);





    $defn(self, '_reduce_1', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 0);

      return result;
    }, 3);

    $defn(self, '_reduce_2', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'BodyStatementsNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 2), val.$m['[]'](val, 3));

      return result;
    }, 3);

    $defn(self, '_reduce_3', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 0);

      return result;
    }, 3);

    $defn(self, '_reduce_4', function(self, val, _values, result) {var __a;
      result = (__a = $cg(self, 'StatementsNode')).$m['new'](__a, []);

      return result;
    }, 3);

    $defn(self, '_reduce_5', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'StatementsNode')).$m['new'](__a, [val.$m['[]'](val, 0)]);

      return result;
    }, 3);

    $defn(self, '_reduce_6', function(self, val, _values, result) {var __a, __b;
      (__a = val.$m['[]'](val, 0)).$m['<<'](__a, val.$m['[]'](val, 2));
      result = val.$m['[]'](val, 0);

      return result;
    }, 3);









    $defn(self, '_reduce_11', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'UndefNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1));

      return result;
    }, 3);

    $defn(self, '_reduce_12', function(self, val, _values, result) {var __a, __b, __c;
      result = (__a = $cg(self, 'IfNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 2), (__b = $cg(self, 'StatementsNode')).$m['new'](__b, [val.$m['[]'](val, 0)]), [], val.$m['[]'](val, 1));

      return result;
    }, 3);

    $defn(self, '_reduce_13', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'IfModNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 2), val.$m['[]'](val, 0));

      return result;
    }, 3);

    $defn(self, '_reduce_14', function(self, val, _values, result) {var __a, __b, __c;
      result = (__a = $cg(self, 'WhileNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 2), (__b = $cg(self, 'StatementsNode')).$m['new'](__b, [val.$m['[]'](val, 0)]), val.$m['[]'](val, 1));

      return result;
    }, 3);

    $defn(self, '_reduce_15', function(self, val, _values, result) {var __a, __b, __c;
      result = (__a = $cg(self, 'WhileNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 2), (__b = $cg(self, 'StatementsNode')).$m['new'](__b, [val.$m['[]'](val, 0)]), val.$m['[]'](val, 1));

      return result;
    }, 3);







    $defn(self, '_reduce_19', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'AssignNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 2), val.$m['[]'](val, 1));

      return result;
    }, 3);

    $defn(self, '_reduce_20', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'MlhsAssignNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_21', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'OpAsgnNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), val.$m['[]'](val, 2));

      return result;
    }, 3);



    $defn(self, '_reduce_23', function(self, val, _values, result) {var __a, __b, __c;
      result = (__a = $cg(self, 'OpAsgnNode')).$m['new'](__a, val.$m['[]'](val, 3), (__b = $cg(self, 'CallNode')).$m['new'](__b, val.$m['[]'](val, 0), val.$m['[]'](val, 2), []), val.$m['[]'](val, 4));

      return result;
    }, 3);









    $defn(self, '_reduce_28', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'MlhsAssignNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_29', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'MlhsAssignNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), val.$m['[]'](val, 2));

      return result;
    }, 3);





    $defn(self, '_reduce_32', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'AndNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_33', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'OrNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_34', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 1), $hash($symbol_334, '!', $symbol_335, 0), []);

      return result;
    }, 3);

    $defn(self, '_reduce_35', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), []);

      return result;
    }, 3);









    $defn(self, '_reduce_40', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'ReturnNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1));

      return result;
    }, 3);

    $defn(self, '_reduce_41', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'BreakNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1));

      return result;
    }, 3);

    $defn(self, '_reduce_42', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'NextNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1));

      return result;
    }, 3);









    $defn(self, '_reduce_47', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, nil, val.$m['[]'](val, 0), val.$m['[]'](val, 1));

      return result;
    }, 3);



    $defn(self, '_reduce_49', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 2), val.$m['[]'](val, 3));

      return result;
    }, 3);



    $defn(self, '_reduce_51', function(self, val, _values, result) {
      result = "result = ['call', val[0], val[2], val[3]];";

      return result;
    }, 3);



    $defn(self, '_reduce_53', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'SuperNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1));

      return result;
    }, 3);

    $defn(self, '_reduce_54', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'YieldNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1));

      return result;
    }, 3);

    $defn(self, '_reduce_55', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 0);

      return result;
    }, 3);

    $defn(self, '_reduce_56', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 1);

      return result;
    }, 3);

    $defn(self, '_reduce_57', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 0);

      return result;
    }, 3);

    $defn(self, '_reduce_58', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 1);

      return result;
    }, 3);

    $defn(self, '_reduce_59', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0)];

      return result;
    }, 3);

    $defn(self, '_reduce_60', function(self, val, _values, result) {var __a, __b;
      result = [(__a = val.$m['[]'](val, 0)).$m['<<'](__a, val.$m['[]'](val, 1))];

      return result;
    }, 3);









    $defn(self, '_reduce_65', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 0);

      return result;
    }, 3);

    $defn(self, '_reduce_66', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 1);

      return result;
    }, 3);

    $defn(self, '_reduce_67', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0)];

      return result;
    }, 3);

    $defn(self, '_reduce_68', function(self, val, _values, result) {var __a, __b;
      result = (__a = val.$m['[]'](val, 0)).$m['<<'](__a, val.$m['[]'](val, 1));

      return result;
    }, 3);



















    $defn(self, '_reduce_78', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'ArefNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_79', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 2), [[]]);

      return result;
    }, 3);













    $defn(self, '_reduce_86', function(self, val, _values, result) {
      result = "result = ['::', val[1]];";

      return result;
    }, 3);

    $defn(self, '_reduce_87', function(self, val, _values, result) {var __a;
      result = [nil, val.$m['[]'](val, 0)];

      return result;
    }, 3);

    $defn(self, '_reduce_88', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), val.$m['[]'](val, 2)];

      return result;
    }, 3);















    $defn(self, '_reduce_96', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0)];

      return result;
    }, 3);

    $defn(self, '_reduce_97', function(self, val, _values, result) {var __a, __b;
      result = (__a = val.$m['[]'](val, 0)).$m['<<'](__a, val.$m['[]'](val, 2));

      return result;
    }, 3);











































































































































    $defn(self, '_reduce_167', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'AssignNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 2), val.$m['[]'](val, 1));

      return result;
    }, 3);



    $defn(self, '_reduce_169', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'OpAsgnNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_170', function(self, val, _values, result) {var __a, __b, __c;
      result = (__a = $cg(self, 'OpAsgnNode')).$m['new'](__a, val.$m['[]'](val, 4), (__b = $cg(self, 'ArefNode')).$m['new'](__b, val.$m['[]'](val, 0), val.$m['[]'](val, 2)), val.$m['[]'](val, 5));

      return result;
    }, 3);

    $defn(self, '_reduce_171', function(self, val, _values, result) {var __a, __b, __c;
      result = (__a = $cg(self, 'OpAsgnNode')).$m['new'](__a, val.$m['[]'](val, 3), (__b = $cg(self, 'CallNode')).$m['new'](__b, val.$m['[]'](val, 0), val.$m['[]'](val, 2), [[]]), val.$m['[]'](val, 4));

      return result;
    }, 3);











    $defn(self, '_reduce_177', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'RangeNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_178', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'RangeNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_179', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_180', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_181', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_182', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_183', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_184', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);





    $defn(self, '_reduce_187', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), []);

      return result;
    }, 3);

    $defn(self, '_reduce_188', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), []);

      return result;
    }, 3);

    $defn(self, '_reduce_189', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_190', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_191', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_192', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_193', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_194', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_195', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_196', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_197', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_198', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_199', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_200', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_201', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_202', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), []);

      return result;
    }, 3);

    $defn(self, '_reduce_203', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), []);

      return result;
    }, 3);

    $defn(self, '_reduce_204', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_205', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), [[val.$m['[]'](val, 2)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_206', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'AndNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_207', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'OrNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), val.$m['[]'](val, 2));

      return result;
    }, 3);



    $defn(self, '_reduce_209', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'TernaryNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 2), val.$m['[]'](val, 4));

      return result;
    }, 3);





    $defn(self, '_reduce_212', function(self, val, _values, result) {
      result = [[], nil];

      return result;
    }, 3);



    $defn(self, '_reduce_214', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), nil];

      return result;
    }, 3);

    $defn(self, '_reduce_215', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), val.$m['[]'](val, 3)];

      return result;
    }, 3);

    $defn(self, '_reduce_216', function(self, val, _values, result) {var __a, __b;
      result = [[(__a = $cg(self, 'HashNode')).$m['new'](__a, val.$m['[]'](val, 0), $hash(), $hash())], nil];

      return result;
    }, 3);

    $defn(self, '_reduce_217', function(self, val, _values, result) {var __a;
      result = [[], val.$m['[]'](val, 1)];

      return result;
    }, 3);

    $defn(self, '_reduce_218', function(self, val, _values, result) {
      result = [[]];

      return result;
    }, 3);

    $defn(self, '_reduce_219', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 1);

      return result;
    }, 3);





    $defn(self, '_reduce_222', function(self, val, _values, result) {
      result = [];

      return result;
    }, 3);



    $defn(self, '_reduce_224', function(self, val, _values, result) {var __a;
      result = [[val.$m['[]'](val, 0)], nil, nil, nil];

      return result;
    }, 3);

    $defn(self, '_reduce_225', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), nil, nil, val.$m['[]'](val, 1)];

      return result;
    }, 3);

    $defn(self, '_reduce_226', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), val.$m['[]'](val, 3), nil, val.$m['[]'](val, 4)];

      return result;
    }, 3);

    $defn(self, '_reduce_227', function(self, val, _values, result) {var __a;
      result = [nil, nil, val.$m['[]'](val, 0), val.$m['[]'](val, 1)];

      return result;
    }, 3);

    $defn(self, '_reduce_228', function(self, val, _values, result) {var __a;
      result = [nil, val.$m['[]'](val, 3), val.$m['[]'](val, 0), val.$m['[]'](val, 4)];

      return result;
    }, 3);

    $defn(self, '_reduce_229', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), nil, val.$m['[]'](val, 2), val.$m['[]'](val, 3)];

      return result;
    }, 3);

    $defn(self, '_reduce_230', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), val.$m['[]'](val, 5), val.$m['[]'](val, 2), val.$m['[]'](val, 6)];

      return result;
    }, 3);

    $defn(self, '_reduce_231', function(self, val, _values, result) {var __a;
      result = [nil, val.$m['[]'](val, 1), nil, val.$m['[]'](val, 2)];

      return result;
    }, 3);

    $defn(self, '_reduce_232', function(self, val, _values, result) {var __a;
      result = [nil, nil, nil, val.$m['[]'](val, 0)];

      return result;
    }, 3);

























    $defn(self, '_reduce_245', function(self, val, _values, result) {var __a;
      self.$m.$cmdarg_push(self, 1);

      return result;
    }, 3);

    $defn(self, '_reduce_246', function(self, val, _values, result) {var __a;
      self.$m.$cmdarg_pop(self);
      result = val.$m['[]'](val, 1);

      return result;
    }, 3);



    $defn(self, '_reduce_248', function(self, val, _values, result) {
      result = [[]];

      return result;
    }, 3);

    $defn(self, '_reduce_249', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 1);

      return result;
    }, 3);

    $defn(self, '_reduce_250', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 1);

      return result;
    }, 3);

    $defn(self, '_reduce_251', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 1);

      return result;
    }, 3);

    $defn(self, '_reduce_252', function(self, val, _values, result) {
      result = nil;

      return result;
    }, 3);

    $defn(self, '_reduce_253', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0)];

      return result;
    }, 3);

    $defn(self, '_reduce_254', function(self, val, _values, result) {var __a, __b;
      result = (__a = val.$m['[]'](val, 0)).$m['<<'](__a, val.$m['[]'](val, 2));

      return result;
    }, 3);

























    $defn(self, '_reduce_267', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'BeginNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 2));

      return result;
    }, 3);



    $defn(self, '_reduce_269', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'ParenNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_270', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'Colon2Node')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_271', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'Colon3Node')).$m['new'](__a, val.$m['[]'](val, 1));

      return result;
    }, 3);

    $defn(self, '_reduce_272', function(self, val, _values, result) {var __a, __b, __c;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), $hash($symbol_335, (__b = val.$m['[]'](val, 0)).$m.line(__b), $symbol_334, '[]'), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_273', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'ArrayNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_274', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'HashNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 0), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_275', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'ReturnNode')).$m['new'](__a, val.$m['[]'](val, 0), [nil]);

      return result;
    }, 3);

    $defn(self, '_reduce_276', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'YieldNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_277', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'YieldNode')).$m['new'](__a, val.$m['[]'](val, 0), []);

      return result;
    }, 3);

    $defn(self, '_reduce_278', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'YieldNode')).$m['new'](__a, val.$m['[]'](val, 0), []);

      return result;
    }, 3);



    $defn(self, '_reduce_280', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, nil, val.$m['[]'](val, 0), [[]]);
      result.$m['block='](result, val.$m['[]'](val, 1));

      return result;
    }, 3);



    $defn(self, '_reduce_282', function(self, val, _values, result) {var __a, __b;
      result = val.$m['[]'](val, 0);
      result.$m['block='](result, val.$m['[]'](val, 1));

      return result;
    }, 3);

    $defn(self, '_reduce_283', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'IfNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 3), val.$m['[]'](val, 4), val.$m['[]'](val, 5));

      return result;
    }, 3);

    $defn(self, '_reduce_284', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'IfNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 3), val.$m['[]'](val, 4), val.$m['[]'](val, 5));

      return result;
    }, 3);

    $defn(self, '_reduce_285', function(self, val, _values, result) {var __a;
      self.$m.$cond_push(self, 1);

      return result;
    }, 3);

    $defn(self, '_reduce_286', function(self, val, _values, result) {var __a;
      self.$m.$cond_pop(self);

      return result;
    }, 3);

    $defn(self, '_reduce_287', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'WhileNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 2), val.$m['[]'](val, 5), val.$m['[]'](val, 6));

      return result;
    }, 3);

    $defn(self, '_reduce_288', function(self, val, _values, result) {
      result = "this.cond_push(1);";

      return result;
    }, 3);

    $defn(self, '_reduce_289', function(self, val, _values, result) {
      result = "this.cond_pop();";

      return result;
    }, 3);

    $defn(self, '_reduce_290', function(self, val, _values, result) {
      result = "result = ['while', val[0], val[2], val[5]];";

      return result;
    }, 3);

    $defn(self, '_reduce_291', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CaseNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 3), val.$m['[]'](val, 4));

      return result;
    }, 3);

    $defn(self, '_reduce_292', function(self, val, _values, result) {
      result = "result = ['case', null, val[2]];";

      return result;
    }, 3);



    $defn(self, '_reduce_294', function(self, val, _values, result) {
      result = "this.cond_push(1);";

      return result;
    }, 3);

    $defn(self, '_reduce_295', function(self, val, _values, result) {
      result = "this.cond_pop();";

      return result;
    }, 3);



    $defn(self, '_reduce_297', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'ClassNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 2), val.$m['[]'](val, 3), val.$m['[]'](val, 4));

      return result;
    }, 3);

    $defn(self, '_reduce_298', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'ClassShiftNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 2), val.$m['[]'](val, 4), val.$m['[]'](val, 5));

      return result;
    }, 3);

    $defn(self, '_reduce_299', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'ModuleNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 2), val.$m['[]'](val, 3));

      return result;
    }, 3);

    $defn(self, '_reduce_300', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'DefNode')).$m['new'](__a, val.$m['[]'](val, 0), nil, val.$m['[]'](val, 1), val.$m['[]'](val, 2), val.$m['[]'](val, 3), val.$m['[]'](val, 4));

      return result;
    }, 3);

    $defn(self, '_reduce_301', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'DefNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 3), val.$m['[]'](val, 4), val.$m['[]'](val, 5), val.$m['[]'](val, 6));

      return result;
    }, 3);

    $defn(self, '_reduce_302', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'BreakNode')).$m['new'](__a, val.$m['[]'](val, 0), []);

      return result;
    }, 3);

    $defn(self, '_reduce_303', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'NextNode')).$m['new'](__a, val.$m['[]'](val, 0), []);

      return result;
    }, 3);

    $defn(self, '_reduce_304', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'RedoNode')).$m['new'](__a, val.$m['[]'](val, 0));

      return result;
    }, 3);



















    $defn(self, '_reduce_314', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 0);

      return result;
    }, 3);

    $defn(self, '_reduce_315', function(self, val, _values, result) {var __a, __b;
      result = (__a = [[val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 3)]]).$m.concat(__a, val.$m['[]'](val, 4));

      return result;
    }, 3);

    $defn(self, '_reduce_316', function(self, val, _values, result) {
      result = [];

      return result;
    }, 3);

    $defn(self, '_reduce_317', function(self, val, _values, result) {var __a;
      result = [[val.$m['[]'](val, 0), val.$m['[]'](val, 1)]];

      return result;
    }, 3);

    $defn(self, '_reduce_318', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), nil];

      return result;
    }, 3);

    $defn(self, '_reduce_319', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), val.$m['[]'](val, 2), val.$m['[]'](val, 4), val.$m['[]'](val, 5)];

      return result;
    }, 3);

    $defn(self, '_reduce_320', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), val.$m['[]'](val, 2), nil, val.$m['[]'](val, 3)];

      return result;
    }, 3);

    $defn(self, '_reduce_321', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), nil, val.$m['[]'](val, 2), val.$m['[]'](val, 3)];

      return result;
    }, 3);

    $defn(self, '_reduce_322', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), nil, nil, val.$m['[]'](val, 1)];

      return result;
    }, 3);

    $defn(self, '_reduce_323', function(self, val, _values, result) {var __a;
      result = [nil, val.$m['[]'](val, 0), val.$m['[]'](val, 2), val.$m['[]'](val, 3)];

      return result;
    }, 3);

    $defn(self, '_reduce_324', function(self, val, _values, result) {var __a;
      result = [nil, val.$m['[]'](val, 0), nil, val.$m['[]'](val, 1)];

      return result;
    }, 3);

    $defn(self, '_reduce_325', function(self, val, _values, result) {var __a;
      result = [nil, nil, val.$m['[]'](val, 0), val.$m['[]'](val, 1)];

      return result;
    }, 3);

    $defn(self, '_reduce_326', function(self, val, _values, result) {var __a;
      result = [nil, nil, nil, val.$m['[]'](val, 0)];

      return result;
    }, 3);

    $defn(self, '_reduce_327', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0)];

      return result;
    }, 3);

    $defn(self, '_reduce_328', function(self, val, _values, result) {var __a, __b;
      (__a = val.$m['[]'](val, 0)).$m['<<'](__a, val.$m['[]'](val, 2));
      result = val.$m['[]'](val, 0);

      return result;
    }, 3);

    $defn(self, '_reduce_329', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), val.$m['[]'](val, 2)];

      return result;
    }, 3);

    $defn(self, '_reduce_330', function(self, val, _values, result) {
      result = [nil];

      return result;
    }, 3);

    $defn(self, '_reduce_331', function(self, val, _values, result) {
      result = [nil];

      return result;
    }, 3);

    $defn(self, '_reduce_332', function(self, val, _values, result) {
      result = [nil];

      return result;
    }, 3);

    $defn(self, '_reduce_333', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 1);

      return result;
    }, 3);

    $defn(self, '_reduce_334', function(self, val, _values, result) {


      return result;
    }, 3);

    $defn(self, '_reduce_335', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'BlockNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 2), val.$m['[]'](val, 3), val.$m['[]'](val, 4));

      return result;
    }, 3);

    $defn(self, '_reduce_336', function(self, val, _values, result) {var __a, __b;
      result = val.$m['[]'](val, 0);
      (__a = val.$m['[]'](val, 0)).$m['block='](__a, val.$m['[]'](val, 1));

      return result;
    }, 3);





    $defn(self, '_reduce_339', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, nil, val.$m['[]'](val, 0), val.$m['[]'](val, 1));

      return result;
    }, 3);

    $defn(self, '_reduce_340', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'CallNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 2), val.$m['[]'](val, 3));

      return result;
    }, 3);





    $defn(self, '_reduce_343', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'SuperNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1));

      return result;
    }, 3);

    $defn(self, '_reduce_344', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'SuperNode')).$m['new'](__a, val.$m['[]'](val, 0), []);

      return result;
    }, 3);

    $defn(self, '_reduce_345', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'BlockNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 2), val.$m['[]'](val, 3));

      return result;
    }, 3);

    $defn(self, '_reduce_346', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'BlockNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 2), val.$m['[]'](val, 3));

      return result;
    }, 3);

    $defn(self, '_reduce_347', function(self, val, _values, result) {var __a, __b;

      result = (__a = [[val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 3)]]).$m['+'](__a, val.$m['[]'](val, 4));

      return result;
    }, 3);

    $defn(self, '_reduce_348', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 0);

      return result;
    }, 3);

    $defn(self, '_reduce_349', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 0);

      return result;
    }, 3);

    $defn(self, '_reduce_350', function(self, val, _values, result) {
      result = [];

      return result;
    }, 3);





    $defn(self, '_reduce_353', function(self, val, _values, result) {var __a, __b;
      result = [[val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 2), val.$m['[]'](val, 4)]];
      result.$m.concat(result, val.$m['[]'](val, 5));

      return result;
    }, 3);

    $defn(self, '_reduce_354', function(self, val, _values, result) {
      result = [];

      return result;
    }, 3);







    $defn(self, '_reduce_358', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 1);

      return result;
    }, 3);

    $defn(self, '_reduce_359', function(self, val, _values, result) {
      result = nil;

      return result;
    }, 3);

















    $defn(self, '_reduce_368', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'StringNode')).$m['new'](__a, val.$m['[]'](val, 1), val.$m['[]'](val, 2));

      return result;
    }, 3);



    $defn(self, '_reduce_370', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'XStringNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_371', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'RegexpNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1));

      return result;
    }, 3);

    $defn(self, '_reduce_372', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'WordsNode')).$m['new'](__a, val.$m['[]'](val, 0), [], val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_373', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'WordsNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_374', function(self, val, _values, result) {
      result = [];

      return result;
    }, 3);

    $defn(self, '_reduce_375', function(self, val, _values, result) {var __a, __b;
      result = (__a = val.$m['[]'](val, 0)).$m.concat(__a, [val.$m['[]'](val, 1)]);

      return result;
    }, 3);

    $defn(self, '_reduce_376', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 0);

      return result;
    }, 3);

    $defn(self, '_reduce_377', function(self, val, _values, result) {var __a, __b;
      result = (__a = val.$m['[]'](val, 0)).$m.concat(__a, [val.$m['[]'](val, 1)]);

      return result;
    }, 3);

    $defn(self, '_reduce_378', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'WordsNode')).$m['new'](__a, val.$m['[]'](val, 0), [], val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_379', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'WordsNode')).$m['new'](__a, val.$m['[]'](val, 0), val.$m['[]'](val, 1), val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_380', function(self, val, _values, result) {
      result = [];

      return result;
    }, 3);

    $defn(self, '_reduce_381', function(self, val, _values, result) {var __a, __b;
      result = (__a = val.$m['[]'](val, 0)).$m.concat(__a, [['string_content', val.$m['[]'](val, 1)]]);

      return result;
    }, 3);

    $defn(self, '_reduce_382', function(self, val, _values, result) {
      result = [];

      return result;
    }, 3);

    $defn(self, '_reduce_383', function(self, val, _values, result) {var __a, __b;
      result = (__a = val.$m['[]'](val, 0)).$m['<<'](__a, val.$m['[]'](val, 1));

      return result;
    }, 3);

    $defn(self, '_reduce_384', function(self, val, _values, result) {
      result = [];

      return result;
    }, 3);

    $defn(self, '_reduce_385', function(self, val, _values, result) {var __a, __b;
      result = (__a = val.$m['[]'](val, 0)).$m.concat(__a, [val.$m['[]'](val, 1)]);

      return result;
    }, 3);

    $defn(self, '_reduce_386', function(self, val, _values, result) {var __a;
      result = ['string_content', val.$m['[]'](val, 0)];

      return result;
    }, 3);

    $defn(self, '_reduce_387', function(self, val, _values, result) {var __a;
      result = ['string_dvar', val.$m['[]'](val, 1)];

      return result;
    }, 3);

    $defn(self, '_reduce_388', function(self, val, _values, result) {var __a;
      self.$m.$cond_push(self, 0);
      self.$m.$cmdarg_push(self, 0);

      return result;
    }, 3);

    $defn(self, '_reduce_389', function(self, val, _values, result) {var __a;
      self.$m.$cond_lexpop(self);
      self.$m.$cmdarg_lexpop(self);
      result = ['string_dbegin', val.$m['[]'](val, 2)];

      return result;
    }, 3);









    $defn(self, '_reduce_394', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'SymbolNode')).$m['new'](__a, val.$m['[]'](val, 1));

      return result;
    }, 3);











    $defn(self, '_reduce_400', function(self, val, _values, result) {
      result = "result = ['dsym', val[1]];";

      return result;
    }, 3);

    $defn(self, '_reduce_401', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'NumericNode')).$m['new'](__a, val.$m['[]'](val, 0));

      return result;
    }, 3);

    $defn(self, '_reduce_402', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'NumericNode')).$m['new'](__a, val.$m['[]'](val, 0));

      return result;
    }, 3);





    $defn(self, '_reduce_405', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'IdentifierNode')).$m['new'](__a, val.$m['[]'](val, 0));

      return result;
    }, 3);

    $defn(self, '_reduce_406', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'IvarNode')).$m['new'](__a, val.$m['[]'](val, 0));

      return result;
    }, 3);

    $defn(self, '_reduce_407', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'GvarNode')).$m['new'](__a, val.$m['[]'](val, 0));

      return result;
    }, 3);

    $defn(self, '_reduce_408', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'ConstantNode')).$m['new'](__a, val.$m['[]'](val, 0));

      return result;
    }, 3);

    $defn(self, '_reduce_409', function(self, val, _values, result) {
      result = "result = ['cvar', val[0]];";

      return result;
    }, 3);

    $defn(self, '_reduce_410', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'NilNode')).$m['new'](__a, val.$m['[]'](val, 0));

      return result;
    }, 3);

    $defn(self, '_reduce_411', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'SelfNode')).$m['new'](__a, val.$m['[]'](val, 0));

      return result;
    }, 3);

    $defn(self, '_reduce_412', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'TrueNode')).$m['new'](__a, val.$m['[]'](val, 0));

      return result;
    }, 3);

    $defn(self, '_reduce_413', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'FalseNode')).$m['new'](__a, val.$m['[]'](val, 0));

      return result;
    }, 3);

    $defn(self, '_reduce_414', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'FileNode')).$m['new'](__a, val.$m['[]'](val, 0));

      return result;
    }, 3);

    $defn(self, '_reduce_415', function(self, val, _values, result) {var __a, __b;
      result = (__a = $cg(self, 'LineNode')).$m['new'](__a, val.$m['[]'](val, 0));

      return result;
    }, 3);









    $defn(self, '_reduce_420', function(self, val, _values, result) {
      result = nil;

      return result;
    }, 3);

    $defn(self, '_reduce_421', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 1);

      return result;
    }, 3);

    $defn(self, '_reduce_422', function(self, val, _values, result) {
      result = nil;

      return result;
    }, 3);

    $defn(self, '_reduce_423', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 1);

      return result;
    }, 3);

    $defn(self, '_reduce_424', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 0);

      return result;
    }, 3);

    $defn(self, '_reduce_425', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), val.$m['[]'](val, 2), val.$m['[]'](val, 4), val.$m['[]'](val, 5)];

      return result;
    }, 3);

    $defn(self, '_reduce_426', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), val.$m['[]'](val, 2), nil, val.$m['[]'](val, 3)];

      return result;
    }, 3);

    $defn(self, '_reduce_427', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), nil, val.$m['[]'](val, 2), val.$m['[]'](val, 3)];

      return result;
    }, 3);

    $defn(self, '_reduce_428', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), nil, nil, val.$m['[]'](val, 1)];

      return result;
    }, 3);

    $defn(self, '_reduce_429', function(self, val, _values, result) {var rsult, __a;
      rsult = [nil, val.$m['[]'](val, 0), val.$m['[]'](val, 2), val.$m['[]'](val, 3)];

      return result;
    }, 3);

    $defn(self, '_reduce_430', function(self, val, _values, result) {var __a;
      result = [nil, val.$m['[]'](val, 0), nil, val.$m['[]'](val, 1)];

      return result;
    }, 3);

    $defn(self, '_reduce_431', function(self, val, _values, result) {var __a;
      result = [nil, nil, val.$m['[]'](val, 0), val.$m['[]'](val, 1)];

      return result;
    }, 3);

    $defn(self, '_reduce_432', function(self, val, _values, result) {var __a;
      result = [nil, nil, nil, val.$m['[]'](val, 0)];

      return result;
    }, 3);

    $defn(self, '_reduce_433', function(self, val, _values, result) {
      result = [nil, nil, nil, nil];

      return result;
    }, 3);

    $defn(self, '_reduce_434', function(self, val, _values, result) {
      result = "this.yyerror('formal argument cannot be a constant');";

      return result;
    }, 3);

    $defn(self, '_reduce_435', function(self, val, _values, result) {
      result = "this.yyerror('formal argument cannot be an instance variable');";

      return result;
    }, 3);

    $defn(self, '_reduce_436', function(self, val, _values, result) {
      result = "this.yyerror('formal argument cannot be a class variable');";

      return result;
    }, 3);

    $defn(self, '_reduce_437', function(self, val, _values, result) {
      result = "this.yyerror('formal argument cannot be a global variable');";

      return result;
    }, 3);



    $defn(self, '_reduce_439', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0)];

      return result;
    }, 3);

    $defn(self, '_reduce_440', function(self, val, _values, result) {var __a, __b;
      (__a = val.$m['[]'](val, 0)).$m['<<'](__a, val.$m['[]'](val, 2));
      result = val.$m['[]'](val, 0);

      return result;
    }, 3);

    $defn(self, '_reduce_441', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), val.$m['[]'](val, 2)];

      return result;
    }, 3);

    $defn(self, '_reduce_442', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0)];

      return result;
    }, 3);

    $defn(self, '_reduce_443', function(self, val, _values, result) {var __a, __b;
      result = val.$m['[]'](val, 0);
      (__a = val.$m['[]'](val, 0)).$m['<<'](__a, val.$m['[]'](val, 2));

      return result;
    }, 3);





    $defn(self, '_reduce_446', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 1);

      return result;
    }, 3);

    $defn(self, '_reduce_447', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 0);

      return result;
    }, 3);





    $defn(self, '_reduce_450', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 1);

      return result;
    }, 3);

    $defn(self, '_reduce_451', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 1);

      return result;
    }, 3);

    $defn(self, '_reduce_452', function(self, val, _values, result) {
      result = nil;

      return result;
    }, 3);

    $defn(self, '_reduce_453', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 0);

      return result;
    }, 3);

    $defn(self, '_reduce_454', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 1);

      return result;
    }, 3);

    $defn(self, '_reduce_455', function(self, val, _values, result) {
      result = [];

      return result;
    }, 3);

    $defn(self, '_reduce_456', function(self, val, _values, result) {var __a;
      result = val.$m['[]'](val, 0);

      return result;
    }, 3);

    $defn(self, '_reduce_457', function(self, val, _values, result) {var __a;
      self.$m.$raise(self, ("unsupported assoc list type (" + "#@line_number)"));

      return result;
    }, 3);

    $defn(self, '_reduce_458', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0)];

      return result;
    }, 3);

    $defn(self, '_reduce_459', function(self, val, _values, result) {var __a, __b;
      result = (__a = val.$m['[]'](val, 0)).$m['<<'](__a, val.$m['[]'](val, 2));

      return result;
    }, 3);

    $defn(self, '_reduce_460', function(self, val, _values, result) {var __a;
      result = [val.$m['[]'](val, 0), val.$m['[]'](val, 2)];

      return result;
    }, 3);

    $defn(self, '_reduce_461', function(self, val, _values, result) {var __a, __b;
      result = [(__a = $cg(self, 'SymbolNode')).$m['new'](__a, val.$m['[]'](val, 0)), val.$m['[]'](val, 1)];

      return result;
    }, 3);



















































    return $defn(self, '_reduce_none', function(self, val, _values, result) {var __a;
      return val.$m['[]'](val, 0);
    }, 3);

    }, 0);
}, 2);
}
var __a;var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G, $symbol_1 = $symbol('racc_error'), $symbol_2 = $symbol('_reduce_1'), $symbol_3 = $symbol('_reduce_2'), $symbol_4 = $symbol('_reduce_3'), $symbol_5 = $symbol('_reduce_4'), $symbol_6 = $symbol('_reduce_5'), $symbol_7 = $symbol('_reduce_6'), $symbol_8 = $symbol('_reduce_none'), $symbol_9 = $symbol('_reduce_11'), $symbol_10 = $symbol('_reduce_12'), $symbol_11 = $symbol('_reduce_13'), $symbol_12 = $symbol('_reduce_14'), $symbol_13 = $symbol('_reduce_15'), $symbol_14 = $symbol('_reduce_19'), $symbol_15 = $symbol('_reduce_20'), $symbol_16 = $symbol('_reduce_21'), $symbol_17 = $symbol('_reduce_23'), $symbol_18 = $symbol('_reduce_28'), $symbol_19 = $symbol('_reduce_29'), $symbol_20 = $symbol('_reduce_32'), $symbol_21 = $symbol('_reduce_33'), $symbol_22 = $symbol('_reduce_34'), $symbol_23 = $symbol('_reduce_35'), $symbol_24 = $symbol('_reduce_40'), $symbol_25 = $symbol('_reduce_41'), $symbol_26 = $symbol('_reduce_42'), $symbol_27 = $symbol('_reduce_47'), $symbol_28 = $symbol('_reduce_49'), $symbol_29 = $symbol('_reduce_51'), $symbol_30 = $symbol('_reduce_53'), $symbol_31 = $symbol('_reduce_54'), $symbol_32 = $symbol('_reduce_55'), $symbol_33 = $symbol('_reduce_56'), $symbol_34 = $symbol('_reduce_57'), $symbol_35 = $symbol('_reduce_58'), $symbol_36 = $symbol('_reduce_59'), $symbol_37 = $symbol('_reduce_60'), $symbol_38 = $symbol('_reduce_65'), $symbol_39 = $symbol('_reduce_66'), $symbol_40 = $symbol('_reduce_67'), $symbol_41 = $symbol('_reduce_68'), $symbol_42 = $symbol('_reduce_78'), $symbol_43 = $symbol('_reduce_79'), $symbol_44 = $symbol('_reduce_86'), $symbol_45 = $symbol('_reduce_87'), $symbol_46 = $symbol('_reduce_88'), $symbol_47 = $symbol('_reduce_96'), $symbol_48 = $symbol('_reduce_97'), $symbol_49 = $symbol('_reduce_167'), $symbol_50 = $symbol('_reduce_169'), $symbol_51 = $symbol('_reduce_170'), $symbol_52 = $symbol('_reduce_171'), $symbol_53 = $symbol('_reduce_177'), $symbol_54 = $symbol('_reduce_178'), $symbol_55 = $symbol('_reduce_179'), $symbol_56 = $symbol('_reduce_180'), $symbol_57 = $symbol('_reduce_181'), $symbol_58 = $symbol('_reduce_182'), $symbol_59 = $symbol('_reduce_183'), $symbol_60 = $symbol('_reduce_184'), $symbol_61 = $symbol('_reduce_187'), $symbol_62 = $symbol('_reduce_188'), $symbol_63 = $symbol('_reduce_189'), $symbol_64 = $symbol('_reduce_190'), $symbol_65 = $symbol('_reduce_191'), $symbol_66 = $symbol('_reduce_192'), $symbol_67 = $symbol('_reduce_193'), $symbol_68 = $symbol('_reduce_194'), $symbol_69 = $symbol('_reduce_195'), $symbol_70 = $symbol('_reduce_196'), $symbol_71 = $symbol('_reduce_197'), $symbol_72 = $symbol('_reduce_198'), $symbol_73 = $symbol('_reduce_199'), $symbol_74 = $symbol('_reduce_200'), $symbol_75 = $symbol('_reduce_201'), $symbol_76 = $symbol('_reduce_202'), $symbol_77 = $symbol('_reduce_203'), $symbol_78 = $symbol('_reduce_204'), $symbol_79 = $symbol('_reduce_205'), $symbol_80 = $symbol('_reduce_206'), $symbol_81 = $symbol('_reduce_207'), $symbol_82 = $symbol('_reduce_209'), $symbol_83 = $symbol('_reduce_212'), $symbol_84 = $symbol('_reduce_214'), $symbol_85 = $symbol('_reduce_215'), $symbol_86 = $symbol('_reduce_216'), $symbol_87 = $symbol('_reduce_217'), $symbol_88 = $symbol('_reduce_218'), $symbol_89 = $symbol('_reduce_219'), $symbol_90 = $symbol('_reduce_222'), $symbol_91 = $symbol('_reduce_224'), $symbol_92 = $symbol('_reduce_225'), $symbol_93 = $symbol('_reduce_226'), $symbol_94 = $symbol('_reduce_227'), $symbol_95 = $symbol('_reduce_228'), $symbol_96 = $symbol('_reduce_229'), $symbol_97 = $symbol('_reduce_230'), $symbol_98 = $symbol('_reduce_231'), $symbol_99 = $symbol('_reduce_232'), $symbol_100 = $symbol('_reduce_245'), $symbol_101 = $symbol('_reduce_246'), $symbol_102 = $symbol('_reduce_248'), $symbol_103 = $symbol('_reduce_249'), $symbol_104 = $symbol('_reduce_250'), $symbol_105 = $symbol('_reduce_251'), $symbol_106 = $symbol('_reduce_252'), $symbol_107 = $symbol('_reduce_253'), $symbol_108 = $symbol('_reduce_254'), $symbol_109 = $symbol('_reduce_267'), $symbol_110 = $symbol('_reduce_269'), $symbol_111 = $symbol('_reduce_270'), $symbol_112 = $symbol('_reduce_271'), $symbol_113 = $symbol('_reduce_272'), $symbol_114 = $symbol('_reduce_273'), $symbol_115 = $symbol('_reduce_274'), $symbol_116 = $symbol('_reduce_275'), $symbol_117 = $symbol('_reduce_276'), $symbol_118 = $symbol('_reduce_277'), $symbol_119 = $symbol('_reduce_278'), $symbol_120 = $symbol('_reduce_280'), $symbol_121 = $symbol('_reduce_282'), $symbol_122 = $symbol('_reduce_283'), $symbol_123 = $symbol('_reduce_284'), $symbol_124 = $symbol('_reduce_285'), $symbol_125 = $symbol('_reduce_286'), $symbol_126 = $symbol('_reduce_287'), $symbol_127 = $symbol('_reduce_288'), $symbol_128 = $symbol('_reduce_289'), $symbol_129 = $symbol('_reduce_290'), $symbol_130 = $symbol('_reduce_291'), $symbol_131 = $symbol('_reduce_292'), $symbol_132 = $symbol('_reduce_294'), $symbol_133 = $symbol('_reduce_295'), $symbol_134 = $symbol('_reduce_297'), $symbol_135 = $symbol('_reduce_298'), $symbol_136 = $symbol('_reduce_299'), $symbol_137 = $symbol('_reduce_300'), $symbol_138 = $symbol('_reduce_301'), $symbol_139 = $symbol('_reduce_302'), $symbol_140 = $symbol('_reduce_303'), $symbol_141 = $symbol('_reduce_304'), $symbol_142 = $symbol('_reduce_314'), $symbol_143 = $symbol('_reduce_315'), $symbol_144 = $symbol('_reduce_316'), $symbol_145 = $symbol('_reduce_317'), $symbol_146 = $symbol('_reduce_318'), $symbol_147 = $symbol('_reduce_319'), $symbol_148 = $symbol('_reduce_320'), $symbol_149 = $symbol('_reduce_321'), $symbol_150 = $symbol('_reduce_322'), $symbol_151 = $symbol('_reduce_323'), $symbol_152 = $symbol('_reduce_324'), $symbol_153 = $symbol('_reduce_325'), $symbol_154 = $symbol('_reduce_326'), $symbol_155 = $symbol('_reduce_327'), $symbol_156 = $symbol('_reduce_328'), $symbol_157 = $symbol('_reduce_329'), $symbol_158 = $symbol('_reduce_330'), $symbol_159 = $symbol('_reduce_331'), $symbol_160 = $symbol('_reduce_332'), $symbol_161 = $symbol('_reduce_333'), $symbol_162 = $symbol('_reduce_334'), $symbol_163 = $symbol('_reduce_335'), $symbol_164 = $symbol('_reduce_336'), $symbol_165 = $symbol('_reduce_339'), $symbol_166 = $symbol('_reduce_340'), $symbol_167 = $symbol('_reduce_343'), $symbol_168 = $symbol('_reduce_344'), $symbol_169 = $symbol('_reduce_345'), $symbol_170 = $symbol('_reduce_346'), $symbol_171 = $symbol('_reduce_347'), $symbol_172 = $symbol('_reduce_348'), $symbol_173 = $symbol('_reduce_349'), $symbol_174 = $symbol('_reduce_350'), $symbol_175 = $symbol('_reduce_353'), $symbol_176 = $symbol('_reduce_354'), $symbol_177 = $symbol('_reduce_358'), $symbol_178 = $symbol('_reduce_359'), $symbol_179 = $symbol('_reduce_368'), $symbol_180 = $symbol('_reduce_370'), $symbol_181 = $symbol('_reduce_371'), $symbol_182 = $symbol('_reduce_372'), $symbol_183 = $symbol('_reduce_373'), $symbol_184 = $symbol('_reduce_374'), $symbol_185 = $symbol('_reduce_375'), $symbol_186 = $symbol('_reduce_376'), $symbol_187 = $symbol('_reduce_377'), $symbol_188 = $symbol('_reduce_378'), $symbol_189 = $symbol('_reduce_379'), $symbol_190 = $symbol('_reduce_380'), $symbol_191 = $symbol('_reduce_381'), $symbol_192 = $symbol('_reduce_382'), $symbol_193 = $symbol('_reduce_383'), $symbol_194 = $symbol('_reduce_384'), $symbol_195 = $symbol('_reduce_385'), $symbol_196 = $symbol('_reduce_386'), $symbol_197 = $symbol('_reduce_387'), $symbol_198 = $symbol('_reduce_388'), $symbol_199 = $symbol('_reduce_389'), $symbol_200 = $symbol('_reduce_394'), $symbol_201 = $symbol('_reduce_400'), $symbol_202 = $symbol('_reduce_401'), $symbol_203 = $symbol('_reduce_402'), $symbol_204 = $symbol('_reduce_405'), $symbol_205 = $symbol('_reduce_406'), $symbol_206 = $symbol('_reduce_407'), $symbol_207 = $symbol('_reduce_408'), $symbol_208 = $symbol('_reduce_409'), $symbol_209 = $symbol('_reduce_410'), $symbol_210 = $symbol('_reduce_411'), $symbol_211 = $symbol('_reduce_412'), $symbol_212 = $symbol('_reduce_413'), $symbol_213 = $symbol('_reduce_414'), $symbol_214 = $symbol('_reduce_415'), $symbol_215 = $symbol('_reduce_420'), $symbol_216 = $symbol('_reduce_421'), $symbol_217 = $symbol('_reduce_422'), $symbol_218 = $symbol('_reduce_423'), $symbol_219 = $symbol('_reduce_424'), $symbol_220 = $symbol('_reduce_425'), $symbol_221 = $symbol('_reduce_426'), $symbol_222 = $symbol('_reduce_427'), $symbol_223 = $symbol('_reduce_428'), $symbol_224 = $symbol('_reduce_429'), $symbol_225 = $symbol('_reduce_430'), $symbol_226 = $symbol('_reduce_431'), $symbol_227 = $symbol('_reduce_432'), $symbol_228 = $symbol('_reduce_433'), $symbol_229 = $symbol('_reduce_434'), $symbol_230 = $symbol('_reduce_435'), $symbol_231 = $symbol('_reduce_436'), $symbol_232 = $symbol('_reduce_437'), $symbol_233 = $symbol('_reduce_439'), $symbol_234 = $symbol('_reduce_440'), $symbol_235 = $symbol('_reduce_441'), $symbol_236 = $symbol('_reduce_442'), $symbol_237 = $symbol('_reduce_443'), $symbol_238 = $symbol('_reduce_446'), $symbol_239 = $symbol('_reduce_447'), $symbol_240 = $symbol('_reduce_450'), $symbol_241 = $symbol('_reduce_451'), $symbol_242 = $symbol('_reduce_452'), $symbol_243 = $symbol('_reduce_453'), $symbol_244 = $symbol('_reduce_454'), $symbol_245 = $symbol('_reduce_455'), $symbol_246 = $symbol('_reduce_456'), $symbol_247 = $symbol('_reduce_457'), $symbol_248 = $symbol('_reduce_458'), $symbol_249 = $symbol('_reduce_459'), $symbol_250 = $symbol('_reduce_460'), $symbol_251 = $symbol('_reduce_461'), $symbol_252 = $symbol('error'), $symbol_253 = $symbol('CLASS'), $symbol_254 = $symbol('MODULE'), $symbol_255 = $symbol('DEF'), $symbol_256 = $symbol('UNDEF'), $symbol_257 = $symbol('BEGIN'), $symbol_258 = $symbol('RESCUE'), $symbol_259 = $symbol('ENSURE'), $symbol_260 = $symbol('END'), $symbol_261 = $symbol('IF'), $symbol_262 = $symbol('UNLESS'), $symbol_263 = $symbol('THEN'), $symbol_264 = $symbol('ELSIF'), $symbol_265 = $symbol('ELSE'), $symbol_266 = $symbol('CASE'), $symbol_267 = $symbol('WHEN'), $symbol_268 = $symbol('WHILE'), $symbol_269 = $symbol('UNTIL'), $symbol_270 = $symbol('FOR'), $symbol_271 = $symbol('BREAK'), $symbol_272 = $symbol('NEXT'), $symbol_273 = $symbol('REDO'), $symbol_274 = $symbol('RETRY'), $symbol_275 = $symbol('IN'), $symbol_276 = $symbol('DO'), $symbol_277 = $symbol('DO_COND'), $symbol_278 = $symbol('DO_BLOCK'), $symbol_279 = $symbol('RETURN'), $symbol_280 = $symbol('YIELD'), $symbol_281 = $symbol('SUPER'), $symbol_282 = $symbol('SELF'), $symbol_283 = $symbol('NIL'), $symbol_284 = $symbol('TRUE'), $symbol_285 = $symbol('FALSE'), $symbol_286 = $symbol('AND'), $symbol_287 = $symbol('OR'), $symbol_288 = $symbol('NOT'), $symbol_289 = $symbol('IF_MOD'), $symbol_290 = $symbol('UNLESS_MOD'), $symbol_291 = $symbol('WHILE_MOD'), $symbol_292 = $symbol('UNTIL_MOD'), $symbol_293 = $symbol('RESCUE_MOD'), $symbol_294 = $symbol('ALIAS'), $symbol_295 = $symbol('DEFINED'), $symbol_296 = $symbol('klBEGIN'), $symbol_297 = $symbol('klEND'), $symbol_298 = $symbol('LINE'), $symbol_299 = $symbol('FILE'), $symbol_300 = $symbol('IDENTIFIER'), $symbol_301 = $symbol('FID'), $symbol_302 = $symbol('GVAR'), $symbol_303 = $symbol('IVAR'), $symbol_304 = $symbol('CONSTANT'), $symbol_305 = $symbol('CVAR'), $symbol_306 = $symbol('NTH_REF'), $symbol_307 = $symbol('BACK_REF'), $symbol_308 = $symbol('STRING_CONTENT'), $symbol_309 = $symbol('INTEGER'), $symbol_310 = $symbol('FLOAT'), $symbol_311 = $symbol('REGEXP_END'), $symbol_312 = $symbol('OP_ASGN'), $symbol_313 = $symbol('PAREN_BEG'), $symbol_314 = $symbol('tLPAREN_ARG'), $symbol_315 = $symbol('ARRAY_BEG'), $symbol_316 = $symbol('tLBRACE'), $symbol_317 = $symbol('tLBRACE_ARG'), $symbol_318 = $symbol('SPLAT'), $symbol_319 = $symbol('BACK_REF2'), $symbol_320 = $symbol('SYMBOL_BEG'), $symbol_321 = $symbol('STRING_BEG'), $symbol_322 = $symbol('XSTRING_BEG'), $symbol_323 = $symbol('REGEXP_BEG'), $symbol_324 = $symbol('WORDS_BEG'), $symbol_325 = $symbol('AWORDS_BEG'), $symbol_326 = $symbol('STRING_DBEG'), $symbol_327 = $symbol('STRING_DVAR'), $symbol_328 = $symbol('STRING_END'), $symbol_329 = $symbol('STRING'), $symbol_330 = $symbol('SYMBOL'), $symbol_331 = $symbol('SPACE'), $symbol_332 = $symbol('LABEL'), $symbol_333 = $symbol('LOWEST'), $symbol_334 = $symbol('value'), $symbol_335 = $symbol('line');$rb.mm(['require', 'new', 'each', 'split', 'empty?', '[]=', 'to_i', '+', '[]', '<<', 'cmdarg_push', 'cmdarg_pop', 'line', 'block=', 'cond_push', 'cond_pop', 'concat', 'cond_lexpop', 'cmdarg_lexpop', 'raise']);return $$();
 });opal.register('racc/parser.rb', function($rb, self, __FILE__) { function $$(){



















return $class(self, nil, 'Racc', function(self) { 

  return $class(self, nil, 'Parser', function(self) {

    $defn(self, '_racc_setup', function(self) {
      return $cg(self, 'Racc_arg');
    }, 0);

    $defn(self, 'do_parse', function(self) {var __a, __b;
      return self.$m.$_racc_do_parse_rb(self, self.$m.$_racc_setup(self), Qfalse);
    }, 0);

    return $defn(self, '_racc_do_parse_rb', function(self, arg, in_debug) {var action_table, __a, action_check, action_default, action_pointer, goto_table, goto_check, goto_default, goto_pointer, nt_base, reduce_table, token_table, shift_n, reduce_n, use_result, racc_state, racc_tstack, racc_vstack, racc_t, racc_tok, racc_val, racc_read_next, racc_user_yyerror, racc_error_status, token, act, i, nerr, custate, __b, __c, __d, __e, curstate, reduce_i, reduce_len, reduce_to, method_id, tmp_v, reduce_call_result, k1;
      action_table = arg.$m['[]'](arg, 0);
      action_check = arg.$m['[]'](arg, 1);
      action_default = arg.$m['[]'](arg, 2);
      action_pointer = arg.$m['[]'](arg, 3);

      goto_table = arg.$m['[]'](arg, 4);
      goto_check = arg.$m['[]'](arg, 5);
      goto_default = arg.$m['[]'](arg, 6);
      goto_pointer = arg.$m['[]'](arg, 7);

      nt_base = arg.$m['[]'](arg, 8);
      reduce_table = arg.$m['[]'](arg, 9);
      token_table = arg.$m['[]'](arg, 10);
      shift_n = arg.$m['[]'](arg, 11);
      reduce_n = arg.$m['[]'](arg, 12);

      use_result = arg.$m['[]'](arg, 13);


      racc_state = [0];
      racc_tstack = [];
      racc_vstack = [];

      racc_t = nil;
      racc_tok = nil;
      racc_val = nil;
      racc_read_next = Qtrue;

      racc_user_yyerror = Qfalse;
      racc_error_status = 0;

      token = nil;      act = nil;      i = nil;      nerr = nil;      custate = nil;

      __a = false; while (__a || (Qtrue).$r) {__a = false;
      i = action_pointer.$m['[]'](action_pointer, racc_state.$m['[]'](racc_state, -1));

      if (i.$r) {
        if (racc_read_next.$r) {
          if (racc_t.$m['!='](racc_t, 0).$r) {
            token = self.$m.$next_token(self);

            racc_tok = token.$m['[]'](token, 0);
            racc_val = token.$m['[]'](token, 1);

            if (racc_tok.$m['=='](racc_tok, Qfalse).$r) {
              racc_t = 0;
            } else {
              racc_t = token_table.$m['[]'](token_table, racc_tok);
              if(!(racc_t).$r) {racc_t = 1};

            }

            racc_read_next = Qfalse;
          }
        }

        i = i.$m['+'](i, racc_t);

        if (((__b = ((__c = (i.$m['<'](i, 0))).$r ? __c : (__d = (act = action_table.$m['[]'](action_table, i))).$m['nil?'](__d))).$r ? __b : ((__c = action_check.$m['[]'](action_check, i)).$m['!='](__c, racc_state.$m['[]'](racc_state, -1)))).$r) {
          act = action_default.$m['[]'](action_default, racc_state.$m['[]'](racc_state, -1));
        }

      } else {
        act = action_default.$m['[]'](action_default, racc_state.$m['[]'](racc_state, -1));
      }

      if (((__b = act.$m['>'](act, 0)).$r ? act.$m['<'](act, shift_n) : __b).$r) {
        if (racc_error_status.$m['>'](racc_error_status, 0).$r) {
          if (racc_t.$m['!='](racc_t, 1).$r) {
            racc_error_status = racc_error_status.$m['-'](racc_error_status, 1);
          }
        }

        racc_vstack.$m.push(racc_vstack, racc_val);
        curstate = act;
        racc_state.$m['<<'](racc_state, act);
        racc_read_next = Qtrue;

      } else if (((__b = act.$m['<'](act, 0)).$r ? act.$m['>'](act, reduce_n.$m['-@'](reduce_n)) : __b).$r) {
        reduce_i = act.$m['*'](act, -3);
        reduce_len = reduce_table.$m['[]'](reduce_table, reduce_i);
        reduce_to = reduce_table.$m['[]'](reduce_table, reduce_i.$m['+'](reduce_i, 1));
        method_id = reduce_table.$m['[]'](reduce_table, reduce_i.$m['+'](reduce_i, 2));

        tmp_v = racc_vstack.$m.last(racc_vstack, reduce_len);

        racc_state.$m.pop(racc_state, reduce_len);
        racc_vstack.$m.pop(racc_vstack, reduce_len);
        racc_tstack.$m.pop(racc_tstack, reduce_len);

        if (use_result.$r) {
          reduce_call_result = self.$m.__send__(self, method_id, tmp_v, nil, tmp_v.$m['[]'](tmp_v, 0));
          racc_vstack.$m.push(racc_vstack, reduce_call_result);
        } else {
          self.$m.$raise(self, "not using result??");
        }

        racc_tstack.$m.push(racc_tstack, reduce_to);

        k1 = reduce_to.$m['-'](reduce_to, nt_base);

        if ((__b = (reduce_i = goto_pointer.$m['[]'](goto_pointer, k1))).$m['!='](__b, nil).$r) {
          reduce_i = reduce_i.$m['+'](reduce_i, racc_state.$m['[]'](racc_state, -1));

          if (((__b = ((__c = (reduce_i.$m['>='](reduce_i, 0))).$r ? ((__d = (curstate = goto_table.$m['[]'](goto_table, reduce_i))).$m['!='](__d, nil)) : __c)).$r ? ((__c = goto_check.$m['[]'](goto_check, reduce_i)).$m['=='](__c, k1)) : __b).$r) {
            racc_state.$m.push(racc_state, curstate);
          } else {
            racc_state.$m.push(racc_state, goto_default.$m['[]'](goto_default, k1));
          }

        } else {
          racc_state.$m.push(racc_state, goto_default.$m['[]'](goto_default, k1));
        }

      } else if (act.$m['=='](act, shift_n).$r) {

        return racc_vstack.$m['[]'](racc_vstack, 0);

      } else if (act.$m['=='](act, reduce_n.$m['-@'](reduce_n)).$r) {

        self.$m.$raise(self, ("Opal Syntax Error: unexpected '" + (__c = racc_tok.$m.inspect(racc_tok)).$m.to_s(__c) + "'"));

      } else {
        self.$m.$raise(self, ("Rac: unknown action: " + (__c = act).$m.to_s(__c)));
      }


      };
    }, 2);
    }, 0);
}, 2);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;$rb.mm(['_racc_do_parse_rb', '_racc_setup', '[]', '!=', 'next_token', '==', '+', '<', 'nil?', '>', '-', 'push', '<<', '-@', '*', 'last', 'pop', '__send__', 'raise', '>=', 'to_s', 'inspect']);return $$();
 });
opal.register('strscan.rb', function($rb, self, __FILE__) { function $$(){return $class(self, nil, 'StringScanner', function(self) {

  $defn(self, 'initialize', function(self, str) {
    self._str = str;
     self._at = 0;
     self._matched = "";
     self._working_string = str;
    return nil;
  }, 1);

  $defn(self, 'scan', function(self, reg) {
    reg = new RegExp('^' + reg.toString().substr(1, reg.toString().length - 2));
    var res = reg.exec(self._working_string);

    if (res == null) {
      self.matched = "";
      return Qfalse;
    }
    else if (typeof res == 'object') {
      self._at += res[0].length;
      self._working_string = self._working_string.substr(res[0].length);
      self._matched = res[0];
      return res[0];
    }
    else if (typeof res == 'string') {
      self._at += res.length;
      self._working_string = self._working_string.substr(res.length);
      return res;
    }
    else {
      return Qfalse;
    }
  }, 1);

  $defn(self, 'check', function(self, reg) {
    reg = new RegExp('^' + reg.toString().substr(1, reg.toString().length - 2));
    return reg.exec(self._working_string) ? Qtrue : Qfalse;
  }, 1);

  $defn(self, 'peek', function(self, len) {
    return self._working_string.substr(0, len);
  }, 1);

  $defn(self, 'eos?', function(self) {
    return self._working_string.length == 0 ? Qtrue : Qfalse;
  }, 0);

  return $defn(self, 'matched', function(self) {
    return self._matched;
  }, 0);
}, 0);
}
var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G;return $$();
 });
opal.register('dev.rb', function($rb, self, __FILE__) { function $$(){self.$m.$require(self, 'opal/ruby/parser');

$class(self, nil, 'Opal', function(self) { 

  $defs(self, 'compile', function(self, source) {var res, __a, __b, __c;
    res = (__a = (__b = (__c = $cg($cg(self, 'Opal'), 'RubyParser')).$m['new'](__c, source)).$m['parse!'](__b)).$m.generate_top(__a, $hash($symbol_1, Qtrue));
    return res;
  }, 1);

  $defs(self, 'run_ruby_content', function(self, source, filename) {var js, __a;if (filename == undefined) {filename = "(opal)";}
    js = self.$m.$compile(self, source);
    var exec = new Function('$rb', 'self', '__FILE__', js);
    return exec($rb, $rb.top, filename);
  }, -2);






  $defs(self, 'run_remote_content', function(self, filename) {var __a, __b;
    var xhr;

    if (window.ActiveXObject)
      xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
    else
      xhr = new XMLHttpRequest();

    xhr.open('GET', filename, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 0 || xhr.status == 200) {
          self.$m.$run_ruby_content(self, xhr.responseText, filename);
        } else {
          self.$m.$raise(self, ("LoadError: Cannot load: " + (__b = filename).$m.to_s(__b)));
        }
      }
    };
    xhr.send(null);
    return nil;
  }, 1);

  return $defs(self, 'run_script_tags', function(self) {var __a;
    var scripts = document.getElementsByTagName('script');

    for (var i = 0, ii = scripts.length; i < ii; i++) {
      var script = scripts[i];

      if (script.type == "text/ruby") {
        if (script.src) {
          self.$m.$run_remote_content(self, script.src);
        } else {
          self.$m.$run_ruby_content(self, script.innerHTML, "(script-tag)");
        }
      }
    }

    return nil;
  }, 0);
}, 2);

opal.compile = function(source, options) {
  console.log("need to compile some code");
  return (__a = $cg(self, 'Opal')).$m.compile(__a, source);
};

if (typeof window !== 'undefined') {
  var runner = function() { (__a = $cg(self, 'Opal')).$m.run_script_tags(__a); };

  if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', runner, false);
  } else {
    window.attachEvent('onload', runner);
  }
}

var repl_running = false;

opal.browser_repl = function() {
  if (repl_running) return;
  repl_running = true;

  var html = '<div id="opal-repl" style="position: fixed; width: 100%; height: '
           +     '230px; bottom: 0px; overflow: scroll; border-top: 4px solid'
           +     '#A5A5A5; left: 0px; padding: 4px; background-color: #E5E5E5;">'

           +   '<div id="opal-stdout" style="font-family: \'Bitstream Vera Sans'
           +       'Mono\', \'Courier\', monospace; font-size: 12px"></div>'

           +   '<span style="float: left; display: block; font-family: \'Bitst'
           +       'ream Vera Sans Mono\', \'Courier\', monospace; font-size: '
           +       '12px">&gt;&gt;&nbsp;</span>'

           +   '<input id="opal-stdin" type="text" style="position: relative;'
           +       'float: left; right: 0px; width: 500px; font-family: \'Bit'
           +       'stream Vera Sans Mono\', \'Courier\', monospace;'
           +       'font-size: 12px; outline-width: 0; outline: none; border:'
           +       '0px; padding: 0px; margin: 0px; background: none" />'

           + '</div>';

  var host = document.createElement('div');
  host.innerHTML = html;
  document.body.appendChild(host);
  var opal_repl = document.getElementById('opal-repl');

  var stdout = document.getElementById('opal-stdout');
  var stdin = document.getElementById('opal-stdin');
  var history = [], history_idx = 0;
  setTimeout(function() { stdin.focus(); }, 0);

  var puts_content = function(str) {
    var elem = document.createElement('div');
    elem.textContent == null ? elem.innerText = str : elem.textContent = str;
    stdout.appendChild(elem);
  };

  var stdin_keydown = function(evt) {
    if (evt.keyCode == 13) {
      var ruby = stdin.value;

      history.push(stdin.value);
      history_idx = history.length;
      stdin.value = '';
      puts_content(">> " + ruby);

      try {
        puts_content("=> " + (__a = (__b = $cg(self, 'Opal')).$m.run_ruby_content(__b, ruby, '(irb)')).$m.inspect(__a).toString());
      }
      catch (err) {
        // if (err.stack) puts_content(err.stack);
        //else puts_content("=> " + err.message);
        puts_content("=> " + err.$klass.__classid__ + ": " + err['@message']);
      }

      opal_repl.scrollTop = opal_repl.scrollHeight;
    }
    else if (evt.keyCode == 38) {
      if (history_idx > 0) {
        history_idx -= 1;
        stdin.value = history[history_idx];
      }
    }
    else if (evt.keyCode == 40) {
      if (history_idx < history.length - 1) {
        history_idx += 1;
        stdin.value = history[history_idx];
      }
    }
  };

  if (stdin.addEventListener) {
    stdin.addEventListener('keydown', stdin_keydown, false);
  } else {
    stdin.attachEvent('onkeydown', stdin_keydown);
  }

  $defs($rb.gg('$stdout'), 'puts', function(self, a) {var __a;a = [].slice.call(arguments, 1);

  for (var i = 0, ii = a.length; i < ii; i ++) {
      puts_content((__a = a[i]).$m.to_s(__a).toString());
    }
  return nil;
}, -1);

  puts_content("opal REPL! Type command then <enter>.");
};
}
var __a, __b;var nil = $rb.Qnil, $ac = $rb.ac, $super = $rb.S, $break = $rb.B, $class = $rb.dc, $defn = $rb.dm, $defs = $rb.ds, $symbol = $rb.Y, $hash = $rb.H, $B = $rb.P, Qtrue = $rb.Qtrue, Qfalse = $rb.Qfalse, $cg = $rb.cg, $range = $rb.G, $symbol_1 = $symbol('debug');$rb.mm(['require', 'generate_top', 'parse!', 'new', 'compile', 'run_ruby_content', 'raise', 'to_s', 'run_remote_content', 'run_script_tags', 'inspect']);return $$();
 });
opal.require('dev');