import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      'sort-imports': [
        'error',
        { ignoreCase: true, ignoreDeclarationSort: true },
      ],
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'], 
            'internal', 
            ['sibling', 'parent'], 
            'index', 
          ],
          pathGroups: [
            {
              pattern: '@src/**', 
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/no-explicit-any': 'warn', 
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        { allowExpressions: true },
      ], 
    },
  },
);
