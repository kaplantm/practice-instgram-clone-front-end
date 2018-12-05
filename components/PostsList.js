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
import Post from "./Post";
import Comment from "./Comment";

export default class PostsList extends React.Component {
  constructor(props) {
    super(props);
  }

  display_posts = () => {
    if (this.props.posts.length > 0) {
      return this.props.posts.map(post => (
        <Post
          handle_change_route={this.props.handle_change_route}
          post={post}
          user={post.user}
          key={post.id}
        />
      ));
    } else {
      return (
        <View style={styles.loading}>
          <Text>Loading posts...</Text>
        </View>
      );
    }
  };
  display_comments = () => {
    if (this.props.route_type === "one_post") {
      let post = this.props.posts[0];
      if (post.comments && post.comments.length > 0) {
        return post.comments.map(comment => (
          <Comment
            handle_change_route={this.props.handle_change_route}
            comment={comment}
            user={comment.user}
            key={comment.id}
          />
        ));
      }
    }
  };
  render() {
    return (
      <View>
        {this.display_posts()}
        {this.props.comments && this.display_comments()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    padding: 10
  }
});
