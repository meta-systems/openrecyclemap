module.exports = {
    chainWebpack: (config) => {
        const isLegacyBundle = process.env.VUE_CLI_MODERN_MODE && !process.env.VUE_CLI_MODERN_BUILD;
        if (!isLegacyBundle) {
            config.plugin("preload").tap(() => {
                return [{
                    rel: "preload",
                    include: "allAssets",
                    fileWhitelist: [/.*\.css/, /.*\.js/, /.*\.woff2$/],
                    fileBlacklist: [/\.map$/, /hot-update\.js$/]
                }];
            });
        }
    }
};