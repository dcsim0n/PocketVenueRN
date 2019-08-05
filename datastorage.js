import { AsyncStorage } from '@react-native-community/async-storage';

export const saveData = async (state) => {
  try {
    await AsyncStorage.setItem(
      "@PocketVenue:state",
      JSON.stringify(state)
    );
  } catch (error) {
    Alert.alert("Data Store Error", `${error.name}: ${error.message}`, [
      { text: "OK" }
    ]);
  }
};

export const readData = async () => {
  try {
    const venues = await AsyncStorage.getItem("@PocketVenue:store");
    // this.setState({ venues: JSON.parse(venues) });
  } catch (error) {
    Alert.alert("Data Store Error", `${error.name}: ${error.message}`, [
      { text: "OK" }
    ]);
  }
};