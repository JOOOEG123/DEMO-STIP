import { Component, OnDestroy, OnInit, VERSION } from '@angular/core';
import { Subscription } from 'rxjs';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { RightistSchema } from 'src/app/core/types/adminpage.types';
import * as d3 from 'd3';
import { Arc, DefaultArcObject } from 'd3';
interface FilterData {
  filter: string;
  count: number;
}

@Component({
  selector: 'app-about-research',
  templateUrl: './about-research.component.html',
  styleUrls: ['./about-research.component.scss'],
})
export class AboutResearchComponent implements OnInit, OnDestroy {
  name = 'Angular ' + VERSION.major;

  total?: number;
  rightistSubscription?: Subscription;
  maleRightistList: RightistSchema[] = [];
  femaleRightistList: RightistSchema[] = [];

  rightist1957List: RightistSchema[] = [];
  rightist1958List: RightistSchema[] = [];
  rightist1959List: RightistSchema[] = [];

  rightistYearData: FilterData[] = [];
  genderData: FilterData[] = [];

  constructor(private archiveAPI: ArchieveApiService) {}

  ngOnInit(): void {
    this.bindChart();

    this.rightistSubscription = this.archiveAPI
      .getArchiveList()
      .subscribe((data: any) => {
        this.total = data.length;
        this.maleRightistList = data.filter((x) => x.gender == 'male');
        this.femaleRightistList = data.filter((x) => x.gender == 'female');
        this.rightist1957List = data.filter((x) => x.rightistYear == 1957);
        this.rightist1958List = data.filter((x) => x.rightistYear == 1958);
        this.rightist1959List = data.filter((x) => x.rightistYear == 1959);

        this.rightistYearData = [
          { filter: '1957', count: this.rightist1957List.length },
          { filter: '1958', count: this.rightist1958List.length },
          { filter: '1959', count: this.rightist1959List.length },
          {
            filter: 'unknown',
            count:
              this.total! -
              this.rightist1957List.length -
              this.rightist1958List.length -
              this.rightist1959List.length,
          },
        ];

        this.genderData = [
          { filter: 'male', count: this.maleRightistList.length },
          { filter: 'female', count: this.femaleRightistList.length },
          {
            filter: 'unknown',
            count:
              this.total! -
              this.maleRightistList.length -
              this.femaleRightistList.length,
          },
        ];
      });
  }

  bindChart() {
    var datatest = [
      { name: 'Female', value: 2.47, color: '#266461' },

      { name: 'Male', value: 25.51, color: '#D2D497' },

      { name: 'Unknown', value: 72.02, color: '#61AF87' },
    ];
    var width = 300,
      height = 300;

    var outerRadius = width / 2;
    var innerRadius = 100;
    var pie1 = d3
      .pie()
      .value((d: any) => {
        return d.value;
      })
      .sort(null);

    let arc: Arc<any, DefaultArcObject> = d3
      .arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius)
      .cornerRadius(3)
      .padAngle(0.015);

    var outerArc = d3.arc().outerRadius(outerRadius).innerRadius(innerRadius);

    var svg: any = d3
      .select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    svg.append('g').attr('class', 'slices');
    svg.append('g').attr('class', 'labelName');
    svg.append('g').attr('class', 'lines');

    var path = svg
      .selectAll('path')
      .data(pie1(datatest as any))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function (d) {
        return d.data.color;
      });

    path
      .transition()
      .duration(1000)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t));
        };
      });

    var restOfTheData = function () {
      var text = svg
        .selectAll('text')
        .data(pie1(datatest as any))
        .enter()
        .append('text')
        .transition()
        .duration(200)
        .attr('transform', function (d) {
          return 'translate(' + arc.centroid(d) + ')';
        })
        .attr('dy', '.4em')
        .attr('text-anchor', 'middle')
        .text(function (d) {
          return d.data.value + '%';
        })
        .style('fill', '#fff')
        .style('font-size', '10px');

      var legendRectSize = 20;
      var legendSpacing = 7;
      var legendHeight = legendRectSize + legendSpacing;

      var legend = svg
        .selectAll('.legend')
        .data(datatest)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function (d, i) {
          //Just a calculation for x & y position
          return 'translate(-50,' + (i * legendHeight - 55) + ')';
        });
      legend
        .append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .attr('rx', 20)
        .attr('ry', 20)
        .style('fill', function (d) {
          return d.color;
        })
        .style('stroke', function (d) {
          return d.color;
        });

      legend
        .append('text')
        .attr('x', 30)
        .attr('y', 15)
        .text(function (d) {
          console.log(d.name);
          return d.name;
        })
        .style('fill', function (d) {
          return d.color;
        })
        .style('font-size', '14px');
    };

    setTimeout(restOfTheData, 1000);
  }

  ngOnDestroy() {
    this.rightistSubscription?.unsubscribe();
  }
}
