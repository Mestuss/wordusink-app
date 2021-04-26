import React, { useEffect } from "react";
import styled from "styled-components/native";
import {
  useNavigation,
  useRoute,
  CommonActions,
  useNavigationState,
} from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { Alert } from "react-native";
import useInput from "../../hooks/useInput";
import { EditWordParams } from "../../types/interfaces";
import { DELETE_WORD, EDIT_WORD } from "../../queries";
import { inputValidation } from "../../utils";
import Edit from "../../components/Edit";

export default () => {
  const { params }: EditWordParams = useRoute();
  const navigation = useNavigation();
  const routesHistory: string[] = useNavigationState(
    (state) => state.routeNames
  );
  const [editWordMutation] = useMutation(EDIT_WORD);
  const [deleteWordMutation] = useMutation(DELETE_WORD);
  const inputName = useInput(params?.name);
  const inputCaption = useInput(params?.caption);

  const doneHandle = async () => {
    try {
      inputValidation(inputName?.value, inputCaption?.value);
      const {
        data: { editWord: result },
      } = await editWordMutation({
        variables: {
          wordId: params?.wordId,
          name: inputName.value,
          caption: inputCaption.value,
        },
      });
      if (result) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: routesHistory[0] }],
          })
        );
      }
    } catch (e) {
      Alert.alert("", e.message);
    }
  };

  const deleteHandle = async () => {
    try {
      const {
        data: { deleteWord: result },
      } = await deleteWordMutation({
        variables: { wordId: params?.wordId },
      });
      if (result) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: routesHistory[0] }],
          })
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const preDeleteHandle = () => {
    Alert.alert(
      `\'${inputName.value}\' 를 정말 지우시겠습니까?`,
      "",
      [
        {
          text: "아니요",
          style: "cancel",
        },
        { text: "예", onPress: () => deleteHandle() },
      ],
      { cancelable: false }
    );
  };

  return (
    <Edit
      url={params?.url}
      doneHandle={doneHandle}
      deleteHandle={deleteHandle}
      preDeleteHandle={preDeleteHandle}
      name={inputName}
      caption={inputCaption}
    />
  );
};
