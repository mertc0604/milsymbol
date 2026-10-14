// S-scheme only. Run after extracting independent publication cells.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ms from "../index.js";
const sharp=createRequire(import.meta.url)(process.env.SHARP_MODULE||"sharp");
const out=path.resolve("output/app6a-audit/symbols");
const rows=JSON.parse(fs.readFileSync(path.join(out,"references.json")));
const baseline=new Map(JSON.parse(fs.readFileSync("output/app6a-audit/before.json")).rows.map(row=>[row.id,row]));
for(const row of rows){
  for(const c of row.cases||[]){
    const sidc=`S${c.affiliation}${row.id[2]}P${row.id.slice(4)}${row.modifier.replaceAll('*','-')}---`;
    c.sidc=sidc;c.variants=[];
    for(const strokeWidth of [1,2,3,4]){
      const symbol=new ms.Symbol(sidc,{standard:"APP6A",size:160,frame:c.frame,fill:true,strokeWidth,infoFields:false});
      const name=`${c.key}-${strokeWidth}`;
      const svgPath=path.join(out,name+".svg"),pngPath=path.join(out,name+".png"),svg=symbol.asSVG();
      if(!fs.existsSync(pngPath)||!fs.existsSync(svgPath)||fs.readFileSync(svgPath,"utf8")!==svg){
        fs.writeFileSync(svgPath,svg);
        await sharp(Buffer.from(svg),{density:144}).flatten({background:"white"}).png().toFile(pngPath);
      }
      c.variants.push({strokeWidth,image:name+".png",svg:name+".svg",valid:symbol.isValid()});
    }
    const before=baseline.get(row.id)?.cases.find(b=>b.affiliation===c.affiliation&&b.frame===c.frame);
    if(before&&!fs.existsSync(path.join(out,c.key+"-baseline.png")))await sharp(Buffer.from(before.svg),{density:288}).flatten({background:"white"}).png().toFile(path.join(out,c.key+"-baseline.png"));
  }
}
fs.writeFileSync(path.join(out,"inputs.json"),JSON.stringify(rows,null,2));
console.log(`Rendered ${rows.length} S-scheme symbols and their publication-prescribed variants.`);
