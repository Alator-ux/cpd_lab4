import * as d3 from "d3";
import * as Geo from "../geo.json";
import { useRef, useEffect } from "react";
import { ColorScale } from "color-scales";

function createContainer(containerRef, props) {
    let svg = d3.select(containerRef.current).select("svg")
    if (svg.empty()) {
        svg = d3.select(containerRef.current).append("svg")
    }
    svg.selectAll("*").remove();
    svg.attr("width", props.width + props.margin.left + props.margin.right)
        .attr("height", props.height + props.margin.top + props.margin.bottom)
        .append("g")
        .attr("transform", `translate(${props.margin.left},${props.margin.top})`)
    return svg;
}
function drawMap(container, projection) {
    let g = container.append("g");
    g.selectAll("path")
        .data(Geo.features)
        .enter()
        .append("path")
        .attr("class", "topo")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .style("opacity", .7)
    return g;
}
function drawLaunchpadPoints(container, geoLaunchpads, projection) {
    const path = d3.geoPath().projection(projection)
    let g = container.append("g")
    g.attr("id", "launchpads")
        .selectAll("path")
        .data(geoLaunchpads)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", (d) => { return `i${d.id}` })
        .attr("class", "launchpad")
    return g;
}
function convertLaunchpads(launchpads) {
    res = [];
    for (let i = 0; i < launchpads.length; i++) {
        res.push({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [launchpads[i].longitude, launchpads[i].latitude]
            },
            "properties": { "name": launchpads[i].name },
            "id": launchpads[i].id
        })
    }
    return res;
}

function Map(props) {
    if (props.launchpads === undefined) {
        return <div>
        </div>
    }
    const containerRef = useRef(null);
    const containerProps = {
        width: 1000,
        height: 600,
        margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 100,
        },
    };
    useEffect(() => {
        let svg = createContainer(containerRef, containerProps)

        const projection = d3.geoMercator()
            .scale(70)
            .center([0, 20])
            .translate([containerProps.width / 2 - containerProps.margin.left, containerProps.height / 2]);
        let map = drawMap(svg, projection);
        const geoLaunchpads = convertLaunchpads(props.launchpads);
        drawLaunchpadPoints(map, geoLaunchpads, projection);
        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', function (event) {
                map.selectAll('path')
                    .attr('transform', event.transform);
            });
        svg.call(zoom);
    }, [props.launchpads]);

    return (
        <div className="mapContainer map" ref={containerRef}>
        </div>
    )
}

export { Map }