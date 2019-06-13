import React, { Component } from 'react'
import {View, Text} from 'react-native';
import {AreaChart, LineChart, Grid} from 'react-native-svg-charts';

export default class RfGraph extends Component {
    render() {
        const { scan } = this.props
        return (
            <View>
                <AreaChart
                    style={{ height:200 }}
                    data={ scan.scan }
                    svg={{ 
                        fill: 'rgba(255, 114, 0, 0.5)',
                        stroke: 'rgba(255, 114, 0, 1)' }}
                    contentInset={{ top:20, bottom: 20}}>
                        <Grid />
                </AreaChart>
                <Text>Block: {scan.block} Start: {scan.start.toFixed(2)} End: {scan.end.toFixed(2)} </Text>
            </View>
        )
    }
}
