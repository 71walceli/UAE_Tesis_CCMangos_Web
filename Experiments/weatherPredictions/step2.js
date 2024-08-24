const data = require('./step2.json');

const output = Object.fromEntries(Object.entries(data)
    .map(([ rank, timeSeries ]) => [rank, Object.entries(timeSeries)
        .map(([ year, vars ]) => ({ date: year, ...vars}))
    ])
)

console.log(JSON.stringify(output, null, 2));
