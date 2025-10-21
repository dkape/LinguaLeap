module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:security/recommended'
  ],
  plugins: [
    'security',
    'no-secrets'
  ],
  rules: {
    // Security-focused rules
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    'security/detect-possible-timing-attacks': 'warn',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'warn',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-new-buffer': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    
    // Secrets detection
    'no-secrets/no-secrets': ['error', {
      'tolerance': 4.2,
      'additionalRegexes': {
        'Basic Auth': 'Authorization:\\s*Basic\\s+[A-Za-z0-9+/=]+',
        'Bearer Token': 'Authorization:\\s*Bearer\\s+[A-Za-z0-9\\-._~+/]+=*',
        'API Key': '[Aa][Pp][Ii][_]?[Kk][Ee][Yy].*[\'"][0-9a-zA-Z]{32,45}[\'"]',
        'JWT Token': 'eyJ[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.?[A-Za-z0-9-_.+/=]*',
        'MongoDB URI': 'mongodb(\\+srv)?://[^\\s]+',
        'Database URL': '(postgres|mysql|mariadb)://[^\\s]+',
        'Private Key': '-----BEGIN [A-Z ]+PRIVATE KEY-----'
      }
    }],
    
    // Additional security rules
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-alert': 'warn',
    'no-console': 'warn',
    
    // React security
    'react/no-danger': 'error',
    'react/no-danger-with-children': 'error',
    'react/jsx-no-script-url': 'error',
    'react/jsx-no-target-blank': ['error', { 
      'allowReferrer': false,
      'enforceDynamicLinks': 'always'
    }],
    
    // Next.js security
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'warn', // We handle this with eslint-disable comments where needed
    
    // TypeScript security
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn'
  },
  
  // Environment-specific overrides
  overrides: [
    {
      // Test files can be more lenient
      files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
      rules: {
        'no-console': 'off',
        'security/detect-non-literal-fs-filename': 'off'
      }
    },
    {
      // Configuration files
      files: ['*.config.{js,ts}', '.eslintrc.{js,ts}'],
      rules: {
        'security/detect-non-literal-require': 'off'
      }
    },
    {
      // Server-side files
      files: ['server/**/*.{js,ts}'],
      rules: {
        'no-console': 'off', // Server logging is acceptable
        'security/detect-child-process': 'error' // More strict on server
      }
    }
  ],
  
  // Ignore patterns for security scanning
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'dist/',
    'build/',
    '*.min.js',
    '*.bundle.js',
    'coverage/',
    '.nyc_output/'
  ]
};