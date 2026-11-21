import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "surface-container-high": "#e8e8e8",
        "on-tertiary": "#ffffff",
        "on-primary-container": "#848484",
        "surface-container-low": "#f3f3f4",
        "inverse-surface": "#2f3131",
        "surface-tint": "#5e5e5e",
        "on-secondary-fixed-variant": "#464747",
        "tertiary-fixed": "#e3e2e2",
        "outline-variant": "#cfc4c5",
        "outline": "#7e7576",
        "on-primary-fixed": "#1b1b1b",
        "surface-dim": "#dadada",
        "on-error": "#ffffff",
        "error": "#ba1a1a",
        "inverse-primary": "#c6c6c6",
        "background": "#f9f9f9",
        "surface": "#f9f9f9",
        "on-error-container": "#93000a",
        "on-primary-fixed-variant": "#474747",
        "primary-container": "#1b1b1b",
        "on-background": "#1a1c1c",
        "on-surface-variant": "#4c4546",
        "secondary-fixed-dim": "#c7c6c6",
        "secondary": "#5e5e5e",
        "on-secondary": "#ffffff",
        "on-tertiary-fixed-variant": "#464747",
        "tertiary": "#000000",
        "surface-container-lowest": "#ffffff",
        "inverse-on-surface": "#f0f1f1",
        "error-container": "#ffdad6",
        "tertiary-container": "#1a1c1c",
        "primary": "#000000",
        "primary-fixed-dim": "#c6c6c6",
        "on-secondary-fixed": "#1b1c1c",
        "surface-container-highest": "#e2e2e2",
        "surface-container": "#eeeeee",
        "secondary-fixed": "#e4e2e2",
        "on-secondary-container": "#646464",
        "tertiary-fixed-dim": "#c7c6c6",
        "surface-variant": "#e2e2e2",
        "surface-bright": "#f9f9f9",
        "primary-fixed": "#e2e2e2",
        "on-tertiary-fixed": "#1a1c1c",
        "on-tertiary-container": "#838484",
        "on-surface": "#1a1c1c",
        "on-primary": "#ffffff",
        "secondary-container": "#e4e2e2"
      },
      borderRadius: {
        "DEFAULT": "0px",
        "lg": "0px",
        "xl": "0px",
        "full": "9999px"
      },
      spacing: {
        "unit": "4px",
        "gutter": "24px",
        "container-max": "1280px",
        "margin-mobile": "16px",
        "margin-desktop": "64px"
      },
      fontFamily: {
        "headline-xl": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "detail-mono": ["Courier Prime", "monospace"],
        "label-caps": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"]
      },
      fontSize: {
        "headline-xl": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "headline-lg-mobile": ["24px", { lineHeight: "1.2", fontWeight: "700" }],
        "detail-mono": ["14px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }]
      }
    }
  }
}
