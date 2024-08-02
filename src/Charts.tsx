import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts';

const option = {
    dataset: {
        source:[{}]
    },
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
        }
    ]
};

const Charts = () => {

    const chartContainerRef = useRef<any>()

    useEffect(() => {
        const myChart = echarts.init(chartContainerRef.current);
        myChart.setOption(option)
    }, [])

    return <div ref={chartContainerRef} style={{ height: '400px', width: '800px', margin: '200px auto', border: '1px solid red' }} />
}

export default Charts

