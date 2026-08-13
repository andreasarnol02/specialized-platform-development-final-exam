import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import Icon from "./Icon";

// Fixed category enum of My Skill: value is the API value (English),
// label is the Indonesian display label.
export const CATEGORIES = [
  { value: "Automotive", label: "Otomotif", icon: "car", tone: "blue" },
  { value: "Electronics", label: "Elektronika", icon: "phone", tone: "mint" },
  { value: "Electrical", label: "Kelistrikan", icon: "bolt", tone: "yellow" },
  { value: "Construction", label: "Konstruksi", icon: "home", tone: "peach" },
  {
    value: "Machining & Welding",
    label: "Pemesinan & Pengelasan",
    icon: "spark",
    tone: "lavender",
  },
];

export default function CategoryRow({ onSelect, selected }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {CATEGORIES.map((category) => {
        const tone =
          theme.colors.categoryTones[category.tone] ||
          theme.colors.categoryTones.gray;
        const isSelected = selected === category.value;
        return (
          <Pressable
            key={category.value}
            onPress={() => onSelect?.(category.value)}
            style={styles.item}
            accessibilityRole="button"
            accessibilityLabel={category.label}
            accessibilityState={{ selected: isSelected }}
          >
            <View
              style={[
                styles.tile,
                { backgroundColor: tone.bg },
                isSelected && { backgroundColor: tone.text },
              ]}
            >
              <Icon
                name={category.icon}
                size={20}
                color={isSelected ? theme.colors.white : tone.text}
              />
            </View>
            <Text
              style={[styles.label, isSelected && styles.labelSelected]}
              numberOfLines={1}
            >
              {category.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 4,
  },
  item: {
    alignItems: "center",
    gap: 8,
    minHeight: 44,
    minWidth: 56,
  },
  tile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.inkSoft,
    textAlign: "center",
  },
  labelSelected: {
    color: theme.colors.greenDark,
    fontWeight: "700",
  },
});
