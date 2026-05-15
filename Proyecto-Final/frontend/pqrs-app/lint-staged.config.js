// lint-staged — corre lint sobre archivos staged en pre-commit.
// Doc: https://github.com/lint-staged/lint-staged
module.exports = {
  '*.ts': ['eslint --fix'],
  '*.html': ['eslint --fix'],
  '*.{json,md,scss}': [], // sin lint configurado por ahora — placeholder
};
