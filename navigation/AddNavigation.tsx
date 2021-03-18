import React, { useLayoutEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import FromLibrary from "../screens/Word/FromLibrary";
import FromGoogle from "../screens/Word/FromGoogle";
import FromPhoto from "../screens/Word/FromPhoto";
import NewWord from "../screens/Word/NewWord";
import { TabsP, StackNavigationP } from "../types/interfaces";

const MaterialTab = createMaterialTopTabNavigator();
const AddStack = createStackNavigator();

const materialTabFactory = (
  tabs: TabsP[],
  stackNavigation: StackNavigationP
) => {
  return (
    <MaterialTab.Navigator
      tabBarOptions={{
        showIcon: true,
        showLabel: false,
      }}
    >
      {tabs.map(({ name, Component, iconName }, idx) => (
        <MaterialTab.Screen
          key={idx}
          name={name}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={iconName} size={20} color={color} />
            ),
          }}
        >
          {() => <Component stackNavigation={stackNavigation} />}
        </MaterialTab.Screen>
      ))}
    </MaterialTab.Navigator>
  );
};

export default () => {
  return (
    <AddStack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <AddStack.Screen name={"NewWord"} component={NewWord} />
      <AddStack.Screen name={"SelectPhoto"}>
        {({ navigation: stackNavigation }) => {
          return materialTabFactory(
            [
              {
                name: "FromGoogle",
                Component: FromGoogle,
                iconName: "logo-google",
              },
              {
                name: "FromLibrary",
                Component: FromLibrary,
                iconName: "albums",
              },
              {
                name: "FromPhoto",
                Component: FromPhoto,
                iconName: "camera",
              },
            ],
            stackNavigation
          );
        }}
      </AddStack.Screen>
    </AddStack.Navigator>
  );
};