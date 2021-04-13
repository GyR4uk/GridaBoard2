import React from 'react';
import { Theme, Tooltip, TooltipProps, Typography, withStyles } from "@material-ui/core";
// import { ITipType } from './RadioField';


export type ITipType = { head: string, msg: string, tail: string };

const NeoToolTipPopup = withStyles((theme: Theme) => ({ 
    tooltip: {
      backgroundColor: theme.palette.grey[200],
      color: theme.palette.text.hint,
      maxWidth: 240,
      fontSize: theme.typography.pxToRem(12),
      border: `1px solid ${theme.palette.grey[300]}`, 
    },
  }))(Tooltip); 

interface Props extends TooltipProps {
  open?: boolean,
  tip?: ITipType,

  title: NonNullable<React.ReactNode>;
}

export default function NeoToolTip(props: Props) {
  const { children, tip, open, title, ...rest } = props;
  const { title: titleDefault } = props;

  let show = open;

  if (titleDefault !== undefined) {
    console.log(`title default show=${title}`);
  }

  let head = "", msg = "", tail = "";
  if (tip) {
    head = tip.head;
    msg = tip.msg;
    tail = tip.tail;
  }
  else if (!title) { show = false; }

  const renderTitle = (title, tip) => {
    if (tip) {
      return (
        <React.Fragment>
          <Typography color="primary"><b> {head}</b></Typography>
          {msg}
          <br />
          <br />
          <b>{tail}</b>
        </React.Fragment>
      );
    }
    else {
      return (
        <React.Fragment>
          {title}
        </React.Fragment>
      );
    }
  }


  if (show) {
    return (
      <NeoToolTipPopup
        placement="left" title={renderTitle(title, tip)}>
        {children}
      </NeoToolTipPopup>
    );
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
}
