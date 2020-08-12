import constants from "./constants.js";

export default function registerSettings() {
  game.settings.register(constants.moduleName, "unit-frame-box-position", {
    scope: "client",
    config: false,
    default: {top: 400, left: 120},
  });

  game.settings.register(constants.moduleName, "quest-tracker-position", {
    scope: "client",
    config: false,
    default: {top: 60, left: 1300},
  });

  game.settings.register(constants.moduleName, "skin", {
    name: "WorkshopModuleTemplate.Settings.skin.name",
    hint: "WorkshopModuleTemplate.Settings.skin.hint",
    scope: "client",
    config: true,
    default: 'default',
    type: String,
    choices: {
      "default": "WorkshopModuleTemplate.Settings.skin.default",
      "pill": "WorkshopModuleTemplate.Settings.skin.pill"
    },
    onChange: value => ui.unitFrames?.render()
  });

  /**
   game.settings.register(constants.moduleName, "someKey", {
    name: "WorkshopModuleTemplate.Settings.someKey.name",
    hint: "WorkshopModuleTemplate.Settings.someKey.hint",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });
   */
}