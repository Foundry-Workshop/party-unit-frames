import { warn, error, debug, i18n } from "../foundryvtt-workshop-party-unit-frames";
import {registerSettings,  MODULE_NAME } from "./settings.js";
import UnitFramesBox from "./apps/UnitFramesBox";
import QuestTracker from "./apps/QuestTracker";

export let readyHooks = async () => {

  if (game.settings.get(MODULE_NAME, 'enableUnitFramesBox'))
    UnitFramesBox.init();

  if (game.settings.get(MODULE_NAME, 'enableQuestTracker'))
    if (game.modules.get("forien-quest-log")?.active)
      QuestTracker.init();

  Hooks.callAll(`${MODULE_NAME}:afterReady`);


}

export let initHooks = () => {
  warn("Init Hooks processing");

  // setup all the hooks
  Hooks.callAll(`${MODULE_NAME}:afterInit`);

  Hooks.once('setup', () => {

    Hooks.callAll(`${MODULE_NAME}:afterSetup`);
  });

  Hooks.on("canvasReady", () => {
    if (ui['unitFrames']) ui['unitFrames'].render();

    Hooks.callAll(`${MODULE_NAME}:afterCanvasReady`);
  });

  Hooks.on("createToken", () => {
    if (ui['unitFrames']?.rendered) ui['unitFrames'].render();
  });

  Hooks.on("targetToken", (user, token, isTargeted) => {
    if (user.id !== game.user.id) return;
    if (ui['unitFrames']?.rendered) ui['unitFrames'].setTargetFrame(token, isTargeted);
  });

  Hooks.on("deleteToken", (scene, token, options, userId) => {
    if (ui['unitFrames']?.rendered) ui['unitFrames'].removeFrame(token);
  });

  Hooks.on("updateToken", (scene, token, data, options, userId) => {
    if (data.displayBars !== undefined && ui['unitFrames']?.rendered) return ui['unitFrames'].render();
    if (ui['unitFrames']?.rendered) ui['unitFrames'].updateFrame(token);
  });

  Hooks.on("updateActor", (actor, data, options, userId) => {
    if (!ui['unitFrames']?.rendered) return;

    for (let token of actor.getActiveTokens(true)) {
      ui['unitFrames'].updateFrame(token);
    }
  });

  /**
   * Need to Update Quest Log with custom Hooks :c
   */
  Hooks.on("updateJournalEntry", () => {
    if (ui['questTracker']) ui['questTracker'].render();
  });

}
