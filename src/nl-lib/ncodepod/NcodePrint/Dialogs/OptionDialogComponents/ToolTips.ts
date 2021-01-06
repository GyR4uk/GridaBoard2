import { ITipType } from "../../../../common/ui";

export const printOptionTip: { [key: string]: ITipType } = {
  'hasToPutNcode': {
    head: '복사지에 Ncode를 인쇄',
    msg: '일반 용지에 PDF 파일과 N코드를 동시에 인쇄합니다. 칼라프린터가 필요하며 프린터 기종에 따라 지원되지 않을 수도 있습니다.',
    tail: '프린터에 일반 인쇄 용지를 준비하세요.'
  },

  'useNA4': {
    head: 'Ncode A4에 인쇄',
    msg: 'Ncode A4에 인쇄합니다. 칼라 프린터가 필요하며, 인쇄된 후에는 인쇄된 페이지를 수동 등록해야 합니다. 화면 오른쪽 아래에 등록 버튼이 있습니다.',
    tail: '프린터에 Ncode A4를 준비하세요.'
  },

  'pagesPerSheet': {
    head: '1장에 인쇄할 페이지 수',
    msg: '인쇄 용지 1장에 인쇄할 페이지 수입니다.',
    tail: 'Ncode A4에 인쇄하는 경우에는 여러 페이지를 한장에 인쇄할 수 없습니다.'
  },

  'showTooltip': {
    head: '도움말 보기',
    msg: '이 도움말이 표시되는 것을 설정합니다.',
    tail: '도움말을 표시를 해제하더라도, 다시 표시하게 할 수 있습니다.'
  },

  'targetPages': {
    head: '인쇄 대상 페이지 번호',
    msg: '인쇄할 대상의 페이지 번호를 "숫자", "쉼표(,)" 그리고 "하이픈(-)" 표시로 입력하여 지정합니다.',
    tail: '빈칸으로 남겨두면 전체 페이지를 인쇄합니다.'
  },

  'sameCode': {
    head: '등록된 Ncode로 재인쇄',
    msg: '이전에 이미 Ncode를 포함해서 인쇄하여 문서에 등록된 Ncode가 있습니다. 문서에 등록된 Ncode를 사용해서 인쇄하면 내용을 추가로 기록할 수 있습니다.',
    tail: 'Ncode A4를 선택한 경우에는 적용되지 않습니다.'
  },

  'newNcode': {
    head: '새로운 Ncode로 인쇄',
    msg: 'Ncode를 문서 페이지 수 만큼 발급 받아 인쇄합니다. 발급 받은 Ncode는 자동으로 문서에 등록됩니다. 수동 등록 과정 없이 인쇄물에 쓰기만 하면 바로 표시됩니다.',
    tail: 'Ncode A4를 선택한 경우에는 적용되지 않습니다.'
  },

  'forceToUpdateBaseCode': {
    head: '새로운 Ncode를 강제',
    msg: '문서에 등록된 Ncode의 유무와 상관 없이 새로운 Ncode를 강제로 발행합니다.',
    tail: 'Ncode A4를 선택한 경우에는 적용되지 않습니다.'
  },

  'needToIssuePrintCode': {
    head: '새 Ncode가 필요',
    msg: '문서에 Ncode가 등록되어 있지 않습니다. 새로운 Ncode를 발급 받아야 일반 용지에 인쇄할 수 있습니다.',
    tail: 'Ncode A4를 선택한 경우에는 적용되지 않습니다.'
  },

  'mediaSize': {
    head: '용지 크기',
    msg: '인쇄할 용지의 크기를 결정합니다.',
    tail: '인쇄 용지의 크기와 연결된 프린터의 용지 크기가 다른 경우, Ncode가 인식되지 않을 수 있습니다.'
  },

  'downloadNcodedPdf': {
    head: '재인쇄용 파일 다운로드',
    msg: '인쇄만 따로 할 수 있도록, 컴퓨터에 재인쇄용 PDF 파일을 다운로드 합니다. 인쇄 준비 과정이 종료되면, 자동으로 다운로드 되어 웹 브라우저에서 지정한 다운로드 폴더에 저장됩니다',
    tail: 'Adobe Acrobat (Reader)로, 설정에서 "확대 축소 없이, 원래 크기"대로 인쇄하도록 설정하고 인쇄해야 정상적으로 작동합니다.'
  },

  'drawCalibrationMark': {
    head: '문서 등록용 마크 표시',
    msg: 'Ncode A4를 사용하는 경우, 문서를 수동으로 등록해야 합니다(화면 오른쪽 아래의 버튼). 이 때, 등록 표식이 될 수 있도록 문서에 플러스(십자, +)를 인쇄해 둡니다.',
    tail: 'Ncode A4를 사용하는 경우 선택이 필수입니다.'
  },

  'drawMarkRatio': {
    head: '문서 등록 마크 위치',
    msg: '문서 등록 마크가 인쇄물에 표시되는 위치를 용지 크기의 비율로 표시한 것입니다. 예를 들어, 0.1 (10%)이면 좌상단의 (10%,10%) 지점과 우하단의 (10%,10%) 지점에 빨간색 등록 마크가 인쇄됩니다.',
    tail: '이 값을 바꾸면 이전에 인쇄했던 등록용 표시는 사용할 수 없습니다.'
  },

  'colorMode': {
    head: '색변환 방법 선택',
    msg: 'Ncode를 인식하기 위해서는 문서 전체의 색을 변환해야 합니다. 이 때 쓰이는 변환하는 방식을 선택합니다.',
    tail: '잉크를 골고루 사용하기 위해서는, 색상인쇄 1(ANDROID), 또는 색상인쇄 2(iOS)를 선택하십시오.'
  },

  'luminanceMaxRatio': {
    head: '색변환 최대 농도',
    msg: '문서 색변환 시에 적용되는 잉크의 최대 농도를 설정합니다. 1에 가까울 수록 진하게 인쇄됩니다만, 코드를 인식하지 못할 수 있습니다',
    tail: '0.6 ~ 0.8 정도가 적정합니다.'
  },

  'codeDensity': {
    head: 'Ncode 인쇄 시, 코드 농도',
    msg: '일반 복사 용지에 인쇄를 선택하면 문서와 함께 Ncode가 인쇄됩니다. 이 때 인쇄되는 Ncode의 농도를 결정합니다. 보통의 경우가 가장 적절합니다.',
    tail: '"보통"이나 "연하게"에서 코드 인식이 전혀 되지 않을 때에만 "진하게"를 선택해 주십시오'
  },

  'drawFrame': {
    head: '페이지 윤곽을 인쇄',
    msg: '분할 인쇄를 하는 경우 각 페이지의 경계 표시가 필요한 경우가 있습니다. 이 때를 위해 문서 페이지의 경계를 표시해서 인쇄합니다.',
    tail: '기본값으로는 윤곽 표시를 하지 않습니다.'
  },

  'padding': {
    head: '종이 여백 설정',
    msg: '인쇄물의 상하좌우 여백을 설정합니다.',
    tail: '여백이 너무 작은 경우, 인쇄물에서 문서의 내용이 표시되지 않는 영역시 발생할 수 있습니다.'
  },

  'maxPagesPerSheetToDrawMark': {
    head: 'Ncode A4의 최대 분할 인쇄 수',
    msg: '문서 등록용 마크의 인쇄를 허용할 최대 면 분할 페이지 수입니다. default=1',
    tail: '현재 버전에서는 1을 초과해서 설정하면, Ncode A4의 문서가 인식되지 않습니다.'
  },

  'filename': {
    head: '문서의 로컬 파일이름',
    msg: '"파일 선택"을 통해 문서를 읽어 들였을 때의 문서 파일의 "파일명"입니다.',
    tail: '임의로 바꿀 수 없습니다.'
  },

  'url': {
    head: '문서를 받아온 URL',
    msg: '문서를 로드할 때 썼던 임시 URL입니다.',
    tail: '임의로 바꿀 수 없습니다.'
  },

  'debugMode': {
    head: '개발자용 디버그 모드',
    msg: '개발자용으로 만들어진 인쇄 디버그 플래그입니다.',
    tail: '0: nothing, 1: 인쇄 좌표계 설정'
  },


}