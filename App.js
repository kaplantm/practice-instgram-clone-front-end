import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  AsyncStorage
} from "react-native";
import { AppLoading, Asset, Font, Icon } from "expo";
import AppNavigator from "./navigation/AppNavigator";
import LoginScreen from "./screens/LoginScreen";
const ThemeContext = React.createContext("light");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      isLoggedIn: false,
      user: {},
      accessToken: null,
      refreshToken: null
    };
  }
  componentDidMount = async () => {
    // AsyncStorage.clear();

    // this.saveTokens();
    // this.refresh_token();

    refreshToken = await this.retrieveItem("refreshToken");
    this.setState({ refreshToken: refreshToken }, this.refresh_token);
    setInterval(this.refresh_token, 24000);
  };

  saveTokens = async (
    callback,
    accessToken,
    refreshToken,
    userId,
    userEmail
  ) => {
    console.log("Save Tokens", accessToken, refreshToken, userId, userEmail);
    //if new tokens, save them to storate
    accessToken = accessToken || (await this.retrieveItem("accessToken"));
    refreshToken = refreshToken || (await this.retrieveItem("refreshToken"));
    userId = userId || (await this.retrieveItem("userId"));
    userEmail = userEmail || (await this.retrieveItem("userEmail"));

    this.saveItem("accessToken", accessToken);
    this.saveItem("refreshToken", refreshToken);
    this.saveItem("userId", userId);
    this.saveItem("userEmail", userEmail);

    //then save to react state
    this.setState(
      {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: { id: userId, email: userEmail },
        isLoggedIn: true
      },
      () => {
        console.log("Saved tokens");
        // console.log(this.state);
      }
    );
  };

  saveItem = async (item, selectedValue) => {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error("AsyncStorage error: " + error.message);
    }
  };

  retrieveItem = async item => {
    try {
      const value = await AsyncStorage.getItem(item);
      if (value !== null) {
        // We have data!!
        // console.log(value);
        return value;
      } else {
        return null;
      }
    } catch (error) {
      // Error retrieving data
      return null;
    }
  };

  authorize_user = async body => {
    return await fetch("http://tkaplan101518.local:4000/api/users/login", {
      method: "POST", // or 'PUT'
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(response => {
        // console.log(response);
        if (response.login === true) {
          console.log("Logged In User");
          this.saveTokens(
            null,
            response.token,
            response.refresh_token,
            response.user.userId.toString(),
            response.user.email
          );
          return true;
        } else {
          console.log("Failed to login");
          this.setState({ isLoggedIn: false });
          return false;
        }
      })
      .catch(error => {
        console.log("Authorize user error", error);
        false;
      });
  };

  refresh_token = async () => {
    return await fetch("http://tkaplan101518.local:4000/api/tokens", {
      method: "POST", // or 'PUT'
      body: JSON.stringify({
        id: this.state.user.id,
        email: this.state.user.email,
        refresh_token: this.state.refreshToken
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status === 401) {
          this.setState({ isLoggedIn: false });
          throw new Error("Unauthorized Token Refresh");
        }
        return res.json();
      })
      .then(response => {
        console.log("Refreshed Token");
        this.saveTokens(
          null,
          response.token,
          response.refresh_token,
          response.user
        );
        return true;
      })
      .catch(error => {
        console.log("Token Refresh error", error);
        false;
      });
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <LoginScreen
          userLogin={this.authorize_user}
          loginState={this.state.isLoggedIn}
        >
          <AppLoading
            startAsync={this._loadResourcesAsync}
            onError={this._handleLoadingError}
            onFinish={this._handleFinishLoading}
          />
        </LoginScreen>
      );
    } else {
      return (
        <LoginScreen
          userLogin={this.authorize_user}
          loginState={this.state.isLoggedIn}
        >
          <View style={styles.container}>
            <>
              {Platform.OS === "ios" && <StatusBar barStyle="default" />}
              {/* screenprops now available to all screens via this.props.screenProps
              https://stackoverflow.com/questions/46264767/react-navigation-pass-props-in-tabnavigator */}
              <AppNavigator
                screenProps={{ accessToken: this.state.accessToken }}
              />
            </>
          </View>
        </LoginScreen>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([require("./assets/images/logo_title.png")]),
      Asset.loadAsync([require("./assets/images/logo_camera.png")]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
