

let timer = null;
export const bins = 10;

export function schedulePlot(resolution, counts, threshold, raster) {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
    timer = setTimeout(plot.bind(null, resolution, counts, threshold, raster), 1000 / 60);
}

const barWidth = 15;
const plotHeight = 150;
const chart = d3
    .select('#plot')
    .append('svg')
    .attr('width', barWidth * bins)
    .attr('height', plotHeight);

const chartRect = chart.node().getBoundingClientRect();
const tip = d3.select(document.body).append('div').attr('class', 'tip');

function plot(resolution, counts, threshold, raster) {
    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(counts.values)])
        .range([0, plotHeight]);

    const bar = chart.selectAll('rect').data(counts.values);

    bar.enter().append('rect');

    bar
        .attr('class', function (count, index) {
            const value = counts.min + index * counts.delta;
            return 'bar' + (value >= threshold ? ' selected' : '');
        })
        .attr('width', barWidth - 5);

    bar
        .transition()
        .attr('transform', function (value, index) {
            return (
                'translate(' +
                index * barWidth +
                ', ' +
                (plotHeight - yScale(value)) +
                ')'
            );
        })
        .attr('height', yScale);

    bar.on('mousemove', function () {
        const index = bar.nodes().indexOf(this);
        const threshold = counts.min + index * counts.delta;
        if (raster.get('threshold') !== threshold) {
            raster.set('threshold', threshold);
            raster.changed();
        }
    });

    bar.on('mouseover', function (event) {
        const index = bar.nodes().indexOf(this);
        let area = 0;
        for (let i = counts.values.length - 1; i >= index; --i) {
            area += resolution * resolution * counts.values[i];
        }
        tip.html(message(counts.min + index * counts.delta, area));
        tip.style('display', 'block');
        tip
            .transition()
            .style('left', chartRect.left + index * barWidth + barWidth / 2 + 'px')
            .style('top', event.y - 60 + 'px')
            .style('opacity', 1);
    });

    bar.on('mouseout', function () {
        tip
            .transition()
            .style('opacity', 0)
            .on('end', function () {
                tip.style('display', 'none');
            });
    });
}

function message(value, area) {
    const acres = (area / 4046.86)
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return acres + ' acres at<br>' + value.toFixed(2) + ' VGI or above';
}
