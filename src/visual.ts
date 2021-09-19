
"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import { VisualSettings } from "./settings";
 
import { Map } from 'ol';
import { Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import { View } from 'ol';
import { fromLonLat } from 'ol/proj';
import { XYZ } from "ol/source";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import {
    Tile as TileLayer,
  } from "ol/layer";
  import MVT from "ol/format/MVT";
  import { Fill, Stroke, Style, Text } from "ol/style";
export class Visual implements IVisual {
    private target: HTMLElement;
    private updateCount: number;
    private settings: VisualSettings;
    private textNode: Text;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.target = options.element;
        this.updateCount = 0;
        if (document) {
            const new_p: HTMLElement = document.createElement("div");
            new_p.setAttribute("id", 'map')
            new_p.setAttribute("style",'width:100%;height:100%;' )
                        // new_p.appendChild(document.createTextNode("Update count:"));
            // const new_em: HTMLElement = document.createElement("em");
            // this.textNode = document.createTextNode(this.updateCount.toString());
            // new_em.appendChild(this.textNode);
            // new_p.appendChild(new_em);
            this.target.appendChild(new_p);

            const overlayStyle = new Style({
                stroke: new Stroke({
                  color: "#3399cc",
                  width: 1,
                }),
                fill: new Fill({
                  color: "rgba(0,0,0,0)",
                }),
              });


            const vtSource = new VectorTileSource({
                maxZoom: 15,
                format: new MVT({
                  idProperty: "ADM0_CODE",
                }),
                url: "https://geoscan.staging.ifad.org/vt/{z}/{x}/{y}.pbf",
              });
          
          
                  const vtOverlay = new VectorTileLayer({
                declutter: true,
                renderMode: "vector",
                source: vtSource,
                style: overlayStyle,
              });


            var map = new Map({
                target: 'map',
                layers: [
                    // new Tile({
                    // source: new OSM(),
                    // }),
                    new TileLayer({
                        source: new XYZ({  url: 'https://geoscan.staging.ifad.org/geoserver/gwc/service/wmts?layer=geoscan:bluemarble&style=&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}'
     }),
                      }),
                      vtOverlay

                ],
                view: new View({
                    center: fromLonLat([37.41, 8.82]),
                    zoom: 4,
                }),
                });




        }

    }

    public update(options: VisualUpdateOptions) {
        this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        console.log('Visual update', options);

        // if (this.textNode) {
        //     this.textNode.textContent = (this.updateCount++).toString();
        // }
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}