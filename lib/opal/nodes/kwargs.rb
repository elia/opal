require 'opal/nodes/base'

module Opal
  module Nodes
    # FIXME: needs rewrite
    class KWArgsNode < Base
      handle :kwargs

      def compile
        raise inspect
      end
    end
  end
end
