"""Which Oyster watch to build.  WATCH_VARIANT=<name> bpyenv/bin/python build.py

grnr   126710GRNR GMT-Master II (Oystersteel, black/grey Cerachrom, green GMT text and hand): the
       default, the build's original reference
chnr   126711CHNR GMT-Master II "Root Beer" (Everose Rolesor)
613ln  126613LN Submariner Date 41 (yellow Rolesor, black)
610lv  126610LV Submariner Date 41 (Oystersteel, green Cerachrom, black dial)
618lb  126618LB Submariner Date 41 (18 ct yellow gold, blue Cerachrom, royal blue sunburst dial)

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
            dial=(6, 6, 7), sunburst=False, rehaut=(96, 98, 101), gmt_hand=True)
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
V = dict(BASE, **VARIANTS[NAME])


def mat(part, default):
    """The material for a part: the variant's gold where it calls for it, else the default."""
    return 'gold_polished' if part in V['gold_parts'] else default
