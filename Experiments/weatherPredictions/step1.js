const data = require('./step1.json');

const output = Object.fromEntries(data
    .map(([ rank, timeSeries ]) => {
        return [rank, Object.fromEntries(Object.entries(timeSeries)
            .map(([ year, vars ]) => {
                return [year, Object.fromEntries(Object.entries(vars)
                    .filter(([key]) => !key.endsWith('_count'))
                    .map(([variable, value]) => {
                        return [variable, value / vars[`${variable}_count`]]
                    })
                )]
            })
        )]
    })
)

console.log(JSON.stringify(output, null, 2));
