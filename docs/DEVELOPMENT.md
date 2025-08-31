# Development Guide

## Requirements
- Node 18+ and npm
- Git
- Home Assistant instance (local or HA Cloud)

## Install
```bash
npm ci
```

## Build (production)
```bash
npm run build
# Output: dist/multi-calendar-grid-card.js
```

## Dev workflow with Home Assistant
1. Copy the built JS to HA (dev copy recommended):
   - HA path: `/config/www/dev/multi-calendar-grid-card.js`
   - Or keep the production copy in `/config/www/multi-calendar-grid-card/multi-calendar-grid-card.js`
2. In **Settings → Dashboards → Resources**, add (or edit) a resource:
   - URL: `/local/dev/multi-calendar-grid-card.js`
   - Type: `JavaScript Module`
3. Add the card to your dashboard YAML:
   ```yaml
   type: custom:multi-calendar-grid-card
   entities:
     - entity: calendar.example
       name: Example
       color: '#3f51b5'
   view_start_time: '07:00:00'
   view_end_time: '22:00:00'
   px_per_min: 0.8
   weather_entity: weather.integra_langsbau_1_3
  ```
4. Hard-refresh the dashboard (disable cache) after each change.

## Lint & Typecheck
```bash
npm run lint
npm run check
```

## Release
- Update `CHANGELOG.md`.
- `npm run build`.
- Attach `dist/multi-calendar-grid-card.js` to the GitHub Release.
