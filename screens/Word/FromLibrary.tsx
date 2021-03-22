import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import Loading from "../../components/Loading";
import PhotoAlbum from "../../components/PhotoAlbum";
import {
  ComponentInMaterialTabs,
  SrollBotReachedP,
} from "../../types/interfaces";

export default ({ stackRoute }: ComponentInMaterialTabs) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [startNum, setStartNum] = useState<number>(19);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectPhoto, setSelectPhoto] = useState<string>("");

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
      if (hasNext) {
        setStartNum((prev) => prev + 19);
      }
    }
  };

  const getFromLibrary = async (): Promise<void> => {
    try {
      if (photos.length === 0) {
        setLoading(true);
      }
      const { granted } = await MediaLibrary.requestPermissionsAsync();

      if (granted) {
        const { assets, hasNextPage } = await MediaLibrary.getAssetsAsync({
          first: startNum,
        });
        let data: string[] = [];
        assets.map((asset) => data.push(asset.uri));
        setPhotos(data);
        setHasNext(hasNextPage);
        // Initial selected
        if (selectPhoto === "") {
          setSelectPhoto(data?.[0]);
        }
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Dont get the data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFromLibrary();
  }, [startNum]);

  return loading || selectPhoto === "" ? (
    <Loading />
  ) : (
    <PhotoAlbum
      photos={photos}
      selectPhoto={selectPhoto}
      setSelectPhoto={setSelectPhoto}
      onSrollBotReached={onSrollBotReached}
      name={stackRoute.params?.name}
      caption={stackRoute.params?.caption}
    />
  );
};
