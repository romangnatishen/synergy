module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        // useBuiltIns: 'entry',
        corejs: 3
      }
    ]
  ]
}