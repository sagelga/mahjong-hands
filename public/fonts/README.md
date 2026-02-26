# Font Files

This directory contains self-hosted Inter font files to improve page load performance.

The following Inter font files are currently in use:

- Inter_18pt-Regular.ttf
- Inter_18pt-Medium.ttf
- Inter_18pt-SemiBold.ttf
- Inter_18pt-Bold.ttf

The font-face declarations in `src/fonts.css` are configured to use these TTF files.

## Benefits

- Eliminates external requests to Google Fonts CDN
- Improves First Contentful Paint (FCP) time
- Better caching opportunities
- Improved privacy (no third-party tracking)
