# ShieldTX Black

The black version of the ShieldTX website. This repo contains only this version, with its images, logos, styles and animation code.

[Live website](https://shieldtx-v2-git-shield-black-eeshita7546-4312s-projects.vercel.app/)

## Run it locally

```sh
python3 -m http.server 4216 --directory dist
```

Open http://localhost:4216. There is no build step. For Vercel, use `dist` as the output directory; the configuration is included.

## Look and feel

Black backgrounds (`#000`), charcoal cards (`#0A0A0C` to `#070708`), light text (`#EEE`) and quiet gray supporting text (`#777`). Thin lines, wireframe graphics and soft light keep the focus on the content. Product images keep their original colors.

Headings use a Google Sans / Arial stack at regular weight. Google Sans is not bundled, so browsers use Arial when it is unavailable. Body text uses the device's system font; small technical labels use monospace. A DM Sans font file is also included as a retained asset. Section headings are 36px on mobile and scale up to 72px on desktop.

## How the flow works

The coin carries the story from the hero to wallet exposure, the trade flow and the institution walkthrough. The first trade follows your scroll so each step has time to make sense. After that, trades loop automatically, with a fresh account for every trade. The institution then breaks into its parts and comes back together.

Mobile has its own layout and shorter flow route. Refreshing restores the reading section and coin position; the first trade resets after refresh. Reduced-motion settings are supported.

## Where to edit

Everything lives in `dist/`. Start with `index.html` for content and `style.css` for shared styles. The JavaScript files are named by the section they control. Images, logos, fonts and bundled animation libraries are in `dist/assets/`.

Trading, API access and wallet scanning connect to existing ShieldTX services. This repo is the marketing website.
