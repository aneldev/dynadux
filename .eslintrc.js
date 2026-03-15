"use strict";
module.exports = {
  root: true,
  env: {
    browser: false,
    es2021: true,
    "jest/globals": true,
  },
  ignorePatterns: [
    "under-construction/",
  ],
  parser: "@typescript-eslint/parser",
  plugins: [
    "eslint-plugin-react",
    "etc",
    "jest",
  ],
  extends: [
    "react-app",
    "react-app/jest",
    "plugin:@typescript-eslint/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
  ],
  overrides: [
    {
      files: [
        "*.ts",
        "*.tsx",
      ],
      rules: {
        "no-debugger": [
          "warn",
        ],

        "no-console": [
          "warn",
          {
            allow: [
              "log",
              "info",
              "warn",
              "error",
              "time",
              "timeEnd",
              // But not "debug"
            ],
          },
        ],

        "space-infix-ops": [
          "warn",
          {
            "int32Hint": false,
          },
        ],

        "eol-last": [
          "warn",
          "always",
        ],
        "@typescript-eslint/member-delimiter-style": [
          "warn",
          {
            multiline: {
              delimiter: "semi",
              requireLast: true,
            },
            singleline: {
              delimiter: "semi",
              requireLast: false,
            }
          }
        ],
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/prefer-namespace-keyword": "warn",
        "@typescript-eslint/naming-convention": [
          "warn",
          {
            selector: "interface",
            format: [],
            custom: {
              regex: "^I[A-Z]",
              match: true,
            }
          },
          {
            selector: "enum",
            format: [
              "PascalCase",
              "UPPER_CASE",
            ],
            custom: {
              regex: "^E[A-Z]",
              match: true,
            }
          }
        ],
        "@typescript-eslint/semi": [
          "warn",
          "always"
        ],
        "@typescript-eslint/type-annotation-spacing": "warn",
        "brace-style": [
          "warn",
          "stroustrup"
        ],
        "no-extra-boolean-cast": [
          "warn"
        ],
        "comma-dangle": [
          "warn",
          "always-multiline"
        ],
        "eqeqeq": [
          // https://eslint.org/docs/rules/eqeqeq
          "warn",
          "smart"
        ],
        "id-blacklist": [
          "warn",
          "any",
          "Number",
          "String",
          "string",
          "Boolean",
          "boolean",
          "Undefined",
          "undefined"
        ],
        "id-match": "warn",
        indent: [
          1,
          2,
          {
            ImportDeclaration: 1,
            SwitchCase: 1
          }
        ],
        "no-eval": "warn",
        "no-mixed-operators": "warn",
        "no-trailing-spaces": "warn",
        "no-underscore-dangle": "off",
        "no-unsafe-finally": "warn",
        "no-var": "warn",
        semi: "warn",
        curly: [
          "warn",
          "multi-line"
        ],
        "object-curly-newline": [
          "warn",
          {
            ImportDeclaration: {
              minProperties: 2,
              consistent: true,
              multiline: true
            },
            ObjectExpression: {
              multiline: true,
              minProperties: 2
            },
            ObjectPattern: {
              multiline: true,
              minProperties: 2
            },
            ExportDeclaration: {
              multiline: true,
              minProperties: 1
            }
          }
        ],
        "object-curly-spacing": [
          "warn",
          "never"
        ],
        "object-property-newline": [
          "warn",
          {
            allowAllPropertiesOnSameLine: false,
            allowMultiplePropertiesPerLine: false,
          }
        ],
        "keyword-spacing": [
          "warn",
          {
            before: true,
            after: true,
          }
        ],
        "space-before-blocks": [
          "warn",
          "always"
        ],
        "array-bracket-spacing": [
          "warn",
          "never"
        ],
        "computed-property-spacing": [
          "warn",
          "never"
        ],
        "spaced-comment": [
          "warn",
          "always",
          {
            markers: [
              "/",
              "#region",
              "#endregion",
            ]
          }
        ],
        "switch-colon-spacing": [
          "warn",
          {
            after: true,
            before: false
          }
        ],
        "newline-per-chained-call": "warn",
        "react-hooks/exhaustive-deps": "off",
        "react/jsx-pascal-case": [
          "warn",
          {}
        ],
        "no-restricted-syntax": [
          "error",
          {
            selector: 'JSXAttribute[name.name="dangerouslySetInnerHTML"]',
            message: 'Using dangerouslySetInnerHTML is not allowed! Use the HTMLContent instead!'
          }
        ],
        "react/jsx-first-prop-new-line": [
          "warn",
          "multiline-multiprop"
        ],
        "react/jsx-max-props-per-line": [
          "warn",
          {
            maximum: 3
          }
        ],
        "react/jsx-indent-props": [
          "warn",
          2,
        ],
        "react/jsx-closing-bracket-location": "warn",
        "react/self-closing-comp": "warn",
        "etc/no-commented-out-code": "warn",
        "capitalized-comments": [
          "warn",
          "always",
        ],
      }
    },
    {
      "files": [
        "**/*.stories.*",
      ],
      "rules": {
        "import/no-anonymous-default-export": "off"
      }
    }
  ]
};
