import React from 'react'
import {Doughnut} from "react-chartjs-2"
import {Chart as ChartJS} from 'chart.js/auto'

function ChartCountry(props) {

  return (
    <Doughnut data={props.hotels} >
            
    </Doughnut>
   )
}

export default ChartCountry