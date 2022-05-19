import { Dimensions, StyleSheet, Platform } from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    paddingTop: 2,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
  },
  item: {
    width: "100%",
    height: screenWidth - 200, //height will be 20 units less than screen width.
  },
  imageContainer: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    marginBottom: Platform.select({ ios: 0, android: 1 }), //handle rendering bug.
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  dotContainer: {
    backgroundColor: "rgb(230,0,0)",
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "black",
  },
  inactiveDotStyle: {
    backgroundColor: "rgb(255,230,230)",
  },
});
export default styles;
