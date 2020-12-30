import { store } from "../../client/Root";
import GridaDoc from "../../GridaBoard/GridaDoc";
import NeoPdfDocument from "../../NcodePrintLib/NeoPdf/NeoPdfDocument";
//[Define Action Types
const ActionGroup = "ACTIVE_PDF";

const UrlActionType = Object.freeze({
  SET: `${ActionGroup}.SET`,
  GET: `${ActionGroup}.GET`,

  // SET_DOC_NUMPAGES: `${ActionGroup}.SET_DOC_NUMPAGES`,
  // SET_DOC_ACTIVE_PAGE_NO: `${ActionGroup}.SET_DOC_ACTIVE_PAGE_NO`,
  // SET_DOC_ACTIVE_PDF: `${ActionGroup}.SET_DOC_ACTIVE_PDF`,
});
//]


export const setUrlAndFilename = async (url: string, filename: string) => {
  store.dispatch({
    type: UrlActionType.SET,
    value: { url, filename },
  });
};

export const setDocNumPages = async (numPages: number) => {
  store.dispatch({
    type: UrlActionType.SET,
    value: { numDocPages: numPages },
  });
}


export const setActivePageNo = async (pageNo: number) => {
  store.dispatch({
    type: UrlActionType.SET,
    value: { activePageNo: pageNo },
  });
}

export const setActivePdf = async (pdf: NeoPdfDocument) => {
  const filename = pdf.filename;
  const url = pdf.url;

  store.dispatch({
    type: UrlActionType.SET,
    value: { url, filename, pdf }
  });

}




const initialState = {
  pdf: undefined as NeoPdfDocument,
  url: undefined as string,
  filename: undefined as string,

  numDocPages: 0,
  activePageNo: 0,

  section: 0,
  owner: 0,
  book: 0,
  page: 0,
};

export type IActivePageState = typeof initialState;

//[Reducer
export default (state = initialState, action) => {
  // console.log(action);

  switch (action.type) {
    case UrlActionType.SET: {
      return {
        ...state,
        ...action.value
      };
    }

    default: {
      return state;
    }
  }
};
//]
