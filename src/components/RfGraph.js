import React, { Component } from 'react'
import {View, Text, Button} from 'react-native';
import {AreaChart, Grid, XAxis} from 'react-native-svg-charts';
import Slider from '@react-native-community/slider'
import GraphToolTip from './GraphToolTip'
import PropTypes from 'prop-types'
import * as scale from 'd3-scale'

const stepSize = .1
const zoomStep = 2
export default class RfGraph extends Component {
    constructor(props){
        super(props)

        this.state = {
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
        const newGraphMax = this.state.graphMax + value
        const newGraphMin = this.state.graphMin + value
        this.setState({graphMax: newGraphMax, graphMin: newGraphMin})
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
                    xMax={this.state.graphMax}
                    xMin={this.state.graphMin}>
                        <Grid />
                        <GraphToolTip />
                </AreaChart>
                <View style={{flexDirection:'row'}}>
                    <Button onPress={()=>this.zoomIn()} title={"+"} /> 
                    <Button onPress={()=>this.zoomOut()} title={"-"} />
                    <Slider
                        width={200}
                        minimumValue={-5}
                        maximumValue={5}
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
    })
}