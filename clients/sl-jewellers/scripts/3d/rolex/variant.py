"""Which Oyster watch to build.  WATCH_VARIANT=<name> bpyenv/bin/python build.py

grnr   126710GRNR GMT-Master II (Oystersteel, black/grey Cerachrom, green GMT text and hand): the
       default, the build's original reference
chnr   126711CHNR GMT-Master II "Root Beer" (Everose Rolesor)
613ln  126613LN Submariner Date 41 (yellow Rolesor, black)
610lv  126610LV Submariner Date 41 (Oystersteel, green Cerachrom, black dial)
618lb  126618LB Submariner Date 41 (18 ct yellow gold, blue Cerachrom, royal blue sunburst dial)
116334 116334 Datejust II (Oystersteel, white gold fluted bezel, blue Roman dial)
126333 126333 Datejust 41 'Wimbledon' (yellow Rolesor, slate dial, Jubilee)
126333ol the same in olive, as S&L's photo of watch 07 shows it
126622 126622 Yacht-Master 40 (Rolesium: Oystersteel, a platinum bezel with raised polished
       numerals on a sand-blasted ground, slate dial, blue YACHT-MASTER and seconds hand)

Rolex's catalogue images frame every Oyster Professional at the same bezel size, so each dial
and insert is measured in the GMT's millimetre frame (28.85 px/mm, centre 1200,1781) and the
finished watch is scaled to its real size (41/40 for the Submariner Date 41). Colours are
sampled off each image and calibrated against the grnr build, whose albedos already match its
own catalogue image."""
import os

NAME = os.environ.get('WATCH_VARIANT', 'grnr')
YELLOW = (0.98, 0.72, 0.40)       # 18 ct yellow gold, linear
EVEROSE = (0.93, 0.62, 0.48)
BASE = dict(model='gmt', scale=1.0, gmt_text=(0, 150, 70), insert_style='gmt24',
            insert_top=(9, 9, 10), insert_bottom=(44, 45, 47), engrave=None,
            gold=None, gold_parts=(), all_gold=False, bezel_teeth=60,
            dial=(6, 6, 7), sunburst=False, rehaut=(96, 98, 101), gmt_hand=True, seconds=None,
            model_text=None, guards=True, bezel='insert', rings=None, dial_style=None, numerals=None,
            text_color=None, hands='oyster', crown_mark='triplock', bracelet='oyster')
VARIANTS = {
    'grnr': dict(),
    'chnr': dict(gmt_text=(240, 168, 128), insert_bottom=(48, 24, 17), engrave=(228, 178, 156),
                 gold=EVEROSE, gold_parts=('bezel', 'crown', 'hands', 'indices', 'gmt_hand', 'centre_links')),
    '613ln': dict(model='sub', scale=41 / 40, insert_style='sub60', insert_bottom=(9, 9, 10),
                  engrave=(232, 196, 120), gold=YELLOW, bezel_teeth=120, gmt_hand=False,
                  gold_parts=('bezel', 'crown', 'hands', 'indices', 'centre_links')),
    '610lv': dict(model='sub', scale=41 / 40, insert_style='sub60', insert_top=(22, 56, 17),
                  insert_bottom=(22, 56, 17), engrave=(214, 216, 212), bezel_teeth=120, gmt_hand=False),
    '618lb': dict(model='sub', scale=41 / 40, insert_style='sub60', insert_top=(12, 32, 62),
                  insert_bottom=(12, 32, 62), engrave=(232, 196, 120), gold=YELLOW, all_gold=True,
                  bezel_teeth=120, gmt_hand=False, dial=(22, 78, 158), sunburst=True, rehaut=(70, 96, 130),
                  gold_parts=('bezel', 'crown', 'hands', 'indices', 'centre_links')),
}
VARIANTS['126622'] = dict(model='ym', insert_style='ym60', insert_top=(196, 197, 196), insert_bottom=(196, 197, 196),
                          engrave=(214, 215, 214), bezel_teeth=120, gmt_hand=False, dial=(46, 50, 54),
                          sunburst=True, rehaut=(110, 114, 118), gmt_text=(0, 158, 214),
                          seconds=(0.0, 0.32, 0.62))
# Datejust II 116334 (Oystersteel, white gold fluted bezel, azzurro blue sunburst dial, applied
# white gold Roman numerals with joined serifs, baton hands), measured off S&L's own reference
# photo (dj22.jpg, 14.68 px per frame-mm across, 0.958 vertical foreshortening corrected). The
# dial, rehaut and crystal sit wider than the GMT's, inside a fluted bezel that runs from r 16.25 to
# the case edge. rings: dial edge, rehaut top, flange outer and bezel inner radii, and the crystal's
# x/y scale against the GMT's (frame mm).
DJ2_RINGS = dict(dial=14.31, rh=15.19, fl=16.31, fl_in=16.25, cry=1.066)
VARIANTS['116334'] = dict(model='dj', scale=41 / 40, guards=False, bezel='fluted', rings=DJ2_RINGS,
                          dial_style='datejust', numerals='roman', dial=(78, 122, 178), sunburst=True,
                          rehaut=(96, 126, 162), hands='baton', gmt_hand=False, crown_mark='twinlock',
                          insert_style=None)
# Datejust 41 126333 'Wimbledon' (Oystersteel and yellow gold, fluted bezel, Jubilee), measured
# off Rolex's catalogue image m126333-0020 (28.5 px per frame-mm, centre 1200,1781): dial to
# r 14.62 with the 5-minute numbers round its edge, green-edged black Roman numerals centred on
# r 10.55 and 3.05 tall, a lume baton at 9, an applied coronet, gold baton hands with lume.
DJ41_RINGS = dict(dial=14.62, rh=15.30, fl=16.02, fl_in=16.00, cry=1.050)
DJ41 = dict(model='dj', scale=41 / 40, guards=False, bezel='fluted', rings=DJ41_RINGS,
            dial_style='datejust41', numerals='wimbledon', sunburst=True, hands='baton_lume', gmt_hand=False,
            crown_mark='twinlock', insert_style=None, bracelet='jubilee', gold=YELLOW,
            gold_parts=('bezel', 'crown', 'hands', 'indices', 'centre_links'))
# 54: slate, as Rolex makes it; 07: the same watch layout in the olive S&L's photo shows (no
# factory Wimbledon is olive, so its colour is the photo's, not a reference's)
VARIANTS['126333'] = dict(DJ41, dial=(84, 86, 88), rehaut=(80, 82, 84), rehaut_ground=(118, 120, 122))
VARIANTS['126333ol'] = dict(DJ41, dial=(70, 74, 50), rehaut=(80, 82, 84), rehaut_ground=(118, 120, 122))
V = dict(BASE, **VARIANTS[NAME])


def mat(part, default):
    """The material for a part: the variant's gold where it calls for it, else the default."""
    return 'gold_polished' if part in V['gold_parts'] else default
