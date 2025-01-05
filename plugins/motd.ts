import PluginBase from "../src/pluginbase";
import VrcOscClient from "../src/VrcOscClient";

export default class MotdPlugin implements PluginBase {
  name: string = 'Motd';
  description: string = 'Displays message of the day.';

  private message: string = 'github.com/kotleni/vrchat-osc-motd';

  onLoad() {

  }

  onUnload() {

  }

  onUpdate(client: VrcOscClient) {
      client.sendInputToChatbox(this.message)
  }
}