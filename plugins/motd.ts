import PluginBase from "../src/pluginbase";
import VrcOscClient from "../src/VrcOscClient";

export default class MotdPlugin implements PluginBase {
  name: string = 'Motd';
  description: string = 'Displays message of the day.';

  private message: string = 'Hello from vrchat-osc-motd!';

  onLoad() {

  }

  onUnload() {

  }

  async onUpdate(_client: VrcOscClient): Promise<string | undefined> {
    return this.message;
  }
}