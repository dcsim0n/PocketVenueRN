import React from 'react'
import { View, Text } from 'react-native'
import {Line, Circle, G} from 'react-native-svg'

const TxGraphLayer = ({tx, x, y}) => {
    return (<G>
            {tx.map(( tx ) => {
                return <G x={x(tx.frequency)}>
                        
                        <Line
                        y1="50"
                        y2="130"
                        strokeWidth="3"
                        stroke="green"
                        />
                        <Circle
                        cy="50"
                        r="8"
                        fill="green" />
                    </G>

            })
        }
        </G>
            
        
    )
}

export default TxGraphLayer
