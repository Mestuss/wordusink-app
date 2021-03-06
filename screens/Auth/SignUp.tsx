import React from "react";
import styled from "styled-components/native";
import axios from "axios";
import { useMutation } from "@apollo/client";
// import * as Google from "expo-auth-session/providers/google";
import AuthButton from "../../components/AuthButton";
import AppName from "../../components/AppName";
import { useLogIn } from "../../components/AuthContext";
import { SIGN_UP } from "../../queries";
import { globalNotifi } from "../../utils";
import * as Google from "expo-google-app-auth";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(prop) => prop.theme.colors.bgColor};
`;

const Maincharacter = styled.Image`
  width: 200px;
  height: 250px;
`;

const Message = styled.Text`
  font-family: ${(prop) => prop.theme.fontFamily.rubik400};
  font-size: 16px;
`;

const BtnContainer = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
`;

export default () => {
  const [signUpMutation] = useMutation(SIGN_UP);
  const logIn = useLogIn();

  const signUpWithGoogle = async () => {
    try {
      // Google Auth api with Expo
      const result = await Google.logInAsync({
        clientId:
          "873102509009-39ht480mj5i51r7o89uf1e78s2hb6s8l.apps.googleusercontent.com",
        androidStandaloneAppClientId:
          "873102509009-7mua9cufgv5id8lb3mkov6saotb01v24.apps.googleusercontent.com",
        scopes: ["email"],
      });

      if (result.type === "success") {
        const {
          data: { email },
        } = await axios({
          url: "https://www.googleapis.com/userinfo/v2/me",
          responseType: "json",
          method: "get",
          headers: {
            Authorization: `Bearer ${result?.accessToken}`,
          },
        });

        if (email) {
          const {
            data: {
              signUp: { token, message, type },
            },
          } = await signUpMutation({ variables: { email } });

          if (type === true) {
            logIn(token);
            globalNotifi("success", message);
          } else {
            throw Error(message);
          }
        }
      } else {
        throw Error("지금은 구글 로그인을 사용할 수 없습니다.😨");
      }
    } catch (e) {
      console.log(e);
      globalNotifi("error", e.message);
    }
  };

  return (
    <Container>
      <Message>Hello. human</Message>
      <Maincharacter
        source={require("../../assets/character.png")}
        resizeMode="contain"
      />

      <AppName />
      <BtnContainer>
        <AuthButton
          text={"구글 로그인"}
          type={"google"}
          onPress={signUpWithGoogle}
        />
      </BtnContainer>
    </Container>
  );
};
