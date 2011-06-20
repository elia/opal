opal = {};

(function() {

// So we can minimize
var Op = opal;

/**
  All methods and properties available to ruby/js sources at runtime. These
  are kept in their own namespace to keep the opal namespace clean.
*/
Op.runtime = {};

// for minimizng
var Rt = Op.runtime;
Rt.opal = Op;

