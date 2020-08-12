import constants from "../constants.js";
import RepositionableApplication from "./RepositionableApplication.js";

export default class QuestTracker extends RepositionableApplication {
  static app;
  positionSetting = 'quest-tracker-position';

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "quest-tracker",
      template: `${constants.modulePath}/templates/hud/quest-tracker.html`,
      popOut: false
    });
  }

  /** @override */
  getData(options = {}) {
    options = super.getData(options);
    options.quests = this.prepareQuests();

    return options;
  }

  prepareQuests() {
    const quests = Quest.getQuests();
  }

  static init() {
    if (ui.questTracker instanceof this) return;

    const instance = new this();
    ui.questTracker = instance;
    instance.render(true);
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html.on('click', '.unit-frame', this._handleClick);
    html.on('contextmenu', '.unit-frame', this._handleClick);
  }

  _handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.originalEvent.detail < 2) {
      switch (event.originalEvent.button) {
        case 2:
          QuestTracker._onRightClick(event);
          break;
        case 0:
        default:
          QuestTracker._onClick(event);
      }
    } else {
      QuestTracker._onDoubleClick(event);
    }
  }


  static _onClick(event) {
  }

  static _onRightClick(event) {
  }

  static _onDoubleClick(event) {
  }
}