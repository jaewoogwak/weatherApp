import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const API_KEY = "";

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({
      accuracy: 5,
    });
    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    );
    setCity(location[0].city + " " + location[0].district);
    const response2 = axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const datas = await response2;
    const result = datas.data;

    setDays(result.daily);
    console.log("days", days);
  };

  useEffect(() => {
    getWeather();
  }, []);

  const formatting = (unix) => {
    let dt = new Date(unix * 1000);
    const month = dt.getMonth() + 1;
    const date = dt.getDate();
    return month + "월 " + date + "일";
  };
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="black" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.dateText}>{`${formatting(day.dt)}`}</Text>
              <Text style={styles.temp}>{day.temp.day.toFixed(1)}</Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "skyblue",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 48,
    fontWeight: "500",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    backgroundColor: "skyblue",
  },
  day2: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    backgroundColor: "orange",
  },
  day3: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    backgroundColor: "purple",
  },
  temp: {
    marginTop: 40,
    fontSize: 148,
  },
  description: { fontSize: 60, marginTop: -20 },
  tinyText: {
    fontSize: 20,
  },
  dateText: {
    fontSize: 30,
  },
});
