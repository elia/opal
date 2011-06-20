var cIO, stdin, stdout, stderr;

function stdio_getter(id) {
  switch (id) {
    case "$stdout":
      return stdout;
    case "$stdin":
      return stdin;
    case "$stderr":
      return stderr;
    default:
      raise(eRuntimeError, "stdout_setter being used for bad variable");
  }
};

function stdio_setter(id, value) {
  raise(eException, "stdio_setter cannot currently set stdio variables");

  switch (id) {
    case "$stdout":
      return stdout = value;
    case "$stdin":
      return stdin = value;
    case "$stderr":
      return stderr = value;
    default:
      raise(eRuntimeError, "stdout_setter being used for bad variable: " + id);
  }
};

function init_io() {

  cIO = define_class('IO', cObject);
  stdin = obj_alloc(cIO);
  stdout = obj_alloc(cIO);
  stderr = obj_alloc(cIO);

  const_set(cObject, 'STDIN', stdin);
  const_set(cObject, 'STDOUT', stdout);
  const_set(cObject, 'STDERR', stderr);

  define_hooked_variable('$stdin', stdio_getter, stdio_setter);
  define_hooked_variable('$stdout', stdio_getter, stdio_setter);
  define_hooked_variable('$stderr', stdio_getter, stdio_setter);
}

