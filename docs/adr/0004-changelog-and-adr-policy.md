# 0004: Require changelog and ADR updates

Date: 2025-08-31

## Status
Accepted

## Context
Features were occasionally merged without documenting the reasoning or noting the change in the changelog, making it hard to track decisions.

## Decision
Every pull request introducing a user-facing feature or architectural change must:
- Add or update an Architecture Decision Record in `docs/adr`.
- Add an entry to `CHANGELOG.md` describing the change.

## Consequences
- Ensures project history and architectural intent stay accurate.
- Contributors and automated agents (Codex) must keep these files current.
