import QuestTracker from "./apps/QuestTracker";
import UnitFramesBox from "./apps/UnitFramesBox";
import { i18n } from "../foundryvtt-workshop-party-unit-frames";

const unitFrameDefault = {top: 400, left: 120};
const questTrackerDefault = {top: 80};

export const MODULE_NAME = "workshop-party-unit-frames";
export const MODULE_PATH = "modules/workshop-party-unit-frames";
export const MODULE_LABEL = "Workshop's Party Unit Frames";

export const registerSettings = function () {
// export default function registerSettings() {

  game.settings.register(MODULE_NAME, "unit-frame-box-position", {
    scope: "client",
    config: false,
    default: unitFrameDefault,
  });

  game.settings.register(MODULE_NAME, "quest-tracker-position", {
    scope: "client",
    config: false,
    default: questTrackerDefault,
  });

  game.settings.register(MODULE_NAME, "skin", {
    name: i18n(MODULE_NAME+".Settings.skin.name"),
    hint: i18n(MODULE_NAME+".Settings.skin.hint"),
    scope: "client",
    config: true,
    default: 'default',
    type: String,
    choices: {
      "default": i18n(MODULE_NAME+".Settings.skin.default"),
      "pill": i18n(MODULE_NAME+".Settings.skin.pill"),
      "thin": i18n(MODULE_NAME+".Settings.skin.thin")
    },
    onChange: value => {
      if (ui['unitFrames']?.rendered) {
        ui['unitFrames'].element.removeClass('default pill thin').addClass(value);
      }
    }
  });

  game.settings.register(MODULE_NAME, "filter", {
    name: i18n(MODULE_NAME+".Settings.filter.name"),
    hint: i18n(MODULE_NAME+".Settings.filter.hint"),
    scope: "client",
    config: true,
    default: 'none',
    type: String,
    choices: {
      "none": i18n(MODULE_NAME+".Settings.filter.none"),
      "damped": i18n(MODULE_NAME+".Settings.filter.damped"),
      "grayscale": i18n(MODULE_NAME+".Settings.filter.grayscale"),
      "sepia": i18n(MODULE_NAME+".Settings.filter.sepia")
    },
    onChange: value => {
      if (ui['unitFrames']?.rendered) {
        ui['unitFrames'].element.removeClass('none damped grayscale sepia').addClass(value);
      }
    }
  });

  game.settings.register(MODULE_NAME, "showUnlikedTokens", {
    name: i18n(MODULE_NAME+".Settings.showUnlikedTokens.name"),
    hint: i18n(MODULE_NAME+".Settings.showUnlikedTokens.hint"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
    onChange: value => ui['unitFrames']?.render()
  });

  game.settings.register(MODULE_NAME, "showResourceValues", {
    name: i18n(MODULE_NAME+".Settings.showResourceValues.name"),
    hint: i18n(MODULE_NAME+".Settings.showResourceValues.hint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: value => ui['unitFrames']?.render()
  });

  game.settings.register(MODULE_NAME, "enableQuestTracker", {
    name: i18n(MODULE_NAME+".Settings.enableQuestTracker.name"),
    hint: i18n(MODULE_NAME+".Settings.enableQuestTracker.hint"),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: value => {
      if (value && game.modules.get("forien-quest-log")?.active) {
        QuestTracker.init();
        ui['questTracker'].render(true);
      } else {
        ui['questTracker'].close();
      }
    }
  });

  game.settings.register(MODULE_NAME, "enableUnitFramesBox", {
    name: i18n(MODULE_NAME+".Settings.enableUnitFramesBox.name"),
    hint: i18n(MODULE_NAME+".Settings.enableUnitFramesBox.hint"),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
    onChange: value => {
      if (ui['unitFrames']?.rendered) {
        ui['unitFrames'].close();
      } else {
        UnitFramesBox.init();
        ui['unitFrames'].render(true);
      }
    }
  });

  game.settings.register(MODULE_NAME, "questTrackerBackground", {
    name: i18n(MODULE_NAME+".Settings.questTrackerBackground.name"),
    hint: i18n(MODULE_NAME+".Settings.questTrackerBackground.hint"),
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    onChange: value => {
      if (ui['questTracker']?.rendered) {
        ui['questTracker'].element.toggleClass('background', value);
      }
    }
  });

  game.settings.register(MODULE_NAME, "resetUnitFrames", {
    name: i18n(MODULE_NAME+".Settings.resetUnitFrames.name"),
    hint: i18n(MODULE_NAME+".Settings.resetUnitFrames.hint"),
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    onChange: value => {
      if (value) {
        game.settings.set(MODULE_NAME, "unit-frame-box-position", unitFrameDefault);
        game.settings.set(MODULE_NAME, "resetUnitFrames", false);
        if (ui['unitFrames']?.rendered) ui['unitFrames'].render();
      }
    }
  });

  game.settings.register(MODULE_NAME, "resetQuestTracker", {
    name: i18n(MODULE_NAME+".Settings.resetQuestTracker.name"),
    hint: i18n(MODULE_NAME+".Settings.resetQuestTracker.hint"),
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    onChange: value => {
      if (value) {
        game.settings.set(MODULE_NAME, "quest-tracker-position", questTrackerDefault);
        game.settings.set(MODULE_NAME, "resetQuestTracker", false);
        if (ui['questTracker']?.rendered) ui['questTracker'].render();
      }
    }
  });
}
