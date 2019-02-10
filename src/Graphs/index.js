import "./graph.css";
import BarChart from "./barChart";
class Graphs{
    init(){
        // let inputData = [
        //     {name: "JAN", value:  40},
        //     {name: "FEB", value:  8},
        //     {name: "MAR", value: 15},
        //     {name: "APR", value: 16},
        //     {name: "MAY", value: 23},
        //     {name: "JUN", value: 30},
        //     {name: "JUL", value: 52},
        //     {name: "AUG", value: 41},
        //     {name: "SEP", value: 52},
        //     {name: "OCT", value: 23},
        //     {name: "NOV", value: 32},
        //     {name: "DEC", value: 42}
        // ];
     

        let inputData = {
            readings: [
            {name: "JAN", value: 40, color:"green",     hoverText: "JAN-40"},
            {name: "FEB", value:  8, color:"violet",    hoverText: "JAN-40"},
            {name: "MAR", value: 15, color:"blue",      hoverText: "JAN-40"},
            {name: "APR", value: 16, color:"red",       hoverText: "JAN-40"},
            {name: "MAY", value: 23, color:"green",     hoverText: "JAN-40"},
            {name: "JUN", value: 30, color:"blue",      hoverText: "JAN-40"},
            {name: "JUL", value: 52, color:"green",     hoverText: "JAN-40"},
            {name: "AUG", value: 41, color:"green",     hoverText: "JAN-40"},
            {name: "SEP", value: 52, color:"green",     hoverText: "JAN-40"},
            {name: "OCT", value: 23, color:"red",       hoverText: "JAN-40"},
            {name: "NOV", value: 32, color:"violet",    hoverText: "JAN-40"},
            {name: "DEC", value: 42, color:"green",     hoverText: "JAN-40"}
            ],

            graphValues: [{
                title: "i am a title",x_axis: "Month",y_axis: "payment"
            }]
        };
        let barChart = new BarChart();
        barChart.init("#bar_Chart",inputData);
    }
}
export default new Graphs();