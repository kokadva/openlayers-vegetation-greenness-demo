import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {DrawPolygon} from './draw'
import {RasterStatistics} from "./raster";


const map = new Map({
    target: 'map',
    view: new View({
        center: [-11000000, 4600000],
        zoom: 15,
    }),
});


const rasterStatistics = new RasterStatistics(map);

const draw = new DrawPolygon(map);
draw.onDrawEnd((x) => rasterStatistics.plot.call(rasterStatistics, x))
draw.onDrawStart((x) => rasterStatistics.clear.call(rasterStatistics, x))
