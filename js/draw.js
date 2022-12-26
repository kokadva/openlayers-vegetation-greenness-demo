import {getBoxDrawInteraction, getVectorSourceForDrawing} from "./utils";


export class DrawPolygon {


    constructor(map) {
        this.map = map;
        this.vectorLayer = getVectorSourceForDrawing();
        this.map.addLayer(this.vectorLayer);
        this.drawInteraction = getBoxDrawInteraction(this.vectorLayer);
        this.map.addInteraction(this.drawInteraction);
        this.drawEndCallbacks = [];
        this.drawStartCallbacks = [];
        this.initOnDrawEndCallbacks();
        this.initOnDraStartCallbacks();
    }


    onDrawEnd(callback) {
        this.drawEndCallbacks.push(callback)
    }

    onDrawStart(callback) {
        this.drawStartCallbacks.push(callback)
    }

    clear() {
        this.vectorLayer.getSource().clear();
    }

    initOnDrawEndCallbacks() {
        this.drawInteraction.on('drawend', (evt) => {
            this.drawEndCallbacks.forEach((c) => c(evt.feature))
        });
    }

    initOnDraStartCallbacks() {
        let self = this;
        this.drawInteraction.on('drawstart', (evt) => {
            self.clear();
            this.drawStartCallbacks.forEach((c) => c(evt.feature))
        });
    }
}