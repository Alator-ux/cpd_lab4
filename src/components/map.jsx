import * as d3 from "d3";
import * as Geo from "../geo.json";
import {useRef, useEffect} from "react";
import {ColorScale} from "color-scales";
class Map {
    constructor(proportions) {
        this.proportions = proportions;
        this.colorScale = new ColorScale(0, 255, ["#000000", "#ffffff"]);
        this.#createProjection();
        this.#createZoom();
    }
    #createProjection() {
        this.projection = d3.geoMercator()
            .scale(70)
            .center([0, 20])
            .translate([this.proportions.width / 2 - this.proportions.margin.left, this.proportions.height / 2]);
    }
    #createSVG(containerRef) {
        const svg = d3.select(containerRef.current).append("svg");
        svg.selectAll("*").remove();
        svg.attr("width", this.proportions.width + this.proportions.margin.left + this.proportions.margin.right)
            .attr("height", this.proportions.height + this.proportions.margin.top + this.proportions.margin.bottom )
            .append("g")
            .attr("transform", `translate(${this.proportions.margin.left},${this.proportions.margin.top})`)

    }
    #drawCountries() {
        this.gCountries = this.svg.append("g")
            .selectAll("path")
            .data(Geo.features)
            .enter()
            .append("path")
            .attr("class", "topo")
            .attr("d", d3.geoPath()
                .projection(this.projection)
            )
            .attr("fill", (d) => {
                return this.colorScale.getColor(50).toHexString();
            })
    }
    #createZoom(){
        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', function(event) {
                this.gCountries.selectAll('path')
                    .attr('transform', event.transform);
            });
    }
    #drawPoint(xy, color) {
        let point = this.svg.append("circle")
            .attr("cx", xy[0])
            .attr("cy", xy[1])
            .attr("r", 5)
            .attr("fill", color)
            .classed('point', true);
    }
    #drawLaunchpadPoints(orig_launchpads, highlightLaunchpadId = undefined) {
        this.svg.selectAll(".point").remove();
        let launchpads = JSON.parse(JSON.stringify(orig_launchpads));
        let topLaunchpadIndex = launchpads.findIndex((launchpad) => launchpad.id === highlightLaunchpadId);
        let topLaunchpad = undefined;
        if(topLaunchpadIndex != -1){
            topLaunchpad = launchpads[topLaunchpadIndex];
        }
        launchpads.splice(topLaunchpadIndex, 1);

        launchpads.forEach(launchpad => {
            const xy = this.projection([launchpad.longitude, launchpad.latitude])
            this.#drawPoint(xy, 'blue');
        });
        if(!(topLaunchpad === undefined)){
            const xy = this.projection([topLaunchpad.longitude, topLaunchpad.latitude])
            this.#drawPoint(xy, 'red');
        }
    }
    Draw(props){
        const containerRef = useRef(null);
        if(props.launchpads.length == 0){
            return (<div></div>)
        }
        useEffect(()=> {
            this.#createSVG(containerRef);
            this.#drawCountries();

            svg.call(zoom);
            this.#drawLaunchpadPoints(orig_launchpads, highlightLaunchpadId);
        }, []);
        return(
            <div className="mapContainer map" ref={containerRef}>
            </div>
        )
    }
}

export {Map}