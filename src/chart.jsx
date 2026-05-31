import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function SavingsChart({
    currentSpend , optimizedSpend , savings 
}) {
const data = {

  labels: [
   "Optimized-spend" ,"Savings" 
  ],

datasets: [
  {
    data: [ optimizedSpend,
  savings],

    backgroundColor: [
         "#dede008f",
      "#22c55e"
    ],

    borderWidth: 0
  }
]

};
const options = {

  responsive: true,

  maintainAspectRatio: false,
 cutout: "60%",
 plugins: {

  legend: {

    position: "bottom"

  }

}
};
  return (
    
  <div className="chartContainer">
  <Doughnut data={data} options={options}/>

</div>
  );

}

export default SavingsChart;