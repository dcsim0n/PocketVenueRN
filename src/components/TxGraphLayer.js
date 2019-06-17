import React from 'react'
import {Line, Circle, G, Text} from 'react-native-svg'

function logPress(e){
    e.persist()
    console.log('event:', e)
}
const TxGraphLayer = ({tx, x, y}) => {
    return (<G>
            {tx.map(( tx ) => {
                return <G x={x(tx.frequency)} onPress={(e)=>logPress(e)}>
                        
                        <Line
                            y1="50"
                            y2="130"
                            strokeWidth="3"
                            stroke="green"
                        />
                        <Circle
                            cy="50"
                            r="8"
                            fill="green" 
                        />
                        <Text 
                            y="20" 
                            textAnchor={'middle'}
                        >
                            {tx.frequency.toFixed(2)}
                        </Text>
                    </G>

            })
        }
        </G>
            
        
    )
}

export default TxGraphLayer
