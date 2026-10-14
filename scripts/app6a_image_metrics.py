import numpy as np
from PIL import Image,ImageFilter
SIZE=256
def normalize(image):
    image=image.convert("RGB"); a=np.array(image)
    y,x=np.where(a.min(axis=2)<215)
    if not len(x): return None
    crop=image.crop((int(x.min()),int(y.min()),int(x.max())+1,int(y.max())+1))
    scale=(SIZE-32)/max(crop.size)
    crop=crop.resize((max(1,round(crop.width*scale)),max(1,round(crop.height*scale))),Image.Resampling.LANCZOS)
    result=Image.new("RGB",(SIZE,SIZE),"white");result.paste(crop,((SIZE-crop.width)//2,(SIZE-crop.height)//2))
    return result
def compare(expected,actual):
    if actual is None: actual=Image.new("RGB",expected.size,"white")
    a,b=np.array(expected),np.array(actual)
    ma,mb=a.min(axis=2)<100,b.min(axis=2)<100
    da=np.array(Image.fromarray(ma).filter(ImageFilter.MaxFilter(5)))
    db=np.array(Image.fromarray(mb).filter(ImageFilter.MaxFilter(5)))
    recall=float((ma&db).sum())/max(1,int(ma.sum()));precision=float((mb&da).sum())/max(1,int(mb.sum()))
    score=2*precision*recall/max(1e-9,precision+recall)
    overlay=np.full_like(a,255);overlay[ma&mb]=[35,45,55];overlay[ma&~mb]=[0,145,195];overlay[mb&~ma]=[210,45,115]
    return score,float(np.abs(a.astype(float)-b.astype(float)).mean()/255),Image.fromarray(overlay)
