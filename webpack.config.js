const path = require('path');
const fs = require('fs');

class MergeMdPlugin {
  constructor(options) {
    this.src = options.src;       // папка с md
    this.output = options.output; // путь до файла назначения
    this.enabled = !!options.enabled; // без флага плагин ничего не делает
  }

  apply(compiler) {
    if (!this.enabled) return;

    compiler.hooks.emit.tapAsync('MergeMdPlugin', (compilation, callback) => {
      try {
        const files = fs.readdirSync(this.src)
            .filter(f => f.endsWith('.md'))
            .sort(); // если нужно строго по алфавиту

        const content = files
            .map(f => fs.readFileSync(path.join(this.src, f), 'utf-8'))
            .join('\n\n'); // разделитель между файлами

        // записываем в файл назначения
        fs.writeFileSync(path.join(this.src, this.output), content, 'utf-8');

        console.log(`Merged ${files.length} MD files into ${this.output}`);
      } catch (err) {
        console.error(err);
      }
      callback();
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
        src: path.join(__dirname, 'book'),
        output: 'ai.txt',
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
    entry: path.join(__dirname, `src/editor/${file}.js`),
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
    entry: path.join(__dirname, 'src/datatable/wex-datatable.js'),
    output: { path: dist, filename: 'wex-datatable.js' },
    plugins: [],
  };

  const datepicker = {
    ...bundle,
    entry: path.join(__dirname, 'src/datepicker/wex-datepicker.js'),
    output: { path: dist, filename: 'wex-datepicker.js' },
    plugins: [],
  };

  const select = {
    ...bundle,
    entry: path.join(__dirname, 'src/select/wex-select.js'),
    output: { path: dist, filename: 'wex-select.js' },
    plugins: [],
  };

  return [bundle, mini, doc, minify(doc), editor, minify(editor), datatable, minify(datatable), datepicker, minify(datepicker), select, minify(select)];
};