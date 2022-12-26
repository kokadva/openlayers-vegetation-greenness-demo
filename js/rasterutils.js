import RasterSource from "ol/source/Raster";
import {getSatelliteSource} from "./utils";
import {Image as ImageLayer} from "ol/layer";


export const createCounts = (min, max, num) => {
    const values = new Array(num);
    for (let i = 0; i < num; ++i) {
        values[i] = 0;
    }
    return {
        min: min,
        max: max,
        values: values,
        delta: (max - min) / num,
    };
}


export const summarize = (value, counts) => {
    const min = counts.min;
    const max = counts.max;
    const num = counts.values.length;
    if (value < min) {
        // do nothing
    } else if (value >= max) {
        counts.values[num - 1] += 1;
    } else {
        const index = Math.floor((value - min) / counts.delta);
        counts.values[index] += 1;
    }
}

export const getRasterSource = () => {
    const satelliteSource = getSatelliteSource();
    const rasterSource = new RasterSource({
        sources: [satelliteSource],
        operation: function (pixels, data) {

            const pixel = pixels[0];
            const r = pixel[0] / 255;
            const g = pixel[1] / 255;
            const b = pixel[2] / 255;
            const value = (2 * g - r - b) / (2 * g + r + b);

            const counts = data.counts;
            const min = counts.min;
            const max = counts.max;
            const num = counts.values.length;

            if (value < min) {
                // do nothing
            } else if (value >= max) {
                counts.values[num - 1] += 1;
            } else {
                const index = Math.floor((value - min) / counts.delta);
                counts.values[index] += 1;
            }
            if (value >= data.threshold) {
                pixel[0] = 0;
                pixel[1] = 255;
                pixel[2] = 0;
                pixel[3] = 128;
            } else {
                pixel[3] = 0;
            }
            return pixel;
        },
        lib: {
            vgi: (pixel) => {
                const r = pixel[0] / 255;
                const g = pixel[1] / 255;
                const b = pixel[2] / 255;
                return (2 * g - r - b) / (2 * g + r + b);
            },
            summarize: summarize,
        },
    });

    return rasterSource

}

export const getRasterImageLayer = () => {
    const rasterImageLayer = new ImageLayer({
        source: getRasterSource(),
    });
    return rasterImageLayer;
}