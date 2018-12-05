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

export default class Comment extends React.Component {
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
    const { comment, user } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.postFooter}>
          <TouchableOpacity onPress={this.username_route}>
            <Text style={styles.username_text}>{user.username} </Text>
          </TouchableOpacity>
          <Text style={styles.caption}>{comment.content}</Text>
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
  username_view: { marginLeft: 10, marginRight: 10 },
  username_text: { fontWeight: "800" },
  postFooter: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginBottom: 5,
    marginTop: 20,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    backgroundColor: "#fafafa",
    borderRadius: 4,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1
  }
});
