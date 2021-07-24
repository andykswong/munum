/**
 * This strips AssemblyScript specific constructs so that polyfill is not needed for JS environment.
 */
module.exports = function() {
  return {
    visitor: {
      CallExpression: {
        exit(path) {
          const funcName = path.node.callee.name;
          const binding = path.scope.getBinding(funcName);

          // Strip AS global unchecked() call.
          if (funcName === 'unchecked' && !binding) {
            path.replaceWith(path.node.arguments[0]);
          }
        }
      }
    }
  };
}
