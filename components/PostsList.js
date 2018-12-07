import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  FlatList,
  RefreshControl
} from "react-native";
import Post from "./Post";
import Comment from "./Comment";

export default class PostsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  };

  display_posts = () => {
    if (this.props.posts.length > 0) {
      let keys = this.props.posts.map((post, index) => {
        return {
          data: post,
          key: post.id.toString()
        };
      });
      return (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          data={keys}
          onEndReachedThreshold={0.01}
          onEndReached={() => this.props.fetchData("load_more")}
          renderItem={({ item }) => (
            <Post
              handle_change_route={this.props.handle_change_route}
              post={item.data}
              user={item.data.user}
              key={item.data.id}
            />
          )}
        />
      );
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
        return post.comments.map(comment => {
          return (
            //could also be later converted to flat list
            <Comment
              handle_change_route={this.props.handle_change_route}
              comment={comment}
              user={comment.user}
              key={comment.id}
            />
          );
        });
      }
    }
  };
  render() {
    return (
      <View>
        {this.display_posts()}
        <ScrollView>
          {this.props.comments && this.display_comments()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    padding: 10
  }
});
