import { store } from "../client/Root";
import { PenEventName } from "../nl-lib/common/enums";
import { IPageSOBP } from "../nl-lib/common/structures";
import { MappingStorage } from "../nl-lib/common/mapper";
import { IPenToViewerEvent } from "../nl-lib/common/neopen";
import { setPens } from "../store/reducers/appConfigReducer";
import GridaDoc from "./GridaDoc";
import PenManager from "../nl-lib/neosmartpen/PenManager";
import { NeoSmartpen } from "../nl-lib/neosmartpen";

let _app_instance = undefined as GridaApp;

export default class GridaApp {
  _doc: GridaDoc;
  _penManager: PenManager;

  _pens: NeoSmartpen[];

  constructor() {
    if (_app_instance) return _app_instance;

    this._doc = GridaDoc.getInstance();
    this._penManager = PenManager.getInstance();
    this._penManager.addEventListener(PenEventName.ON_PEN_PAGEINFO, this.onNcodePageChanged);

    store.subscribe(this.onStateChanged);
    console.log("GridaApp: GridaDoc initied");
  }

  static getInstance() {
    if (_app_instance) return _app_instance;
    _app_instance = new GridaApp();

    return _app_instance;
  }

  onStateChanged = () => {
    // const state = store.getState();
    console.log(`GridaApp: store state changed`);
  }

  start = () => {
    const doc = GridaDoc.getInstance();
    // const filename = "___1page.pdf";
    // const url = "./___1page.pdf";

    const filename = "A4_Pirates-of-the-Caribbean-Hes-a-Pirate-Klaus-Badelt.pdf";
    const url = "./A4_Pirates-of-the-Caribbean-Hes-a-Pirate-Klaus-Badelt.pdf";

    doc.openPdfFile({ url, filename });
  }


  onNcodePageChanged = (event: IPenToViewerEvent) => {
    const pageInfo = { section: event.section, owner: event.owner, book: event.book, page: event.page } as IPageSOBP;

    const msi = MappingStorage.getInstance();
    const found = msi.getNPageTransform(pageInfo);

    const doc = GridaDoc.getInstance();
    const result = doc.handleActivePageChanged(pageInfo, found);

    // if (!noMoreAutoLoad && result.needToLoadPdf) {
    //   handleFileLoadNeeded(found, result.pageInfo, result.basePageInfo);
    // }

    // console.log(`GridaApp: get new page info: ${makeNPageIdStr(pageInfo)}`);
  }


  onPenLinkChanged = (e) => {
    const state = store.getState();
    this._pens = state.appConfig.pens;

    const pen = e.pen;
    if (e.event.event === 'on_connected') {
      this._pens.push(pen);
      setPens([...this._pens]);
    }
    else if (e.event.event === 'on_disconnected') {
      const mac = pen.getMac();
      console.log(`Home: OnPenDisconnected, mac=${pen.getMac()}`);
      const index = this._pens.findIndex(p => p.getMac() === mac);
      if (index > -1) {
        const newPens = this._pens.splice(index, 1);
        setPens([...newPens]);
      }
    }
  }
}

