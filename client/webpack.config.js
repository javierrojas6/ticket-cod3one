/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const htmlWebpackPlugin = require('html-webpack-plugin');
// const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {dependencies, version} = require('./package.json');

const BUILD_DIR = path.join(__dirname, 'build');
const APP_DIR = path.join(__dirname, 'src');

const DEFAULT_CLIENT_ROOT = 'http://localhost:3000';
const DEFAULT_DEV_PROXY_TARGET = 'http://opensupports-srv:80';
const ASSET_FILENAME = 'assets/[name][ext][query]';

const parseDotEnv = filePath => {
    if (!fs.existsSync(filePath)) return {};

    return fs.readFileSync(filePath, 'utf8').split(/\r?\n/).reduce((result, line) => {
        const trimmedLine = line.trim();

        if (!trimmedLine || trimmedLine.startsWith('#')) {
            return result;
        }

        const separatorIndex = trimmedLine.indexOf('=');
        if (separatorIndex === -1) {
            return result;
        }

        const key = trimmedLine.slice(0, separatorIndex).trim();
        let value = trimmedLine.slice(separatorIndex + 1).trim();

        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        result[key] = value;
        return result;
    }, {});
};

const parseBoolean = (value, defaultValue) => {
    if (value === undefined || value === null || value === '') {
        return defaultValue;
    }

    return !['0', 'false', 'no', 'off'].includes(String(value).toLowerCase());
};

const parsePort = (value, defaultValue) => {
    const parsedValue = parseInt(value, 10);
    return Number.isNaN(parsedValue) ? defaultValue : parsedValue;
};

const normalizeBasePath = value => {
    if (!value || value === '/') {
        return '';
    }

    return `/${String(value).replace(/^\/+|\/+$/g, '')}`;
};

const removeTrailingSlash = value => value.replace(/\/+$/, '');

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getFrontendEnvironment = webpackEnv => {
    const fileEnv = parseDotEnv(path.join(__dirname, '.env'));
    const cliEnv = webpackEnv && typeof webpackEnv === 'object' ? webpackEnv : {};
    const mergedEnv = {...fileEnv, ...process.env, ...cliEnv};
    const isProduction = process.env.NODE_ENV === 'production';
    const globalIndexPath = normalizeBasePath(mergedEnv.OS_GLOBAL_INDEX_PATH || '');
    const devServerPort = parsePort(mergedEnv.OS_DEV_SERVER_PORT, isProduction ? 3000 : 3002);
    const defaultClientRootBase = isProduction
        ? DEFAULT_CLIENT_ROOT
        : DEFAULT_CLIENT_ROOT.replace(/:\d+$/, `:${devServerPort}`);
    const defaultClientRoot = `${defaultClientRootBase}${globalIndexPath}`;
    const clientRoot = removeTrailingSlash(mergedEnv.OS_CLIENT_ROOT || defaultClientRoot);
    const devProxyTarget = Object.prototype.hasOwnProperty.call(mergedEnv, 'OS_DEV_PROXY_TARGET')
        ? (mergedEnv.OS_DEV_PROXY_TARGET || '').trim() || null
        : DEFAULT_DEV_PROXY_TARGET;

    return {
        clientRoot,
        apiRoot: mergedEnv.OS_API_ROOT || `${clientRoot}/api`,
        globalIndexPath,
        showLogs: parseBoolean(mergedEnv.OS_SHOW_LOGS, true),
        devServerHost: mergedEnv.OS_DEV_SERVER_HOST || '0.0.0.0',
        devServerPort,
        devProxyTarget,
    };
};

const buildRuntimeConfig = frontendEnv => {
    return [
        `opensupports_version = ${JSON.stringify(version)};`,
        `root = ${JSON.stringify(frontendEnv.clientRoot)};`,
        `apiRoot = ${JSON.stringify(frontendEnv.apiRoot)};`,
        `globalIndexPath = ${JSON.stringify(frontendEnv.globalIndexPath)};`,
        `showLogs = ${frontendEnv.showLogs};`,
        '',
    ].join('\n');
};

const config = env => {
    const frontendEnv = getFrontendEnvironment(env);
    const isProduction = process.env.NODE_ENV === 'production';
    const shouldAnalyze = parseBoolean(process.env.ANALYZE, false);
    const publicPath = frontendEnv.globalIndexPath ? `${frontendEnv.globalIndexPath}/` : '/';
    const apiContexts = frontendEnv.globalIndexPath
        ? ['/api', `${frontendEnv.globalIndexPath}/api`]
        : ['/api'];
    const globalApiPrefixPattern = frontendEnv.globalIndexPath
        ? new RegExp(`^${escapeRegExp(frontendEnv.globalIndexPath)}/api`)
        : null;

    return {
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? false : 'source-map',
        entry: {
          bundle: APP_DIR + '/index.js',
        },
        output: {
            path: BUILD_DIR,
            filename: '[name].js',
            publicPath,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                cacheDirectory: true,
                                cacheCompression: false,
                            },
                        } /*, 'eslint-loader'*/,
                    ],
                  },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    silenceDeprecations: [
                                        'import',
                                        'global-builtin',
                                        'color-functions',
                                        'slash-div',
                                    ],
                                },
                            },
                        },
                        'webpack-import-glob',
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg|eot|woff|woff2|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    type: 'asset/resource',
                    generator: {
                        filename: ASSET_FILENAME,
                    },
                },
            ],
        },
        devServer: {
            static: {
                directory: BUILD_DIR,
                publicPath,
            },
            host: frontendEnv.devServerHost,
            compress: true,
            port: frontendEnv.devServerPort,
            allowedHosts: 'all',
            open: publicPath,
            hot: true,
            historyApiFallback: {
                index: publicPath,
                rewrites: frontendEnv.globalIndexPath ? [
                    {
                        from: /^\/$/,
                        to: publicPath,
                    },
                    {
                        from: new RegExp(`^${escapeRegExp(frontendEnv.globalIndexPath)}(?:/.*)?$`),
                        to: publicPath,
                    },
                ] : undefined,
            },
            proxy: frontendEnv.devProxyTarget ? [
                {
                    context: apiContexts,
                    target: frontendEnv.devProxyTarget,
                    pathRewrite: path => {
                        const pathWithoutGlobalPrefix = globalApiPrefixPattern
                            ? path.replace(globalApiPrefixPattern, '')
                            : path;

                        return pathWithoutGlobalPrefix.replace(/^\/api/, '');
                    },
                    secure: false,
                    changeOrigin: true,
                },
            ] : undefined,
        },
        plugins: [
            new htmlWebpackPlugin({
                template: APP_DIR + '/index.html'
            }),
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/,
            }),
            new webpack.DefinePlugin({
                'process.env.FIXTURES': env && env.FIXTURES,
            }),
            // new StyleLintPlugin({
            //     files: './src/**/*.scss',
            //     configPath: '.stylelintrc',
            //     syntax: 'scss'
            // }),
            new CopyPlugin({
                patterns: [
                    {from: './src/.htaccess'},
                    {
                        from: './src/config.js',
                        to: 'config.js',
                        transform: () => Buffer.from(buildRuntimeConfig(frontendEnv)),
                    },
                    {from: './src/assets/images', to: 'images'},
                ],
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: shouldAnalyze ? 'server' : 'disabled'
            }),
        ],
        resolve: {
            modules: ['./src', './node_modules'],
            fallback: {
                fs: false,
            },
        },
    };
};

module.exports = config;
