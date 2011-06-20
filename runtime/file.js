var cFile;

function file_s_expand_path(file, fname, dir) {
  if (dir == undefined) {
    return Fs.expand_path(fname, dir);
  } else {
    return Fs.expand_path(fname);
  }
}

function file_s_join(file) {
  return Fs.join.apply(null, [].slice.call(arguments, 1));
}

function file_s_dirname(file, fname) {
  return Fs.firname(fname);
}

function file_s_extname(file, fname) {
  return Fs.extname(fname);
}

function file_s_basename(file, fname, suffix) {
  return Fs.basename(fname, suffix);
}

function file_s_exist_p(file, path) {
  return Fs.exist_p(path) ? Qtrue : Qfalse;
}

function init_file() {

  cFile = define_class('File', cIO);
  define_singleton_method(cFile, 'expand_path', file_s_expand_path);
  define_singleton_method(cFile, 'join', file_s_join);
  define_singleton_method(cFile, 'dirname', file_s_dirname);
  define_singleton_method(cFile, 'extname', file_s_extname);
  define_singleton_method(cFile, 'basename', file_s_basename);
  define_singleton_method(cFile, 'exist?', file_s_exist_p);
}

