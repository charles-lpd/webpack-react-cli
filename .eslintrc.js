module.exports = {
  extends: ['react-app'], // 继承react 官方规则
  parserOptions: {
    babelOptions: {
      presets: [
        //解决页面报错问题
        ['babel-preset-react-app', false],
        'babel-preset-react-app/prod',
      ],
    },
  },
  rules: {
    "no-extra-parens": 0,
    "comma-spacing": [2, {
      "before": false,
      "after": true
    }],
    "no-multiple-empty-lines": [2, {
      "max": 1
    }],
    "no-trailing-spaces": 2,
    "no-unused-vars": 0,
    "react/jsx-max-props-per-line": [2, {
      "maximum": 3
    }],
  },
}
