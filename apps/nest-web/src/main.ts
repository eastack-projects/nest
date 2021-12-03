import {createApp} from 'vue'
import App from './App.vue'
import * as d3 from "d3";

createApp(App).mount('#app')

const margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

class RawHTData {
    datetime: string;
    humidity: number;
    temperature: number;

    constructor(datetime: string, humidity: number, temperature: number) {
        this.datetime = datetime;
        this.humidity = humidity;
        this.temperature = temperature;
    }
}

class HTData {
    datetime: Date;
    humidity: number;
    temperature: number;

    constructor(datetime: string, humidity: number, temperature: number) {
        this.datetime = new Date(datetime);
        this.humidity = humidity;
        this.temperature = temperature;
    }
}

const svg = d3.select("#th")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("style", "background-color: #FBFAF0")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json<RawHTData[]>("http://localhost:3001/main.json")
    .then(row => {
        const data = row?.map(value => {
            return new HTData(value.datetime, value.humidity, value.temperature)
        })
        if (data !== undefined) {
            const [xMin, xMax] = d3.extent<HTData, Date>(data, datum => datum.datetime);
            const x = d3.scaleTime()
                .domain([xMin!, xMax!])
                .range([0, width]);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x));

            const ytMin = d3.min<HTData, number>(data, datum => datum.temperature);
            const ytMax = d3.max<HTData, number>(data, datum => datum.temperature);
            const yt = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(yt))

            const yhMin = d3.min<HTData, number>(data, datum => datum.humidity);
            const yhMax = d3.max<HTData, number>(data, datum => datum.humidity);
            const yh = d3.scaleLinear()
                .domain([0, 100])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisRight(yh).ticks(15))
                .attr("transform", `translate(${width})`);

            svg.append("path")
                .datum(data)
                .attr("fill", "rgba(54, 174, 175, 0.65)")
                .attr("d", d3.area<HTData>()
                    .curve(d3.curveMonotoneX)
                    .x(datum => x(datum.datetime))
                    .y0(yh(0))
                    .y1(datum => yh(datum.humidity)));

            svg.append("path")
                .datum(data)
                .attr("fill", "rgba(249, 208, 87, 0.7)")
                .attr("d", d3.area<HTData>()
                    .curve(d3.curveMonotoneX)
                    .x(datum => x(datum.datetime))
                    .y0(yt(0))
                    .y1(datum => yt(datum.temperature)));

        } else {
            console.error("data is undefined")
        }
    });
