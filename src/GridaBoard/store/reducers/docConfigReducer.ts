import { store } from "../../client/pages/GridaBoard";

//[Define Action Types

const ActionGroup = "DOC_CONFIG";

const ACTION_TYPE = Object.freeze({
  SET: `${ActionGroup}.SET`,
  GET: `${ActionGroup}.GET`,
});
//]

//[Action Methods

export const setDocName = async (docName: string) => {
  store.dispatch({
    type: ACTION_TYPE.SET,
    value: { docName: docName } as ActionValue,
  });
};

export const setDate = async (date: string) => {
  store.dispatch({
    type: ACTION_TYPE.SET,
    value: { date: date } as ActionValue,
  });
};

export const setIsNewDoc = async (isNew: boolean) => {
  store.dispatch({
    type: ACTION_TYPE.SET,
    value: { isNewDoc: isNew } as ActionValue,
  });
};

type ActionValue = {
  docName: string,
  isNewDoc: boolean,
  date: string,
}
//]

//[Reducer
const initialState = {
  docName: 'undefined',
  isNewDoc: true,
  date: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPE.SET: {
      const value = action.value as typeof initialState;
      return {
        ...state,
        ...value
      };
    }
    default: {
      return state;
    }
  }
};
//]