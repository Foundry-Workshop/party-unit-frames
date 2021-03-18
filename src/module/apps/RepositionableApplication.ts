import { MODULE_NAME } from "../settings";

export default class RepositionableApplication extends Application {
  static app;
  positionSetting;

  /** @override */
  getData(options:any = {}) {
    options = super.getData(options);
    options.pos = game.settings.get(MODULE_NAME, this.positionSetting);

    return options;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html.find('.move-handle').mousedown(this.reposition.bind(this));
  }

  /**
   * Repurposed code originally written by user ^ and stick for Token Action HUD
   *
   * @author ^ and stick#0520
   * @url https://github.com/espositos/fvtt-tokenactionhud/blob/master/scripts/tokenactionhud.js#L199
   */
  reposition(ev) {
    ev.preventDefault();
    ev = ev || window.event;

    const _this = this;
    let hud = $(ev.currentTarget).parent();
    let marginLeft = parseInt(hud.css('marginLeft').replace('px', ''));
    let marginTop = parseInt(hud.css('marginTop').replace('px', ''));

    dragElement(document.getElementById(hud.attr('id')));
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    function dragElement(elmnt) {
      elmnt.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        elmnt.style.top = (elmnt.offsetTop - pos2) - marginTop + 'px';
        elmnt.style.left = (elmnt.offsetLeft - pos1) - marginLeft + 'px';
        elmnt.style.position = 'fixed';
        elmnt.style.zIndex = '100';
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        elmnt.onmousedown = null;
        document.onmouseup = null;
        document.onmousemove = null;
        let xPos = (elmnt.offsetLeft - pos1) > window.innerWidth ? window.innerWidth : (elmnt.offsetLeft - pos1);
        let yPos = (elmnt.offsetTop - pos2) > window.innerHeight - 20 ? window.innerHeight - 100 : (elmnt.offsetTop - pos2);
        xPos = xPos < 0 ? 0 : xPos;
        yPos = yPos < 0 ? 0 : yPos;

        if (xPos !== (elmnt.offsetLeft - pos1) || yPos !== (elmnt.offsetTop - pos2)) {
          elmnt.style.top = (yPos) + 'px';
          elmnt.style.left = (xPos) + 'px';
        }

        _this.savePosition({top: yPos, left: xPos});
      }
    }
  }

  async savePosition(pos = {top: 400, left: 120}) {
    if (pos.top && pos.left) return game.settings.set(MODULE_NAME, this.positionSetting, pos);
  }
}
