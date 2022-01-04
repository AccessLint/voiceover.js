import * as wdio from "webdriverio";
import { moveRight, rotor } from "../../lib/Commands";
import { VoiceOver } from '../../lib/VoiceOver'

async function main () {
  const opts = {
    path: "/wd/hub",
    port: 4723,
    capabilities: {
      platformName: "iOS",
      platformVersion: "14.5",
      deviceName: "iPhone Simulator",
      app: "com.apple.Health",
      automationName: "XCUITest",
    },
  };

  try {
    const client = await wdio.remote(opts);

    const voiceover = new VoiceOver();
    await voiceover.launch();
    voiceover.tail();

    let i = 0;
    const limit = 25;
    while (i < limit) {
      await voiceover.execute(moveRight);
      i++;
    }

    await voiceover.quit();

    await client.deleteSession();
  } catch (error) {
    console.log(error);
  }
}

main();
