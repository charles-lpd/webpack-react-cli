// 引入path 解决路径
const path = require('path')
// 引入eslint插件
const EslintWebpackPlugin = require('eslint-webpack-plugin')
// 引入 html 插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 提取 CSS 为单独文件
const MinniCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩Css
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
// 压缩js
const TerserWebpackPlugin = require('terser-webpack-plugin')
// 压缩 图片
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
// 复制静态文件
const CopyPlugin = require('copy-webpack-plugin')
// 开启热更新
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
console.log(process.env.NODE_ENV)
// 判断是否是生产模式
const isProd = process.env.NODE_ENV === 'production'
const getStyleLoaders = (loader) => {
  return [
    isProd ? MinniCssExtractPlugin.loader : 'style-loader',
    'css-loader',
    {
      // 处理css兼容性问题
      // 配合 package.json 中browserslist 来指定兼容性
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['postcss-preset-env'],
        },
      },
    },
    loader && {
      loader: loader,
      options:
        loader === 'less-loader'
          ? {
              // antd 主题配置
              // https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
              lessOptions: {
                modifyVars: { '@primary-color': '#1DA57A' },
                javascriptEnabled: true,
              },
            }
          : {},
    },
  ].filter(Boolean)
}

module.exports = {
  entry: './src/main.tsx',
  output: {
    path: isProd ? path.resolve(__dirname, '../dist') : undefined,
    // 入口文件名
    filename: isProd
      ? 'static/js/[name].[contenthash:10].js'
      : 'static/js/[name].js',
    // chunk 文件路径
    chunkFilename: isProd
      ? 'static/js/[name].[contenthash:10].chunk.js'
      : 'static/js/[name].chunk.js',
    // asset 处理文件路径
    assetModuleFilename: 'static/media/[hash:10][ext][query]',
    // 清除上次 dist文件
    clean: isProd,
  },
  module: {
    rules: [
      // 处理css
      {
        test: /\.css$/,
        use: getStyleLoaders(),
      },
      {
        test: /\.less$/,
        use: getStyleLoaders('less-loader'),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoaders('sass-loader'),
      },
      {
        test: /\.styl$/,
        use: getStyleLoaders('stylus-loader'),
      },
      // 处理图片
      {
        test: /\.(jpe?g|png|gif|svg|webp)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            // 如果没有超出maxSize 将会被转化成base64 格式输出
            maxSize: 10 * 1024,
          },
        },
      },
      // 其他资源
      {
        test: /\.(woff2?|ttf)$/,
        type: 'asset/resource',
      },
      // 处理js
      {
        test: /\.(ts|tsx|js|jsx)$/,
        // 只处理src文件下的 jsx
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: true, // 开启 js 缓存
          cacheCompression: false, // 关闭 js 压缩
          plugins: [!isProd && 'react-refresh/babel'].filter(Boolean), // 开启HMR
        },
      },
    ],
  },
  //处理 html
  plugins: [
    new EslintWebpackPlugin({
      // 处理文件路径
      context: path.resolve(__dirname, '../src'),
      //不包含哪些文件
      exclude: 'node_modules',
      cache: true,
      // 开启eslint 缓存
      cacheLocation: path.resolve(
        __dirname,
        '../node_modules/.cache/.eslintcache'
      ),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    isProd &&
      new MinniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:10].css',
        chunkFilename: 'static/css/[name].[contenthash:10].chunk.css',
      }),
    // 复制 public 下的文件 到 dist目录中
    isProd &&
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../public'), // 来自
            to: path.resolve(__dirname, '../dist'), // 去处
            globOptions: {
              // 因为已经做过 html 处理 所以要忽略掉 index.html
              ignore: ['**/index.html'],
            },
          },
        ],
      }),
    !isProd && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  // 开启测试环境
  mode: isProd ? 'production' : 'development',
  // 开启错误提示
  devtool: isProd ? 'source-map' : 'cheap-module-source-map',
  // 压缩操作
  optimization: {
    // 代码分割
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // react react-dom react-router-dom 一起打包成一个js文件
        react: {
          test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
          name: 'chunk-react',
          priority: 40,
        },
        // antd 打包在一起
        antd: {
          test: /[\\/]node_modules[\\/]antd[\\/]/,
          name: 'chunk-antd',
          priority: 30,
        },
        // 剩下的 node_modules 打包一起
        libs: {
          test: /[\\/]node_modules[\\/]/,
          name: 'chunk-libs',
          priority: 20,
        },
      },
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`,
    },
    minimize: isProd,
    minimizer: [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                'svgo',
                {
                  plugins: [
                    'preset-default',
                    'prefixIds',
                    {
                      name: 'sortAttrs',
                      params: {
                        xmlnsOrder: 'alphabetical',
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
  // webpack 解析模块加载选项
  resolve: {
    // 自动补全文件扩展名
    extensions: ['.ts', '.tsx', '.jsx', '.js', '.json'],
  },
  devServer: {
    host: '0.0.0.0',
    port: 'auto',
    open: true,
    hot: true,
    historyApiFallback: true, // 解决前端路由刷新404问题
  },
  performance: false, // 关闭性能分析， 提升打包速度
}
