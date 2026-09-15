/**
 * Safe serialiser for JSON-LD injected with `dangerouslySetInnerHTML`.
 *
 * `JSON.stringify` does NOT escape `<`, so a value containing the literal
 * text `</script>` closes the tag it is sitting inside, and everything after
 * it is parsed as markup. In a `<script type="application/ld+json">` block
 * that is stored XSS on every page the block renders on.
 *
 * Today every value comes from `content.ts`, so nothing hostile reaches it —
 * but "the inputs happen to be trustworthy" is a coincidence, not a control,
 * and the coincidence is already eroding: `sameAs` is built from the socials
 * array, and the FAQ schema serialises long prose that someone will one day
 * paste rather than type.
 *
 * WHAT IS ESCAPED, and why it is the complete set:
 *
 *   <        closes the script tag and opens a new one
 *   >        completes a comment or a CDATA end
 *   &        lets an HTML entity reconstruct either of the above
 *   U+2028   legal in JSON, a LINE TERMINATOR to a JavaScript parser
 *   U+2029   the same
 *
 * The last two are written as \u escapes rather than as themselves, and that
 * is not fussiness: typed literally into the character class below they end
 * the line mid-regex and the file stops parsing. The bug this function
 * prevents is the same bug that breaks the function if you write it the
 * obvious way.
 *
 * The replacement is computed from the code point, so every escape is a
 * valid JSON string escape and the PARSED value is unchanged — a consumer
 * reads back exactly the characters that went in. This is an encoding change
 * at the boundary, not a change to the data.
 */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(
    /[<>&\u2028\u2029]/g,
    (character) =>
      "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0"),
  );
}
