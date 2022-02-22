import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as chartData from '../../assets/chartdata.json';

@Component({
    selector: 'line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {

    private svg:any;
    public chartData: any;
    public width = 800;
    public height = 600;
    public margin = { top: 20, right: 30, bottom: 30, left: 40 };

    constructor() { }

    ngOnInit(): void {
        this.getChartData();
    }

    getChartData() {
        this.chartData = chartData; // API call
        if (this.chartData) {
            this.createChart(this.chartData);
        }
    }

    createChart(data: { peaks: any }) {
        const peaks = data.peaks;
        const intensityArr = peaks.map((item: any) => item.intensity);
        const maxIntensity = Math.max.apply(null, intensityArr);
        const mxArr = peaks.map((item: any) => item.mz);
        const maxMx = Math.max.apply(null, mxArr);
        const minMx = Math.min.apply(null, mxArr);
        const mx_domain = [minMx, maxMx];

        this.svg = d3
            .select('#app')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        //prepare x-axis with mx
        const xScale = d3
            .scaleLinear()
            .domain([this.chartData.mzStart, this.chartData.mzStop])
            .range([0, this.width - this.margin.right]);
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('.4n'));
        const xAxisTranslate = this.height - this.margin.top - this.margin.bottom;

        this.svg
            .append('g')
            .attr('transform', 'translate(150, ' + xAxisTranslate + ')')
            .call(xAxis);

        this.svg
            .append('text')
            .attr(
                'transform',
                'translate(' +
                (this.width / 2 + this.margin.left) +
                ' ,' +
                (this.height - this.margin.bottom + this.margin.top) +
                ')'
            )
            .style('text-anchor', 'middle')
            .text('Mass-to-Charge');

        //prepare y axisd
        const yScale = d3
            .scaleLinear()
            .domain([0, maxIntensity])
            .range([this.height - this.margin.bottom - this.margin.top, 0]);
        const yAxis = d3.axisLeft(yScale).tickFormat(d3.format('.1e'));

        this.svg.append('g').attr('transform', 'translate(100,0)').call(yAxis);

        this.svg
            .append('text')
            .attr(
                'transform',
                'translate(' +
                this.margin.left +
                ' ,' +
                (this.height / 2 + this.margin.left + this.margin.top) +
                ') rotate(270)'
            )
            .style('text-anchor', 'middle')
            .text('Intensity');

        this.svg
            .append('path')
            .datum(peaks)
            .attr('fill', 'none')
            .attr('stroke', '#f781bf')
            .attr('stroke-width', 1.5)
            .attr('transform', 'translate(150,0)')
            .attr(
                'd',
                d3
                    .line()
                    .x(function (d: any) {
                        return xScale(d.mz);
                    })
                    .y(function (d: any) {
                        return yScale(d.intensity);
                    })
            );
    }
}
