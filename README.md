# Grid Calendar Card

A modern 7-day, time-grid calendar card for Home Assistant. Overlay multiple calendar entities, stack overlapping events, keep all-day events tidy in a pill row, and (optionally) show **daily weather in each day header**.

**Tech:** Lit + TypeScript • Works in normal dashboards and kiosk displays.

> Footer shows the running version. Example: `Grid Calendar Card v0.8.1`.

---

## Features

- **Multi-calendar overlay** with automatic laneing of overlapping events
- **All-day pills** (optional)
- **“Today” indicator** line (optional)
- **Rolling “today-first” week** (new in v0.8.0)
- **Daily weather in day headers** (new in v0.8.0)
- **Internationalization support** (new in v0.8.1)
- Remembered scroll offset (optional)
- Lightweight, no external dependencies
Tested on **Home Assistant 2025.8**. Should work on 2024.12+.
---
## Installation
### 1) Download the release asset
Grab `grid-calendar-card.js` from the latest GitHub Release and place it at:

```
/config/www/grid-calendar-card/grid-calendar-card.js
```

### 2) Add a Lovelace resource
**Settings → Dashboards → (⋮) Resources → + Add resource**

- URL: `/local/grid-calendar-card/grid-calendar-card.js`
- Resource type: **JavaScript Module**

> Tip: After updates, hard-refresh the browser (Ctrl/Cmd-Shift-R) to bust cache.

---

## Configuration

### Configuration (UI)
The card includes a basic editor and appears in Home Assistant's card picker. Use **Add Card → Grid Calendar Card** and configure options through the form. Advanced setups can still be done in YAML as documented below.

### Configuration (YAML)

Add the card to a view:

```yaml
type: custom:grid-calendar-card
entities:
  - entity: calendar.nuesken_family_gmail
    name: Family
    color: '#3f51b5'
  - entity: calendar.dennis_nuesken_gmail
    name: Dennis
    color: '#9c27b0'
  - entity: calendar.auri_nuesken_gmail_com
    name: Auri
    color: '#03a9f4'
```
# Time-grid & layout
view_start_time: '07:00:00'
view_end_time: '22:00:00'
view_slot_minutes: 60
locale: de               # optional language override
time_format: 24          # optional time format (12 or 24)
px_per_min: 0.8
height_vh: 80
show_now_indicator: true
remember_offset: true
data_refresh_minutes: 5

# Weather in day headers (optional)
weather_entity: weather.integra_langsbau_1_3
```

---

## Options

| Key                    | Type            | Default | Description |
|------------------------|-----------------|---------|-------------|
| `entities`             | list            | —       | Calendars to overlay. Each item: `{ entity, name?, color? }`. |
| `view_start_time`      | `HH:MM:SS`      | `07:00:00` | Earliest visible hour. |
| `view_end_time`        | `HH:MM:SS`      | `22:00:00` | Latest visible hour. |
| `view_slot_minutes`    | number          | `30`    | Minor grid step in minutes (1–180). |
| `locale`               | `'en'`/`'de'`   | HA      | Language override (defaults to Home Assistant). |
| `time_format`          | `'12'`/`'24'`   | `24`    | Hour format override. |
| `px_per_min`           | number          | `1.6`   | Vertical scale: pixels per minute. |
| `height_vh`            | number          | `80`    | Scroll area height in viewport units. |
| `show_now_indicator`   | boolean         | `true`  | Red “now” line when viewing the current week. |
| `remember_offset`      | boolean         | `true`  | Persist vertical scroll between reloads. |
| `data_refresh_minutes` | number          | `5`     | Re-fetch calendars every N minutes (1–60). |
| `weather_entity`       | string          | —       | Optional `weather.*` entity to show daily weather in headers. |

---

## Troubleshooting

- **Weather not showing**
  - Confirm `weather_entity` exists and is of domain `weather`.
  - Make sure your dashboard resource points to the **new** JS file (clear cache after updating).
  - The card reads forecast from the HA weather API and/or entity attributes. Some providers expose only daily or hourly — the card handles common formats.

- **I still see old code / version**
  - Hard refresh: Ctrl/Cmd-Shift-R.
  - If you host both dev/prod copies, double-check the resource path.

---

## Development

```bash
npm ci
npm run lint    # lint (no warnings allowed in CI)
npm run check   # typecheck
npm run build   # produces bundle(s) in dist/
```

For release, we typically upload a stable-named bundle:
- `dist/grid-calendar-card.js` (+ optional `.map`)

---

## Documentation

The most useful docs live in the `/docs` directory:

- **[Architecture](docs/ARCHITECTURE.md)** – How the card is structured and how data flows.
- **[Development Guide](docs/DEVELOPMENT.md)** – Local dev, building, linting, and release process.
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** – Common issues and fixes.
- **[Internationalization](docs/I18N.md)** – Add or update translations.

### Architecture Decision Records (ADRs)

- **[0001: Forecast data source](docs/adr/0001-forecast-data-source.md)** – Why we use the service/REST/attributes fallback order.
- **[0002: Week start = today](docs/adr/0002-week-start-today.md)** – Rationale for starting the 7-day grid from the current day.
- **[0003: Weather rendering in headers](docs/adr/0003-weather-rendering-in-headers.md)** – Design choices for minimal, consistent weather display.
- **[0005: Remove legacy options](docs/adr/0005-remove-legacy-options.md)** – Cleanup and renaming of configuration.

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for guidelines on filing issues and sending PRs.


## License

See `LICENSE`.