#!/usr/bin/env bash

TO_LINK=(
  "react-native-gesture-handler"
  "react-native-tcp" 
  "react-native-svg" 
  "@react-native-community/async-storage" 
  "react-native-vector-icons"
  "native-base"
)

for module in "${TO_LINK[@]}"; do
  react-native link $module
done

