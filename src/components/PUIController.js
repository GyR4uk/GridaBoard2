import PenManager from "../neosmartpen/pencomm/PenManager";
import { IBrushType } from "../neosmartpen/DataStructure";
import React from 'react';
import $ from 'jquery';


// 2020-12-09 현재 구현되어 있는 부분까지 PUI 완성(페이지 넘어가는 부분과 스트로크 찍히는 오류 수정할 것) 
export default class PUIController {
  constructor(url) {
      /** @type {Promise} */
      this._ready = this.getPuiXML(url);

      /** @type {number} */
      this._owner = 0;

      /** @type {number} */
      this._section = 0;

      /** @type {number} */
      this._book = 0;

      /** @type {number} */
      this._startPage = 0;

      /** @type {Array.<number>} */
      this._pages = [];

      /** @type {Array.<{pageDelta:number, type:string, left:number, top:number, width:number, height:number, command:string}>} */
      this._symbols = [];
  }

  get ready() {
      return this._ready;
  }

  getPuiXML(url) {
      var self = this;

      return new Promise(function (resolve, reject) {
          $.ajax({
              type: "GET",
              dataType: "xml",
              url: url,
              success: function (xml) {
                console.log(xml);
                  // page 정보
                  var $bookXml = $(xml).find("book");
                  var section = parseInt($bookXml.find("section").text());
                  var owner = parseInt($bookXml.find("owner").text());
                  var book = parseInt($bookXml.find("code").text());
                  var startPage = parseInt($bookXml.find("start_page").text());

                  var $pagesXml = $(xml).find("pages");
                  var numPages = parseInt($pagesXml.attr("count"));

                  self._owner = owner;
                  self._section = section;
                  self._book = book;
                  self._startPage = startPage;
                  self._pages = [];

                  var i;
                  for (i = 0; i < numPages; i++) self._pages.push(startPage + i);

                  // symbol 정보
                  var xmlData = $(xml).find("symbol");
                  var listLength = xmlData.length;

                  self._symbols = [];

                  $(xmlData).each(function () {
                      var pageDelta = parseInt($(this).attr("page"));
                      var type = $(this).attr("type"); // 여기서는 Rectangle만 취급한다.
                      var left = parseFloat($(this).attr("x"));
                      var top = parseFloat($(this).attr("y"));
                      var width = parseFloat($(this).attr("width"));
                      var height = parseFloat($(this).attr("height"));

                      var command = $(this).find("command").attr("param");

                      var puiSymbol = {
                          pageDelta,
                          type,
                          left,
                          top,
                          width,
                          height,
                          command,
                      };
                      self._symbols.push(puiSymbol);
                  });

                  self._symbols.sort(function (a, b) {
                      var ax = a.top * 10000 + a.left;
                      var bx = b.top * 10000 + b.left;

                      return ax - bx;
                  });

                  resolve(true);
              },
              error: function (error) {
                  resolve(false);
              },
              complete: function () {},
          });
      });
  }

  m(val) {
      return Math.round(val * 10) / 10;
  }

  getCommand(owner, book, page, x, y) {
      if (owner != this._owner || book != this._book) return null;
      var pageDelta = page - this._startPage;
      if (this._pages.findIndex((elem) => elem == page) < 0) return null;

      var i;

      for (i = 0; i < this._symbols.length; i++) {
          var sym = this._symbols[i];

          var x1 = sym.left / 72; // inch
          var x2 = (sym.left + sym.width) / 72; // inch
          var y1 = sym.top / 72;
          var y2 = (sym.top + sym.height) / 72;

          var xx = (x * 56) / 600;
          var yy = (y * 56) / 600;

          if (sym.pageDelta == pageDelta) {
              if (x1 < xx && xx < x2 && y1 < yy && yy < y2) {
                  var m = this.m;
                  console.log(`(${m(xx)}, ${m(yy)}) in (${m(x1)}, ${m(y1)})-(${m(x2)}, ${m(y2)}) ==> ${sym.command}`);
                  return sym.command;
              }
          }
      }

      return null;
  }

  /**
   *
   * @param {string} cmd
   */
  static executeCommand(cmd) {
      switch (cmd) {
          case "strokesize_1":
            PenManager.getInstance().setThickness(1);
              break;

          case "strokesize_2":
            PenManager.getInstance().setThickness(2);
              break;

          case "strokesize_3":
            PenManager.getInstance().setThickness(3);
              break;

          case "pen":
            PenManager.getInstance().setPenRendererType(IBrushType.PEN);
              break;

          case "highlighter":
            PenManager.getInstance().setPenRendererType(IBrushType.MARKER);
              break;

          case "erase_brush":
            PenManager.getInstance().setPenRendererType(IBrushType.ERASER);
              break;

          case "#FFE5E5E5":
            PenManager.getInstance().setColor(5)
              break;

          case "#FF000000":
            PenManager.getInstance().setColor(4)
              break;

          case "#FFAAAAAA":
            PenManager.getInstance().setColor(0)
              break;

          case "#FFFFD001":
            PenManager.getInstance().setColor(2)
              break;

          case "#FFFF6500":
            PenManager.getInstance().setColor(6)
              break;

          case "#FFFF0200":
            PenManager.getInstance().setColor(1)
              break;

          case "#FF00ABEB":
            PenManager.getInstance().setColor(8)
              break;

          case "#FF3CDD00":
            PenManager.getInstance().setColor(7)
              break;

          case "#FF6C00E2":
            PenManager.getInstance().setColor(9)
              break;

          case "#FF012EE2":
            PenManager.getInstance().setColor(3)
              break;

          case "pointer":
              break;

          case "erase_all":
              break;

          case "menu_grida":
              break;

          case "full_screen":
              break;

          case "zoom_in":
              break;

          case "zoom_out":
              break;

          case "previous":
              break;

          case "next":
              break;
      }
  }
}
