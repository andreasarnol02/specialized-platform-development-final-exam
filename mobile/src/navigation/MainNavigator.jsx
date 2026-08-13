import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { theme } from "../theme";
import Icon from "../components/Icon";
import HomeScreen from "../screens/HomeScreen";
import ContentsScreen from "../screens/ContentsScreen";
import ContentDetailScreen from "../screens/ContentDetailScreen";
import BookmarksScreen from "../screens/BookmarksScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const stackScreenOptions = {
  headerStyle: { backgroundColor: theme.colors.white },
  headerShadowVisible: false,
  headerTitleStyle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  headerTintColor: theme.colors.greenDark,
  headerBackButtonDisplayMode: "minimal",
};

const tabScreenOptions = {
  tabBarActiveTintColor: theme.colors.greenDark,
  tabBarInactiveTintColor: theme.colors.muted,
  tabBarStyle: {
    backgroundColor: theme.colors.white,
    borderTopColor: theme.colors.line,
  },
  tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
  headerShown: false,
};

// Hoisted tab bar icons so each tabBarIcon receives a stable component
// reference instead of a fresh function per render.
const HomeTabIcon = ({ color, size }) => (
  <Icon name="home" size={size} color={color} />
);
const ContentsTabIcon = ({ color, size }) => (
  <Icon name="grid" size={size} color={color} />
);
const BookmarksTabIcon = ({ color, size }) => (
  <Icon name="heart" size={size} color={color} />
);

function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function ContentsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="Contents"
        component={ContentsScreen}
        options={{ title: "Konten" }}
      />
    </Stack.Navigator>
  );
}

function BookmarksStackNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{ title: "Penanda" }}
      />
    </Stack.Navigator>
  );
}

// Root stack of the main app: tabs + detail/profile screens above them.
export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContentDetail"
        component={ContentDetailScreen}
        options={{ title: "" }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profil" }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ tabBarLabel: "Beranda", tabBarIcon: HomeTabIcon }}
      />
      <Tab.Screen
        name="ContentsTab"
        component={ContentsStackNavigator}
        options={{ tabBarLabel: "Konten", tabBarIcon: ContentsTabIcon }}
      />
      <Tab.Screen
        name="BookmarksTab"
        component={BookmarksStackNavigator}
        options={{ tabBarLabel: "Penanda", tabBarIcon: BookmarksTabIcon }}
      />
    </Tab.Navigator>
  );
}
