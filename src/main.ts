import config from './config';
import PluginsLoader from './pluginsloader';
import VrcOscClient from "./VrcOscClient.ts";

const pluginsLoader = new PluginsLoader();
await pluginsLoader.loadPLugins("./plugins/");

const client = new VrcOscClient();

const MAX_MESSAGE_LINE_LENGTH = 30;
const MAX_MESSAGE_LINES_COUNT = 3;

function trimMessageString(input: string): string {
  if (input.length > MAX_MESSAGE_LINE_LENGTH) {
    return input.substring(0, MAX_MESSAGE_LINE_LENGTH) + '...';
  }
  return input;
}

// TODO: Move somewhere?
const sleep = (waitTimeInMs: number) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

let currentLinesScroll = 0;

while (true) {
  // Exec all plugins updating and get outputs
  let outputs: string[] = [];
  for (const plugin of pluginsLoader.plugins) {
    const output = await plugin.onUpdate(client);
    if(output != undefined) {
      const format = trimMessageString(output!!);
      outputs.push(format);
    }
  }

  // Send new input to chat
  let displayedOutputs = outputs.slice(currentLinesScroll, currentLinesScroll + MAX_MESSAGE_LINES_COUNT);
  let outputString = displayedOutputs.join("\n");
  client.sendInputToChatbox(outputString);

  // Update lines scroll
  if(outputs.length > MAX_MESSAGE_LINES_COUNT) {
    currentLinesScroll++;
    if(currentLinesScroll + MAX_MESSAGE_LINES_COUNT - 1 >= outputs.length) {
      currentLinesScroll = 0;
    }
  } else {
    currentLinesScroll = 0;
  }

  // Wait X seconds
  await sleep(config.updateDelay);
}