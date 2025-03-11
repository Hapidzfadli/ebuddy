module.exports = {
    extends: [
      'next/core-web-vitals',
      
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', 
      '@typescript-eslint/no-unused-vars': 'warn',  
      'react/jsx-no-undef': 'warn',                
      'react-hooks/exhaustive-deps': 'warn'        // sudah 'warn', tidak perlu diubah
    }
  };