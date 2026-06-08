import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import prettier from 'eslint-plugin-prettier'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
    },
    plugins: {
      'react': react,
      'prettier': prettier,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // Disabled in favor of the TypeScript-aware equivalents below;
      // the base rules misfire on TS types/globals (e.g. NodeJS, __dirname).
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'prettier/prettier': ['error', {
        endOfLine: 'auto'
      }],
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_' }]
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
]
