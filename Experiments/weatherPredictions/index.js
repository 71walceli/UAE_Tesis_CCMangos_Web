const data = require('./step0.json');

let output = data
output = Object.entries(
    Object.entries(output).map(([variable, seriesTiempo]) => [
        ...Object.entries(seriesTiempo.min).map(([date, value]) => ({
            variable,
            date,
            value,
            rank: "min"
        })),
        ...Object.entries(seriesTiempo.value).map(([date, value]) => ({
            variable,
            date,
            value,
            rank: "value"
        })),
        ...Object.entries(seriesTiempo.max).map(([date, value]) => ({
            variable,
            date,
            value,
            rank: "max"
        })),
    ])
        .flatMap(x => x)
        .reduce((acc, item) => {
            const { date, rank, value, variable } = item
            if (!acc[rank]) {
                acc[rank] = {}
            }
            const year = date.substring(0, 4)
            if (!acc[rank][year]) {
                acc[rank][year] = {}
            }
            acc[rank][year][`${variable}_count`] = (acc[rank][year][`${variable}_count`] || 0) + 1
            acc[rank][year][variable] = (acc[rank][year][variable] || 0) + value
            
            return acc
        }, {})
)
output = Object.fromEntries(output
    .map(([ rank, timeSeries ]) => [rank, Object.fromEntries(Object.entries(timeSeries)
        .map(([year, vars]) => [year, Object.fromEntries(Object.entries(vars)
            .filter(([key]) => !key.endsWith('_count'))
            .map(([variable, value]) => [variable, value / vars[`${variable}_count`]])
        )])
    )])
    .map(([ rank, timeSeries ]) => [rank, Object.entries(timeSeries)
        .map(([ year, vars ]) => ({ date: year, ...vars}))
    ])
)

console.log(JSON.stringify(output, null, 2));
