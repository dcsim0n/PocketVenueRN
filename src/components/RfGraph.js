import React, { Component } from 'react'
import {View, Text, Button} from 'react-native';
import {AreaChart, Grid, XAxis} from 'react-native-svg-charts';
import Slider from '@react-native-community/slider'
import GraphToolTip from './GraphToolTip'
import TxGraphLayer from './TxGraphLayer';
import PropTypes from 'prop-types'
import * as scale from 'd3-scale'

const stepSize = .1
const zoomStep = 2
export default class RfGraph extends Component {
    constructor(props){
        super(props)

        this.state = {
            panDelta: 0,
            graphMax : props.scan.end,
            graphMin : props.scan.start
        }
    }
    zoomIn(){
        console.log("Zooming in");
        const newGraphMax = this.state.graphMax - zoomStep
        const newGraphMin = this.state.graphMin + zoomStep
        this.setState({graphMax: newGraphMax, graphMin: newGraphMin})
    }
    zoomOut(){
        console.log("Zoom out");
        const newGraphMax = this.state.graphMax + zoomStep
        const newGraphMin = this.state.graphMin - zoomStep
        this.setState({graphMax: newGraphMax, graphMin: newGraphMin})
    }
    pan(value) {
        this.setState({panDelta: value})
    }
    
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
                    contentInset={{ top:20, bottom: 20}}
                    xMax={this.state.graphMax + this.state.panDelta}
                    xMin={this.state.graphMin + this.state.panDelta}>
                        <Grid />
                        {/* <GraphToolTip /> */}
                        <TxGraphLayer tx={this.props.tx} />
                </AreaChart>
                <View style={{flexDirection:'row'}}>
                    <Button onPress={()=>this.zoomIn()} title={"+"} /> 
                    <Button onPress={()=>this.zoomOut()} title={"-"} />
                    <Slider
                        width={200}
                        minimumValue={-10}
                        maximumValue={10}
                        value={ 0 }
                        onValueChange={(e)=>{this.pan(e)}}
                        />
                </View>

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
    }),
    tx: PropTypes.array
}