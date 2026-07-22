import { ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";

const config: ExpoConfig = {
  name: IS_DEV ? "Day Planner Dev" : "Day Planner",
  slug: "day-planner",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/day-planner.png",
  scheme: "dayplanner",
  userInterfaceStyle: "automatic",

  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV ? "com.ando.dayplanner.dev" : "com.ando.dayplanner",
  },

  android: {
    package: IS_DEV ? "com.ando.dayplanner.dev" : "com.ando.dayplanner",

    permissions: [
      "SCHEDULE_EXACT_ALARM",
      "WRITE_EXTERNAL_STORAGE",
      "WAKE_LOCK",
      "VIBRATE",
      "USE_FULL_SCREEN_INTENT",
      "RECEIVE_BOOT_COMPLETED",
      "USE_EXACT_ALARM",
    ],
  },

  plugins: [
    "expo-router",
    "expo-sqlite",
    "@react-native-community/datetimepicker",
    ["expo-notifications", { defaultChannel: "alarm_v3" }],
    [
      "expo-build-properties",
      {
        android: {
          gradleProperties: {
            "org.gradle.jvmargs": "-Xmx2560m -XX:MaxMetaspaceSize=512m",
            "org.gradle.parallel": "false",
            "org.gradle.workers.max": "2",
          },
        },
      },
    ],
  ],

  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },

  extra: {
    router: {},
    eas: {
      projectId: "9f54bb2c-a18c-4e0b-a79d-aa576d36c659",
    },
  },
};

export default config;
