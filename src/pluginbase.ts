import VrcOscClient from "./VrcOscClient.ts";

export default interface PluginBase {
  name: string;
  description: string;

  onLoad(): void;
  onUnload(): void;

  /* Update plugin and return string of output */
  onUpdate(_client: VrcOscClient): Promise<string | undefined>;
}