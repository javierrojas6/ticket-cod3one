const getGlobalScope = () => {
  if (globalThis.window !== undefined) {
    return globalThis;
  }

  if (globalThis.global !== undefined) {
    return globalThis;
  }

  return {};
};

const getDefaultRoot = () => {
  if (globalThis.window === undefined || !globalThis.location) {
    return '';
  }

  return `${globalThis.location.protocol}//${globalThis.location.host}`;
};

const getPublicConfig = () => {
  const publicConfig = getGlobalScope().__OS_PUBLIC_CONFIG__ || {};
  const defaultRoot = getDefaultRoot();
  const root = publicConfig.root || defaultRoot;

  return {
    version: publicConfig.version || '',
    root,
    apiRoot: publicConfig.apiRoot || (root ? `${root}/api` : ''),
    globalIndexPath: publicConfig.globalIndexPath || '',
    showLogs: publicConfig.showLogs === undefined ? false : publicConfig.showLogs
  };
};

export default {
  getAll() {
    return getPublicConfig();
  },

  getVersion() {
    return getPublicConfig().version;
  },

  getRoot() {
    return getPublicConfig().root;
  },

  getApiRoot() {
    return getPublicConfig().apiRoot;
  },

  getGlobalIndexPath() {
    return getPublicConfig().globalIndexPath;
  },

  getShowLogs() {
    return !!getPublicConfig().showLogs;
  }
};