
import React, { useEffect, useState } from "react";
import { ButtonProps, } from "@material-ui/core";

import { IPrintingReport, IPrintOption } from "../../common/structures";
import ProgressDialog from "./ProgressDialog";
import PrintNcodedPdfWorker from "./PrintNcodedPdfWorker";
import { OptionDialog } from "./Dialogs/OptionDialog";
import CancelWaitingDialog from "./CancelWaitingDialog";
import { cloneObj } from "../../common/util";
import Button from '@material-ui/core/Button';

interface Props extends ButtonProps {
  /** 인쇄될 문서의 url, printOption.url로 들어간다. */
  url: string,
  filename: string,

  /** 인쇄 준비 상태를 업데이트하는 콜백 함수 */
  reportProgress?: (arg: IPrintingReport) => void,

  /** 기본값의 IPrintOption을 받아서, dialog를 처리하고 다시 돌려주는 콜백 함수 */
  printOptionCallback?: (arg: IPrintOption) => IPrintOption,

  /** 앱이 key event를 바인딩하고 있으면, form에 입력이 안된다, 그래서, dialog가 control 할 수 있도록 전달 */
  handkeTurnOnAppShortCutKey: (on: boolean) => void,

  /** 버튼 클릭시에 pdf url을 직접 생성하고 싶을 때 사용. 기생성된 url을 쓰고 싶으면 props.url에 값을 받으면 됨 */
  handlePdfUrl?: () => string,
}

/**
 * locally global variables
 */


/** default print option의 포인터 */
let _printOptionPointer: IPrintOption;

/** dialog에서 임시로 쓰는 option */
let _workingOption: IPrintOption;

/** modal dialog를 async/await 함수에서 쓰도록 한 것 */
let _promise: Promise<IPrintOption>;

/** _promise의 resolve callback */
let _resolve;

const printStyle = {
  padding: "0px",
  margin: "0px",
  border: "0px",
  minWidth: "24px"
}

/**
 * Class
 */
export default function PrintNcodedPdfButton(props: Props) {
  const { url, filename, reportProgress, printOptionCallback, ...rest } = props;

  const [progressPercent, setProgressPercent] = useState(0);
  const [status, setStatus] = useState("N/A");
  const [progressOn, setProgressOn] = useState(false);
  const [optionOn, setOptionOn] = useState(false);
  const [worker, setWorker] = useState(undefined as PrintNcodedPdfWorker);
  const [waitingOn, setWaitingOn] = useState(false);

  const closeOptionDialog = () => setOptionOn(false);
  const openOptionDialog = () => setOptionOn(true);

  useEffect(() => {
    // console.log(`status = ${status}, progress=${progressPercent}`);
  }, [status, progressPercent]);


  /**
   * 인쇄의 시작, worker가 PDF를 만들고 viewer를 띄우는 등 모든 작업을 한다.
   */
  const startPrint = async () => {
    // if (props.url && props.filename) {
      // setStart(true);
      const worker = new PrintNcodedPdfWorker(props, onProgress);
      setWorker(worker);

      setProgressPercent(0);

      /**
       * worker의 startPrint에서는
       * 1) 기본 printOptino의 설정을 마치고,
       * 2) onConfigurePrintOption를 불러서 다이얼로그를 띄운다
       * 3) 다이얼로그의 OK를 클릭하게 되면, worker는 계속 진행, cancel을 클릭하면 worker가 exit
       * 4) worker가 exit하고 나면 worker.startPrint 다음의 행이 실행된다.
       */

      let url = '';
      if (props.url === undefined) {
        url = await props.handlePdfUrl();
      } else {
        url = props.url;
      }
      await worker.startPrint(url, 'GridaBoard', onConfigurePrintOption);

      console.log("CANCEL, worker canceled");
      setProgressOn(false);
      setWaitingOn(false);
  }

  /**
   * worker에서 callback으로 불려지는, printOption의 개인 설정 다이얼로그를 처리하는 부분
   *
   * promise 관점에서 보면, 아래의 onOK, onCancel과 쌍을 이룬다.
   * onConfigurePrintOption 에서 promimse를 생성하고, onOK 또는 onCancel 에서 resolve하는 식이다.
   *
   * @param printOption
   */
  const onConfigurePrintOption = (printOption: IPrintOption): Promise<IPrintOption> => {
    // 리턴값을 준비
    const promise = new Promise((resolve) => {
      _resolve = resolve;
    }) as Promise<IPrintOption>;
    _promise = promise;

    // 취소 버튼을 대비
    _printOptionPointer = printOption;
    _workingOption = cloneObj(printOption);

    // 완료시 콜백
    _workingOption.completedCallback = onAfterPrint;

    // 다이얼로그를 열어 놓고
    openOptionDialog();

    // promise가 종료되지 않은 상태로 리턴, onAfterPrint 등에서 promise를 resolve
    return promise;
  }

  /**
   * configure 다이얼로그에서 OK가 눌려졌다. worker로 돌아갈 수 있도록 resolve(printOption);
   * @param printOption
   */
  const onOK = (printOption: IPrintOption) => {
    // 디이얼로그를 닫고, 프로그레스 바를 보여준다.
    closeOptionDialog();
    setProgressOn(true);

    // default option으로 저장해 둔다.
    _printOptionPointer = printOption;

    // _printOption을 돌려 줘서 세팅 값을 반환한다.
    if (_resolve) _resolve(printOption);
    console.log("onOK");
  }

  /**
   * configure 다이얼로그에서 cancel이 눌려졌다. worker로 돌아가서 바로 빠져 나오도록 undefined
   * @param printOption
   */
  const onCancel = (printOption: IPrintOption) => {
    // 디이얼로그를 닫고, 프로그레스 바를 열지 않는다.
    closeOptionDialog();

    console.log("onCancel");

    // _printOption이 세팅되지 않았음을 전한다.
    // 받는 곳에서는 undefined가 되어 있는지 확인해야 한다.
    if (_resolve) _resolve(undefined);
  }






  /**
   * worker에서 progress가 있을 때 마다 보고하는 callback
   * @param event
   */

  const onProgress = (event: IPrintingReport) => {
    setProgressPercent(event.totalCompletion);
    setStatus(event.status);
  }


  /**
   * worker가 인쇄를 마쳤다는 시그널을 주는 callback
   */
  const onAfterPrint = () => {
    setProgressOn(false);
    setWaitingOn(false);

    _workingOption = undefined;
    _resolve = undefined;
    console.log("END OF PRINT");
    console.log("CANCEL, END OF PRINT");

  }


  /**
   * worker에 인쇄 준비 작업을 중당하라는 시그널을 주는 곳
   * 시그널을 준다고 당장 중지되지는 않는다.
   */
  const cancelPrint = () => {
    setWaitingOn(true);
    worker.cancelPrint();
  }




  let dialogTitle = status === "prepared" ? "인쇄 종료 대기 중" : "인쇄 준비 중";
  dialogTitle = status === "completed" ? "완료" : dialogTitle;

  const optionDialogOn = optionOn;
  // const optionDialogOn = true;
  // _workingOption = g_defaultPrintOption;
  return (
    <React.Fragment>
      <Button {...rest} onClick={startPrint} style={printStyle}>
        {props.children}
      </Button>

      { optionDialogOn
        ? <OptionDialog open={optionDialogOn}
          cancelCallback={onCancel} okCallback={onOK}
          handkeTurnOnAppShortCutKey={props.handkeTurnOnAppShortCutKey}
          printOption={_workingOption}
        />
        : <ProgressDialog progress={progressPercent} title={dialogTitle} open={progressOn} cancelCallback={cancelPrint} />
      }
      <CancelWaitingDialog open={waitingOn} />
    </React.Fragment>
  );
}


