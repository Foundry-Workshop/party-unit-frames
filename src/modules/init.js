import constants from "./constants.js";
import registerSettings from "./settings.js";
import UnitFramesBox from "./apps/UnitFramesBox.js";

Hooks.once('init', () => {
  registerSettings();

  Hooks.callAll(`${constants.moduleName}:afterInit`);
});

Hooks.once('setup', () => {

  Hooks.callAll(`${constants.moduleName}:afterSetup`);
});

Hooks.once("ready", () => {
  UnitFramesBox.init();

  Hooks.callAll(`${constants.moduleName}:afterReady`);
});

Hooks.on("canvasReady", () => {
  if (ui.unitFrames) ui.unitFrames.render();

  Hooks.callAll(`${constants.moduleName}:afterCanvasReady`);
});

Hooks.on("createToken", () => {
  if (ui.unitFrames?.rendered) ui.unitFrames.render();
});

Hooks.on("deleteToken", (scene, token, options, userId) => {
  if (ui.unitFrames?.rendered) ui.unitFrames.removeFrame(token);
});

Hooks.on("updateToken", (scene, token, data, options, userId) => {
  if (ui.unitFrames?.rendered) ui.unitFrames.updateFrame(token);
});

Hooks.on("updateActor", (actor, data, options, userId) => {
  if (!ui.unitFrames?.rendered) return;

  for (let token of actor.getActiveTokens(true)) {
    ui.unitFrames.updateFrame(token);
  }
});