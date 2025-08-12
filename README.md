# Next.js 15: Looking at What's New

A personal dev log as I revisit and upgrade my Next.js skills through [Brad Traversy's Tutorial](https://www.traversymedia.com/nextjs-ecommerce).

## App Creation & Basic Layout

### Create Next App & Assets

#### Fonts

In the past, using Google Fonts meant copying link tags into your HTML. If we do it like this, the fonts need to be loaded from a CDN every time the user makes a request to the page. Especially in a case when the user is in a slow internet, it can take some time to load the correct font. In this case, a fallback font will be used for the page until the correct font is loaded from the CDN. So, this increases the layout shift of your site.

A better way is to host the fonts yourself. And this is what Next.js is doing. CSS and font files are downloaded at build time and self-hosted with the rest of your static assets. No requests are sent to Google by the browser.

In summary, Next.js includes built-in automatic self-hosting for any font file.

After you've loaded the font, the variable must be available in the CSS scope - that is, in the DOM tree. So first, you'll have to add `fontFamily.variable` in the parent element (usually at `layout.tsx`). This is the variable that holds the reference to the font to be used in Tailwind or your own CSS.

To apply the font, use `fontFamily.variable` or simply `font-fontFamily` if you've already set up the font theme in Tailwind.

### Theme Mode Toggle

Encountered the hydration error whenever I'm changing the theme even though I've already set `use client`. This is because **client components** are still **server rendered**, read more at [If using <<use client>> in all components. Why use Next.js at all?](https://www.reddit.com/r/nextjs/comments/1c80rfp/if_using_use_client_in_all_components_why_use/)

## Responsive Sheet Menu

`@layer utilities` is now [deprecated](https://tailwindcss.com/docs/upgrade-guide#adding-custom-utilities). Custom classes would not work when applying responsive prefixes like `md:flex-start`.
