# Build inputs for the models in public/models (7 Oct 2026)

Run from this folder with Blender's Python (bpy 5.2). Paths in the specs are relative to it;
the straightened textures they name are made by the commands below from the images in
`public/images/pieces/` (the `.cut.` front cut-outs) and the studio back images.

Bars (`../bars`):

    python ../bars/rectify.py ../../../public/images/pieces/bullion/00-06134f88.cut.2026-10-07.webp b00_front 1
    (the back: the studio back cut-out, flipped left to right, colour-matched to the front)
    python ../bars/build_bar.py b00.json b00.glb          # likewise b06 (1 bar), b41 (2 bars)

Chains (`../chains`), the traced paths are the `NN-hash.json` files here:

    python ../chains/chain_path.py ../../../public/images/pieces/chains/56-750751bb.cut.2026-10-07.webp 56-750751bb.json --closed
    python ../chains/build_chain.py c56.json c56.glb      # likewise c32, c44, c46, c53

Bracelet 11:

    python ../chains/strip.py ../../../public/images/pieces/bracelets/11-2b564db0.cut.2026-10-07.webp front_strip.png 112 \
        190,40 280,180 460,430 580,600 660,760 740,940 800,1080 860,1240 910,1400
    python ../chains/strip.py <studio back cut-out>.png back_strip.png 150 1320,320 1000,720 720,1200 560,1680 460,1960
    (then rows 48-300 of back_strip.png)
    python ../chains/build_band.py b11.json b11.glb

Then: `gltf-transform optimize in.glb out.glb --compress meshopt --texture-compress webp --texture-size 2048`.
