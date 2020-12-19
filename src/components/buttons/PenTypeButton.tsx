import React, { Component, useState } from "react";
import '../../styles/buttons.css';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import { Theme, Typography, withStyles } from '@material-ui/core';
import PenManager from "../../neosmartpen/pencomm/PenManager";
import { IBrushType } from "../../neosmartpen/DataStructure";
import GridaToolTip from "../../styles/GridaToolTip";


const manager: PenManager = PenManager.getInstance();

export default class PenTypeButton extends React.Component {
  shouldComponentUpdate(nextProps: any, nextState: any) {
    return false;
  }

  render() {
    return (
      <React.Fragment>
        <button id="btn_brush" disabled type="button"
          className="bind-popover btn btn-neo btn-neo-vertical" data-toggle="dropdown" aria-haspopup="true"
          aria-expanded="false">
          <GridaToolTip placement="left" title={
            <React.Fragment>
              <Typography color="inherit">Pen Type</Typography>
              <em>{"펜과 형광펜, 지우개 중 하나를 선택하는 버튼입니다."}</em>
              <br></br>
              <b>{"Q 펜, W 형광펜, E 지우개, A~G 굵기 선택"}</b>
            </React.Fragment>
          }>
            <div className="c2 disabled state_0">
              <img src="../../icons/icon_pen_n.png" className="state_0 normal-image"></img>
              <img src="../../icons/icon_pen_p.png" className="state_0 hover-image"></img>

              <img src="../../icons/icon_highlight_n.png" className="state_1 normal-image"></img>
              <img src="../../icons/icon_highlight_p.png" className="state_1 hover-image"></img>

              <img src="../../icons/icon_eraser_n.png" className="state_2 normal-image"></img>
              <img src="../../icons/icon_eraser_p.png" className="state_2 hover-image"></img>

              <span id="thickness_num" className="thickness-badge badge badge-pill badge-secondary">2</span>
            </div>
          </GridaToolTip>
        </button>

        <div className="dropdown-menu dropdown-menu-right p-0 border border-0" aria-labelledby="btn_brush">
          {/* 펜/형광펜 */}
          <div className="btn-group">
            <button id="btn_pen" type="button" className="btn btn-neo btn-neo-dropdown"
              onClick={() => manager.setPenRendererType(IBrushType.PEN)}>
              <GridaToolTip placement="left" title={
                <React.Fragment>
                  <Typography color="inherit">Pen Type[Pen]</Typography>
                  <em>{"펜을 선택하는 버튼입니다."}</em>
                  <br></br>
                  <b>{"단축키 Q로 선택가능합니다."}</b>
                </React.Fragment>
              }>
                <div className="c2">
                  <img src="../../icons/icon_pen_n.png" className="normal-image"></img>
                  <img src="../../icons/icon_pen_p.png" className="hover-image"></img>
                </div>
              </GridaToolTip>
            </button>
            <button id="btn_marker" type="button" className="btn btn-neo btn-neo-dropdown"
              onClick={() => manager.setPenRendererType(IBrushType.MARKER)}>
              <GridaToolTip placement="left" title={
                <React.Fragment>
                  <Typography color="inherit">Pen Type[Marker]</Typography>
                  <em>{"형광펜을 선택하는 버튼입니다."}</em>
                  <br></br>
                  <b>{"단축키 W로 선택가능합니다."}</b>
                </React.Fragment>
              }>
                <div className="c2">
                  <img src="../../icons/icon_highlight_n.png" className="normal-image"></img>
                  <img src="../../icons/icon_highlight_p.png" className="hover-image"></img>
                </div>
              </GridaToolTip>
            </button>
            <button id="btn_eraser" type="button" className="btn btn-neo btn-neo-dropdown"
              onClick={() => manager.setPenRendererType(IBrushType.ERASER)}>
              <GridaToolTip placement="left" title={
                <React.Fragment>
                  <Typography color="inherit">Pen Type[Eraser]</Typography>
                  <em>{"지우개를 선택하는 버튼입니다."}</em>
                  <br></br>
                  <b>{"단축키 E로 선택가능합니다."}</b>
                </React.Fragment>
              }>
                <div className="c2">
                  <img src="../../icons/icon_eraser_n.png" className="normal-image"></img>
                  <img src="../../icons/icon_eraser_p.png" className="hover-image"></img>
                </div>
              </GridaToolTip>
            </button>
          </div>

          {/* 선 굵기 */}
          <div className="dropdown-divider"></div>
          <div className="btn-group">
            <button id="btn_thick_1" type="button" className="btn btn-neo btn-neo-dropdown" onClick={() => manager.setThickness(1)}>
              <div className="c2">
                <img src="../../icons/icon_thickness_01_n.png" className="normal-image"></img>
                <img src="../../icons/icon_thickness_01_p.png" className="hover-image"></img>
              </div>
            </button>
            <button id="btn_thick_2" type="button" className="btn btn-neo btn-neo-dropdown" onClick={() => manager.setThickness(2)}>
              <div className="c2">
                <img src="../../icons/icon_thickness_02_n.png" className="normal-image"></img>
                <img src="../../icons/icon_thickness_02_p.png" className="hover-image"></img>
              </div>
            </button>
            <button id="btn_thick_3" type="button" className="btn btn-neo btn-neo-dropdown" onClick={() => manager.setThickness(3)}>
              <div className="c2">
                <img src="../../icons/icon_thickness_03_n.png" className="normal-image"></img>
                <img src="../../icons/icon_thickness_03_p.png" className="hover-image"></img>
              </div>
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}