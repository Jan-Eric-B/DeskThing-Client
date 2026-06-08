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
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
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
      // TypeScript already validates props; the prop-types rule is redundant noise here.
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }]
    },
  },
]
