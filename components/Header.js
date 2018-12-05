import React from "react";
import { Image, StyleSheet, View, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  container: {
    borderBottomColor: "rgba(0, 0, 0, 0.0975)",
    borderBottomWidth: 1,
    alignItems: "center",
    paddingBottom: 5,
    height: 40
  },
  headerImage: {
    height: "100%",
    resizeMode: "contain"
  }
});

export default class TabBarIcon extends React.Component {
  recent_posts_route = () => {
    this.props.handle_change_route("recent_posts");
  };

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.recent_posts_route}
      >
        <Image
          style={styles.headerImage}
          source={require("../assets/images/logo_title.png")}
        />
      </TouchableOpacity>
    );
  }
}
