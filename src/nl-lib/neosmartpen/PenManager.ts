import $ from "jquery";
import { EventDispatcher, EventCallbackType } from "../common/event";
import { IBrushType, PenEventName } from "../common/enums";
import { IPenEvent } from "../common/structures";


import ThemeManager from "../../styles/ThemeManager"
import { IPenToViewerEvent } from "../common/neopen/INeoSmartpen";
import NeoSmartpen from "./NeoSmartpen";
import { IPenManager } from "../common/neopen/IPenManager";


let _penmanager_instance = null;
let _active_pen: NeoSmartpen = null;



export const DEFAULT_PEN_COLOR_NUM = 2;
export const DEFAULT_PEN_THICKNESS = 2;
export const DEFAULT_PEN_RENDERER_TYPE: IBrushType = IBrushType.PEN;



export default class PenManager  {
  /** @type {Array.<{id:string, mac:string, pen:NeoSmartpen, connected:boolean}>} */
  penArray = new Array(0);

  /** @type {Array.<StorageRenderer>} */
  // render = [];

  pen_colors: string[] = [
    "rgb(169, 169, 169)", // 0 DARK_GARY #FFAAAAAA #A9A9A9
    "rgb(255, 0, 0)", // 1 RED #FFFF0200 #FF0000  rgb(255, 0, 0, 0)
    "rgb(255, 255, 2)", // 2 YELLOW #FFFFD001 #FFFF02
    "rgb(0, 0, 128)", // 3 NAVY #FF012EE2 #000080

    "rgb(0, 0, 0)", // 4 BLACK #FF000000 #000000

    "rgb(211, 211, 211)", // 5 LIGHT_GRAY #FFE5E5E5 #D3D3D3
    "rgb(255, 165, 0)", // 6 ORANGE #FFFF6500 #FFA500
    "rgb(0, 128, 0)", // 7 GREEN #FF3CDD00 #008000

    "rgb(0, 0, 255)", // 8 BLUE #FF00ABEB #0000FF
    "rgb(128, 0, 128)", // 9 PURPLE #FF6C00E2 #800080
    "rgb(169, 169, 169)" // 10 DARK_GARY #FFAAAAAA #A9A9A9
  ];

  marker_colors: string[] = [
    "rgb(217, 217, 224)", // 0
    "rgb(232, 155, 162)", // 1
    "rgb(244, 244, 175)", // 2
    "rgb(166, 166, 212)", // 3

    "rgb(167, 167, 174)", // 4

    "rgb(231, 231, 238)", // 5
    "rgb(241, 214, 171)", // 6
    "rgb(166, 205, 173)", // 7

    "rgb(167, 167, 251)", // 8
    "rgb(205, 166, 212)", // 9
    "rgb(217, 217, 224)" // 10
  ];

  color: string = this.pen_colors[DEFAULT_PEN_COLOR_NUM];
  thickness: number = DEFAULT_PEN_THICKNESS;
  penRendererType: IBrushType = DEFAULT_PEN_RENDERER_TYPE;


  dispatcher: EventDispatcher = new EventDispatcher();

  init = () => {
    this.setThickness(DEFAULT_PEN_THICKNESS);
    this.setPenRendererType(DEFAULT_PEN_RENDERER_TYPE);
    this.setColor(DEFAULT_PEN_COLOR_NUM);
  }

  constructor() {
    if (_penmanager_instance) return _penmanager_instance;
  }

  static getInstance() {
    if (_penmanager_instance) return _penmanager_instance;

    _penmanager_instance = new PenManager();
    return _penmanager_instance;
  }

  /**
   *
   */
  public createPen = () => {
    const pen = new NeoSmartpen();
    pen.addEventListener(PenEventName.ON_CONNECTED, this.onConnected);
    pen.addEventListener(PenEventName.ON_DISCONNECTED, this.onDisconnected);
    pen.addEventListener(PenEventName.ON_PEN_PAGEINFO, this.onLivePenPageInfo);

    return pen;
  }

  onLivePenPageInfo = (event: IPenToViewerEvent) => {
    this.dispatcher.dispatch(PenEventName.ON_PEN_PAGEINFO, event);
  }

  /**
   *
   * @param pen
   * @param device
   */
  public add = (pen: NeoSmartpen, device: BluetoothDevice) => {
    console.log(device);
    this.penArray.push({
      id: device.id,
      mac: pen.getMac(),
      pen,
      connected: false
    });

    console.log(`PenManager: pen added, mac=${pen.getMac()}`);
  }

  /**
   *
   * @param device
   */
  public isAlreadyConnected = (device: BluetoothDevice): boolean => {
    const index = this.penArray.findIndex(penInfo => penInfo.id === device.id);
    if (index > -1) return true;

    return false;
  }

  /**
   *
   * @param pen
   */
  private removePen = (pen: NeoSmartpen) => {
    const btDeviceId = pen.getBtDevice().id;

    const index = this.penArray.findIndex(penInfo => penInfo.id === btDeviceId);
    if (index > -1) {
      this.penArray.splice(index, 1);
    }
  }

  setActivePen = (penId: string) => {
    _active_pen = this.penArray.find(penInfo => penInfo.pen.mac === penId).pen;
  }

  setColor(color_num: number) {
    this.toggleColorRadioButton(color_num);
    this.color = this.pen_colors[color_num];

    if (_active_pen) {
      _active_pen.setColor(this.color);
    }
  }

  toggleColorRadioButton(color_num: number) {
    const $elem = $(`.color_${color_num}`);
    this.toggleColorRadioButton_inner(undefined, $elem);
  }

  toggleColorRadioButton_inner(e, $elem) {
    if ($elem === undefined) {
      $elem = $(e.target);
    }
    if ($elem.hasClass("color_icon")) {
      $(".color_icon").each(function () {
        $(this).removeClass("pressed");
      });
      $elem.addClass("pressed");
    }
  }

  setPenRendererType(type: IBrushType) {
    const $elem = $("#btn_brush").find(".c2");
    this.setPenTypeStatus($elem, type);

    if (type === IBrushType.MARKER) {
      for (let i = 0; i < 11; i++) {
        $('#clr_' + [i]).find(".color_" + [i]).css('background-color', this.marker_colors[i]);
      }
    }
    else if (type === IBrushType.PEN) {
      for (let i = 0; i < 11; i++) {
        $('#clr_' + [i]).find(".color_" + [i]).css('background-color', this.pen_colors[i]);
      }
    }

    this.penRendererType = type;

    if (_active_pen) {
      _active_pen.setPenRendererType(this.penRendererType);
    }
  }

  setPenTypeStatus($elem, type) {
    if (type == IBrushType.MARKER) {
      $elem.removeClass("state_0");
      $elem.removeClass("state_2");

      $elem.addClass("state_1");
    } else if (type == IBrushType.ERASER) {
      $elem.removeClass("state_0");
      $elem.removeClass("state_1");

      $elem.addClass("state_2");
    } else if (type == IBrushType.PEN) {
      $elem.removeClass("state_1");
      $elem.removeClass("state_2");

      $elem.addClass("state_0");
    }
  }

  setThickness(thickness: number) {
    $("#thickness_num").text(thickness);

    thickness = thickness / 10;
    this.thickness = thickness;

    if (_active_pen) {
      _active_pen.setThickness(this.thickness);
    }
  }

  // registerRenderContainer = (renderContainer) => {
  //   this.render.push(renderContainer);
  // }

  // unregisterRenderContainer = (renderContainer) => {
  //   const sameRender = (item) => item === renderContainer;
  //   const index = this.penArray.findIndex(sameRender);

  //   if (index > -1) {
  //     this.render.splice(index, 1);
  //   }
  // }


  /**
   *
   * @param opt
   */
  public onConnected = (opt: { pen: NeoSmartpen, event: IPenEvent }) => {
    const { pen } = opt;
    const btDeviceId = pen.getBtDevice().id;

    const index = this.penArray.findIndex(penInfo => penInfo.id === btDeviceId);

    if (index > -1) {
      this.penArray[index].connected = true;
    }
    else {
      console.log("PenManager: something wrong, un-added pen connected");
      this.penArray.push({ id: pen.getBtDevice().id, mac: pen.getMac(), pen, connected: true });
    }

    const $elem = $("#btn_connect").find(".c2");
    $elem.addClass("checked");
    $("#pen_id").text(`${this.penArray.length}`);

    const themeManager = ThemeManager.getInstance();
    themeManager.enablePenRelatedButtons(true);
  }

  /**
   *
   * @param opt
   */
  public onDisconnected = (opt: { pen: NeoSmartpen, event: IPenEvent }) => {
    const { pen } = opt;
    const btDeviceId = pen.getBtDevice().id;

    const index = this.penArray.findIndex(penInfo => penInfo.id === btDeviceId);
    if (index > -1) {
      this.penArray.splice(index, 1);
    }
    else {
      console.log("PenManager: something wrong, un-added pen disconnected");
    }

    $("#pen_id").text(`${this.penArray.length}`);
    if (this.penArray.length === 0) {
      const $elem = $("#btn_connect").find(".c2");
      $elem.removeClass("checked");
    }
  }

  /**
   *
   * @param opt
   */
  public onNcodeError = (opt: { pen: NeoSmartpen, event: IPenEvent }) => {
    // const { pen, event } = opt;

  }

  /**
   *
   */
  getConnectedPens = (): NeoSmartpen[] => {
    /** @type {Array<NeoSmartpen>} */
    const ret = new Array(0);

    this.penArray.forEach(penInfo => {
      if (penInfo.connected) {
        ret.push(penInfo.pen);
      }
    });

    return ret;
  }



  public addEventListener(eventName: PenEventName, listener: EventCallbackType) {
    this.dispatcher.on(eventName, listener, null);
  }


  /**
   *
   * @param eventName
   * @param listener
   */
  public removeEventListener(eventName: PenEventName, listener: EventCallbackType) {
    this.dispatcher.off(eventName, listener);
  }

}