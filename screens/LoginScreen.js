import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView
} from "react-native";
import { WebBrowser } from "expo";

import { MonoText } from "../components/StyledText";
import Header from "../components/Header";
// import Post from "../components/Post";

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loginAttempt: false,
      loginSucess: false
    };
  }
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    // this.handle_change_route(this.state.route_type);
  }

  handleLogin = async () => {
    let login = await this.props.userLogin({
      email: this.state.email,
      password: this.state.password
    });

    this.setState({ loginAttempt: true, loginSucess: login });
  };

  //TODO: MOVE HEADER COMPONENT SOMEWHERE ELSE TO ABOVE EVERYTHING (SO ON ALL PAGES)
  // maybe not? I'd have to move state up. Not worth it till add redux
  render() {
    if (this.props.loginState) {
      return this.props.children;
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            enabled
          >
            <Header />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={email => this.setState({ email })}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={password => this.setState({ password })}
              />
            </View>

            <TouchableOpacity
              style={[styles.buttonContainer, styles.loginButton]}
              onPress={this.handleLogin}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            {/* TODO: have this popup for a couple seconds then fade */}
            {this.state.loginAttempt && !this.state.loginSucess && (
              <Text>Failed to login.</Text>
            )}

            {/* //TODO: Add register and forgot password buttons */}
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DCDCDC"
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: "center"
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30
  },
  loginButton: {
    backgroundColor: "#00b5ec"
  },
  loginText: {
    color: "white"
  }
});
