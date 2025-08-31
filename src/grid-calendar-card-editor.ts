import { LitElement, html, css, nothing } from "lit";
import { DEFAULTS, GridCalendarCardConfig, EntityCfg } from "./config";
import { tr, TranslationKey } from "./i18n";

/** Traditional form-based editor for Grid Calendar Card */
export class GridCalendarCardEditor extends LitElement {
  hass?: any;
  private _config: GridCalendarCardConfig = { entities: [] };

  setConfig(config: GridCalendarCardConfig): void {
    this._config = { entities: [], ...config };
  }

  private get _lang(): string {
    return this.hass?.language ?? "en";
  }

  render() {
    if (!this.hass) return nothing;
    const cfg = this._config;
    return html`
      <div class="entities">
        <div class="header">${tr(this._lang, "editor_calendars")}</div>
        ${cfg.entities?.map((ent, idx) => this._renderEntity(ent, idx))}
        <mwc-button @click=${this._addEntity} outlined>
          ${tr(this._lang, "editor_add_calendar")}
        </mwc-button>
      </div>
      <ha-textfield
        name="view_start_time"
        .label=${tr(this._lang, "editor_view_start_time")}
        type="time"
        .value=${cfg.view_start_time ?? DEFAULTS.view_start_time}
        @change=${this._valueChanged}
      ></ha-textfield>
      <ha-textfield
        name="view_end_time"
        .label=${tr(this._lang, "editor_view_end_time")}
        type="time"
        .value=${cfg.view_end_time ?? DEFAULTS.view_end_time}
        @change=${this._valueChanged}
      ></ha-textfield>
      <ha-textfield
        name="view_slot_minutes"
        .label=${tr(this._lang, "editor_view_slot_minutes")}
        type="number"
        min="1"
        max="180"
        .value=${String(cfg.view_slot_minutes ?? DEFAULTS.view_slot_minutes)}
        @change=${this._valueChanged}
      ></ha-textfield>
      <ha-select
        name="locale"
        .label=${tr(this._lang, "editor_locale")}
        .value=${cfg.locale ?? ""}
        @selected=${this._valueChanged}
        @closed=${this._stopPropagation}
      >
        <mwc-list-item value=""></mwc-list-item>
        <mwc-list-item value="en">English</mwc-list-item>
        <mwc-list-item value="de">Deutsch</mwc-list-item>
      </ha-select>
      <ha-select
        name="time_format"
        .label=${tr(this._lang, "editor_time_format")}
        .value=${cfg.time_format ?? DEFAULTS.time_format}
        @selected=${this._valueChanged}
        @closed=${this._stopPropagation}
      >
        <mwc-list-item value="12">12</mwc-list-item>
        <mwc-list-item value="24">24</mwc-list-item>
      </ha-select>
      ${this._renderBoolean(
        "show_now_indicator",
        cfg.show_now_indicator ?? DEFAULTS.show_now_indicator,
        "editor_show_now_indicator",
      )}
      <ha-textfield
        name="height_vh"
        .label=${tr(this._lang, "editor_height_vh")}
        type="number"
        min="10"
        max="200"
        .value=${String(cfg.height_vh ?? DEFAULTS.height_vh)}
        @change=${this._valueChanged}
      ></ha-textfield>
      <ha-textfield
        name="px_per_min"
        .label=${tr(this._lang, "editor_px_per_min")}
        type="number"
        step="0.1"
        min="0.1"
        max="10"
        .value=${String(cfg.px_per_min ?? DEFAULTS.px_per_min)}
        @change=${this._valueChanged}
      ></ha-textfield>
      ${this._renderBoolean(
        "remember_offset",
        cfg.remember_offset ?? DEFAULTS.remember_offset,
        "editor_remember_offset",
      )}
      <ha-textfield
        name="data_refresh_minutes"
        .label=${tr(this._lang, "editor_data_refresh_minutes")}
        type="number"
        min="1"
        max="60"
        .value=${String(cfg.data_refresh_minutes ?? DEFAULTS.data_refresh_minutes)}
        @change=${this._valueChanged}
      ></ha-textfield>
      <ha-entity-picker
        name="weather_entity"
        .hass=${this.hass}
        .label=${tr(this._lang, "editor_weather_entity")}
        .value=${cfg.weather_entity ?? ""}
        domain="weather"
        @value-changed=${this._valueChanged}
        allow-custom-entity
      ></ha-entity-picker>
    `;
  }

  private _renderEntity(ent: EntityCfg, idx: number) {
    return html`
      <div class="entity">
        <ha-entity-picker
          .hass=${this.hass}
          .label=${tr(this._lang, "editor_entity")}
          .value=${ent.entity}
          @value-changed=${(e: any) => this._entityChanged(e, idx, "entity")}
          allow-custom-entity
          domain="calendar"
        ></ha-entity-picker>
        <ha-textfield
          .label=${tr(this._lang, "editor_name")}
          .value=${ent.name ?? ""}
          @change=${(e: any) => this._entityChanged(e, idx, "name")}
        ></ha-textfield>
        <ha-textfield
          .label=${tr(this._lang, "editor_color")}
          .value=${ent.color ?? ""}
          @change=${(e: any) => this._entityChanged(e, idx, "color")}
        ></ha-textfield>
        <ha-icon-button
          @click=${() => this._removeEntity(idx)}
          .label=${tr(this._lang, "editor_remove")}
          icon="mdi:delete"
        ></ha-icon-button>
      </div>
    `;
  }

  private _renderBoolean(
    name: keyof GridCalendarCardConfig,
    value: boolean,
    labelKey: TranslationKey,
  ) {
    return html`
      <ha-formfield .label=${tr(this._lang, labelKey)}>
        <ha-switch
          name=${name}
          .checked=${value}
          @change=${this._valueChanged}
        ></ha-switch>
      </ha-formfield>
    `;
  }

  private _entityChanged(ev: any, index: number, field: keyof EntityCfg) {
    const value = ev.target?.value;
    const entities = [...(this._config.entities || [])];
    entities[index] = { ...entities[index], [field]: value };
    this._config = { ...this._config, entities };
    this._notify();
  }

  private _addEntity() {
    const entities = [...(this._config.entities || []), { entity: "" }];
    this._config = { ...this._config, entities };
    this._notify();
  }

  private _removeEntity(index: number) {
    const entities = [...(this._config.entities || [])];
    entities.splice(index, 1);
    this._config = { ...this._config, entities };
    this._notify();
  }

  private _valueChanged(ev: any) {
    ev.stopPropagation();
    const target = ev.target;
    const name = target.name as keyof GridCalendarCardConfig;
    let value = target.value ?? target.checked;
    if (target.type === "number") {
      value = target.value === "" ? undefined : Number(target.value);
    }
    const newConfig: any = { ...this._config }; // copy
    if (value === "" || value === undefined) {
      delete newConfig[name];
    } else {
      newConfig[name] = value;
    }
    this._config = newConfig;
    this._notify();
  }

  private _notify() {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _stopPropagation(ev: Event) {
    ev.stopPropagation();
  }

  static styles = css`
    .entities {
      margin-bottom: 16px;
    }
    .entity {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .header {
      font-weight: 500;
      margin-bottom: 4px;
    }
  `;
}

customElements.define("grid-calendar-card-editor", GridCalendarCardEditor);
