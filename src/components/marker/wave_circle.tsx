import mapboxgl from "mapbox-gl";
import * as turf from '@turf/turf'
import polylabel from 'polylabel';

export default class WaveCircle {
    id: string;
    map: mapboxgl.Map | null;
    center: number[];
    speed: number = 6000;


    color: string = 'red';
    geoJson: any = null;
    intersectAreaSetting: any = null;
    selectedAreaSetting: any = null;
    selectedPointSetting: any = null;
    worker: Worker | null = null;

    curTime: number = 0;
    allPolygon: any = [];
    circle: any = null;
    size: number = 0;

    selecttedPoint: any[] = [];


    constructor(id: string, speed: number, map: mapboxgl.Map | null, center: number[], setting: any) {
        this.id = id;
        this.speed = speed;
        this.map = map;
        this.center = center;
        if (setting.color) {
            this.color = setting.color;
        }

        if (setting.geoJson) {
            this.geoJson = setting.geoJson;
        }

        if (setting.intersectAreaSetting) {
            this.intersectAreaSetting = setting.intersectAreaSetting;
        }

        if (setting.selectedAreaSetting) {
            this.selectedAreaSetting = setting.selectedAreaSetting;
        }

        if (setting.selectedPointSetting) {
            this.selectedPointSetting = setting.selectedPointSetting;
        }

        if (setting.worker) {
            this.worker = setting.worker as Worker;
        }

        this.loadGeoJson();
        this.render();


        const animate = (time: number) => {
            if (!this.curTime) this.curTime = time;;
            const deltaTime = time - this.curTime;
            if (this.circle != null && this.map != null) {
                this.circle.features[0].properties.radius = this.size;
                (this.map.getSource(this.id) as mapboxgl.GeoJSONSource).setData(this.circle);

            }

            this.size = 0 + ((deltaTime / 1000) * this.speed);


            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        if ((this.intersectAreaSetting || this.selectedAreaSetting || this.selectedPointSetting) && this.worker != null) {
            setInterval(() => {
                this.worker!.postMessage({ type: 'checkHighlightArea', center: this.center, size: this.size, id: this.id });
            }, 1000);
            this.worker.addEventListener('message', (event) => {
                const data = event.data;
                var area = data.area;
                if(data.id == this.id && area.length > 0){
                    if(this.selectedPointSetting){
                        this.showSelectedPoint(area);
                    }
                    if(this.selectedAreaSetting){
                        this.highlightSelectedArea(area);
                    }
                }
            })
        }

    }
    render() {
        if (this.map == null) return;


        this.circle = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: this.center 
                    },
                    properties: {
                        radius: 0, 
                        lat: this.center[1]
                    }
                }
            ]
        };

        if (this.map.getLayer(this.id)) {
            this.map.removeLayer(this.id);
        }

        this.map.addLayer({
            id: this.id,
            type: 'circle',
            source: {
                type: 'geojson',
                data: this.circle
            },
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['exponential', 2],
                    ['zoom'],
                    0, 0,
                    22, [
                        '/',
                        ['/', ['get', 'radius'], 0.019],
                        ['cos', ['*', ['get', 'lat'], ['/', Math.PI, 180]]],
                    ],
                ],
                'circle-color': 'transparent',
                'circle-stroke-color': this.color,
                'circle-stroke-width': 2,
            }
        });
    }

    loadGeoJson() {
        if (this.geoJson == null || this.map == null) return;
        for (let index = 0; index < this.geoJson.features.length; index++) {
            const feature = this.geoJson.features[index];
            if (!feature.geometry) {
                console.log(feature);
                continue;
            }
            if (feature.geometry.type == 'Polygon') {
                this.allPolygon.push(turf.polygon(feature.geometry.coordinates, feature.properties))
            } else if (feature.geometry.type == 'MultiPolygon') {
                this.allPolygon.push(turf.multiPolygon(feature.geometry.coordinates, feature.properties))
            }
        }
        console.log(this.allPolygon.length);


    }

    highlightIntersectArea(highlightArea: any[]) {
        if (highlightArea.length > 0) {
            if (this.map?.getSource('highlight-source-' + this.id)) {
                (this.map?.getSource('highlight-source-' + this.id) as mapboxgl.GeoJSONSource).setData({ "type": "FeatureCollection", "features": highlightArea });
            } else {
                this.map?.addSource('highlight-source-' + this.id, {
                    'type': 'geojson',
                    'data': { "type": "FeatureCollection", "features": highlightArea }
                });
            }



            if (!this.map?.getLayer('highlight-layer-' + this.id)) {
                this.map?.addLayer({
                    'id': 'highlight-layer-' + this.id,
                    'type': 'fill',
                    'source': 'highlight-source-' + this.id,
                    'layout': {},
                    'paint': {
                        'fill-color': this.intersectAreaSetting.color ? this.intersectAreaSetting.color : 'red',
                        'fill-opacity': this.intersectAreaSetting.opacity ? this.intersectAreaSetting.opacity : 0.7
                    }
                });
                this.map?.moveLayer('outline');
                this.map?.moveLayer(this.id);
            }
        }
    }

    highlightSelectedArea(highlightArea: any[]) {


        if (highlightArea.length > 0) {
            if (this.map?.getSource('selected-source-' + this.id)) {
                (this.map?.getSource('selected-source-' + this.id) as mapboxgl.GeoJSONSource).setData({ "type": "FeatureCollection", "features": highlightArea });
            } else {
                this.map?.addSource('selected-source-' + this.id, {
                    'type': 'geojson',
                    'data': { "type": "FeatureCollection", "features": highlightArea }
                });
            }



            if (!this.map?.getLayer('selected-layer-' + this.id)) {
                this.map?.addLayer({
                    'id': 'selected-layer-' + this.id,
                    'type': 'fill',
                    'source': 'selected-source-' + this.id,
                    'layout': {},
                    'paint': {
                        'fill-color': this.selectedAreaSetting.color ? this.selectedAreaSetting.color : 'orange',
                        'fill-opacity': this.selectedAreaSetting.opacity ? this.selectedAreaSetting.opacity : 0.4
                    }
                });

                this.map?.moveLayer('outline');
                this.map?.moveLayer(this.id);
            }
        }
    }

    showSelectedPoint(selectedArea: any[]) {
        if (this.map == null || this.size <= 0 || !this.selectedPointSetting) return;
        let pins: any[] = [];
        for (let index = 0; index < selectedArea.length; index++) {
            const polygon = selectedArea[index];
            console.log(polygon);
            const p: number[] = turf.centroid(polygon).geometry.coordinates;
            if (this.selecttedPoint.findIndex((el) => el[0] == p[0] && el[1] == p[1]) == -1) {
                this.selecttedPoint.push(p);
                const markerParent = document.createElement('div');
                const markerEl = document.createElement('div');
                markerEl.innerHTML = '<p class="uppercase">'+polygon.properties.alt_name+'</p>';
                markerEl.classList.add('marker-daerah');
                markerEl.classList.add('show-pop-up');
                markerParent.appendChild(markerEl);
                new mapboxgl.Marker(markerParent)
                    .setLngLat([p[0], p[1]])
                    .addTo(this.map)
            }
        }
    }

    checkPoint():any[]{
        if (this.map == null || this.size <= 0) return [];
        const coordinate = [this.center[0], this.center[1]];
        const radius = this.size;
        var buffer = turf.buffer(turf.point(coordinate), radius, { units: 'meters' });

        let points : any[] = [];
        let highlightArea: any[] = [];

        for (let index = 0; index < this.allPolygon.length; index++) {
            const polygon = this.allPolygon[index];
            var p: number[] = polylabel(polygon.geometry.coordinates, 1.0);
            if (p != null && typeof p[0] === 'number' && typeof p[1] === 'number' && !Number.isNaN(p[0]) && !Number.isNaN(p[1])) {
            } else {
                p = turf.centroid(polygon).geometry.coordinates;
            }
            
            const cek = buffer ? turf.booleanContains(buffer, turf.point(p)) : false;
            if (cek) {
                points.push(p);
                highlightArea.push(polygon);
            }
        }

        return highlightArea;
    }
}