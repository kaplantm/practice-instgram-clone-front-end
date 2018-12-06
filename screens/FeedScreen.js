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
  RefreshControl,
  AsyncStorage
} from "react-native";
import { WebBrowser } from "expo";

import { MonoText } from "../components/StyledText";
import Header from "../components/Header";
import PostsList from "../components/PostsList";

export default class FeedScreen extends React.Component {
  constructor(props) {
    super(props);

    this.BASE_URL = "http://tkaplan101518.local:4000/api/";
    this.state = {
      isLoadingComplete: false,
      route_type: "recent_posts",
      route_url: "posts/?sort=createdAt&include=user",
      posts: [],
      refreshing: false
    };
  }
  static navigationOptions = {
    header: null
  };

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  };

  componentDidMount() {
    this.handle_change_route(this.state.route_type);
  }
  handle_change_route = (route_type, userId, postId) => {
    console.log("Changing feed route: ", route_type, userId, postId);
    let new_route = (route_type => {
      switch (route_type) {
        case "one_post":
          return `users/${userId}/posts/${postId}?include=comments,user&sort=createdAt`;
        case "user_posts":
          return `users/${userId}/posts/?include=user&sort=createdAt`;
        default:
          return `posts/?sort=createdAt&include=user`;
      }
    })(route_type);
    this.setState(
      { route_url: new_route, route_type: route_type },
      this.fetchData
    );
  };

  async fetchData() {
    let token = this.props.screenProps.accessToken;
    let bearer = "Bearer " + token;
    // console.log("fetchData ", bearer);
    fetch(this.BASE_URL + this.state.route_url, {
      method: "GET",
      withCredentials: true,
      credentials: "include",
      headers: {
        Authorization: bearer
      }
    })
      .then(results => {
        if (results.status !== 200) {
          // console.log(results.status);
          throw new Error(" No posts found.");
        }
        console.log("Loaded feed");
        return results.json();
      })
      .then(data => {
        let post_data = Array.isArray(data) ? data : [data];
        this.setState({ posts: post_data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    let showComments = this.state.route_type === "one_post" ? true : false;
    return (
      <SafeAreaView style={styles.container}>
        <Header handle_change_route={this.handle_change_route} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <PostsList
            handle_change_route={this.handle_change_route}
            route_url={this.state.route_url}
            posts={this.state.posts}
            comments={showComments}
            route_type={this.state.route_type}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: 30
  }
});
