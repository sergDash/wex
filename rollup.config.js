const path = require('path');
const fs = require('fs');

function mergeMdPlugin(options = {}) {
    const { src, output, enabled } = options;
    if (!enabled) return null;

    return {
        name: 'merge-md-plugin',
        buildStart() {
            try {
                const files = fs.readdirSync(src)
                    .filter(file => file.endsWith('.md'))
                    .sort();

                const content = files
                    .map(file => fs.readFileSync(path.join(src, file), 'utf-8'))
                    .join('\n\n');

                fs.mkdirSync(path.dirname(output), { recursive: true });
                fs.writeFileSync(output, content, 'utf-8');

                console.log(`Merged ${files.length} MD files into ${output}`);
            } catch (err) {
                this.error(err);
            }
        }
    };
}

module.exports = (env = {}) => {
    const docs = !!env.docs;
    const dist = path.join(__dirname, 'dist');

    // Базовые настройки для Oxc/Rolldown транспиляции
    const esbuildOptions = {
        target: 'es5', // если нужна поддержка старых браузеров как у babel preset-env
    };

    const createConfig = ({ entry, filename, library, externals = {}, minimize = false, plugins = [] }) => ({
        input: path.join(__dirname, entry),
        output: {
            dir: dist,
            filename: minimize ? filename.replace('.js', '.min.js') : filename,
            library: library ? { name: library, type: 'umd', export: 'default' } : undefined,
            // В Rolldown UMD настраивается через output.library
        },
        external: Object.keys(externals),
        plugins: [
            ...plugins,
        ],
        // Встроенный минификатор Oxc работает из коробки
        minify: minimize,
        // Поддержка ESNext / транспиляции синтаксиса через Oxc
        transform: {
            oxc: true,
        }
    });

    const coreExternals = { jquery: 'jQuery' };
    const docLib = { 'WexDoc': 'WexDoc' };

    // ---------- Ядро (wex.js / wex.min.js) ----------
    const coreBundle = createConfig({
        entry: 'src/index.js',
        filename: 'wex.js',
        library: 'jqvm',
        externals: coreExternals,
        plugins: [
            mergeMdPlugin({
                src: path.join(__dirname, 'education/Книга'),
                output: path.join(__dirname, 'education/AI.txt'),
                enabled: docs,
            })
        ]
    });

    const coreMin = createConfig({
        entry: 'src/index.js',
        filename: 'wex.js',
        library: 'jqvm',
        externals: coreExternals,
        minimize: true,
    });

    // Вспомогательная функция для плагинов (генерирует обычную и min-версии)
    const createPluginConfigs = (name, library, externals = {}) => {
        const entry = `src/plugins/${name}`;
        return [
            createConfig({ entry: `${entry}/${name}.js`, filename: `${name}.js`, library, externals }),
            createConfig({ entry: `${entry}/${name}.js`, filename: `${name}.js`, library, externals, minimize: true })
        ];
    };

    // ---------- Плагины ----------
    const docConfigs = createPluginConfigs('editor/wex-doc', 'WexDoc', { '../wex.js': 'jqvm' });
    const editorConfigs = createPluginConfigs('editor/wex-editor', 'WexEditor', { '../wex.js': 'jqvm', './wex-doc.js': 'WexDoc' });

    // Самодостаточные плагины (без внешних либ)
    const datatable = createPluginConfigs('datatable/wex-datatable');
    const datepicker = createPluginConfigs('datepicker/wex-datepicker');
    const select = createPluginConfigs('smart-select/wex-smart-select');
    const gallery = createPluginConfigs('carousel/wex-carousel');
    const dropzone = createPluginConfigs('dropzone/wex-dropzone');
    const imageEditor = createPluginConfigs('image-editor/wex-image-editor');
    const draggable = createPluginConfigs('draggable/wex-draggable');

    return [
        coreBundle, coreMin,
        ...docConfigs,
        ...editorConfigs,
        ...datatable,
        ...datepicker,
        ...select,
        ...gallery,
        ...dropzone,
        ...imageEditor,
        ...draggable,
    ];
};