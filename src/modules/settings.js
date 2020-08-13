import constants from "./constants.js";
import QuestTracker from "./apps/QuestTracker.js";

const unitFrameDefault = {top: 400, left: 120};
const questTrackerDefault = {top: 80};

export default function registerSettings() {
  game.settings.register(constants.moduleName, "unit-frame-box-position", {
    scope: "client",
    config: false,
    default: unitFrameDefault,
  });

  game.settings.register(constants.moduleName, "quest-tracker-position", {
    scope: "client",
    config: false,
    default: questTrackerDefault,
  });

  game.settings.register(constants.moduleName, "skin", {
    name: "WorkshopPUF.Settings.skin.name",
    hint: "WorkshopPUF.Settings.skin.hint",
    scope: "client",
    config: true,
    default: 'default',
    type: String,
    choices: {
      "default": "WorkshopPUF.Settings.skin.default",
      "pill": "WorkshopPUF.Settings.skin.pill"
    },
    onChange: value => {
      if (ui.unitFrames?.rendered) {
        ui.unitFrames.element.removeClass().addClass(value);
      }
    }
  });

  game.settings.register(constants.moduleName, "enableQuestTracker", {
    name: "WorkshopPUF.Settings.enableQuestTracker.name",
    hint: "WorkshopPUF.Settings.enableQuestTracker.hint",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: value => {
      if (value && game.modules.get("forien-quest-log")?.active) {
        QuestTracker.init();
        ui.questTracker.render(true);
      } else {
        ui.questTracker.close();
      }
    }
  });

  game.settings.register(constants.moduleName, "questTrackerBackground", {
    name: "WorkshopPUF.Settings.questTrackerBackground.name",
    hint: "WorkshopPUF.Settings.questTrackerBackground.hint",
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    onChange: value => {
      if (ui.questTracker?.rendered) {
        ui.questTracker.element.toggleClass('background', value);
      }
    }
  });

  game.settings.register(constants.moduleName, "resetUnitFrames", {
    name: "WorkshopPUF.Settings.resetUnitFrames.name",
    hint: "WorkshopPUF.Settings.resetUnitFrames.hint",
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    onChange: value => {
      if (value) {
        game.settings.set(constants.moduleName, "unit-frame-box-position", unitFrameDefault);
        game.settings.set(constants.moduleName, "resetUnitFrames", false);
        if (ui.unitFrames?.rendered) ui.unitFrames.render();
      }
    }
  });

  game.settings.register(constants.moduleName, "resetQuestTracker", {
    name: "WorkshopPUF.Settings.resetQuestTracker.name",
    hint: "WorkshopPUF.Settings.resetQuestTracker.hint",
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    onChange: value => {
      if (value) {
        game.settings.set(constants.moduleName, "quest-tracker-position", questTrackerDefault);
        game.settings.set(constants.moduleName, "resetQuestTracker", false);
        if (ui.questTracker?.rendered) ui.questTracker.render();
      }
    }
  });
}