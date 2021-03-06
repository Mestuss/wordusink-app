import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import PhotoAlbum from "../../components/PhotoAlbum";
import {
  ComponentInMaterialTabs,
  SrollBotReachedP,
} from "../../types/interfaces";
import { StackActions, useNavigation } from "@react-navigation/core";
import { useMutation } from "@apollo/client";
import { CREATE_WORD } from "../../queries";
import { globalNotifi, hostForProd } from "../../utils";
import IssueImage from "../../components/IssueImage";

export default ({ stackRoute }: ComponentInMaterialTabs) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [startNum, setStartNum] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [selectPhoto, setSelectPhoto] = useState<string>("");
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [createWordMutation] = useMutation(CREATE_WORD);
  const navigation = useNavigation();

  const onSrollBotReached = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: SrollBotReachedP): void => {
    const PADDING_BOTTOM: number = 0.1;
    const isBottom: boolean =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - PADDING_BOTTOM;
    if (isBottom) {
      // Refetch
      if (!fetching) setStartNum((prev) => prev + 19);
    }
  };

  const doneAction = async () => {
    try {
      const { data } = await createWordMutation({
        variables: {
          name: stackRoute.params?.name,
          caption: stackRoute.params?.caption,
          examples: stackRoute.params?.examples,
          url: selectPhoto,
        },
      });
      if (data?.createWord?.result) {
        navigation.dispatch(StackActions.replace("Tab"));
        globalNotifi("success", "새 단어가 등록되었습니다.😎");
      } else {
        throw Error(data?.createWord?.message);
      }
    } catch (e) {
      globalNotifi("error", e.message);
    }
  };

  const selectPhotoAction = (selected: string) => {
    setSelectPhoto(selected);
  };

  const fetchFromApi = async (): Promise<void> => {
    if (photos.length === 0) setLoading(true);
    try {
      setFetching(true);
      const { data } = await axios.get(
        hostForProd("api", `/api/${stackRoute?.params?.name}/${startNum}`),
        {
          responseType: "json",
        }
      );
      const filteringArray = data.filter((image: string) => {
        const pattern = new RegExp("^(data:image|https://encrypted-tbn0).*");
        const result = pattern.test(image);
        // 고화질 이미지 받아올시 !result 로 바꾸기
        if (result) return image;
      });

      if (filteringArray.length === 0) {
        setHasNext(false);
        setIsEnd(true);
      } else {
        setPhotos([...photos, ...filteringArray]);
      }
      // Initial selected photo
      if (selectPhoto === "") {
        setSelectPhoto(filteringArray?.[0]);
      }
    } catch (e) {
      globalNotifi("error", "구글에서 이미지를 가져올 수 없습니다.😰");
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  useEffect(() => {
    if (hasNext) fetchFromApi();
  }, [startNum]);

  return loading ? (
    <Loading />
  ) : selectPhoto === "" || photos.length === 0 ? (
    <IssueImage type="empty" />
  ) : (
    <PhotoAlbum
      photos={photos}
      selectPhoto={selectPhoto}
      selectPhotoAction={selectPhotoAction}
      onSrollBotReached={onSrollBotReached}
      doneAction={doneAction}
      isEnd={isEnd}
    />
  );
};
