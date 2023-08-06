# setup-modded-android-jar

Replaces android.jar with [Reginer's modded version](https://github.com/Reginer/aosp-android-jar). Android SDK must be set up by another action (or come preinstalled like on Github's action runners).

Currently supported SDKs: `28`, `29`, `30`, `31`, `32`, `33`.

SDK version must be passed as environment variable. Example:

```yaml
- name: Setup Android modded android.jar
  uses: 1fexd/setup-modded-android-jar@0.0.2
  env:
    ANDROID_SDK_VERSION: 33
```
