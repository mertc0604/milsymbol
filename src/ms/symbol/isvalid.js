import { isApp6aSidc, validateApp6aOptions } from "../../lettersidc/metadata.js";

export default function isValid(extended) {
  const modifierErrors = this.metadata.app6a ? validateApp6aOptions(this.options.sidc, this.options) : [];
  const drawInstructions =
    JSON.stringify(this.drawInstructions).indexOf("null") == -1;

  if (extended) {
    return {
      affiliation: this.metadata.affiliation,
      dimension: this.metadata.dimension,
      dimensionUnknown: this.metadata.dimensionUnknown,
      drawInstructions: drawInstructions,
      icon: this.validIcon,
      mobility: this.metadata.mobility != undefined,
      ...(this.metadata.app6a
        ? { standard: isApp6aSidc(this.options.sidc), modifierErrors }
        : {})
    };
  } else {
    return (
      !(
        this.metadata.affiliation == "undefined" ||
        (this.metadata.dimension == "undefined" &&
          !this.metadata.controlMeasure)
      ) &&
      drawInstructions &&
      this.validIcon &&
      this.metadata.mobility != undefined &&
      (!this.metadata.app6a || isApp6aSidc(this.options.sidc)) && modifierErrors.length === 0
    );
  }
}
