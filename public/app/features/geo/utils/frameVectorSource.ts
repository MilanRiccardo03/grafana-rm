import { Feature } from 'ol';
import { Geometry, LineString, Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';

import { DataFrame, Field } from '@grafana/data';

import { getGeometryField, LocationFieldMatchers } from './location';

export interface FrameVectorSourceOptions {
  groupBy?: string; // Campo per il raggruppamento
}

export interface FrameVectorSourceOptions {}

export class FrameVectorSource<T extends Geometry = Geometry> extends VectorSource<T> {
  constructor(
    public location: LocationFieldMatchers,
    options: FrameVectorSourceOptions = {}
  ) {
    super({});
  }

  update(frame: DataFrame) {
    this.clear(true);
    const info = getGeometryField(frame, this.location);
    if (!info.field) {
      this.changed();
      return;
    }

    for (let i = 0; i < frame.length; i++) {
      this.addFeatureInternal(
        new Feature({
          frame,
          rowIndex: i,
          geometry: info.field.values[i] as T,
        })
      );
    }

    // only call this at the end
    this.changed();
  }

  updateLineString(frame: DataFrame) {
    this.clear(true);
    const info = getGeometryField(frame, this.location);
    if (!info.field) {
      this.changed();
      return;
    }

    //eslint-disable-next-line
    const field = info.field as unknown as Field<Point>;
    const geometry: Geometry = new LineString(field.values.map((p) => p.getCoordinates()));
    this.addFeatureInternal(
      new Feature({
        frame,
        rowIndex: 0,
        geometry: geometry as T,
      })
    );

    // only call this at the end
    this.changed();
  }

  updateLineStringGrouped(frame: DataFrame, groupByField: string) {
    this.clear(true);

    const info = getGeometryField(frame, this.location);
    if (!info.field) {
      this.changed();
      return;
    }

    const groupField = frame.fields.find((f) => f.name === groupByField);
    if (!groupField) {
      this.updateLineString(frame);
      return;
    }

    const field = info.field as unknown as Field<Point>;

    const groups: Record<string, Point[]> = {};
    const values = field.values;
    const groupValues = groupField.values;

    for (let i = 0; i < values.length; i++) {
      const p = values[i];
      if (p instanceof Point) {
        const groupValue = groupValues[i];
        if (groupValue !== null && groupValue !== undefined) {
          const key = String(groupValue);
          if (!groups[key]) {
            groups[key] = [];
          }
          groups[key].push(p);
        }
      }
    }

    let featureIndex = 0;
    Object.entries(groups).forEach(([groupValue, points]) => {
      if (points.length > 1) {
        const coords = points.map((p) => p.getCoordinates());
        const lineGeometry: Geometry = new LineString(coords);

        this.addFeatureInternal(
          new Feature({
            frame,
            rowIndex: featureIndex++,
            [groupByField]: groupValue,
            geometry: lineGeometry as T,
          })
        );
      }
    });

    this.changed();
  }
}
