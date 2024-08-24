const data = require('./step0.json');

const output = Object.entries(
    Object.entries(data).map(([variable, seriesTiempo]) => [
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

console.log(JSON.stringify(output, null, 2));
