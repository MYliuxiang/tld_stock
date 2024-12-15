import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    rules: {
      semi: [2, 'never'], // 禁止尾部使用分号“ ; ”
      'no-var': 'error', // 禁止使用 var
      indent: ['error', 2], // 缩进2格
      '@typescript-eslint/no-explicit-any': 'off',
      'no-mixed-spaces-and-tabs': 'error', // 不能空格与tab混用
      quotes: [2, 'single'], // 使用单引号
      'vue/html-closing-bracket-newline': 'off', // 不强制换行
      'vue/singleline-html-element-content-newline': 'off', // 不强制换行
      'vue/no-export-in-script-setup':'off',
      'vue/multi-word-component-names':'off',
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: { max: 5 },
          multiline: { max: 5 },
        },
      ], // vue template模板元素第一行最多5个属性
      // 其它的规则可以去eslint查看，根据自己需要进行添加
    }
  },
]
