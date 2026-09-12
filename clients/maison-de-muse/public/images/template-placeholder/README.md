# Template placeholder imagery — NOT the café's photography

Two iced-coffee product cutouts taken from the Beanro Framer template this
site was built from, re-composited onto the Maison de Muse palette
(plaster `#f1e7dc` and blush `#ead0c6`).

They are here so the closing CTA's plates can be reviewed with artwork in
them. They are **not** photographs of Maison de Muse, of its drinks, or of
its premises, and they must be replaced before the site is indexed.

Three things keep that honest:

1. They resolve only while `NEXT_PUBLIC_SITE_INDEXABLE` is unset — see
   `src/lib/images.ts`.
2. They render with `alt=""`, so they assert nothing to a screen reader.
3. `npm run verify` fails if a build is marked indexable while any
   placeholder is still resolving.

Dropping the real files named in `../README.md` into `public/images/`
takes precedence automatically — nothing here needs deleting first.

## Excluded from the template set, deliberately

The template's other images are Beanro's own brand assets and cannot be
used on a client site: its orange coffee-bean logo (five crops) and its
marketing poster ("Coffee Shop Website Template by Flowgen Studio"). The
set also contains one photograph of a café interior — a different café's
room. Putting that on Maison de Muse's site would misrepresent the
premises, so it is excluded too.
