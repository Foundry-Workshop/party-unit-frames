import constants from "./constants.js";

export default function registerSettings() {
  game.settings.register(constants.moduleName, "position", {
    scope: "client",
    config: false,
    default: {top: 400, left: 120},
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