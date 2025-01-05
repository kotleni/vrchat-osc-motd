
import PluginsLoader from './pluginsloader';
import VrcOscClient from "./VrcOscClient.ts";

const pluginsLoader = new PluginsLoader();
await pluginsLoader.loadPLugins("./plugins/");

const client = new VrcOscClient();

// TODO: Move somewhere?
const sleep = (waitTimeInMs: number) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

let currentPluginIndex = 0;
const pluginsCount = pluginsLoader.plugins.length;

while (true) {
  pluginsLoader.plugins[currentPluginIndex].onUpdate(client)

  currentPluginIndex++;
  if(currentPluginIndex >= pluginsCount) {
    currentPluginIndex = 0;
  }

  await sleep(5000);
}