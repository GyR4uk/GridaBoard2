import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import GridaDoc from "../GridaDoc";

import { makeNPageIdStr } from "nl-lib/common/util";

import { g_defaultPrintOption } from "nl-lib/ncodepod";

import { MappingStorage } from "nl-lib/common/mapper";
import { NoteServerClient } from "nl-lib/common/noteserver";

import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';
import PenTypeButton from "../components/buttons/PenTypeButton";
import ThicknessButton from "../components/buttons/ThicknessButton";
import TracePointButton from "../components/buttons/TracePointButton";
import ColorButtons from "../components/navbar/ColorButtons";
import BackgroundButton from "../components/buttons/BackgroundButton";
import FitButton from "../components/buttons/FitButton";
import PageNumbering from "../components/navbar/PageNumbering";
import { RootState } from "../store/rootReducer";
import { Collapse, IconButton, makeStyles } from "@material-ui/core";
import CustomBadge from "../components/CustomElement/CustomBadge"
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";

const useStyle = props => makeStyles(theme => ({
  navStyle : {
    display: "flex",
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    height: "50px",
    zIndex: 1,
    zoom: 1 / props.brZoom,
    "&>div":{
      display: "inline-flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    "&>div:nth-child(2)":{
      position: "relative",
      left: "-6%",
    }
  },
  headerViewBtn : {
    zIndex: 0,
    height:"24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const printBtnId = "printTestButton";
const printOption = g_defaultPrintOption;

const getNoteInfo = (event) => {
  // let url = "http://nbs.neolab.net/v1/notebooks/attributes?device=android";
  const note_info = new NoteServerClient();
  // note_info.getNoteInfo({});
};

const NavLayer = (props) => {
  const [num_pens, setNumPens] = useState(0);
  const [mapViewDetail, setMapViewDetail] = useState(0);
  const [docViewDetail, setDocViewDetail] = useState(0);
  const [isCollapsed, setCollapsed] = useState(false);

  const brZoom = useSelector((state: RootState) => state.ui.browser.zoom);
  const classes = useStyle({brZoom:brZoom})();
  const badgeInVisible = !useSelector((state: RootState) => state.ui.shotcut.show);

  let mapJson = {} as any;
  if (mapViewDetail) {
    const msi = MappingStorage.getInstance();
    const data = JSON.parse(JSON.stringify(msi._data));
    const arrDocMap = data.arrDocMap;

    arrDocMap.forEach(map => {
      if (mapViewDetail === 1) {
        const splitted = map.id.match(/^.+\/(.*)$/i);
        const pagesPerSheet = parseInt(splitted[1]);
        map["pagesPerSheet"] = pagesPerSheet;
        map["printPageInfo.sum"] = makeNPageIdStr(map.printPageInfo);
        map["basePageInfo.sum"] = makeNPageIdStr(map.basePageInfo);
        delete map.url;
        delete map.id;
        delete map.params;
        delete map.fingerprint;
        delete map.printPageInfo;
        delete map.basePageInfo;

      }
    });

    mapJson = data;
  }

  const docJson = { pdf: [], pages: [] };
  const doc = GridaDoc.getInstance();

  for (let i = 0; i < doc._pdfd.length; i++) {
    const p = doc._pdfd[i];
    const obj = {
      pdf: p.pdf,
      filename: p.pdf.filename,
      fingerprint: p.fingerprint,
      pdfOpenInfo: p.pdfOpenInfo,
      startPageInDoc: p.startPageInDoc,       // starting from 0
      endPageInDoc: p.endPageInDoc,         // starting from 0
      pdfToNcodeMap: p.pdfToNcodeMap,
    };
    docJson.pdf.push(obj);
  }

  for (let i = 0; i < doc.numPages; i++) {
    const p = doc._pages[i];
    const { _pdfPageNo, _pageToNcodeMaps } = p;
    const pageInfo = _pageToNcodeMaps[0].pageInfo;
    const basePageInfo = _pageToNcodeMaps[0].basePageInfo;
    const obj = {
      _pdfPageNo,
      _pageToNcodeMaps,
      pageInfo: makeNPageIdStr(pageInfo),
      basePageInfo: makeNPageIdStr(basePageInfo),

    }
    docJson.pages.push(obj);
  }

  const HeaderController = (props)=>{
    return (
    <div className={classes.headerViewBtn} onClick={props.hideHeader}> 
      <IconButton aria-label="open drawer" onClick={() => { setCollapsed(prev => !prev) }} >
        {!isCollapsed? (<ArrowDropUp />) : (<ArrowDropDown />)}
      </IconButton>
    </div>);
  }

  return (
    <div className={classes.navStyle}>
        <div>
          <PenTypeButton />

          <CustomBadge badgeContent={`1~0`}>
            <ColorButtons />
          </CustomBadge>
          
          <CustomBadge badgeContent={`Z~B`}>
            <ThicknessButton />
          </CustomBadge>

          <CustomBadge badgeContent={`T`}>
            <TracePointButton />
          </CustomBadge>
        </div>

        <div>
          <PageNumbering />
        </div>

        <div>
          <BackgroundButton />
          <FitButton />
          <HeaderController {...props} /> 
        </div>
    </div>
  );
}

export default NavLayer;

