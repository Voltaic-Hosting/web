import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            '.astro/**',
            'public/**',
            'resources/**',
            'vendor/**',
            'tests/fixtures/**',
            '*.min.*',
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...eslintPluginAstro.configs['flat/recommended'],
    ...eslintPluginSvelte.configs['flat/recommended'],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },
    {
        files: ['**/*.svelte', '**/*.svelte.ts'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
    },
    {
        files: ['**/*.astro'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
    },
    {
        files: ['src/layouts/BaseLayout.astro', 'src/layouts/BaseLayout.astro/**'],
        rules: {
            'no-var': 'off',
            'no-empty': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
    eslintConfigPrettier,
);
