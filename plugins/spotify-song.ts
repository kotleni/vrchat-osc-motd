import PluginBase from '../src/pluginbase';
import VrcOscClient from "../src/VrcOscClient";
import dbus, {ProxyObject} from 'dbus-next';

export default class SpotifySongPlugin implements PluginBase {
  name: string = 'SpotifySong';
  description: string =
    'Displays current playing song in spotify (Linux only).';

  private bus?: dbus.MessageBus = undefined;
  private player?: ProxyObject = undefined;
  private metadataInterface?: dbus.ClientInterface = undefined;

  async getCurrentSong() {
    try {
      const metadata = await this.metadataInterface!!.Get('org.mpris.MediaPlayer2.Player', 'Metadata');
      const title = metadata.value['xesam:title'].value;
      const artist = metadata.value['xesam:artist'].value;

      // console.log(metadata.value)

      return `${title} : ${artist}`;
    } catch (error) {
      return `Error fetching song data: ${error}`;
    }
  }

  async onLoad() {
    this.bus = dbus.sessionBus();
    this.player = await this.bus.getProxyObject('org.mpris.MediaPlayer2.spotify', '/org/mpris/MediaPlayer2');
    this.metadataInterface = this.player!!.getInterface('org.freedesktop.DBus.Properties');
  }

  async onUnload() {

  }

  async onUpdate(client: VrcOscClient): Promise<string | undefined> {
    if(!client.getIsAfk()) {
      return `(Spotify) ${await this.getCurrentSong()}`;
    }
    return undefined;
  }
}