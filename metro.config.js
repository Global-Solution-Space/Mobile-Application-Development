const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Intercepta o Zustand e força ele a usar a versão compatível com a Web (CommonJS)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.includes('zustand')) {
    const result = require.resolve(moduleName);
    return context.resolveRequest(context, result, platform);
  }
  // Para todo o resto, segue a vida normal
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;