import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { createHash } from "crypto";

const ANDROID_SDK_VERSION = process.env["ANDROID_SDK_VERSION"] || "33";

const MODDED_ANDROID_JAR_URL = `https://raw.githubusercontent.com/1fexd/aosp-android-jar-mirror/master/android-${ANDROID_SDK_VERSION}.jar`;

const MODDED_ANDROID_JAR_SHA256: { [key: string]: string } = {
  "28": "7eba0f3c6815e83f6d364431a0c868584632e8cab8386a0b7287a08da0bdf383",
  "29": "9dec95a1ac122e71bec7cf09037579fc7f30e924bf24f3582ec46918b0c08476",
  "30": "6529a1f1eb399a30065600609d599790a97c9e1bfa016edae22fb8701bebca05",
  "31": "301f606a8447a4b4021b7a65d7ad14414cafa490d846ba9d74f55ac3a705911a",
  "32": "4ae31e331ffb4ef117ff358583f0328f92e35882e7c2c67e59178a92a80a1b3f",
  "33": "46c79d276c46cb9b32e6567dbe9a9f70c8e236eac0a3e1d8bcf3ff25c16a3805",
};

const HOME = os.homedir();
const ANDROID_HOME_DIR = path.join(HOME, ".android");
const ANDROID_HOME_SDK_DIR = path.join(ANDROID_HOME_DIR, "sdk");
let ANDROID_SDK_ROOT = process.env["ANDROID_SDK_ROOT"] || ANDROID_HOME_SDK_DIR;

async function run(): Promise<void> {
  core.debug(`Found Android SDK ${ANDROID_SDK_ROOT}`);

  if (!(ANDROID_SDK_VERSION in MODDED_ANDROID_JAR_SHA256)) {
    core.error(`${ANDROID_SDK_VERSION} is not supported`);
  }

  const androidJarLocation = `${ANDROID_SDK_ROOT}/platforms/android-${ANDROID_SDK_VERSION}/android.jar`;
  if (!fs.existsSync(androidJarLocation)) {
    core.error(`android.jar does not exist at ${androidJarLocation}`);
  }

  fs.unlinkSync(androidJarLocation);

  const moddedAndroidJarDest = await tc.downloadTool(
    MODDED_ANDROID_JAR_URL,
    androidJarLocation
  );

  core.debug(`Downloaded ${MODDED_ANDROID_JAR_URL} to ${moddedAndroidJarDest}`);

  const buff = fs.readFileSync(moddedAndroidJarDest);
  const hash = createHash("sha256").update(buff).digest("hex");
  const expectedHash = MODDED_ANDROID_JAR_SHA256[ANDROID_SDK_VERSION];

  if (hash !== expectedHash) {
    core.debug(
      `Invalid hash ${hash} for modded android.jar ${ANDROID_SDK_VERSION} (expected ${expectedHash})`
    );
  }
}

run();
