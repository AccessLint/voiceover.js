import * as wdio from "webdriverio";
import { moveRight } from "../../lib/Commands";
import { VoiceOver } from '../../lib/VoiceOver'

async function main () {
  const opts: wdio.RemoteOptions = {
    path: "/wd/hub",
    port: 4723,
    connectionRetryTimeout: 600000,
    capabilities: {
      platformName: "iOS",
      platformVersion: "14.5",
      deviceName: "iPhone X",
      app: "com.apple.Health",
      automationName: "XCUITest",
    },
  };

  const client = await wdio.remote(opts);

  try {
    const voiceover = new VoiceOver();

    console.log('launching voiceover...');
    await voiceover.launch();
    await(new Promise<void>(resolve => { setTimeout(() => resolve(), 60000) }));
    console.log(await voiceover.lastPhrase());
    // voiceover.tail();


    // let i = 0;
    // const limit = 10;
    // while (i < limit) {
    //   await voiceover.execute(moveRight);
    //   console.log(await voiceover.lastPhrase());
    //   i++;
    // }

    console.log('quitting voiceover.');
    await voiceover.quit();
  } catch (error) {
    console.log(error);
  } finally {
    await client.deleteSession();
  }
}

main();
