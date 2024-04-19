import React, { useEffect, useMemo }  from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart, Bar, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter  } from 'recharts';
import { dateFormatter } from '../../../Common/helpers/formats';


const COLORS = [
  "red",
  "green",
  "blue",
  "pink",
  "lime",
  "cyam",
]

const GRAPH_TYPES_2 = {
  line: {
    ChartType: ({children, ...props}) => <LineChart children={children} {...props} />,
  },
  scatter: {
    ChartType: ({children, ...props}) => <ScatterChart children={children} {...props} />,
  },
}
const DATA_TYPES = {
  Date: {
    tickFormatter: dateFormatter,
    formatter: dateFormatter,
    scale: "time",
  },
}

export const Chart = ({data, series, title, type, ...props}) => {
  useEffect(() => console.log({ data }), [data])
  const ChartType = GRAPH_TYPES_2[type].ChartType
  
  const dataTypes = React.useMemo(() => ({
    x: DATA_TYPES[data?.[0]?.x.constructor.name],
    y: DATA_TYPES[data?.[0]?.y?.constructor?.name],
  }), [data])
  useEffect(() => console.log({ dataTypes }), [dataTypes])
  
  const dataSeries = useMemo(() => {
    if (series) {
      return series
    }
    const uniqueSeries = Array.from(new Set([...data.map(r => r.series)]));
    if (uniqueSeries.length === 0) {
      return ["y"]
    }
    return uniqueSeries;
  }, [data, series])
  useEffect(() => console.log({ dataSeries }), [dataSeries])

  const renderedData = useMemo(() => {
    if (series) {
      return data.map(record => Object.fromEntries([
        ["x", record.x],
        ...dataSeries.map(series => [series, record[series]])
      ]))
    }

    return data.map(record => ({
      x: record.x,
      [record.series]: record.y,
      series: record.series,
    }));
  }, [data])
  useEffect(() => console.log({ renderedData }), [renderedData])

  return <div>
    <h4 className='text-cdnter'>{title}</h4>
    <ResponsiveContainer height={400} {...props}>
      <ChartType data={renderedData}>
        {dataSeries?.map((series, i) => 
          type === "line" ? <Line key={series} dataKey={series} stroke={COLORS[i]} />
          :type === "scatter" ? <Scatter key={series} dataKey={series} color={COLORS[i]} />
          :null
        )}
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="x" { ...dataTypes.x } />
        <YAxis />
        {dataSeries?.length > 0 ?<Legend /> : null}
        <Tooltip 
          formatter={(value, name, props) => {
            if (type === "scatter") {
              props = {...props}
              const _value = dataTypes.x.formatter(value);
              props.x = _value
              return [_value, name, {...props}];
            }
            else if (type === "line") {
              const _value = value
              return [_value, name, {...props}];
            }
          }}
        />
      </ChartType>
    </ResponsiveContainer>
  </div>;
}