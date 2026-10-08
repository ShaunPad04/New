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
16233  16233 Datejust 36 (yellow Rolesor, ivory Roman dial, Jubilee)
dj41gem watch 47: steel Datejust 41, green diamond dial, stone-set bezel, Oyster
228349rbr 228349RBR Day-Date 40 (white gold, pavé dial, diamond bezel, President): watches 28 and 31
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
            text_color=None, hands='oyster', crown_mark='triplock', bracelet='oyster', flutes=60,
            roman=dict(r=12.15, h=2.65, w=None, cor_h=2.62, cor_sx=1.27, cor_base=10.6),
            hand_dims=None, hand_ang=None, gems=0, date_frame=False, day=None,
            gem=dict(rc=17.95, rg=1.15, zg=4.64, prong=0.22, pin=16.80, pout=19.10, top_in=16.70))
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
# Datejust 36 16233 (Oystersteel and yellow gold, ivory dial with applied gold Roman numerals,
# Jubilee), measured off Bob's Watches' front photo (17.85 px per frame-mm, pivot 378,813): a narrow
# 84-flute bezel from r 17.95, the dial to r 16.0 with a railway minute track and lume dots, the
# numerals centred on r 13.45 and 2.94 tall, slim gold baton hands with lume. Its rehaut is a plain
# polished ring (no engraving before 2008) and its cyclops is smaller against the crystal.
DJ36_RINGS = dict(dial=16.0, rh=16.75, fl=17.95, fl_in=17.95, cry=1.17, cyc=0.82, rh_mat='ring_silver')
VARIANTS['16233'] = dict(DJ41, scale=0.9, rings=DJ36_RINGS, dial_style='datejust36', numerals='roman',
                         dial=(232, 220, 190), sunburst=False, text_color=(28, 26, 24), flutes=84,
                         roman=dict(r=13.45, h=2.94, w=0.957, cor_h=3.5, cor_sx=1.2, cor_base=10.9),
                         hand_dims=dict(hour=(0.78, 9.8, 2.4), minute=(0.68, 14.8, 2.0), second=(14.7, 5.0)),
                         hand_ang=dict(hour=304.0, minute=58.0, second=318.0))
# Watch 47: a steel Datejust 41 dressed with a green sunburst dial, ten set diamond hour markers,
# a framed date, small printed Roman numerals in the minute ring and a bezel of 46 round
# brilliants, on an Oyster bracelet; measured off S&L's own photo (26.87 px per frame-mm on the
# 1176 px guide crop, the bezel 20 mm). The stone setting is not confirmed as Rolex's own.
VARIANTS['dj41gem'] = dict(model='dj', scale=41 / 40, guards=False, bezel='gems', gems=46,
                           rings=dict(dial=15.8, rh=16.15, fl=16.3, fl_in=16.3, cry=1.069, rh_plain=True),
                           dial_style='dj_gem', numerals='diamonds', dial=(38, 68, 40), sunburst=True,
                           rehaut=(60, 90, 60), hands='baton_lume', gmt_hand=False, crown_mark='twinlock',
                           insert_style=None, date_frame=True,
                           hand_dims=dict(hour=(0.90, 8.6, 2.8), minute=(0.75, 12.6, 2.0), second=(13.5, 3.6)),
                           hand_ang=dict(hour=284.0, minute=149.0, second=146.0))
# Day-Date 40 228349RBR-0036 (white gold, a bezel of 60 brilliants, a pavé dial with eight
# baguette diamonds and sapphire baguettes at 6 and 9, the ROLEX and DAY-DATE plaques, blackened
# hands, President bracelet), measured off Rolex's catalogue image (28.57 px per frame-mm on the
# 1200 px guide crop). Watches 28 and 31 are the same configuration; the day reads FRIDAY as in
# S&L's photos. White gold is modelled with the steel materials (rhodium-plated, it reads the same).
VARIANTS['228349rbr'] = dict(model='dd', guards=False, bezel='gems', gems=60,
                             gem=dict(rc=18.40, rg=0.90, zg=4.62, prong=0.14, pin=17.42, pout=19.40, top_in=17.0),
                             rings=dict(dial=15.0, rh=15.85, fl=16.0, fl_in=16.0, cry=1.05),
                             dial_style='pave', numerals='dd_baguette', dial=(200, 200, 202), sunburst=False,
                             rehaut=(128, 130, 134), rehaut_ground=(196, 198, 200), hands='dd', gmt_hand=False,
                             crown_mark='twinlock', insert_style=None, bracelet='president', day='FRIDAY',
                             date_frame=True,
                             hand_dims=dict(hour=(1.0, 8.3, 2.6), minute=(0.85, 13.0, 2.0), second=(14.0, 4.2)),
                             hand_ang=dict(hour=305.0, minute=62.7, second=183.0))
V = dict(BASE, **VARIANTS[NAME])


def mat(part, default):
    """The material for a part: the variant's gold where it calls for it, else the default."""
    return 'gold_polished' if part in V['gold_parts'] else default
