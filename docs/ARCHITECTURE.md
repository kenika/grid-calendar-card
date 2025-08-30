# Architecture Overview

**Multi-Calendar Grid Card** renders a 7-day time grid for multiple `calendar.*` entities and (optionally) overlays daily weather in each day header.

## Key parts

- **Card (Lit element)**: `<multi-calendar-grid-card>`
  - Fetches events via Home Assistant REST API:
    `GET /api/calendars/<calendar.entity>?start=<ISO>&end=<ISO>`
  - Lays out all-day and timed events, computes lanes, draws “now” line.
  - Supports options: `first_day`, `slot_*`, `px_per_min`, `remember_offset`, etc.
  - (From v0.8.0) Week start can be **today**.
  - If `weather_entity` is set, the card fetches forecast data and renders a compact icon and hi/low in each day header (see ADR-0001).

See `/docs/adr` for design decisions and trade-offs.
