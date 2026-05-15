// commitlint config — Proyecto-Final
// Convencion: Conventional Commits SIN scopes (estilo K-Forge).
// Doc: https://commitlint.js.org/reference/configuration.html
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'docs', 'refactor', 'test', 'release', 'hotfix'],
    ],
    // Sin scopes — K-Forge style
    'scope-empty': [2, 'always'],
    // Subject en minusculas, sin punto final
    'subject-case': [2, 'always', 'lower-case'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-empty': [2, 'never'],
    // Header max length
    'header-max-length': [2, 'always', 72],
    // Type minusculas
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
  },
};
