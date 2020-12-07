import React, { Component, useState } from "react";
import '../../styles/buttons.css';
import { connect, useSelector, useDispatch } from 'react-redux';
import { setPointerTracer } from '../../store/reducers/pointerTracer';
import jQuery from "jquery";
import { RootState } from '../../store/rootReducer';

import icon_point_d from "../../icons/icon_point_d.png";
import icon_point_p from "../../icons/icon_point_p.png";
import icon_point_n from "../../icons/icon_point_n.png";

let $ = jQuery;

const TracePointButton = () => {
  const isTrace = useSelector((state:RootState) => state.pointerTracer.isTrace)
  const dispatch = useDispatch();

  const setEnable = (elem_name: string, sw: boolean) => {
    var $elem = $(`#${elem_name}`);
    if (sw) {
        let $elem = $("#btn_tracepoint").find(".c2");
        $elem.addClass("checked");
    } else {
        let $elem = $("#btn_tracepoint").find(".c2");
        $elem.removeClass("checked");
    }
  }
  
  const onTogglePointerTracer = () => {
    dispatch(setPointerTracer(!isTrace));
    setEnable("btn_tracepoint", isTrace);
  }

    return (
      <button id="btn_tracepoint" type="button" className="btn btn-neo btn-neo-vertical" title="Trace Point"
      onClick = {() => onTogglePointerTracer()}>
          <div className="c2 checked">
              <img src={icon_point_d} className="toggle-off normal-image"></img>
              <img src={icon_point_p} className="toggle-off hover-image"></img>
              <img src={icon_point_n} className="toggle-on normal-image"></img>
              <img src={icon_point_p} className="toggle-on hover-image"></img>
          </div>
      </button>
    );
}
export default TracePointButton;