import constants from "../constants.js";

export default class UnitFramesBox extends Application {
  static app;
  tokenColors = {};

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "unit-frame-box",
      template: `${constants.modulePath}/templates/hud/unit-frame-box.html`,
      popOut: false
    });
  }

  /** @override */
  getData(options = {}) {
    options = super.getData(options);
    options.tokens = this.getTokens();
    options.frames = this.prepareTokens(options.tokens);
    options.pos = game.settings.get(constants.moduleName, 'position');
    options.skin = game.settings.get(constants.moduleName, 'skin');
    return options;
  }

  prepareTokens(tokens) {
    let frames = [];
    for (let [id, t] of tokens) {
      let color = this.getTokenColor(t);
      frames.push({
        id: id,
        color: color,
        name: t.name,
        primary: this.getPrimary(t),
        secondary: this.getSecondary(t)
      })
    }

    return frames;
  }

  getPrimary(token) {
    return this.getAttribute(token, 'bar1');
  }

  getSecondary(token) {
    return this.getAttribute(token, 'bar2');
  }

  getAttribute(token, bar) {
    let barData = token.getBarAttribute(bar);
    if (!barData) return 0;

    return Math.round((barData.value * 100) / barData.max);
  }

  getTokenColor(token) {
    if (token.actor) {
      const user = game.users.entities.filter(u => u.character).find(u => token.actor.id === u.character.id);
      if (user) return user.data.color;
    }

    return this.randomizeColor(token);
  }

  randomizeColor(token) {
    if (this.tokenColors[token.id] === undefined) {
      this.tokenColors[token.id] = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6)
    }

    return this.tokenColors[token.id]
  }

  getTokens() {
    const tokens = new Map();

    // first linked character
    if (game.user.character) {
      let linked = canvas.tokens.placeables.find(t => t.actor.id === game.user.character.id);
      if (linked) {
        tokens.set(linked.id, linked);
      }
    }
    // then all owned, sorted alphabetically
    canvas.tokens.placeables.filter(t => t.owner && this.canSeeBars(t)).sort(this._sortNames).forEach(t => tokens.set(t.id, t));
    // then rest, sorted alphabetically
    canvas.tokens.placeables.filter(t => this.canSeeBars(t)).sort(this._sortNames).forEach(t => tokens.set(t.id, t));

    return tokens;
  }

  _sortNames(a, b) {
    return a.name.localeCompare(b.name);
  }

  canSeeBars(token) {
    switch (token.data.displayBars) {
      case CONST.TOKEN_DISPLAY_MODES.ALWAYS:
      case CONST.TOKEN_DISPLAY_MODES.HOVER:
        return true;
      case CONST.TOKEN_DISPLAY_MODES.CONTROL:
      case CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER:
      case CONST.TOKEN_DISPLAY_MODES.OWNER:
        return token.owner;
      default:
        return false;
    }
  }

  static init() {
    const instance = new this();
    ui.unitFrames = instance;
    instance.render(true);
  }


  activateListeners(html) {
    super.activateListeners(html);

    html.find('.move-handle').mousedown(this.reposition);
    // html.on('dblclick', '.unit-frame', this._handleFrameDoubleClick);
    html.on('click', '.unit-frame', this._handleFrameClick);
    html.on('contextmenu', '.unit-frame', this._handleFrameClick);
  }

  _handleFrameClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.originalEvent.detail < 2) {
      switch (event.originalEvent.button) {
        case 2:
          UnitFramesBox._onRightClick(event);
          break;
        case 0:
        default:
          UnitFramesBox._onClick(event);
      }
    } else {
      UnitFramesBox._onDoubleClick(event);
    }
  }


  static _onClick(event) {
    const id = event.currentTarget.dataset.id;
    const token = canvas.tokens.get(id);
    const release = !game.keyboard.isDown("Shift");
    token.setTarget(true, {user: game.user, releaseOthers: release});
  }

  static _onRightClick(event) {
    const id = event.currentTarget.dataset.id;
    const token = canvas.tokens.get(id);
    if (token.actor?.permission > 0)
      token.actor.sheet.render(true, {token: token});
  }

  static _onDoubleClick(event) {
    const id = event.currentTarget.dataset.id;
    const token = canvas.tokens.get(id);
    canvas.animatePan({x: token.data.x, y: token.data.y, scale: 1});
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

        UnitFramesBox.savePosition({top: yPos, left: xPos});
      }
    }
  }

  static async savePosition(pos = {top: 400, left: 120}) {
    if (pos.top && pos.left) return game.settings.set(constants.moduleName, 'position', pos);
  }

  updateFrame(token) {
    let id = token.data?._id || token._id;
    token = canvas.tokens.get(id);
    const _this = this;

    this.element.find(`#unit-frame-${id}`).each(function () {
      if (!token) return $(this).remove();

      $(this).find('.primary .bar').css('width', _this.getPrimary(token) + "%");
      $(this).find('.secondary .bar').css('width', _this.getSecondary(token) + "%");
      $(this).find('.name').text(token.name);
    });
  }

  removeFrame(token) {
    let id = token._id;

    this.element.find(`#unit-frame-${id}`).remove();
  }
}