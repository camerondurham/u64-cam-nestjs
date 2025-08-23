#!/usr/bin/env node

/**
 * Security validation script for GitHub Pages deployment
 * This script validates that the build configuration and output are secure
 */

const fs = require('fs');
const path = require('path');

function validateNextConfig() {
  console.log('🔍 Validating Next.js configuration security...');
  
  try {
    const nextConfig = require('../next.config.js');
    
    // Check if poweredByHeader is disabled
    if (nextConfig.poweredByHeader !== false) {
      console.warn('⚠️  WARNING: poweredByHeader should be set to false for security');
      return false;
    }
    
    // Check if output is set to export for static hosting
    if (nextConfig.output !== 'export') {
      console.warn('⚠️  WARNING: output should be set to "export" for GitHub Pages');
      return false;
    }
    
    // Check if images are unoptimized (required for static export)
    if (!nextConfig.images || nextConfig.images.unoptimized !== true) {
      console.warn('⚠️  WARNING: images.unoptimized should be true for static export');
      return false;
    }
    
    console.log('✅ Next.js configuration security validation passed');
    return true;
  } catch (error) {
    console.error('❌ Error validating Next.js configuration:', error.message);
    return false;
  }
}

function validateWorkflowPermissions() {
  console.log('🔍 Validating GitHub Actions workflow permissions...');
  
  try {
    const workflowPath = '.github/workflows/deploy.yml';
    if (!fs.existsSync(workflowPath)) {
      console.error('❌ GitHub Actions workflow file not found');
      return false;
    }
    
    const workflowContent = fs.readFileSync(workflowPath, 'utf8');
    
    // Check for required permissions
    const requiredPermissions = ['contents: read', 'pages: write', 'id-token: write'];
    const hasAllPermissions = requiredPermissions.every(permission => 
      workflowContent.includes(permission)
    );
    
    if (!hasAllPermissions) {
      console.warn('⚠️  WARNING: Missing required permissions in workflow');
      return false;
    }
    
    // Check for security validation steps
    if (!workflowContent.includes('Validate build output security')) {
      console.warn('⚠️  WARNING: Build output security validation step missing');
      return false;
    }
    
    if (!workflowContent.includes('Validate environment security')) {
      console.warn('⚠️  WARNING: Environment security validation step missing');
      return false;
    }
    
    console.log('✅ GitHub Actions workflow permissions validation passed');
    return true;
  } catch (error) {
    console.error('❌ Error validating workflow permissions:', error.message);
    return false;
  }
}

function validateBuildOutput() {
  console.log('🔍 Validating build output security...');
  
  const outDir = 'out';
  if (!fs.existsSync(outDir)) {
    console.log('ℹ️  Build output directory not found (run npm run build first)');
    return true; // Not an error, just hasn't been built yet
  }
  
  try {
    // Check for sensitive file patterns
    const sensitivePatterns = ['.env', '.key', '.pem', '.p12', '.pfx'];
    const findSensitiveFiles = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          findSensitiveFiles(filePath);
        } else {
          const hasSensitivePattern = sensitivePatterns.some(pattern => 
            file.includes(pattern)
          );
          if (hasSensitivePattern) {
            console.warn(`⚠️  WARNING: Potentially sensitive file found: ${filePath}`);
            return false;
          }
        }
      }
      return true;
    };
    
    if (!findSensitiveFiles(outDir)) {
      return false;
    }
    
    console.log('✅ Build output security validation passed');
    return true;
  } catch (error) {
    console.error('❌ Error validating build output:', error.message);
    return false;
  }
}

function main() {
  console.log('🛡️  Starting security validation for GitHub Pages deployment\n');
  
  const validations = [
    validateNextConfig,
    validateWorkflowPermissions,
    validateBuildOutput
  ];
  
  let allPassed = true;
  
  for (const validation of validations) {
    const result = validation();
    allPassed = allPassed && result;
    console.log(''); // Add spacing between validations
  }
  
  if (allPassed) {
    console.log('🎉 All security validations passed!');
    process.exit(0);
  } else {
    console.log('❌ Some security validations failed. Please review the warnings above.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateNextConfig,
  validateWorkflowPermissions,
  validateBuildOutput
};