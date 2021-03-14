// import { useD3 } from './hooks/useD3';
import React from 'react';
import * as d3 from 'd3'
import d3mall from '../d3mall'

const useD3 = (renderChartFn, data, dependencies) => {
  const ref = React.useRef();

  React.useEffect(() => {
    console.log('renderChartFn', renderChartFn)
      renderChartFn(d3.select(ref.current), data);
      return () => {};
    }, dependencies);
  return ref;
}

export default function MallGraph({ data }) {
  const ref = useD3(
    d3mall.renderGraph,
    data,
    [data.nodes.length],
  );

  return (
    <svg
      ref={ref}
      style={{
        height: 800,
        width: "100%",
        marginRight: "0px",
        marginLeft: "0px",
      }}
    >
      <g className="plot-area" />
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
}
