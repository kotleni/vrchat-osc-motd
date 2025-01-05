import fs from 'fs';
import PluginBase from "./pluginbase.ts";

export default class PluginsLoader {
    plugins: PluginBase[] = [];

    async loadPLugins(folderPath: string) {
        console.log("Loading plugins...");

        for (const file of fs.readdirSync(folderPath)) {
            console.log(`Loading... ${file}`);
            const module = await import(`../${folderPath}${file}`);
            const plugin: PluginBase = new module.default();
            plugin.onLoad();
            console.log(`Loaded: ${plugin.name} (${plugin.description})`);

            this.plugins.push(plugin);
        }
    }
}