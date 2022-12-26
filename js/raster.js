import {getSatelliteTileLayer} from "./utils";
import {createCounts, getRasterImageLayer} from "./rasterutils";
import {bins, schedulePlot} from "./rasterchart";

// Constants
const minVgi = 0;
const maxVgi = 0.5;



export class RasterStatistics {

    initRasterSourceBeforeOperationsCallback() {
        let raster = this.satelliteRasterLayer.getSource();
        raster.on('beforeoperations', function (event) {
            event.data.counts = createCounts(minVgi, maxVgi, bins);
            event.data.threshold = raster.get('threshold');
        });
    }

    initRasterSourceAfterOperationsCallback() {
        let raster = this.satelliteRasterLayer.getSource();
        raster.on('afteroperations', function (event) {
            schedulePlot(event.resolution, event.data.counts, event.data.threshold, raster);
        });
    }

    constructor(map) {
        this.map = map;

        this.satelliteTileLayer = getSatelliteTileLayer();
        this.map.addLayer(this.satelliteTileLayer);

        this.satelliteRasterLayer = getRasterImageLayer();
        this.satelliteRasterLayer.setVisible(false);
        this.satelliteRasterLayer.getSource().set('threshold', 0.25);
        this.map.addLayer(this.satelliteRasterLayer);

        this.initRasterSourceBeforeOperationsCallback();
        this.initRasterSourceAfterOperationsCallback();
    }

    plot(feature) {
        const extent = feature.getGeometry().getExtent()
        this.satelliteRasterLayer.setExtent(extent);
        this.satelliteRasterLayer.setVisible(true);
    }

    clear(feature) {
        this.satelliteRasterLayer.setVisible(false);
    }
}