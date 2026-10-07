"""Which GMT-Master II to build.  WATCH_VARIANT=chnr bpyenv/bin/python build.py
grnr: 126710GRNR (Oystersteel, black/grey Cerachrom, green GMT text and hand) -- the default
chnr: 126711CHNR "Root Beer" (Everose Rolesor: Everose bezel, crown, hands, index surrounds and
      centre links; black/brown Cerachrom with Everose numerals; Everose GMT-MASTER II text).
Colours for chnr sampled off Rolex's m126711chnr-0002 image and calibrated against the grnr
build, whose albedos already match its own catalogue image (measured/used ratios)."""
import os

NAME = os.environ.get('WATCH_VARIANT', 'grnr')
VARIANTS = {
    'grnr': dict(gmt_text=(0, 150, 70), insert_top=(9, 9, 10), insert_bottom=(44, 45, 47),
                 engrave=None, gold=None, gold_parts=()),
    'chnr': dict(gmt_text=(240, 168, 128), insert_top=(9, 9, 10), insert_bottom=(48, 24, 17),
                 engrave=(228, 178, 156), gold=(0.93, 0.62, 0.48),
                 gold_parts=('bezel', 'crown', 'hands', 'indices', 'gmt_hand', 'centre_links')),
}
V = VARIANTS[NAME]


def mat(part, default):
    """The material for a part: the variant's gold where it calls for it, else the default."""
    return 'gold_polished' if part in V['gold_parts'] else default
