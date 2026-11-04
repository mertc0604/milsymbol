// Engagment bar ##################################################################################
export default function engagement(ms) {
  const drawArray1 = [];
  const drawArray2 = [];
  const bbox = this.bbox;
  let x1 = bbox.x1;
  let x2 = bbox.x2;
  let y1 = bbox.y1;
  const y2 = bbox.y2;

  // APP-6A Table III has no engagement bar field (AO is a later edition).
  if (
    this.options.engagementBar !== "" &&
    !(this.metadata.app6a && this.options.sidc[0] === "S") &&
    !(this.metadata.app6b && this.options.sidc[0] === "S")
  ) {
    // APP-6(D) and MIL-STD-2525C: AO sits above the B/C/D cell, so above a
    // quantity text (APP-6D Figure 3-3 PDF 84/3-4, Figure 3-14 PDF 161/3-81;
    // 2525C Figure 2 PDF 27/21). 2525C draws C on the frame (no quantityTop).
    let aoLift = 0;
    if (
      (this.metadata.app6d ||
        this.metadata.std2525c ||
        (this.metadata.textLayout || {}).quantityAbove) &&
      this.style.infoFields &&
      this.options.quantity &&
      ((this.metadata.textLayout || {}).top || []).indexOf("quantity") >= 0
    ) {
      const quantityTop =
        this.metadata.quantityTop !== undefined
          ? this.metadata.quantityTop
          : this.metadata.baseGeometry.bbox.y1;
      aoLift = Math.max(
        0,
        bbox.y1 - (quantityTop - 10 - this.style.infoSize * 0.75) - 1
      );
    }
    y1 -= 6 + aoLift;
    const fontFamily = this.style.fontfamily;
    const fontColor =
      this.colors.iconColor[this.metadata.affiliation] ||
      this.colors.iconColor["Friend"];

    drawArray2.push({
      type: "text",
      text: this.options.engagementBar,
      x: 100,
      y: bbox.y1 - 11 - aoLift,
      textanchor: "middle",
      fontsize: 22,
      fontfamily: fontFamily,
      fontweight: "bold",
      fill: fontColor,
      stroke: false,
    });

    let color = false;
    if (this.metadata.fill && this.style.monoColor === "") {
      const colors = {
        TARGET: "rgb(255, 0, 0)",
        "NON-TARGET": "rgb(255, 255, 255)",
        EXPIRED: "rgb(255, 120, 0)",
      };
      color =
        colors[this.options.engagementType.toUpperCase()] ||
        this.colors.fillColor[this.metadata.affiliation];
    }
    // Bar width
    const width = Math.max(bbox.width(), this.options.engagementBar.length * 16);
    x1 = Math.min(x1, 100 - width / 2);
    x2 = Math.max(x2, 100 + width / 2);

    //Add the bar to the geometry
    drawArray2.unshift({
      type: "path",
      strokewidth: this.style.strokeWidth,
      fill: color,
      stroke: this.colors.frameColor[this.metadata.affiliation],
      d:
        "M" +
        (100 - width / 2) +
        "," +
        y1 +
        " l" +
        width +
        ",0 0,-25 -" +
        width +
        ",0 z",
    });

    //Add the hight of the codition bar to the geometry bounds
    y1 -= 25;
    //outline
    if (this.style.outlineWidth > 0) {
      let outline;
      if (this.metadata.fill && this.style.monoColor === "") {
        outline = drawArray2[0];
      } else {
        outline = drawArray2;
      }
      drawArray1.push(
        ms.outline(
          outline,
          this.style.outlineWidth,
          this.style.strokeWidth,
          typeof this.style.outlineColor === "object"
            ? this.style.outlineColor[this.metadata.affiliation]
            : this.style.outlineColor
        )
      );
    }
  }

  //A bounding box only needs the values that might change
  return {
    pre: drawArray1,
    post: drawArray2,
    bbox: { x1: x1, x2: x2, y1: y1, y2: y2 },
  };
}
