import { saveAs } from "file-saver";
import { degrees, PDFDocument } from 'pdf-lib';
import GridaDoc from "../GridaDoc";
import { InkStorage } from "../../nl-lib/common/penstorage";
import { fabric } from "fabric";

const PDF_TO_SCREEN_SCALE = 6.72; // (56/600)*72

const inkSt = InkStorage.getInstance();

export async function saveGrida(gridaName: string) {

  const doc = GridaDoc.getInstance();
  const docPages = doc.pages;

  const strokeInfos = [];

  let pdfUrl, pdfDoc = undefined;

  const pdfSection = [];
  const pdfOwner = [];
  const pdfBook = [];
  const pdfPage = [];

  const baseSection = [];
  const baseOwner = [];
  const baseBook = [];
  const basePage = [];

  let cnt = 0;
  let infoCnt = 0;

  for (const page of docPages) //병렬처리
  {
    pdfSection[cnt] = page.pageInfos[0].section;
    pdfOwner[cnt] = page.pageInfos[0].owner;
    pdfBook[cnt] = page.pageInfos[0].book;
    pdfPage[cnt] = page.pageInfos[0].page

    baseSection[cnt] = page.basePageInfo.section;
    baseOwner[cnt] = page.basePageInfo.owner;
    baseBook[cnt] = page.basePageInfo.book;
    basePage[cnt] = page.basePageInfo.page
    
    cnt++;

    if (page.pdf === undefined) {
      //ncode page일 경우
      if (pdfDoc === undefined) {
        pdfDoc = await PDFDocument.create();
      }
      const pdfPage = await pdfDoc.addPage();
      if (page._rotation === 90 || page._rotation === 270) {
        const tmpWidth = pdfPage.getWidth();
        pdfPage.setWidth(pdfPage.getHeight());
        pdfPage.setHeight(tmpWidth);
      }
    } else {
      //pdf인 경우
      if (pdfUrl !== page.pdf.url) {
        pdfUrl = page.pdf.url;
        const existingPdfBytes = await fetch(page.pdf.url).then(res => res.arrayBuffer());
        const pdfDocSrc = await PDFDocument.load(existingPdfBytes);

        if (pdfDoc !== undefined) {
          //ncode 페이지가 미리 생성돼서 그 뒤에다 붙여야하는 경우
          const srcLen = pdfDocSrc.getPages().length;
          const totalPageArr = [];
          for (let i = 0; i<srcLen; i++) {
            totalPageArr.push(i);
          }

          const copiedPages = await pdfDoc.copyPages(pdfDocSrc, totalPageArr);

          for (const copiedPage of copiedPages) {
            await pdfDoc.addPage(copiedPage);
          }
        } else {
          pdfDoc = pdfDocSrc;
        }
      } else {
        continue;
      }
    }
  }

  //this.completedOnPage에는 페이지 순서대로 stroke array가 들어가는게 아니기 때문에 key값(sobp)으로 정렬
  const sortStringKeys = (a, b) => a[0] > b[0] ? 1 : -1;
  const sortedCompletedOnPage = new Map([...inkSt.completedOnPage].sort(sortStringKeys));

  const pages = pdfDoc.getPages();
  let i = 0;

  for (const [key, NeoStrokes] of sortedCompletedOnPage.entries()) {

    strokeInfos[infoCnt] = NeoStrokes;

    infoCnt++;

    let rotation = 0;
    let isPdf = true;

    for (const docPage of docPages) {
      //page info를 grida doc의 그것과 비교해서 어떤 pdf doc에 stroke를 그릴지 결정
      const { section, owner, book, page } = docPage.basePageInfo;
      const pageId = InkStorage.makeNPageIdStr({ section, owner, book, page });

      if (pageId === key) {
        i = docPage.pageNo;
        rotation = docPage._rotation

        if (docPage._pdf === undefined) {
          isPdf = false;
        }
      }
    }

    const page = pages[i];

    for (let j = 0; j < NeoStrokes.length; j++) {
      const dotArr = NeoStrokes[j].dotArray;
      const stroke_h = NeoStrokes[j].h;
      const stroke_h_rev = NeoStrokes[j].h_rev;

      const { a, b, c, d, e, f, g, h } = stroke_h;

      const pointArray = [];

      for (let k = 0; k < dotArr.length; k++) {
        const dot = dotArr[k];

        const nominator = g * dot.x + h * dot.y + 1;
        const px = (a * dot.x + b * dot.y + c) / nominator;
        const py = (d * dot.x + e * dot.y + f) / nominator;

        const pdf_xy = { x: px, y: py};

        pointArray.push({ x: pdf_xy.x, y: pdf_xy.y, f: dot.f });
      }
      
      if (isPdf) {
        page.setRotation(degrees(rotation));
      }

    }
  }

  //하나의 pdf로 완성됨 pdfDocument에 새로운 그리다 전체 pdf가 포함되어있음
  let newRawData;
  const pdfBytes = await pdfDoc.save();
  const arrayBuffer = new Uint8Array(pdfBytes);
  for (let i = 0; i < arrayBuffer.length; i++) {
    newRawData += String.fromCharCode(arrayBuffer[i]);
  }

  const gridaDate = new Date();

  const pdf = {
    pdfInfo : {
      pageInfo: { "s": pdfSection[0], "o": pdfOwner[0], "b": pdfBook[0], "p": pdfPage[0] },
      basePageInfo : { "s": baseSection[0], "o": baseOwner[0], "b": baseBook[0], "p": basePage[0] },
      rawData: newRawData
    }
  };

  const stroke = strokeInfos;

  const gridaInfo = {
    gridaDate : gridaDate,
    id : "asdf",
    pwd : "qwer"
  }

  const gridaJson = {
    "pdf" : pdf,
    "stroke" : stroke,
    "gridaInfo" : gridaInfo
  };

  console.log(gridaJson);

  const mappingInfoStr = JSON.stringify(gridaJson);

  const blob = new Blob([mappingInfoStr], { type: 'application/json' });
  saveAs(blob, gridaName);

}




