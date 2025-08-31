# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Removed
- Legacy options `start_today`, `first_day`, `show_all_day`, `header_compact`, `weather_days`, `weather_compact`, and `storage_key`.
- Renamed `slot_min_time`/`slot_max_time`/`slot_minutes` to `view_start_time`/`view_end_time`/`view_slot_minutes`.

## [0.8.1] - 2025-08-31
### Added
- Internationalization support. ([#7](https://github.com/kenika/grid-calendar-card/pull/7), [#8](https://github.com/kenika/grid-calendar-card/pull/8))

### Changed
- Release workflow builds and uploads assets automatically. ([#9](https://github.com/kenika/grid-calendar-card/pull/9), [#10](https://github.com/kenika/grid-calendar-card/pull/10))

## [0.8.0] - 2025-08-28
### Added
- **Daily weather in day headers** via `weather_entity`, `weather_days`, `weather_compact`.
- **Rolling “today-first” week** using `start_today: true` (defaults to true).
- Footer version stamp shows running version.

### Changed
- Better lane packing for overlapping events.
- All-day pills kept tidy at top of each day.
- Internal refactors for performance and maintainability.

### Fixed
- Duplicate weather header entries in some configurations.
- Minor build warnings and TypeScript decorator issues.

## [0.7.0] - 2025-08-20
### Added
- Initial public release: 7-day multi-calendar time-grid, all-day pill row,
  “Now” indicator, persisted scroll, compact header mode.
