import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView
} from "react-native";
import { red } from "ansi-colors";

export default class Post extends React.Component {
  constructor(props) {
    super(props);
  }
  username_route = () => {
    this.props.handle_change_route("user_posts", this.props.user.id);
  };
  post_route = () => {
    this.props.handle_change_route(
      "one_post",
      this.props.user.id,
      this.props.post.id
    );
  };

  getAvatar() {
    return this.props.user.avatar.replace(
      "http://0.0.0.0:4000/",
      "http://tkaplan101518.local:4000/"
    );
  }

  render() {
    const { post, user } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.postHeader}>
          <TouchableOpacity onPress={this.username_route}>
            <Image
              style={styles.avatarImage}
              source={{
                uri: this.getAvatar()
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={this.username_route}>
            <View style={styles.username_view}>
              <Text style={styles.username_text}>{user.username}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.postContent}>
          <TouchableOpacity onPress={this.post_route}>
            <Image
              style={styles.postImage}
              source={{
                uri: post.image_url
              }}
            />
          </TouchableOpacity>
          <View style={styles.postFooter}>
            <TouchableOpacity onPress={this.username_route}>
              <Text style={styles.username_text}>{user.username} </Text>
            </TouchableOpacity>
            <Text style={styles.caption}>
              {/* </TouchableOpacity> */}
              {post.caption}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  avatarImage: {
    width: 40,
    resizeMode: "cover",
    borderRadius: 20,
    aspectRatio: 1
  },
  postHeader: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginTop: 20,
    borderBottomWidth: 0,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    borderRadius: 10,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "contain"
  },
  postContent: {
    width: "80%"
  },
  username_view: { marginLeft: 10, marginRight: 10 },
  username_text: { fontWeight: "800" },
  postFooter: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderTopWidth: 0,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    borderRadius: 4,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1
  },
  caption: {
    width: "80%",
    margin: 10
  }
});
