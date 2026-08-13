import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import Icon from "./Icon";

// Badge for the content type: "Artikel" or "Video".
const TYPE_STYLES = {
  article: { bg: "#E2EFFA", text: "#4081B7", icon: "book" },
  video: { bg: "#FAE6EE", text: "#BB5B7E", icon: "play" },
};

const TYPE_LABELS = {
  article: "Artikel",
  video: "Video",
};

export default function TypeBadge({ type }) {
  const normalized = String(type || "").toLowerCase();
  const style = TYPE_STYLES[normalized] || TYPE_STYLES.article;

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Icon name={style.icon} size={12} color={style.text} />
      <Text style={[styles.text, { color: style.text }]}>
        {TYPE_LABELS[normalized] || type}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
  },
});
