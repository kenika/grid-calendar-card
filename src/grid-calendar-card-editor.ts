import { LitElement, html, css, nothing } from "lit";
import { DEFAULTS, GridCalendarCardConfig } from "./config";

declare global {
  interface Window {
    loadHaForm?: () => Promise<void>;
  }
}

/** Simple ha-form based editor for Grid Calendar Card */
export class GridCalendarCardEditor extends LitElement {
  hass?: any;
  private _config: GridCalendarCardConfig = { entities: [] };

  connectedCallback() {
    super.connectedCallback();
    const load = window.loadHaForm
      ? window.loadHaForm()
      : // @ts-ignore
        new Function("return import('../../../src/components/ha-form/ha-form')")();
    load.then(() => this.requestUpdate());
  }

  private _schema: any = [
    {
      name: "entities",
      label: "Calendars",
      type: "array",
      schema: [
        {
          name: "entity",
          label: "Entity",
          selector: { entity: { domain: "calendar" } },
        },
        { name: "name", label: "Name", selector: { text: {} } },
        { name: "color", label: "Color", selector: { color: {} } },
      ],
    },
    {
      name: "view_start_time",
      label: "View start time",
      selector: { time: {} },
      default: DEFAULTS.view_start_time,
    },
    {
      name: "view_end_time",
      label: "View end time",
      selector: { time: {} },
      default: DEFAULTS.view_end_time,
    },
    {
      name: "view_slot_minutes",
      label: "View slot minutes",
      selector: { number: { min: 1, max: 180 } },
      default: DEFAULTS.view_slot_minutes,
    },
    {
      name: "locale",
      label: "Locale",
      selector: {
        select: {
          options: [
            { value: "en", label: "English" },
            { value: "de", label: "Deutsch" },
          ],
          mode: "dropdown",
        },
      },
    },
    {
      name: "time_format",
      label: "Time format",
      selector: { select: { options: ["12", "24"], mode: "dropdown" } },
      default: DEFAULTS.time_format,
    },
    {
      name: "show_now_indicator",
      label: "Show now indicator",
      selector: { boolean: {} },
      default: DEFAULTS.show_now_indicator,
    },
    {
      name: "height_vh",
      label: "Height (vh)",
      selector: { number: { min: 10, max: 200 } },
      default: DEFAULTS.height_vh,
    },
    {
      name: "px_per_min",
      label: "Pixels per minute",
      selector: { number: { min: 0.1, max: 10, step: 0.1 } },
      default: DEFAULTS.px_per_min,
    },
    {
      name: "remember_offset",
      label: "Remember offset",
      selector: { boolean: {} },
      default: DEFAULTS.remember_offset,
    },
    {
      name: "data_refresh_minutes",
      label: "Data refresh minutes",
      selector: { number: { min: 1, max: 60 } },
      default: DEFAULTS.data_refresh_minutes,
    },
    {
      name: "weather_entity",
      label: "Weather entity",
      selector: { entity: { domain: "weather" } },
    },
  ];

  static styles = css`
    ha-form {
      display: block;
    }
  `;

  setConfig(config: GridCalendarCardConfig): void {
    this._config = { entities: [], ...config };
  }

  render() {
    if (!this.hass) return nothing;
    const data = this._config as any;
    const hass = {
      ...this.hass,
      locale: {
        ...this.hass.locale,
        time_format: data.time_format ?? DEFAULTS.time_format,
      },
    };
    return html`
      <ha-form
        .hass=${hass}
        .data=${data}
        .schema=${this._schema}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent) {
    ev.stopPropagation();
    const value = ev.detail.value as GridCalendarCardConfig;
    const config: any = { ...this._config, ...value };
    if (!value.entities || value.entities.length === 0) {
      config.entities = this._config.entities;
    }
    this._config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define("grid-calendar-card-editor", GridCalendarCardEditor);
