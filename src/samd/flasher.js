import { SamBA, Device, sleep, Flasher } from "bossa-web";
import * as esploaderMod from "../libs/esp-web-flasher/dist/index";

const philips = new Audio("philips.mp3");

// import { serial } from "web-serial-polyfill";
const observer = {
  onStatus: (message) => {
    console.log("status", message);
  },
  onProgress: (num, div) => {
    console.log("progress", num, div);
  },
};

export const flashStageOne = async (setProgress, setProgressMsg) => {
  setProgress(10);
  setProgressMsg("Connecting to device");
  let port = await getPort();
  console.log("Got port", port);
  setProgress(20);
  setProgressMsg("Nice of Maartje to give us alpha acces, eh Luigi?");
  const { samba, dev } = await attachPort(port);
  console.log("dev", dev);

  var flasher = new Flasher(samba, dev.flash, observer);
  let offset = 0x00002000;

  setProgress(23);
  setProgressMsg("Cleaning the green book");
  await flasher.erase(offset);
  setProgress(25);
  setProgressMsg("Downloading CUE/BIN/ISO...");
  const data = await getFile("serial.bin");
  setProgress(30);
  setProgressMsg("Playing some Nobelia...");
  await flasher.write(data, offset);
  await dev.reset();

  setProgressMsg("Get ready to select the arduino again...");
  setProgress(40);
  await sleep(1000);

  try {
    await port.close();
  } catch (e) {
    console.log("Error closing port", e);
  }
};

export const flashStageTwo = async (setProgress, setProgressMsg) => {
  setProgressMsg("Wondering what Ganon is up to...");
  setProgress(45);

  const port = await navigator.serial.requestPort({
    filters: [
      {
        usbVendorId: 0x2341,
        usbProductId: 0x8057,
      },
    ],
  });

  console.log("Connecting...");
  await port.open({ baudRate: 115200 });

  console.log("Connected successfully to ESP.");

  const esploader = new esploaderMod.ESPLoader(port, console);

  await esploader.initialize();

  console.log("Connected to " + esploader.chipName);
  console.log("MAC Address: ", esploader.macAddr());

  let espStub = await esploader.runStub();

  setProgressMsg("Ensuring the compact disks are interactive...");
  setProgress(45);
  const data = await getFile("bluepad-a2.bin");
  await sleep(500);

  setProgressMsg("Looking for my Wiimote... (this might take a while)");
  setProgress(60);

  await espStub.flashData(
    data,
    (bytesWritten, totalBytes) => {
      setProgress(Math.floor(60 + (bytesWritten / totalBytes) * 9));
      if (bytesWritten / totalBytes > 0.7) {
        setProgressMsg(
          "Reminding all people that the CD-i is a multimedia machine not a conosle... (this might take a while)"
        );
      } else if (bytesWritten / totalBytes > 0.4) {
        setProgressMsg(
          "Looking for my The Aprentice cheat codes... (this might take a while)"
        );
      }
    },
    0x00 // 0 but fancy
  );

  setProgressMsg("Counting if i have enough rubys...");
  await espStub.disconnect();
  await esploader.port.close();
};

export const flashStageThree = async (setProgress, setProgressMsg) => {
  setProgress(70);
  setProgressMsg("Get ready to select the arduino again...");

  let port = await getPort();
  console.log("Got port", port);

  setProgress(85);
  setProgressMsg(
    "If you need instructions on how to get through the hotels, check out the enclosed instructions book"
  );

  const { samba, dev } = await attachPort(port);
  console.log("dev", dev);

  var flasher = new Flasher(samba, dev.flash, observer);
  let offset = 0x00002000;

  await flasher.erase(offset);
  const data = await getFile("cdib-a2.bin");
  setProgress(90);
  setProgressMsg("(insert Philips Media Interactive sound here)");
  philips.play();
  await flasher.write(data, offset);
  await sleep(1000);

  setProgressMsg("Cleaning my CD off...");
  await dev.reset();
  await sleep(1000);

  setProgress(100);
  setProgressMsg("Done! Enjoy mouse support!");
};

const getFile = async (url) => {
  const response = await fetch(`${window.location.origin}/${url}`);
  const blob = await response.blob();
  return blob.arrayBuffer();
};

const getPort = async () => {
  const filters = [
    {
      usbVendorId: 0x2341,
      usbProductId: 0x8057,
    },
    {
      usbVendorId: 0x2341,
      usbProductId: 0x0057,
    },
  ];

  return navigator.serial.requestPort({ filters: filters });
};

const attachPort = async (serialPort) => {
  let info = serialPort.getInfo();

  try {
    // close if it was open
    await serialPort.close();
  } catch (e) {
    console.log(e);
  }

  if (info.usbProductId !== 0x0057) {
    // enter bootloader mode
    let rebootWaitMs = 1000;
    await serialPort.open({
      dataBits: 8,
      stopBits: 1,
      parity: "none",
      bufferSize: 63,
      flowControl: "hardware",
      baudRate: 1200,
    });
    await sleep(50);
    await serialPort.close();
    await sleep(rebootWaitMs);

    console.debug("Device should have rebooted by now. Starting re-connection");
    serialPort = await getPort();
  }

  return await connectBootloader(serialPort);
};

const connectBootloader = async (serialPort) => {
  let samba = new SamBA(serialPort, {
    logger: console,
    debug: true,
  });
  await samba.connect(1000);

  var dev = new Device(samba);
  await dev.create();

  return { samba, dev };
};
