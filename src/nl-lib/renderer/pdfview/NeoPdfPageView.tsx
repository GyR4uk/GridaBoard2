import React, { Component } from 'react';
import { Typography } from "@material-ui/core";
import { CSSProperties } from '@material-ui/core/styles/withStyles';

import { MAX_RENDERER_PIXELS } from "../RendererConstants";
import { MixedViewProps } from '../MixedPageView';
import { NeoPdfDocument, NeoPdfPage } from '../../common/neopdf';
import { PDF_DEFAULT_DPI } from '../../common/constants';
import { dumpDiffPropsAndState, makeNPageIdStr } from "../../common/util";

interface PageProps extends MixedViewProps {
  // pdf: PdfJs.PDFDocumentProxy,
  pdf: NeoPdfDocument,

  position: { offsetX: number, offsetY: number, zoom: number },
  // pdfCanvas: CSSProperties,
}

interface PageState {
  status: string,
  // page: PdfJs.PDFPageProxy | null,
  page: NeoPdfPage,
  imgSrc: string,

  renderCount: number;
}

type IBackRenderedStatus = {
  result: boolean,
  px_width: number,
  px_height: number
}

export default class NeoPdfPageView extends Component<PageProps, PageState> {
  state: PageState = {
    status: 'N/A',
    page: null,
    imgSrc: URL.createObjectURL(new Blob()),
    renderCount: 0,
  };

  canvas: HTMLCanvasElement | null = null;

  inRendering = false;

  // renderTask: PdfJs.PDFRenderTask = null;
  renderTask: any = null;

  backPlane = {
    canvas: document.createElement("canvas"),
    inited: false,
    nowRendering: false,
    prevZoom: 0,
    zoomQueue: [] as number[],
    size: { result: false, px_width: 0, px_height: 0 },
  };

  zoomQueue: number[] = [];


  componentDidMount() {
    // const { pdf, pdfPageNo } = this.props;
    // this._update(pdf, pdfPageNo);
  }

  shouldComponentUpdate(nextProps: PageProps, nextState: PageState) {
    // dumpDiffPropsAndState(`State PageView ${this.props.pdfPageNo}:`, this.props, nextProps, this.state, nextState);

    const zoomChanged = nextProps.position.zoom !== this.props.position.zoom;
    if (zoomChanged && nextState.page) {
      this.renderPage(nextState.page, nextProps.position.zoom);
    }


    // pad를 load해야 한다면
    let pdfChanged = ((!nextProps.pdf) && (!!this.props.pdf)) || ((!!nextProps.pdf) && (!this.props.pdf)) || (nextProps.pdf !== this.props.pdf);
    if ((!!nextProps.pdf) && (!!this.props.pdf)) pdfChanged = pdfChanged || (nextProps.pdf.fingerprint !== this.props.pdf.fingerprint);
    const pdfPageNoChanged = nextProps.pdfPageNo !== this.props.pdfPageNo;

    if (pdfChanged || pdfPageNoChanged) {
      if (pdfChanged)
        console.log(`*State PageView ${nextProps.pdfPageNo}:* PDF CHANGED ${this.pfp(this.props.pdf)} => ${this.pfp(nextProps.pdf)}`);

      if (pdfPageNoChanged)
        console.log(`*State PageView ${nextProps.pdfPageNo}:* PAGE CHANGED ${this.props.pdfPageNo} => ${nextProps.pdfPageNo}`);

      this._update(nextProps.pdf, nextProps.pdfPageNo);
    }

    // rendering을 새로 해야 한다면
    const loaded = nextState.page !== this.state.page;
    if (loaded) {
      this.renderPage(nextState.page, nextProps.position.zoom);
    }

    // rendering되었 
    // const rendered =
    //   (this.state.status !== nextState.status) && (nextState.status === "N/A" || nextState.status === "rendered" || nextState.status === "lazy-rendered");


    const rendered = this.state.renderCount !== nextState.renderCount;
    console.log(`*State PageView ${nextProps.pdfPageNo}:* rendered=${rendered}  this.state.status=${this.state.status} => ${nextState.status}`);
    return true;
  }


  scaleCanvas(canvas: HTMLCanvasElement, width: number, height: number, zoom: number) {
    // assume the device pixel ratio is 1 if the browser doesn't specify it
    const devicePixelRatio = window.devicePixelRatio || 1;
    const context = canvas.getContext('2d');

    // determine the 'backing store ratio' of the canvas context
    const backingStoreRatio = 1;
    // (
    //   context.webkitBackingStorePixelRatio ||
    //   context.mozBackingStorePixelRatio ||
    //   context.msBackingStorePixelRatio ||
    //   context.oBackingStorePixelRatio ||
    //   context.backingStorePixelRatio || 1
    // );

    // determine the actual ratio we want to draw at
    const pdfCssRatio = 96 / 72;
    let ratio = devicePixelRatio * pdfCssRatio * zoom / backingStoreRatio;

    // 최대값을 설정하자
    if (width * height * ratio * ratio > MAX_RENDERER_PIXELS) {
      ratio = Math.sqrt(MAX_RENDERER_PIXELS / width / height);
    }

    const px_width = Math.floor(width * ratio);
    const px_height = Math.floor(height * ratio);



    if (devicePixelRatio !== backingStoreRatio) {
      // set the 'real' canvas size to the higher width/height
      canvas.width = px_width;
      canvas.height = px_height;

      // ...then scale it back down with CSS
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    }
    else {
      // this is a normal 1:1 device; just scale it simply
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = '';
      canvas.style.height = '';
    }

    // scale the drawing context so everything will work at the higher ratio
    context.scale(ratio, ratio);

    return { ratio, px: { width: px_width, height: px_height }, css: { width, height } };
  }

  timeOut = (n) => {
    return new Promise(resolve => { setTimeout(() => { resolve(true); }, n); });
  }


  pfp = (pdf: NeoPdfDocument) => {
    if (pdf) return pdf.fingerprint;
    return "N/A";
  }

  setCanvasRef = (canvas: HTMLCanvasElement) => {
    // console.log(`*State PageView ${this.props.pdfPageNo}:* setCanvasRef`);
    this.canvas = canvas;
  };

  _update = (pdf: NeoPdfDocument, pageNo: number) => {

    if (pdf) {
      // console.log(`*State PageView ${this.props.pdfPageNo}:* PDF LOADER ${this.pfp(pdf)} / ${pageNo}`);
      this.backPlane.inited = false;
      this._loadPage(pdf, pageNo);
      this.setState({ status: 'loading' });
    } else {
      // console.log(`*State PageView ${this.props.pdfPageNo}:* BLANK ${this.pfp(pdf)} / ${pageNo}`);
      this.setState({ status: 'N/A' });
    }
  };

  _loadPage = async (pdf: NeoPdfDocument, pageNo: number) => {
    if (this.state.status === 'rendering') return;

    if (pageNo > pdf.numPages) {
      console.error("PDF 페이지의 범위를 넘은 페이지를 렌더링하려고 합니다.");
      pageNo = pdf.numPages;
    }

    const page = await pdf.getPageAsync(pageNo);
    this.backPlane.inited = false;
    this.setState({ status: 'loaded', page });
  }

  renderToCanvasSafe = async (page: NeoPdfPage, dpi: number, zoom: number) => {
    // if (this.backPlane.nowRendering && this.renderTask) {
    //   const renderTask = this.renderTask;
    //   renderTask.cancel();
    //   await renderTask;
    // }
    return this.renderToCanvas(page, dpi, zoom);
  }

  renderToCanvas = async (page: NeoPdfPage, dpi: number, zoom: number): Promise<IBackRenderedStatus> => {


    const PRINT_RESOLUTION = dpi * zoom;
    const PRINT_UNITS = PRINT_RESOLUTION / PDF_DEFAULT_DPI;
    const viewport: any = page.getViewport({ scale: 1 });

    const px_width = Math.floor(viewport.width * PRINT_UNITS);
    const px_height = Math.floor(viewport.height * PRINT_UNITS);

    const retVal = { result: false, px_width, px_height };
    if (!px_width || !px_height) return retVal;

    const canvas = document.createElement("canvas");
    canvas.width = px_width;
    canvas.height = px_height;

    const ctx = canvas.getContext('2d');
    try {
      this.backPlane.nowRendering = true;
      const renderContext = {
        canvasContext: ctx,
        transform: [PRINT_UNITS, 0, 0, PRINT_UNITS, 0, 0],
        viewport: page.getViewport({ scale: 1, rotation: viewport.rotation }),
        intent: "print"
      };
      this.renderTask = page.render(renderContext);
      await this.renderTask.promise;

      // this.backPlane.canvas = document.createElement("canvas");
      const destCanvas = this.backPlane.canvas;
      destCanvas.width = canvas.width;
      destCanvas.height = canvas.height;

      const destCtx = destCanvas.getContext("2d");
      destCtx.fillStyle = "#fff";
      destCtx.fillRect(0, 0, destCanvas.width, destCanvas.height);
      destCtx.drawImage(canvas, 0, 0);

      this.backPlane.prevZoom = zoom;
      retVal.result = true;
      this.backPlane.size = { ...retVal };

      this.renderTask = null;
    }
    catch (e) {
      this.renderTask = null;
      this.backPlane.nowRendering = false;
    }

    return retVal;
  }

  renderPage = async (page: NeoPdfPage, zoom: number) => {
    this.setState({ page, status: 'rendering check canvas' });
    if (!this.canvas) return;
    // console.log(`BACKPLANE RENDERPAGE start`)

    this.setState({ page, status: 'rendering' });

    const viewport: any = page.getViewport({ scale: 1 });
    const { width, height } = viewport;
    const canvas = this.canvas;
    const size = { width, height };
    const ret = this.scaleCanvas(canvas, size.width, size.height, zoom);
    const dpi = canvas.width / zoom / size.width * 72;

    let noLazyUpdate = false;
    if (!this.backPlane.inited) {
      // console.log(`BACKPLANE DRAWING start`)
      const result = await this.renderToCanvasSafe(page, dpi, zoom);
      // console.log(`BACKPLANE DRAWING end`)
      this.backPlane.inited = result.result;
      // this.backPlane.size = { ...result };
      noLazyUpdate = true;
    }

    const displaySize = { width, height };
    const { px_width, px_height } = this.backPlane.size;

    const ctx = canvas.getContext('2d');
    const dw = ret.px.width / ret.ratio;
    const dh = ret.px.height / ret.ratio;

    ctx.drawImage(this.backPlane.canvas, 0, 0, px_width, px_height, 0, 0, dw, dh);
    this.setState({ renderCount: this.state.renderCount + 1, status: 'rendered' });

    // Lazy update
    if (!noLazyUpdate && this.backPlane.prevZoom !== zoom) {
      // console.log(`BACKPLANE RENDERPAGE lazy start`);

      this.zoomQueue.push(zoom);
      await this.timeOut(200);

      const lastZoom = this.zoomQueue[this.zoomQueue.length - 1];
      this.zoomQueue = this.zoomQueue.splice(1);
      if ((lastZoom && zoom !== lastZoom) || zoom == this.backPlane.prevZoom) {
        return;
      }

      const result = await this.renderToCanvasSafe(page, dpi, zoom);
      if (result.result) {
        // this.backPlane.size = { ...result };

        const { px_width, px_height } = result;
        ctx.drawImage(this.backPlane.canvas, 0, 0, px_width, px_height, 0, 0, dw, dh);
        this.zoomQueue = [];
        this.setState({ renderCount: this.state.renderCount + 1, status: 'lazy-rendered' });
      }
      else {
        // console.log(`lazy back plane CANCELLED`)
      }
      // console.log(`BACKPLANE RENDERPAGE lazy end`);
    }
    // console.log(`BACKPLANE RENDERPAGE end`)
  }


  render = () => {
    const { status } = this.state;
    const pageCanvas: CSSProperties = {
      position: "absolute",
      zoom: 1,
      left: 0,
      top: 0,
      width: 600
      // background: "#fff"
    }

    const shadowStyle: CSSProperties = {
      color: "#088",
      textShadow: "-1px 0 2px #fff, 0 1px 2px #fff, 1px 0 2px #fff, 0 -1px 2px #fff",
    }
    return (

      <div style={pageCanvas} id={`pdf-page ${status}`} >
        <div style={pageCanvas}  >
          <canvas ref={this.setCanvasRef} />
        </div>

        < div id={`${this.props.parentName}-info`} style={pageCanvas} >
          <br /> &nbsp; &nbsp;
          <br /> &nbsp; &nbsp;
          <br /> &nbsp; &nbsp;
          <br /> &nbsp; &nbsp;
          <br /> &nbsp; &nbsp;
          <br /> &nbsp; &nbsp;
          <br /> &nbsp; &nbsp;
          <br /> &nbsp; &nbsp;
          <br /> &nbsp; &nbsp;
          <br /> &nbsp; &nbsp;
          <Typography style={{ ...shadowStyle, fontSize: 16 }}>PDFViewer </Typography>

          <br /> &nbsp; &nbsp;
          <Typography style={{ ...shadowStyle, fontSize: 10 }}>Page(state):</Typography>
          <Typography style={{ ...shadowStyle, fontSize: 14, }}> {makeNPageIdStr(this.props.pageInfo)} </Typography>

          <br /> &nbsp; &nbsp;
            <Typography style={{ ...shadowStyle, fontSize: 10 }}>Page(property):</Typography>
          <Typography style={{ ...shadowStyle, fontSize: 14, }}> {makeNPageIdStr(this.props.pageInfo)} </Typography>


          <br /> &nbsp; &nbsp;
            <Typography style={{ ...shadowStyle, fontSize: 10 }}>Base(property):</Typography>
          <Typography style={{ ...shadowStyle, fontSize: 14, fontStyle: "initial" }}> {makeNPageIdStr(this.props.basePageInfo)} </Typography>

          <br /> &nbsp; &nbsp;
            <Typography style={{ ...shadowStyle, fontSize: 10 }}>pdfPageNo:</Typography>
          <Typography style={{ ...shadowStyle, fontSize: 14, fontStyle: "initial" }}> {this.props.pdfPageNo} </Typography>

        </div >


      </div>
    );
  }
}
