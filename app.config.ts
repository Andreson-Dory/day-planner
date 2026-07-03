import appJson from "./app.json";

const IS_DEV = process.env.APP_VARIANT === "development";

export default {
  expo: {
    ...appJson.expo,

    name: IS_DEV ? "Day Planner Dev" : "Day Planner",

    android: {
      ...appJson.expo.android,

      package: IS_DEV ? "com.dayplanner.app.dev" : "com.dayplanner.app",
    },

    extra: {
      ...appJson.expo.extra,

      eas: {
        projectId: "9f54bb2c-a18c-4e0b-a79d-aa576d36c659",
      },
    },
  },
};
