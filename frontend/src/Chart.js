import { useEffect } from "react";
import vegaEmbed from "vega-embed";

function Chart({ data, pos, test }) {
  useEffect(() => {
    var spec = {};
    if (data.length === 0) {
        console.log("No data to render in Chart.");
        return;
    }
    else{
        console.log("Data structure in Chart:", data);
        spec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "data": { "values": data }, 
            "hconcat": [
              {
                "params": [
                  {
                    "name": "brush",
                    "select": { "type": "point", "fields": ["Rnd"], "on": "click" }
                  }
                ],
                "transform": [
                  { "filter": `datum.POS == "${pos}"` },
                  {
                    "aggregate": [
                      { "op": "q1", "field": test, "as": "q1" },
                      { "op": "q3", "field": test, "as": "q3" },
                      { "op": "mean", "field": test, "as": "mean" }
                    ],
                    "groupby": ["Rnd"]
                  }
                ],
                "mark": "bar",
                "encoding": {
                  "x": { "field": "q1", "type": "quantitative", "scale": { "zero": false } },
                  "x2": { "field": "q3" },
                  "y": { "field": "Rnd", "type": "nominal" },
                  "color": {
                    "condition": { "param": "brush", "field": "Rnd", "type": "nominal" },
                    "value": "lightgray"
                  },
                  "tooltip": [
                    { "field": "q1", "type": "quantitative" },
                    { "field": "mean", "type": "quantitative" },
                    { "field": "q3", "type": "quantitative" }
                  ]
                },
                "height": 400,
                "width": 500,
                "title": `Range of ${pos} ${test} by Round`
              },
              {
                "transform": [
                  { "filter": { "param": "brush" } },
                  { "filter": `datum.POS == "${pos}"` }
                ],
                "mark": { "type": "circle", "size": 30 },
                "encoding": {
                  "y": {
                    "field": test,
                    "type": "quantitative",
                    "scale": { "zero": false }
                  },
                  "x": {
                    "field": "Pick",
                    "type": "quantitative",
                    "title": "Pick",
                    "scale": { "zero": false }
                  },
                  "color": { "value": "tomato" },
                  "tooltip": [
                    { "field": "Name", "type": "nominal" },
                    { "field": "POS", "type": "nominal" },
                    { "field": test, "type": "quantitative" },
                    { "field": "Rnd", "type": "nominal" }
                  ]
                },
                "width": 500,
                "height": 400,
                "title": `Plot of ${test} of ${pos}`
              }
            ]
          };  
    }


    vegaEmbed("#multi", spec);
  }, [data, pos, test]);

  return <div id="multi"></div>;
}

export default Chart;