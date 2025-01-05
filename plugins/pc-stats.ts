import PluginBase from '../src/pluginbase';
import os from 'os';
import VrcOscClient from '../src/VrcOscClient';

export default class PCStatsPlugin implements PluginBase {
  name: string = 'PCStats';
  description: string = 'Displays information about CPU and RAM usage.';

  private timesBefore: {
    user: number;
    nice: number;
    sys: number;
    idle: number;
    irq: number;
  }[] = [
    {
      user: 0,
      nice: 0,
      sys: 0,
      idle: 0,
      irq: 0,
    },
  ];

  private getAverageUsage() {
    let timesAfter = os.cpus().map((c) => c.times);
    let timeDeltas = timesAfter.map((t, i) => ({
      user: t.user - this.timesBefore[i].user,
      sys: t.sys - this.timesBefore[i].sys,
      idle: t.idle - this.timesBefore[i].idle,
    }));

    this.timesBefore = timesAfter;

    return (
      timeDeltas
        .map((times) => 1 - times.idle / (times.user + times.sys + times.idle))
        .reduce((l1, l2) => l1 + l2) / timeDeltas.length
    );
  }

  onLoad() {
    this.timesBefore = os.cpus().map((c) => c.times);
  }

  onUnload() {}

  async onUpdate(_client: VrcOscClient): Promise<string | undefined> {
    const ramUsedGb = Math.round(
      (os.totalmem() - os.freemem()) / 1024 / 1024 / 1024,
    );
    const ramTotalGb = Math.round(os.totalmem() / 1024 / 1024 / 1024);
    const cpuUsage = Math.round(this.getAverageUsage() * 100);
    return `CPU: ${cpuUsage}% | RAM: ${ramUsedGb}GB/${ramTotalGb}GB`;
  }
}