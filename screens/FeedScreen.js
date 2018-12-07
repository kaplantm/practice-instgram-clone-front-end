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
    this.pageSize = 3;
    this.justLoaded = false;
    this.state = {
      isLoadingComplete: false,
      route_type: "recent_posts",
      route_url: "posts/?sort=createdAt&include=user",
      posts: [],
      page: 0,
      maxedPages: false
    };
  }
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.handle_change_route(this.state.route_type);
  }
  handle_change_route = (route_type, userId, postId) => {
    this.setState({ page: 0, maxedPages: false });
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

  fetchData = async load_type => {
    //delay half second before allowing loading again
    if (this.justLoaded) {
      return null;
    } else {
      //nothing more to load if viewing one post, don't send request
      if (this.state.route_type === "one_post" && load_type === "load_more") {
        return null;
      } else {
        let token = this.props.screenProps.accessToken;
        let bearer = "Bearer " + token;
        let page = load_type === "load_more" ? this.state.page + 1 : 0;

        this.setState({ page: page });
        this.justLoaded = true;
        setTimeout(() => {
          this.justLoaded = false;
        }, 500);
        fetch(
          this.BASE_URL +
            this.state.route_url +
            `&limit=${this.pageSize}&offset=${this.pageSize * page}`,
          {
            method: "GET",
            withCredentials: true,
            credentials: "include",
            headers: {
              Authorization: bearer
            }
          }
        )
          .then(results => {
            if (results.status !== 200) {
              throw new Error(" No posts found.");
            }

            console.log("Loaded feed");
            return results.json();
          })
          .then(data => {
            let post_data = Array.isArray(data) ? data : [data];
            let updated_post_data =
              load_type === "load_more"
                ? [...this.state.posts, ...post_data]
                : post_data;

            this.setState({ posts: updated_post_data });
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  };

  render() {
    let showComments = this.state.route_type === "one_post" ? true : false;
    return (
      <SafeAreaView style={styles.container}>
        <Header handle_change_route={this.handle_change_route} />
        <View style={styles.contentContainer}>
          <PostsList
            style={styles.postsList}
            handle_change_route={this.handle_change_route}
            fetchData={this.fetchData}
            route_url={this.state.route_url}
            posts={this.state.posts}
            comments={showComments}
            route_type={this.state.route_type}
          />
        </View>
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
    paddingTop: 30,
    paddingBottom: 40
  }
});
