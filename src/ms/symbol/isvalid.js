export default function isValid(extended) {
  // Optional SIDC-specific validation is supplied by the metadata provider.
  const validation = this.metadata.validation;
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
      ...(validation ? validation.details : {})
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
      (!validation || validation.valid)
    );
  }
}
