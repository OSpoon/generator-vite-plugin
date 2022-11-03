/**
 * Vite Plugin API
 * https://cn.vitejs.dev/guide/api-plugin.html
 */
 import type { Plugin, ResolvedConfig, UserConfig, ViteDevServer } from "vite";

export type Options = {
    // TODO 
}

export default function <%= pluginName %>(options: Options): Plugin {
    
    let config: ResolvedConfig;

    return {
        name: 'vite-plugin-<%= name %>',
        apply(config, { command }) {
            // TODO 指定插件运行时机是：build、serve，删除此函数默认构建、开发均执行
            return command === 'serve';
        },
        config(config: UserConfig, { command }) {
            // TODO 在解析 Vite 配置前调用
        },
        configResolved(resolvedConfig: ResolvedConfig) {
            // TODO 在解析 Vite 配置后调用
        },
        configureServer(server: ViteDevServer) {
            // TODO 配置开发服务器，实现自定义中间件
        }
    }
}