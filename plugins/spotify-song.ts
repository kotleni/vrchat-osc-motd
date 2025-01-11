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
      return undefined; //`Error fetching song data: ${error}`;
    }
  }

  private async initDbus(): Promise<void> {
    try {
      this.bus = dbus.sessionBus();
      this.player = await this.bus.getProxyObject('org.mpris.MediaPlayer2.spotify', '/org/mpris/MediaPlayer2');
      this.metadataInterface = this.player!!.getInterface('org.freedesktop.DBus.Properties');
    } catch (error) { }
  }

  async onLoad() {
    this.initDbus();
  }

  async onUnload() {

  }

  async onUpdate(client: VrcOscClient): Promise<string | undefined> {
    if(!this.player) { // Try to reconnect to player
      await this.initDbus();
      return undefined;
    }

    const currentSongString = await this.getCurrentSong();
    if(!client.getIsAfk() && currentSongString) {
      return `(Spotify) ${currentSongString}`;
    }
    return undefined;
  }
}