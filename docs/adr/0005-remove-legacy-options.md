# ADR 0005 — Remove Legacy Options and Rename Time Grid Settings

**Status**: Accepted
**Date**: 2025-08-31

## Context
Early versions exposed several configuration flags (`start_today`, `first_day`, `show_all_day`, `header_compact`, `weather_days`, `weather_compact`, `storage_key`) and generic `slot_*` names. They added complexity and were rarely used.

## Decision
- Drop legacy options: `start_today`, `first_day`, `show_all_day`, `header_compact`, `weather_days`, `weather_compact`, and `storage_key`.
- Rename `slot_min_time`, `slot_max_time`, and `slot_minutes` to `view_start_time`, `view_end_time`, and `view_slot_minutes`.
- Always show the all-day row and anchor the 7-day view to the current day.
- Weather forecast always covers the card's 7-day window.

## Consequences
- Simplified configuration surface for future UI editor.
- Existing dashboards using removed options must update their YAML.
