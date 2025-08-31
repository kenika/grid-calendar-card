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
    window.loadHaForm?.();
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
    },
    { name: "view_end_time", label: "View end time", selector: { time: {} } },
    {
      name: "view_slot_minutes",
      label: "View slot minutes",
      selector: { number: { min: 1, max: 180 } },
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
    },
    {
      name: "show_now_indicator",
      label: "Show now indicator",
      selector: { boolean: {} },
    },
    {
      name: "height_vh",
      label: "Height (vh)",
      selector: { number: { min: 10, max: 200 } },
    },
    {
      name: "px_per_min",
      label: "Pixels per minute",
      selector: { number: { min: 0.1, max: 10, step: 0.1 } },
    },
    {
      name: "remember_offset",
      label: "Remember offset",
      selector: { boolean: {} },
    },
    {
      name: "data_refresh_minutes",
      label: "Data refresh minutes",
      selector: { number: { min: 1, max: 60 } },
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
    const data = { ...DEFAULTS, ...this._config } as any;
    const hass = {
      ...this.hass,
      locale: { ...this.hass.locale, time_format: data.time_format },
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
