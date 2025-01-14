import { StyleSheet } from "react-native";
import React, { useContext, useState } from "react";
import { OptionsContext } from "@options";
import { Image, Alert, View, TouchableOpacity, TextInput, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector, useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { styles, textInputStyles } from "./styles";
import { validateEmail } from "../constants";
import { resetPassword } from "../auth";

const PasswordRecover = ({
  navigation,
  route
}) => {
  const options = useContext(OptionsContext);
  const {
    LOGO_IMAGE,
    textInputStyle,
    buttonStyle,
    buttonTextStyle
  } = route.params;
  const [email, setEmail] = useState("");
  const {
    api
  } = useSelector(state => state.Login);
  const dispatch = useDispatch();

  const handlePasswordReset = () => {
    if (!validateEmail.test(email)) {
      return Alert.alert("Error", "Please enter a valid email address.");
    }

    dispatch(resetPassword({
      email
    })).then(unwrapResult).then(() => {
      Alert.alert("Password Reset", "Password reset link has been sent to your email address");
      navigation.goBack();
    }).catch(err => console.log(err.message));
  };

  const renderImage = () => {
    const imageSize = {
      width: 365,
      height: 161
    };
    return <Image style={[styles.image, imageSize]} source={{
      uri: LOGO_IMAGE || options.LOGO_URL
    }} />;
  };

  return <View style={_styles.CWrhMAaU}>
      <KeyboardAwareScrollView contentContainerStyle={[styles.screen, {
      justifyContent: "center"
    }]}>
        {renderImage()}
        <Text style={styles.heading}>{"Password Recovery"}</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput value={email} onChangeText={value => setEmail(value)} placeholder="eg: yourname@gmail.com" size="small" style={[styles.input, textInputStyle]} keyboardType="email-address" textStyle={styles.text} autoCapitalize="none" />
        </View>
        {!!api.error && <Text style={[textInputStyles.error, _styles.TXEsOqyt]}>
            {api.error.message}
          </Text>}
        <TouchableOpacity disabled={api.loading === "pending"} activeOpacity={0.7} style={[styles.actionButon, buttonStyle]} onPress={handlePasswordReset}>
          <Text style={[styles.resetText, buttonTextStyle]}>
            Reset Password
          </Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={() => {
        navigation.goBack();
      }}>
          <Text style={[styles.textRow]}>Back to login?</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>;
};

export default PasswordRecover;

const _styles = StyleSheet.create({
  CWrhMAaU: {
    flex: 1
  },
  TXEsOqyt: {
    marginBottom: 10,
    fontSize: 12
  }
});