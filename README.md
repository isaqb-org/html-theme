# html-theme
HTML Theme for all asciidoc files

## Themed images

Add `role=theme-swap` (AsciiDoc) or `class="theme-swap"` (HTML) to an image and
provide a dark variant named `<name>-dark.<ext>` next to it. In dark mode the
theme loads the dark variant automatically.

This works for link-based image builds only. Curriculum HTML built with
`-a data-uri` inlines images as base64, so there is no filename to rewrite and
the swap is a no-op.
