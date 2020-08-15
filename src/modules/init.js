import constants from "./constants.js";
import registerSettings from "./settings.js";
import UnitFramesBox from "./apps/UnitFramesBox.js";
import QuestTracker from "./apps/QuestTracker.js";

Hooks.once('init', () => {
  registerSettings();

  Hooks.callAll(`${constants.moduleName}:afterInit`);
});

Hooks.once('setup', () => {

  Hooks.callAll(`${constants.moduleName}:afterSetup`);
});

Hooks.once("ready", () => {
  UnitFramesBox.init();
  if (game.settings.get(constants.moduleName, 'enableQuestTracker'))
    if (game.modules.get("forien-quest-log")?.active)
      QuestTracker.init();

  Hooks.callAll(`${constants.moduleName}:afterReady`);
});

Hooks.on("canvasReady", () => {
  if (ui.unitFrames) ui.unitFrames.render();

  Hooks.callAll(`${constants.moduleName}:afterCanvasReady`);
});

Hooks.on("createToken", () => {
  if (ui.unitFrames?.rendered) ui.unitFrames.render();
});

Hooks.on("targetToken", (user, token, isTargeted) => {
  if (user.id !== game.user.id) return;
  if (ui.unitFrames?.rendered) ui.unitFrames.setTargetFrame(token, isTargeted);
});

Hooks.on("deleteToken", (scene, token, options, userId) => {
  if (ui.unitFrames?.rendered) ui.unitFrames.removeFrame(token);
});

Hooks.on("updateToken", (scene, token, data, options, userId) => {
  if (data.displayBars !== undefined && ui.unitFrames?.rendered) return ui.unitFrames.render();
  if (ui.unitFrames?.rendered) ui.unitFrames.updateFrame(token);
});

Hooks.on("updateActor", (actor, data, options, userId) => {
  if (!ui.unitFrames?.rendered) return;

  for (let token of actor.getActiveTokens(true)) {
    ui.unitFrames.updateFrame(token);
  }
});

/**
 * Need to Update Quest Log with custom Hooks :c
 */
Hooks.on("updateJournalEntry", () => {
  if (ui.questTracker) ui.questTracker.render();
});