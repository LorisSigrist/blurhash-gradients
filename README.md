# 🎨 Blurhash Gradients
Draw blurhashes using CSS gradients.

Blurhash's main drawback is that it absolutely requires some client side JS. It cannot be server rendered.

## 🥅 Goals
- [x] Tiny CSS output (<1kb)
- [x] Fast enough to run on the fly during SSR
- [x] No Client side JS required
- [x] Run in both browser and node
- [ ] Don't need a wrapper element (not achieved yet)

## 🚀 Getting Started
Install the package using npm or yarn.

```bash
npm install blurhash-gradients
```

Then simply call the `blurhashAsGradients` function with the blurhash and use the resulting CSS object on a placeholder element behind your image.

```js
import { blurhashAsGradients } from 'blurhash-gradients';

const css = blurhashAsGradients('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
/*
{
    backgroundImage: string;
    backgroundSize: string;
    backgroundPosition: string;
    backgroundRepeat: string;
    boxShadow: string;
    filter: string;
    clipPath: string;
}
*/
```

```html
<div style="position: relative">
    <div style="position: absolute; inset: 0px; z-index: -1; [THE CSS GRADIENT OUTPUT HERE]">
    <img src="./big_image.png" width="1920" height="1080"/> <!-- Make sure to include size -->
</div>
```

## 📖 Options
You can also optionally pass in an options object as the second argument. Here are the defaults:

```js
import { blurhashAsGradients } from 'blurhash-gradients';

const css = blurhashAsGradients('LEHV6nWB2yk8pyo0adR*.7kCMdnj', {
    width: 8, //The horizontal resolution of the gradients
    height: 8, //The vertical resolution of the gradients
    blur: 20, //The amount of blur to apply to the gradients (in pixels). Increase this on large display sizes.
});
```

## 🤝 Credits
- [blurhash-to-css](https://github.com/JamieMason/blurhash-to-css) for the idea. Unfortunately it didn't quite do all I needed so I made this package.
