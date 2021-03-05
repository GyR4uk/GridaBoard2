import React from "react";
import '../../styles/buttons.css';
import { Button, Popover } from '@material-ui/core';
import GridaToolTip from "../../styles/GridaToolTip";
import { setViewFit } from '../../store/reducers/viewFitReducer';
import { ZoomFitEnum } from "../../nl-lib/common/enums";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";

const zoomStyle = {
  marginTop: "8px",
  float: "right"
} as React.CSSProperties;

export default function FitButton() {

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (viewFit: ZoomFitEnum) => {
    setAnchorEl(null);
    setViewFit(viewFit);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const zoom = useSelector((state: RootState) => state.zoomReducer.zoom);
  const zoomPercent = Math.round(zoom * 100);

    return (
      <React.Fragment>
        {/* <div className="btn-group dropright" role="group"> */}
          <Button type="button" id="btn_fit" style={zoomStyle} onClick={handleClick} aria-describedby={id}>
            <GridaToolTip open={true} placement="left" tip={{
                head: "Fit",
                msg: "용지의 크기를 맞추는 여러 옵션 중 하나를 선택합니다.",
                tail: "Z 폭 맞춤, X 높이 맞춤, C 전체 페이지, V 100%"
              }} title={undefined}>
              <span id="zoom-ratio">{zoomPercent}%</span>
            </GridaToolTip>
          </Button>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <a id="btn_fit_height" className="dropdown-item" href="#">
              <div className="c2">
                <span className="bg-dropmenu" data-l10n-id="page_scale_fit">Zoom in</span>
              </div>
            </a>
            <a id="btn_fit_height" className="dropdown-item" href="#" >
              <div className="c2">
                <span className="bg-dropmenu" data-l10n-id="page_scale_fit">Zoom out</span>
              </div>
            </a>
            <a id="btn_fit_height" className="dropdown-item" href="#" onClick={() => handleClose(ZoomFitEnum.HEIGHT)}>
              <div className="c2">
                <span className="bg-dropmenu" data-l10n-id="page_scale_fit">Fit Screen</span>
              </div>
            </a>
            <a id="btn_fit_width" className="dropdown-item" href="#" onClick={() => handleClose(ZoomFitEnum.WIDTH)}>
              <div className="c2">
                <span className="bg-dropmenu" data-l10n-id="page_scale_width">Fill Screen</span>
              </div>
            </a>
          </Popover>

          {/* <div className="dropdown-menu p-0 border border-0 " aria-labelledby="btn_eraser">
            
          </div> */}
        {/* </div> */}
      </React.Fragment>
    );
}