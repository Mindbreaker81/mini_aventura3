// Utility to handle Blockly operations and suppress specific deprecation warnings
export function suppressBlocklyDeprecationWarnings() {
  // Store original console.warn
  const originalWarn = console.warn;
  
  // Override console.warn to filter out specific Blockly deprecation warnings
  console.warn = function(message: any, ...args: any[]) {
    // Skip the specific deprecation warning for getAllVariables
    if (typeof message === 'string' && message.includes('getAllVariables was deprecated in v12')) {
      return;
    }
    // Call original warn for other messages
    originalWarn.call(console, message, ...args);
  };
  
  // Return a function to restore original behavior
  return function restoreWarnings() {
    console.warn = originalWarn;
  };
}

// Safe wrapper for workspaceToCode that suppresses deprecation warnings
export function safeWorkspaceToCode(generator: any, workspace: any): string {
  const restore = suppressBlocklyDeprecationWarnings();
  try {
    const code = generator.workspaceToCode(workspace);
    return code;
  } finally {
    restore();
  }
}

// Safe wrapper for any Blockly operations that might trigger deprecation warnings
export function safeBlocklyOperation<T>(operation: () => T): T {
  const restore = suppressBlocklyDeprecationWarnings();
  try {
    return operation();
  } finally {
    restore();
  }
}