/** Adds the `js` class early so reveal-hidden content never flashes when JS is off. Rendered once in the layout. */
export function JsFlag() {
  return <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />;
}
