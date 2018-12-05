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
import { WebBrowser } from "expo";

import { MonoText } from "../components/StyledText";
import Header from "../components/Header";
// import Post from "../components/Post";
import PostsList from "../components/PostsList";

export default class FeedScreen extends React.Component {
  constructor(props) {
    super(props);

    this.BASE_URL = "http://tkaplan101518.local:4000/api/";
    this.state = {
      isLoadingComplete: false,
      route_type: "recent_posts",
      route_url: "posts/?sort=createdAt&include=user",
      posts: []
    };
  }
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.handle_change_route(this.state.route_type);
  }
  handle_change_route = (route_type, userId, postId) => {
    console.log(route_type, userId, postId);
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
      this.fetch_data
    );
  };

  fetch_data() {
    fetch(this.BASE_URL + this.state.route_url)
      .then(results => {
        if (results.status !== 200) {
          throw new Error(" No posts found.");
        }

        return results.json();
      })
      .then(data => {
        let post_data = Array.isArray(data) ? data : [data];
        // console.log(post_data);
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
        <ScrollView style={styles.container}>
          {/* <Post /> */}
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
  // developmentModeText: {
  //   marginBottom: 20,
  //   color: "rgba(0,0,0,0.4)",
  //   fontSize: 14,
  //   lineHeight: 19,
  //   textAlign: "center"
  // },
  contentContainer: {
    paddingTop: 30
  }
  // welcomeContainer: {
  //   alignItems: "center",
  //   marginTop: 10,
  //   marginBottom: 20
  // },
  // welcomeImage: {
  //   width: 100,
  //   height: 80,
  //   resizeMode: "contain",
  //   marginTop: 3,
  //   marginLeft: -10
  // },
  // getStartedContainer: {
  //   alignItems: "center",
  //   marginHorizontal: 50
  // },
  // feedScreenFilename: {
  //   marginVertical: 7
  // },
  // codeHighlightText: {
  //   color: "rgba(96,100,109, 0.8)"
  // },
  // codeHighlightContainer: {
  //   backgroundColor: "rgba(0,0,0,0.05)",
  //   borderRadius: 3,
  //   paddingHorizontal: 4
  // },
  // getStartedText: {
  //   fontSize: 17,
  //   color: "rgba(96,100,109, 1)",
  //   lineHeight: 24,
  //   textAlign: "center"
  // },
  // tabBarInfoContainer: {
  //   position: "absolute",
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   ...Platform.select({
  //     ios: {
  //       shadowColor: "black",
  //       shadowOffset: { height: -3 },
  //       shadowOpacity: 0.1,
  //       shadowRadius: 3
  //     },
  //     android: {
  //       elevation: 20
  //     }
  //   }),
  //   alignItems: "center",
  //   backgroundColor: "#fbfbfb",
  //   paddingVertical: 20
  // },
  // tabBarInfoText: {
  //   fontSize: 17,
  //   color: "rgba(96,100,109, 1)",
  //   textAlign: "center"
  // },
  // navigationFilename: {
  //   marginTop: 5
  // },
  // helpContainer: {
  //   marginTop: 15,
  //   alignItems: "center"
  // },
  // helpLink: {
  //   paddingVertical: 15
  // },
  // helpLinkText: {
  //   fontSize: 14,
  //   color: "#2e78b7"
  // }
});
