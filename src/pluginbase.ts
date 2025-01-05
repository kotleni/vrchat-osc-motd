import VrcOscClient from "./VrcOscClient.ts";

export default interface PluginBase {
    name: string;
    description: string;

    onLoad(): void;
    onUnload(): void;
    onUpdate(client: VrcOscClient): void;
}