# UI Theme Inventory

This document inventories the current SCSS design values found under `client/src/**/*.scss` and defines the reusable UI theme now exposed from `src/scss/_theme.scss` through the existing `src/scss/_vars.scss` import path.

## Theme Entry Point

- Shared theme file: `src/scss/_theme.scss`
- Legacy compatibility path: `src/scss/_vars.scss`
- Existing component usage stays compatible: components that already import `../scss/vars` automatically receive the new theme tokens and mixins.

## Reusable Theme API

### Semantic Tokens

- Typography: base/system/code font families, semantic display/title/body/label/control sizes.
- Color roles: canvas background, surface layers, text hierarchy, borders, semantic status colors, accent colors.
- Layout scale: spacing steps, radii, control heights, button heights and widths.
- Effects: shadows, focus ring, motion durations, shared easing and entrance animation.

### Mixins

- `@include ui-focus-ring();`
- `@include ui-hover-lift();`
- `@include ui-surface-card();`
- `@include ui-surface-subtle();`
- `@include ui-control-base();`
- `@include ui-button-frame();`
- `@include ui-status-surface(...);`

### Recommended Component Usage

```scss
@import "../scss/vars";

.example-card {
    @include ui-surface-card();
    animation: $ui-animation-entrance;
}

.example-input {
    @include ui-control-base();
}

.example-button {
    @include ui-button-frame();
    background: $ui-gradient-button-tertiary;
}
```

## Extracted Inventory

The lists below come from a raw extraction across all SCSS files in `client/src`. They include product SCSS and generated/vendor-like SCSS already committed in the repository.

### All Explicit Hex Colors Found

```text
#000, #07111f, #08111d, #09121f, #0a66b7, #0d1728, #0e4b5c, #1236ff, #20b8c5, #20B8c5,
#23527c, #245269, #286090, #2b542c, #31708f, #333, #333333, #337ab7, #3c763d, #414A59,
#4D4D4D, #5dae7a, #66512c, #6EB8D4, #777777, #7ee7f2, #7f8da3, #82CA9C, #843534, #89d3a0,
#8a6d3b, #8D8D8D, #8fa2bb, #8fd6ff, #9197a3, #94a3b8, #999, #9db3cb, #9de2b7, #a83d46,
#a8bacf, #a94442, #afd9ee, #bdc1c9, #BFBDBD, #c0c0c0, #c1e2b3, #c4e3f3, #c7254e, #cbd5e1,
#cccccc, #d0e9c6, #d7e2f0, #d8ffeb, #D9D9D9, #d9edf7, #dbe5f2, #dd5555, #DD5555, #ddd,
#dddddd, #dff0d8, #dff7ff, #e0f8ff, #e2e8f0, #e4b9b9, #E5D151, #E7E7E7, #e8e8e8, #ebcccc,
#ece9e9, #eeeeee, #EEEEEE, #eff8ff, #f0fbff, #f1f1f1, #F1F1F1, #f2dede, #f5f5f5, #f6e7b1,
#f7ecb5, #F7F7F7, #f8fafc, #f9f2f4, #f9f9f9, #faf2cc, #FB6362, #fcf8e3, #fdd978, #ff0,
#ff8b8b, #ff8d99, #ffadb8, #ffdfe0, #ffe0e4, #fff, #fff19c, #fff4cf, #ffffe0, #ffffff, #FFFFFF
```

### All Explicit Functional Colors Found

```text
rgba($color, 0.2), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.7), rgba(0,0,0,0),
rgba(0,0,0,0.2), rgba(10, 18, 31, 0.9), rgba(10, 18, 31, 0.95), rgba(10, 18, 31, 0.96),
rgba(10, 18, 31, 0.98), rgba(107, 74, 12, 0.95), rgba(11, 20, 34, 0.96), rgba(11, 20, 34, 0.98),
rgba(120, 20, 34, 0.92), rgba(120, 94, 27, 0.18), rgba(13, 38, 59, 0.92), rgba(14, 75, 92, 0.82),
rgba(14, 75, 92, 0.88), rgba(14, 75, 92, 0.94), rgba(14, 75, 92, 0.98), rgba(143, 214, 255, 0.3),
rgba(143, 214, 255, 0.35), rgba(143, 214, 255, 0.65), rgba(15, 27, 46, 0.94), rgba(150, 150, 150, 0.2),
rgba(151, 27, 43, 0.96), rgba(156, 118, 16, 0.95), rgba(17, 146, 170, 0.72), rgba(18, 31, 51, 0.9),
rgba(18, 31, 51, 0.92), rgba(18, 31, 51, 0.96), rgba(18, 31, 51, 0.98), rgba(19, 186, 213, 0.8),
rgba(2, 6, 16, 0.78), rgba(2, 8, 23, 0.16), rgba(2, 8, 23, 0.2), rgba(2, 8, 23, 0.22),
rgba(2, 8, 23, 0.24), rgba(2, 8, 23, 0.28), rgba(2, 8, 23, 0.3), rgba(2, 8, 23, 0.32),
rgba(2, 8, 23, 0.34), rgba(2, 8, 23, 0.38), rgba(2, 8, 23, 0.4), rgba(20, 184, 198, 0.88),
rgba(20, 31, 48, 0.98), rgba(221, 85, 85, 0.12), rgba(221, 85, 85, 0.14), rgba(221, 85, 85, 0.22),
rgba(221, 85, 85, 0.88), rgba(24, 78, 119, 0.9), rgba(248, 250, 252, 0.15), rgba(25, 35, 49, 0.96),
rgba(250, 204, 21, 0.14), rgba(250, 204, 21, 0.18), rgba(252, 185, 0, 0.14), rgba(252, 185, 0, 0.24),
rgba(255, 125, 141, 0.6), rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.04),
rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.08),
rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.3),
rgba(255, 255, 255, 0.38), rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.74), rgba(255,255,255,0),
rgba(32, 184, 197, 0.08), rgba(32, 184, 197, 0.12), rgba(32, 184, 197, 0.14), rgba(32, 184, 197, 0.16),
rgba(32, 184, 197, 0.22), rgba(32, 184, 197, 0.24), rgba(32, 184, 197, 0.82), rgba(32, 184, 197, 0.9),
rgba(4, 12, 24, 0.72), rgba(4, 12, 24, 0.74), rgba(42, 31, 9, 0.92), rgba(7, 17, 31, 0.72),
rgba(7, 17, 31, 0.9), rgba(78, 60, 18, 0.88), rgba(78, 60, 18, 0.98), rgba(8, 18, 31, 0.9),
rgba(8, 18, 31, 0.92), rgba(8, 18, 31, 0.94), rgba(8, 18, 31, 0.96), rgba(8, 18, 31, 0.98),
rgba(87, 191, 129, 0.14), rgba(87, 191, 129, 0.24), rgba(9, 16, 28, 0.92), rgba(9, 16, 28, 0.98),
rgba(black, 0.2)
```

### Font Families Found

```text
"Helvetica Neue", Helvetica, Arial, sans-serif
'Segoe UI Variable Text', 'Segoe UI', Helvetica, Arial, sans-serif
'Segoe UI Variable Text', 'Segoe UI', Helvetica, sans-serif
Menlo, Monaco, Consolas, "Courier New", monospace
monospace, monospace
sans-serif
inherit
```

### Font Sizes Found

```text
$font-size--xs, $font-size--sm, $font-size--md, $font-size--bg, $font-size--lg, $font-size--xl,
4px, 7px, 10px, 10.6px, 11px, 12px, 12.5px, 13px, 14px, 15px, 16px, 17px, 17.5px, 18px,
20px, 21px, 22px, 24px, 26px, 30px, 36px, 40px, 65%, 75%, 80%, 85%, 90%, 100%, 1em, 2em,
inherit, small
```

### Button Sizes Found

- Shared visual button base: `height: 44px`, `border-radius: 14px`, `font-weight: 600`.
- `button_extra-small`: `width: 130px`, `height: 30px`.
- `button_small`: `width: 100px`, `height: 47px`.
- `button_medium`: `min-width: 70px`, `width: auto`, `padding: 5px 15px`, `height: 35px`.
- `button_large`: `width: 239px`.
- `button_auto`: `width: initial`, `height: initial`.
- `button_clean` and `button_link`: intrinsic width/height.
- Close/icon action controls in overlays: `36px` square is the current standard for circular icon actions.

### Effects and Animations Found

- Keyframes: `os-fade-up`, `sk-bouncedelay`, `turnAnimation`.
- Shared motion tokens now centralized:
  - Fast transitions: `0.2s ease`
  - Interactive color transitions: `0.3s ease`
  - Entrance animation: `os-fade-up 0.45s ease`
- Shared visual effects already present in the SCSS inventory:
  - Hover lift: `translateY(-1px)`
  - Focus ring: `0 0 0 3px rgba(32, 184, 197, 0.14)`
  - Soft shadow: `0 10px 22px rgba(2, 8, 23, 0.16)`
  - Button shadow: `0 12px 28px rgba(2, 8, 23, 0.2)`
  - Panel shadow: `0 18px 44px rgba(2, 8, 23, 0.32)`
  - Card shadow: `0 24px 72px rgba(2, 8, 23, 0.34)`
  - Overlay shadow: `0 28px 80px rgba(2, 8, 23, 0.4)`
  - Backdrop blur: `blur(18px)`

### Common Border Radii Found

```text
2px, 3px, 4px, 5px, 6px, 7px, 10px, 12px, 14px, 16px, 18px, 20px, 22px, 24px, 26px, 28px, 30px, 50%, 100%, 999px
```

## Semantic Mapping Implemented

The new theme centralizes the current visual language into these reusable roles:

- Canvas: dark, layered application background.
- Surfaces: strong/base/elevated/soft/muted layers.
- Text hierarchy: primary, secondary, muted, soft, accent.
- Borders: subtle, strong, focus, danger.
- Brand actions: primary red, success green, tertiary cyan.
- States: success, error, info, warning surfaces with matching icon/text tokens.
- Motion: consistent fast, normal and entrance timings.
- Shape: md/lg/xl/2xl/pill radii.

## Components Already Migrated to Theme Tokens

- `src/scss/_base.scss`
- `src/core-components/button.scss`
- `src/core-components/input.scss`
- `src/core-components/form-field.scss`
- `src/core-components/widget.scss`
- `src/core-components/drop-down.scss`
- `src/core-components/menu.scss`
- `src/core-components/modal.scss`
- `src/core-components/message.scss`
- `src/core-components/table.scss`
- `src/core-components/tag.scss`
- `src/core-components/tooltip.scss`
- `src/core-components/search-box.scss`
- `src/core-components/autocomplete.scss`
- `src/core-components/tag-selector.scss`

## Practical Rule

For new UI work, avoid hardcoding raw hex, rgba, radii, shadows or transition timings inside components when an equivalent semantic token or mixin already exists in `src/scss/_theme.scss`.