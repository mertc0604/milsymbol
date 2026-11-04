"""Independent drawn controls and optional local publication pairs; no mocks."""
import json
import multiprocessing
import unittest
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from app6a_visual_verdicts import fit, measure, judge
import app6a_visual_verdicts as metric

FIXTURES = Path(__file__).resolve().parents[2] / 'output/app6a-audit/symbols'

def picture(text='L', width=3, scale=1., shift=(0, 0), aspect=1., missing=False, extra=False, color='#80e0ff', frame='box'):
    image = Image.new('RGB', (256, 256), 'white')
    d = ImageDraw.Draw(image)
    if frame == 'box': d.rectangle((16, 32, 240, 224), fill=color, outline='black', width=3)
    else: d.polygon(((128, 16), (240, 128), (128, 240), (16, 128)), fill=color, outline='black', width=3)
    icon = Image.new('RGBA', (140, 100))
    p = ImageDraw.Draw(icon)
    p.ellipse((5, 5, 40, 40), outline='black', width=width)
    p.ellipse((100, 5, 135, 40), outline='black', width=width)
    if not missing: p.line((22, 22, 116, 75), fill='black', width=width)
    p.line((116, 22, 22, 75), fill='black', width=width)
    try:
        font = ImageFont.truetype('Arial.ttf', 22)
    except OSError:
        font = ImageFont.load_default(size=22)
    p.text((62, 73), text, fill='black', font=font)
    if extra: p.rectangle((58, 40, 84, 64), outline='black', width=width)
    icon=icon.resize((round(140*scale*aspect), round(100*scale)),Image.Resampling.LANCZOS)
    image.paste(icon, (128-icon.width//2+shift[0],128-icon.height//2+shift[1]),icon)
    return np.array(image)

def geometry(e, a, framed=True, marks=False):
    # The fallback intentionally exercises the old classifier first: new positives
    # fail on its existing review verdict, rather than on a missing API.
    fn = getattr(metric, 'geometry_comparison', None)
    return fn(e,a,framed,marks) if fn else {'equivalent':False,'comparable':False}

def cell(e,a,**kwargs):
    plain=measure(fit(e, False),fit(a,False))
    stretched=measure(fit(e, True),fit(a,True))
    direct=stretched if min(stretched[:2])>min(plain[:2])+.01 else plain
    return dict(score=min(direct[:2]),frameScore=direct[2],colour=getattr(metric,'colour_mismatch',lambda e,a:False)(e,a),frame=True,
                geometry=geometry(e,a,**kwargs))

def verdict(e,a,**kwargs):
    c=cell(e,a,**kwargs)
    return judge(c,.95,False,None,**({'row_geometry':c['geometry']['equivalent']} if hasattr(metric,'geometry_comparison') else {}))

def connected_label(text='L', fontsize=22, bold=0):
    image=Image.new('RGB',(256,256),'white');d=ImageDraw.Draw(image)
    d.rectangle((16,32,240,224),fill='#80e0ff',outline='black',width=3)
    d.rectangle((50,70,206,185),outline='black',width=3)
    d.line((50,70,206,185),fill='black',width=3)
    d.line((50,185,206,70),fill='black',width=3)
    try:font=ImageFont.truetype('Arial.ttf',fontsize)
    except OSError:font=ImageFont.load_default(size=fontsize)
    d.text((127,185-fontsize),text,fill='black',font=font,stroke_width=bold,stroke_fill='black')
    return np.array(image)

LETTERS='LTMHXIEFNKAVYZOCU'
# On the base line L is I and E is F: the differing bar lies on the line itself.
SAME_IMAGE={('L','I'),('I','L'),('E','F'),('F','E')}
LETTER_CHANGES=[(a,b) for a in LETTERS for b in LETTERS if a!=b and (a,b) not in SAME_IMAGE]

def letter_change(args):
    kind,a,b=args
    draw=connected_label if kind=='connected' else lambda text:picture(text=text)
    return verdict(draw(a),draw(b))

def letter_verdicts(kind):
    jobs=[(kind,a,b) for a,b in LETTER_CHANGES]
    try:
        with ProcessPoolExecutor(mp_context=multiprocessing.get_context('fork')) as pool:
            return list(pool.map(letter_change,jobs,chunksize=8))
    except (ValueError,OSError):
        return [letter_change(job) for job in jobs]

def solid(shape):
    image=Image.new('RGB',(256,256),'white');d=ImageDraw.Draw(image)
    d.rectangle((16,32,240,224),fill='#80e0ff',outline='black',width=3)
    getattr(d,shape)((80,80,176,176),fill='black')
    return np.array(image)

class VisualEquivalenceTests(unittest.TestCase):
    @unittest.skipUnless((FIXTURES / 'S-G-USXRC--F-framed-expected.png').exists(), 'local APP-6A audit corpus unavailable')
    def test_publication_recovery_corps_all_identities_pass_with_row_evidence(self):
        cells=[]
        for identity in 'UFNH':
            prefix=FIXTURES/f'S-G-USXRC--{identity}-framed'
            e=np.array(Image.open(str(prefix)+'-expected.png').convert('RGB'))
            a=np.array(Image.open(str(prefix)+'-actual.png').convert('RGB'))
            cells.append(cell(e,a,marks=True))
        evidence=sum(c['geometry']['equivalent'] for c in cells)>=2
        for c in cells:
            with self.subTest(score=c['score']):
                result=judge(c,.9338,False,None,**({'row_geometry':evidence} if hasattr(metric,'geometry_comparison') else {}))
                self.assertEqual(result,'pass')

    @unittest.skipUnless((FIXTURES / 'S-G-USXRT--F-framed-actual.png').exists(), 'local APP-6A audit corpus unavailable')
    def test_real_changed_modifier_and_text_cannot_borrow_row_equivalence(self):
        for expected_id,actual_id,marks in [('S-G-USXRC-','S-G-USXRT-',True),('S-G-UUSC--','S-G-UUSO--',False)]:
            for identity in 'UFNH':
                with self.subTest(expected=expected_id,actual=actual_id,identity=identity):
                    e=np.array(Image.open(FIXTURES/f'{expected_id}-{identity}-framed-expected.png').convert('RGB'))
                    a=np.array(Image.open(FIXTURES/f'{actual_id}-{identity}-framed-actual.png').convert('RGB'))
                    c=cell(e,a,marks=marks)
                    self.assertNotEqual(judge(c,.99,False,None,row_geometry=True),'pass')

    def test_stroke_width_scale_translation_and_modest_aspect_are_nuisance(self):
        e=picture()
        for kwargs in [dict(width=6),dict(scale=.82,shift=(6,-5)),dict(scale=1.10,aspect=1.08),dict(width=5,scale=.9,shift=(-4,3))]:
            with self.subTest(**kwargs): self.assertEqual(verdict(e,picture(**kwargs)),'pass')

    def test_solid_shapes_do_not_crash_or_compare_as_empty_skeletons(self):
        images=[solid('rectangle'),solid('ellipse')]
        self.assertEqual(verdict(images[0],images[0]),'pass')
        self.assertNotEqual(verdict(*images),'pass')

    def test_solid_icon_without_line_work_keeps_its_geometry(self):
        # Thinning leaves almost nothing of a solid square: the pattern
        # registration has no line work, but the geometry is still measured.
        same=metric.icon_metrics(solid('rectangle'),solid('rectangle'),True,False)
        changed=metric.icon_metrics(solid('rectangle'),solid('ellipse'),True,False)
        self.assertIsNone(changed[0])
        self.assertTrue(same[5]['equivalent'])
        self.assertTrue(changed[5]['comparable'])
        self.assertGreaterEqual(changed[5]['residual'],1)

    def test_geometry_result_is_plain_json(self):
        cases=[(picture(),picture(text='M'),False),(connected_label('L'),connected_label('T'),False),
               (solid('rectangle'),solid('ellipse'),True),(picture(),picture(scale=.5),True)]
        for e,a,marks in cases:
            for images in ((e,a),(e.astype(int),a.astype(int))):
                with self.subTest(marks=marks,dtype=images[0].dtype):
                    result=metric.geometry_comparison(*images,True,marks)
                    self.assertEqual(json.loads(json.dumps(result)),result)

    def test_int_arrays_compare_like_uint8_images(self):
        # The report loads images as int arrays; marks rows go through PIL.
        e,a=picture(),picture(text='M')
        self.assertEqual(metric.geometry_comparison(e.astype(int),a.astype(int),True,True),
                         metric.geometry_comparison(e,a,True,True))

    def test_letter_touching_a_line_cannot_change(self):
        # A large connected drawing cannot hide a changed letter: L->T and
        # H->X as well as every other letter change of an Arial 22 label
        # standing on a line.
        for (a,b),result in zip(LETTER_CHANGES,letter_verdicts('connected')):
            with self.subTest(expected=a,actual=b):
                self.assertNotEqual(result,'pass')

    def test_free_letter_cannot_change(self):
        for (a,b),result in zip(LETTER_CHANGES,letter_verdicts('free')):
            with self.subTest(expected=a,actual=b):
                self.assertNotEqual(result,'pass')

    def test_bolder_letter_touching_a_line_is_the_same_letter(self):
        for letter in 'LTHXMEO':
            with self.subTest(letter=letter):
                self.assertEqual(verdict(connected_label(letter),connected_label(letter,bold=1)),'pass')

    def test_connected_small_label_change_cannot_hide_in_large_component(self):
        for size in (16,22):
            with self.subTest(size=size):self.assertNotEqual(verdict(connected_label('L',size),connected_label('M',size)),'pass')

    def test_simple_stroke_scale_bound_applies_to_direct_and_row_routes(self):
        images=[]
        for coords in ((58,83,198,173),(93,105,163,150)):
            image=Image.new('RGB',(256,256),'white');d=ImageDraw.Draw(image)
            d.rectangle((16,32,240,224),fill='#80e0ff',outline='black',width=3)
            d.line(coords,fill='black',width=3);images.append(np.array(image))
        c=cell(*images)
        for supported in (False,True):
            with self.subTest(supported=supported):self.assertNotEqual(judge(c,.99,False,None,row_geometry=supported),'pass')

    def test_changed_small_label_never_passes_even_with_high_frame_score(self):
        e=picture(text='L')
        for label in ['M','H','X']:
            with self.subTest(label=label): self.assertNotEqual(verdict(e,picture(text=label)),'pass')

    def test_removed_line_and_added_icon_part_never_pass(self):
        e=picture()
        for kwargs in [dict(missing=True),dict(extra=True)]:
            with self.subTest(**kwargs): self.assertNotEqual(verdict(e,picture(**kwargs)),'pass')

    def test_wrong_frame_and_colour_fail_before_equivalence(self):
        c=cell(picture(),picture());c['colour']=True
        self.assertEqual(judge(c,1.,False,None),'fail')
        c['colour']=False;c['frameScore']=.5
        self.assertEqual(judge(c,1.,False,None),'fail')

    def test_wrong_image_hue_never_passes(self):
        self.assertEqual(verdict(picture(color='#80e0ff'),picture(color='#ff8080')),'fail')

    def test_wrong_image_frame_never_passes(self):
        self.assertNotEqual(verdict(picture(),picture(frame='diamond')),'pass')

    def test_row_evidence_cannot_hide_one_changed_identity(self):
        c=cell(picture(),picture(text='M'))
        self.assertNotEqual(judge(c,.99,False,None,row_geometry=True),'pass')

    def test_disproportionate_rows_remain_fail(self):
        c=cell(picture(),picture(missing=True))
        self.assertEqual(judge(c,.99,False,3.5),'fail')

    def test_row_evidence_cannot_hide_gross_scale_change(self):
        c=cell(picture(),picture(scale=.5))
        c['score']=.88  # frame-dominated score must not bypass the scale bound
        self.assertNotEqual(judge(c,.99,False,None,row_geometry=True),'pass')

    def test_gross_scale_change_remains_review(self):
        self.assertNotEqual(verdict(picture(),picture(scale=.5)),'pass')

if __name__=='__main__':unittest.main()
