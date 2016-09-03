import React, { Component } from 'react';
import DonutChart from './DonutChart.js';
var dashboard = {
    "data": {
        "topography": [
            {
                "name": "Moutainous",
                "count": 1000000
            },
            {
                "name": "Plain Land",
                "count": 4499890
            },
            {
                "name": "Foothills",
                "count": 2159981
            },
            {
                "name": "ValleyFloor",
                "count": 3853788
            }
        ]
    }
};

class App extends Component {
  render() {
    return (
     <DonutChart data={dashboard.data.topography} class="donut-chart" width={400} height={300}/>
    );
  }
}

export default App;
