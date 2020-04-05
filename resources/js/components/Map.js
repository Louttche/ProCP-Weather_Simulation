import React from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import Simulation from "./classes/Simulation";


class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        var self = this;
        console.log(this.props.data)
        const width = 1280,
            height = 900,
            projection = d3.geoMercator()
                .center([13, 52]) //longitude, latitude
                .translate([width / 2, height / 2]) // center the image
                .scale([width / 1.5]);
        const path = d3.geoPath().projection(projection);
        const svg = d3.select("#Map").append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
            .attr("viewBox", "0 0 " + width + " " + height)
            .attr("preserveAspectRatio", "xMinYMin");

        const zoom = d3.zoom()
            .scaleExtent([1, 8])
            .on('zoom', zoomed);

        const g = svg.append('svg');

        svg.call(zoom);

        function zoomed() {
            svg
                .selectAll('path') // To prevent stroke width from scaling
                .attr('transform', d3.event.transform);
        }

        d3.json('http://localhost:8000/custom.geo.json')
            .then(topology => {
                // console.log(topology);
                svg.selectAll(".country")
                    .data(topojson.feature(topology, topology.objects.custom).features)
                    .enter()
                    .append("path")
                    .attr("class", ".country")
                    .attr("d", path)
                    .attr("fill", "#cccccc")
                    .attr("stroke", "#333333")
                    .attr("stroke-width", "0.5")
                    .on("mouseover", function (d) {
                        d3.select(this).attr("fill", "darkgrey");
                    })
                    .on("click", function (d) {
                        document.getElementById("countryName").innerHTML = `<b>${d.properties.name_long}</b>`;
                        var countryNames = self.props.data.map(d => d['name']);
                        var iCountry = 0;
                        var clickedCountryName = countryNames.find(c => c == d.properties.name_long);
                        var countryPopulation = NaN;
                        var countryForest = NaN;
                        var countryArea = NaN;
                        var countryPPM = NaN;
                        for (let i = 0; i < self.props.data.length; i++) {
                            if (self.props.data[i].name == clickedCountryName) {
                                countryPopulation = self.props.data[i].population;
                                countryForest = self.props.data[i].forests;
                                countryArea = self.props.data[i].area;
                                countryPPM = self.props.data[i].ppm;
                            }
                        }
                        if (clickedCountryName == null) {
                            document.getElementById("modal-body").innerHTML = `Not used!`;
                            document.getElementById("modalButton").click();
                        } else {
                            document.getElementById("modal-body").innerHTML = `<h5>Population: ${countryPopulation}</h5>
                                                                                    <h5>Forest: ${countryForest} %</h5>
                                                                                    <h5>Area: ${countryArea}km2</h5>
                                                                                    <h5>PPM: ${countryPPM}</h5>`;
                            document.getElementById("modalButton").click();
                        }

                    })
                    .on("mouseout", function (d) {
                        d3.select(this).attr("fill", "#cccccc")

                    })
            })

    }


    render() {
        const mystyle = {
            width: 500,
            height: 300,
            backgroundColor: 'white',
            borderRadius: 4,
            textAlign: 'center',
            padding: 20

        }
        return (
            <div>
                <div id="Map"></div>
            </div>
        );
    }
}

export default Map;