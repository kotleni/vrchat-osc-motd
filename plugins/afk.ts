import PluginBase from "../src/pluginbase";
import VrcOscClient from "../src/VrcOscClient";

export default class AfkPlugin implements PluginBase {
    name: string = "AfkPlugin";
    description: string = "Show afk message if in afk.";

    onLoad() {

    }

    onUnload() {

    }

    async onUpdate(client: VrcOscClient): Promise<string | undefined> {
        return client.getIsAfk() ? "(AFK)" : undefined;
    }
}