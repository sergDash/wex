const path = require('path');
const fs = require('fs');

class MergeMdPlugin {
  constructor(options = {}) {
    this.src = options.src;
    this.output = options.output;
    this.enabled = !!options.enabled;
  }

  apply(compiler) {
    if (!this.enabled) return;

    compiler.hooks.emit.tapAsync('MergeMdPlugin', (compilation, callback) => {
      try {
        const files = fs.readdirSync(this.src)
            .filter(file => file.endsWith('.md'))
            .sort();

        const content = files
            .map(file => fs.readFileSync(
                path.join(this.src, file),
                'utf-8'
            ))
            .join('\n\n');

        // Создаём директорию назначения, если её нет
        fs.mkdirSync(path.dirname(this.output), {
          recursive: true
        });

        // Записываем результат непосредственно в output
        fs.writeFileSync(this.output, content, 'utf-8');

        console.log(
            `Merged ${files.length} MD files into ${this.output}`
        );

        callback();
      } catch (err) {
        callback(err);
      }
    });
  }
}


// npm run build        — только код (доку не трогаем)
// npm run build:docs   — код + сборка доки (webpack --env.docs)
module.exports = (env = {}) => {
  const docs = !!env.docs;
  const dist = path.join(__dirname, 'dist');

  // ---------- ядро ----------

  const bundle = {
    mode: 'none',
    entry: path.join(__dirname, 'src/index.js'),
    output: {
      path: dist,
      filename: 'wex.js',
      library: 'jqvm',
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-spread',
              '@babel/plugin-transform-parameters',
            ],
          },
        },
      ],
    },
    plugins: [
      new MergeMdPlugin({
        src: path.join(__dirname, 'education/Книга'),
        output: path.join(__dirname, 'education/') + 'AI.txt',
        enabled: docs,
      }),
    ],
    externals: {
      jquery: {
        root: 'jQuery',
        commonjs: 'jquery',
        commonjs2: 'jquery',
        amd: 'jquery',
      },
    },
    optimization: {
      minimize: false,
      usedExports: true,
      sideEffects: true,
    },
  };

  const mini = {
    ...bundle,
    mode: 'production',
    output: {
      ...bundle.output,
      filename: 'wex.min.js',
    },
    plugins: [], // дока собирается один раз, в основном бандле
    optimization: {
      minimize: true,
      usedExports: true,
      sideEffects: true,
    },
    devtool: 'source-map',
  };

  // ---------- плагины (отдельные файлы, ядро и wex-doc берутся из глобалов) ----------

  const core = { root: 'jqvm', commonjs: 'jqvm', commonjs2: 'jqvm', amd: 'jqvm' };
  const docLib = { root: 'WexDoc', commonjs: 'WexDoc', commonjs2: 'WexDoc', amd: 'WexDoc' };

  const plugin = (file, library, externals) => ({
    ...bundle,
    entry: path.join(__dirname, `src/plugins/editor/${file}.js`),
    output: { path: dist, filename: `${file}.js`, library, libraryTarget: 'umd' },
    plugins: [],
    externals,
  });

  const minify = c => ({
    ...c,
    mode: 'production',
    devtool: 'source-map',
    output: { ...c.output, filename: c.output.filename.replace('.js', '.min.js') },
    optimization: { minimize: true, usedExports: true, sideEffects: true },
  });

  const doc = plugin('wex-doc', 'WexDoc', { '../wex.js': core });
  const editor = plugin('wex-editor', 'WexEditor', { '../wex.js': core, './wex-doc.js': docLib });

  // DataTable: самодостаточный скрипт, сам вешает createDataTable на window,
  // поэтому без library/externals (в отличие от doc и editor)
  const datatable = {
    ...bundle,
    entry: path.join(__dirname, 'src/plugins/datatable/wex-datatable.js'),
    output: { path: dist, filename: 'wex-datatable.js' },
    plugins: [],
  };

  const datepicker = {
    ...bundle,
    entry: path.join(__dirname, 'src/plugins/datepicker/wex-datepicker.js'),
    output: { path: dist, filename: 'wex-datepicker.js' },
    plugins: [],
  };

  const select = {
    ...bundle,
    entry: path.join(__dirname, 'src/plugins/smart-select/wex-smart-select.js'),
    output: { path: dist, filename: 'wex-smart-select.js' },
    plugins: [],
  };

  const gallery = {
    ...bundle,
    entry: path.join(__dirname, 'src/plugins/carousel/wex-carousel.js'),
    output: { path: dist, filename: 'wex-carousel.js' },
    plugins: [],
  };

  const dropzone = {
    ...bundle,
    entry: path.join(__dirname, 'src/plugins/dropzone/wex-dropzone.js'),
    output: { path: dist, filename: 'wex-dropzone.js' },
    plugins: [],
  };

  const imageEditor = {
    ...bundle,
    entry: path.join(__dirname, 'src/plugins/image-editor/wex-image-editor.js'),
    output: { path: dist, filename: 'wex-image-editor.js' },
    plugins: [],
  };

  return [bundle, mini, doc, minify(doc), editor, minify(editor), datatable,
    minify(datatable), datepicker, minify(datepicker), select, minify(select),
    gallery, minify(gallery), dropzone, minify(dropzone), imageEditor,
    minify(imageEditor)
  ];
};