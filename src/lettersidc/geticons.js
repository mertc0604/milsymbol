export function geticons(ms, iconParts, STD2525) {
  const iconSIDC = {};
  const iconBbox = {};

  for (const source of ms._iconSIDC.letter) {
    source.call(this, iconSIDC, iconBbox, iconParts, STD2525);
  }
  return { icons: iconSIDC, bbox: iconBbox };
}
