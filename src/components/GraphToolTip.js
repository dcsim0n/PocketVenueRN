import React from 'react'
import { View, Text } from 'react-native'
import {G, Rect, Circle, Line} from 'react-native-svg';

const xCord = 128
const gHeight = 150 
const GraphToolTip = ({x,y,data}) => {
    return (
        <G
            x={ x(xCord) - (75 / 2) }
            key={ 'tooltip' }
            onPress={ ()=> console.log('clicked tooltip') } 
        >

            <G y={ 50 } >
                <Rect
                    height= { 40 }
                    width= { 75 }
                    stroke={ 'grey' }
                    fill={ 'white' }
                    ry={ 10 }
                    rx={ 10 }
                />
                <Text
                    x= { 75/2 } 
                    dy={ 20 }
                    alignmentBaseline={ 'middle' } 
                    textAnchor={ 'middle' }
                    stroke={ 'rgb(134, 65, 244)'} 
                > 
                   { `${data[xCord]}` }
                </Text>

            </G>
            <G x={ 75/2 }>
                <Line 
                    y1={ 50 + 40 }
                    y2={ y(data[ xCord ]) }
                    stroke={ 'grey' }
                    strokeWidth={ 2 } />
                <Circle
                    cy={ y(data[ xCord ]) }
                    r={ 6 }
                    stroke={ 'rgb(134,65,244)'}
                    fill={ 'white' } />
                
            </G>

        </G>
            
    )
}

export default GraphToolTip
