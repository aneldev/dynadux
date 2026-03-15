const autoprefixer = require('autoprefixer');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },

      {
        // TypeScript loader
        test: /\.(tsx|ts)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: false,         // Ensure this is set to false or omitted to enable type checking
              configFile: 'tsconfig.json',  // Note: This is removed in Storybook! Code point: 20240906173131
            }
          },
        ]
      },

      {
        // CSS loader
        // Note: This loader is removed in Storybook! Code point: 20240906173110
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          "css-loader",
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    overrideBrowserslist: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
          },
        ],
      },

      {
        // Rule for LESS modules
        test: /\.less$/,
        exclude: [
          /node_modules/,
          /^((?!\.module).)*\.less$/,
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,  // Enable CSS Modules for .module.less files
            },
          },
          {
            loader: 'typed-css-modules-loader',
            options: {
              camelCase: true,    // Convert hyphenated class names to camelCase
              namedExports: true, // Export individual class names
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    overrideBrowserslist: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
          },
          'less-loader',
        ],
      },
      {
        // Rule for regular LESS (non-modular)
        test: /\.less$/,
        exclude: [
          /node_modules/,
          /\.module\.less$/,
        ],
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    overrideBrowserslist: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
          },
          'less-loader',
        ],
      },

      {
        // Rule for SCSS modules
        test: /\.scss$/,
        exclude: [
          /node_modules/,
          /^((?!\.module).)*\.scss$/,
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,  // Enable CSS Modules for .module.scss files
            },
          },
          {
            loader: 'typed-css-modules-loader',
            options: {
              camelCase: true,    // Convert hyphenated class names to camelCase
              namedExports: true, // Export individual class names
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    overrideBrowserslist: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        // Rule for regular SCSS (non-modular)
        test: /\.scss$/,
        exclude: [
          /node_modules/,
          /\.module\.scss$/,
        ],
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    overrideBrowserslist: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
          },
          'sass-loader',
        ],
      },

      {
        // inline images load (loads the url() defined in the css)
        // help: https://christianalfoni.github.io/react-webpack-cookbook/Inlining-images.html
        test: /\.(png|jpg|gif)$/,
        exclude: /node_modules/,
        loader: "url-loader",
        options: {
          limit: 100000
        },
      },

      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          limit: 50000,
          mimetype: 'application/font-woff',
          outputPath: '/static/',
        },
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          limit: 50000,
          outputPath: '/static/',
        },
      },

      // Alternative way to load fonts, always as links
      // {
      //   test: /\.(ttf|eot|woff|woff2)$/,
      //   loader: 'file-loader',
      //   options: {
      //     publicPath: '/static/',
      //   },
      // },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: 'svg-inline-loader',
      },
    ],
  },
};
