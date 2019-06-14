import React, { Component } from 'react'
import {View, Text} from 'react-native';
import {AreaChart, LineChart, Grid, XAxis} from 'react-native-svg-charts';
import PropTypes from 'prop-types'
import * as scale from 'd3-scale'
const stepSize = .1
export default class RfGraph extends Component {
    
    render() {
        const { scan } = this.props
        return (
            <View>
            <Text>Block: {scan.block} {scan.start.toFixed(2)}MHz - {scan.end.toFixed(2)}MHz </Text>
                <AreaChart
                    style={{ height:150 }}
                    data={ scan.scan }
                    scale = {scale.scaleLinear}
                    xAccessor = { ( {index} ) => scan.start + (index * stepSize) }
                    svg={{ 
                        fill: 'rgba(255, 114, 0, 0.5)',
                        stroke: 'rgba(255, 114, 0, 1)' }}
                    contentInset={{ top:20, bottom: 20}}>
                        <Grid />
                </AreaChart>
                <XAxis 
                    data = {scan.scan}
                    style={{}}
                    contentInset = {{left: 20, right: 20}}
                    scale={scale.scaleLinear}
                    numberOfTicks={12}
                    formatLabel={ (value, index) => (scan.start + (index * stepSize)).toFixed(2)}
                    />
            </View>
        )
    }
}

RfGraph.propTypes = {
    scan: PropTypes.shape({
        scan: PropTypes.array.isRequired,
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        block: PropTypes.string
    })
}