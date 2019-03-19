'use strict'
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')
const baseUrl = 'http://192.168.2.54'
const url = 'http://192.168.2.54:8767' // http://192.168.2.54:8767
module.exports = {
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/modc': {
        target: `http://192.168.2.252:20086`, // 192.168.24.247
        pathRewrite: {
          '^/modc': '/'
        },
      },
      '/jwt': {
        target: `http://192.168.23.226:8767`, // 192.168.24.247
        pathRewrite: {
          '^/jwt': '/jwt'
        },
      },
      '/dsg-bpm': {
        target: `${url}/api/dsg-bpm`,//接口域名
        changeOrigin: true,//是否跨域
        pathRewrite: {
          '^/dsg-bpm': '/'//需要rewrite重写
        }
      },

      '/plan_': {
        target: `http://192.168.2.253:8080/agile-bpm-platform/sys/scheduleJob`,//接口域名
        changeOrigin: true,//是否跨域
        pathRewrite: {
          '^/plan_': '/'//需要rewrite重写
        }
      },
      '/api_': {
        target: `${url}/api/metadata/v2`,//接口域名
        changeOrigin: true,//是否跨域
        pathRewrite: {
          '^/api_': '/'//需要rewrite重写
        }
      },

      '/datalake-feed_': {
        target: `${url}/api/datalake-feed`,
        changeOrigin: true,
        pathRewrite: {
          '/datalake-feed_': '/'
        }
      },
      '/datalake-agent_': {
        target: `${url}/api/datalake-agent`,
        changeOrigin: true,
        pathRewrite: {
          '/datalake-agent_': '/'
        }
      },
      '/datalakeFeed_': {
        target: `${url}/api/datalake-feed/v1/feedmgr/categories`,
        changeOrigin: true,
        pathRewrite: {
          '/datalakeFeed_': '/'
        }
      },
      '/subject_': {
        target: `${url}/api/dsg-subject`,
        changeOrigin: true,
        pathRewrite: {
          '/subject_': '/'
        }
      },
      '/datalakeFeed': {
        target: `${url}/api/datalake-feed/v1/hive`,
        changeOrigin: true,
        pathRewrite: {
          '/datalakeFeed': '/'
        }
      },
      '/proxy_': {
        target: `${url}/api/datalake-feed`,
        changeOrigin: true,
        pathRewrite: {
          '^/proxy_': '/',
        },
      },
      '/rule_': {
        target: `${baseUrl}:10009`,
        changeOrigin: true,
        pathRewrite: {
          '^/rule_': '/',
        },
      },
      '/curd_': {
        target: `${url}/api/metadata2`,
        changeOrigin: true,
        pathRewrite: {
          '^/curd_': '/',
        },
      },
      '/api': {
        target: `${url}`,
        pathRewrite: {
          '^/api': '/api'
        },
      },
      '/sd': {
        target: `http://192.168.24.250:9998`,
        pathRewrite: {
          '^/sd': '/hive'
        },
      },
      '/dc': {
        target: `http://192.168.24.231:9998`,
        pathRewrite: {
          '^/dc': '/std'
        },
      },
      '/sw': {
        target: `http://192.168.24.221:9413`,
        pathRewrite: {
          '^/sw': '/api'
        },
      }
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST --0.0.0.0
    port: 9528, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',

    // you can set by youself according to actual condition
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
