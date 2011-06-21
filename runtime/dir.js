function dir_s_getwd(dir) {
  return Fs.cwd;
}

function dir_s_aref(dir) {
  return Fs.glob.apply(Fs, [].slice.call(arguments, 1));
}

function init_dir() {
  cDir = define_class('Dir', cObject);
  define_singleton_method(cDir, 'getwd', dir_s_getwd);
  define_singleton_method(cDir, 'pwd', dir_s_getwd);
  define_singleton_method(cDir, '[]', dir_s_aref);
}

