import config from './config';
import PluginsLoader from './pluginsloader';
import VrcOscClient from "./VrcOscClient.ts";

const pluginsLoader = new PluginsLoader();
await pluginsLoader.loadPLugins("./plugins/");

const client = new VrcOscClient();

// TODO: Move somewhere?
const sleep = (waitTimeInMs: number) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

let currentIteration = 0;
let currentPluginIndex = 0;
const pluginsCount = pluginsLoader.plugins.length;

// Force update first plugin
pluginsLoader.plugins[0].onUpdate(client);
currentPluginIndex = 1; // Next plugin

while (true) {
  // Calculate iterations
  currentIteration++;
  // console.log("(->) Next iteration");
  if(currentIteration >= config.iterationsPerPlugin) {
    currentIteration = 0;

    pluginsLoader.plugins[currentPluginIndex].onUpdate(client)

    // Swap plugin to next
    currentPluginIndex++;
    if(currentPluginIndex >= pluginsCount) {
      currentPluginIndex = 0;

      // console.log("(->) Next plugin");
    }
  }

  await sleep(config.updateDelay);
}