import { LitElement, html, css, nothing } from "lit";
import { DEFAULTS, GridCalendarCardConfig } from "./config";

/** Simple ha-form based editor for Grid Calendar Card */
export class GridCalendarCardEditor extends LitElement {
  hass?: any;
  private _config: GridCalendarCardConfig = { entities: [] };

  private _schema: any = [
    {
      name: "entities",
      type: "array",
      schema: [
        { name: "entity", selector: { entity: { domain: "calendar" } } },
        { name: "name", selector: { text: {} } },
        { name: "color", selector: { color: {} } },
      ],
    },
    { name: "view_start_time", selector: { time: {} } },
    { name: "view_end_time", selector: { time: {} } },
    { name: "view_slot_minutes", selector: { number: { min: 1, max: 180 } } },
    {
      name: "locale",
      selector: { select: { options: ["en", "de"], mode: "dropdown" } },
    },
    {
      name: "time_format",
      selector: { select: { options: ["12", "24"], mode: "dropdown" } },
    },
    { name: "show_now_indicator", selector: { boolean: {} } },
    { name: "height_vh", selector: { number: { min: 10, max: 200 } } },
    { name: "px_per_min", selector: { number: { min: 0.1, max: 10, step: 0.1 } } },
    { name: "remember_offset", selector: { boolean: {} } },
    { name: "data_refresh_minutes", selector: { number: { min: 1, max: 60 } } },
    { name: "weather_entity", selector: { entity: { domain: "weather" } } },
  ];

  static styles = css`
    ha-form {
      display: block;
    }
  `;

  setConfig(config: GridCalendarCardConfig): void {
    this._config = { ...config };
  }

  render() {
    if (!this.hass) return nothing;
    const data = { ...DEFAULTS, ...this._config } as any;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${this._schema}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent) {
    ev.stopPropagation();
    const value = ev.detail.value as GridCalendarCardConfig;
    const config: any = { ...value };
    // Remove defaults to keep YAML tidy
    Object.entries(DEFAULTS).forEach(([k, v]) => {
      if (config[k] === v) delete config[k];
    });
    this._config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define(
  "grid-calendar-card-editor",
  GridCalendarCardEditor
);

