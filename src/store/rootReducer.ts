
import { combineReducers } from 'redux';
import activePdfReducer from "./reducers/activePdfReducer"

import authorizationReducer from './reducers/authorization';
import pointerTracer from './reducers/pointerTracer';
import rotate from './reducers/rotate';
import uiReducer from './reducers/ui';
import progressDlgReducer from "./reducers/progressDlgReducer";
import calibrationReducer from "./reducers/calibrationReducer";


const rootReducer = combineReducers({
  auth: authorizationReducer,
  ui: uiReducer,
  pointerTracer,
  rotate,
  pdfInfo: activePdfReducer,
  progress: progressDlgReducer,

  calibration: calibrationReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
