import { IPageSOBP } from "../structures"

export const g_defaultNcode: IPageSOBP = {
  section: 3,
  owner: 27,
  book: 1068,
  page: 0,
}

export const g_defaultTemporaryNcode: IPageSOBP = {
  section: 256,
  owner: 27,
  book: 1068,
  page: 0,
}

export const DefaultPlateNcode: IPageSOBP = {
  section: 3,
  owner: 1013,
  book: 2,
  page: 0,
}

export const PlateNcode_1: IPageSOBP = {
  section: 3,
  owner: 1013,
  book: 2,
  page: 1,
}

export const PlateNcode_2: IPageSOBP = {
  section: 3,
  owner: 1013,
  book: 2,
  page: 2,
}

export const PlateNcode_3: IPageSOBP = { // 부기보드
  section: 3,
  owner: 1013,
  book: 2,
  page: 16,
}

export const PlateNcode_4: IPageSOBP = { // 투명 플레이트
  section: 3,
  owner: 27,
  book: 1227,
  page: 1,
}

export const PlateNcode_5: IPageSOBP = { // 윈도우 기능 플레이트
  section: 3,
  owner: 1013,
  book: 2,
  page: 23
}

export const PlateList : Array<IPageSOBP> = [PlateNcode_1, PlateNcode_2, PlateNcode_3, PlateNcode_4, PlateNcode_5];

export const OnlyWindowController : IPageSOBP = { // 윈도우 전용기능 ( 그리다보드에선 사용 안함 )
  section: 3,
  owner: 1013,
  book: 1,
  page: 15
}

export const FilmNcode_Landscape: IPageSOBP = {
  section: 3,
  owner: 1013,
  book: 2,
  page: 3,
}

export const FilmNcode_Portrait: IPageSOBP = {
  section: 3,
  owner: 1013,
  book: 2,
  page: 4,
}

export const DefaultPUINcode: IPageSOBP = {
  section: 3,
  owner: 1013,
  book: 1116,
  page: 0,
}