import {Vector as VectorSource} from "ol/source";
import {Image as ImageLayer, Vector as VectorLayer} from "ol/layer";
import Draw, {createBox} from "ol/interaction/Draw";
import {Circle as CircleStyle, Fill, Stroke, Style} from "ol/style";
import XYZ from "ol/source/XYZ";
import TileLayer from "ol/layer/Tile";


export const getVectorSourceForDrawing = () => {
    const source = new VectorSource();

    return new VectorLayer({
        source: source,
        style: {
            'fill-color': 'rgba(255, 255, 255, 0.2)',
            'stroke-color': '#ffcc33',
            'stroke-width': 2,
            'circle-radius': 7,
            'circle-fill-color': '#ffcc33',
        },
    });
}

export const getBoxDrawInteraction = (vectorLayer) => {
    const type = "Circle"
    const geometryFunction = createBox()
    return new Draw({
        source: vectorLayer.getSource(),
        type: type,
        geometryFunction: geometryFunction,
        style: new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2,
            }),
            image: new CircleStyle({
                radius: 5,
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.7)',
                }),
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
            }),
        }),
    });

}

export let SATELLITE_SOURCE = null;

export const getSatelliteSource = () => {
    if (SATELLITE_SOURCE == null) {

        const key = 'U4TB1Bcgau3wRomRNAcU';
        const attributions =
            '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
            '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

        const aerial = new XYZ({
            attributions: attributions,
            url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
            maxZoom: 20,
            crossOrigin: '',

        });

        SATELLITE_SOURCE = aerial;
    }

    return SATELLITE_SOURCE;
}

export const getSatelliteRasterLayer = () => {

    const rasterLayer = new ImageLayer({
        source: getSatelliteSource(),
    });

    return rasterLayer;
}

export const getSatelliteTileLayer = () => {

    const satelliteTileLayer = new TileLayer({
        source: getSatelliteSource(),
    });

    return satelliteTileLayer;
}