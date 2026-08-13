import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import Icon from "./Icon";
import ContentImage from "./ContentImage";
import TypeBadge from "./TypeBadge";
import { getContentImage, getCategoryLabel } from "../utils/content";
import { formatDuration } from "../utils/format";

// Content card for the 2-column mobile grid. Width is left to the caller via `style`.
export default function ContentCard({ content, onPress, style }) {
  const image = getContentImage(content);
  const isProject = Boolean(content?.isStudentProject);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      accessibilityRole="button"
      accessibilityLabel={content?.title || "Konten"}
    >
      <View style={styles.imageWrap}>
        <ContentImage src={image} alt={content?.title} style={styles.image} />
        <View style={styles.topLeft}>
          <TypeBadge type={content?.type} />
        </View>
        {isProject && (
          <View style={styles.badgeProject}>
            <Text style={styles.badgeProjectText}>Praktek Siswa</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.category} numberOfLines={1}>
          {getCategoryLabel(content?.category) || "Unggulan"}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {content?.title}
        </Text>
        {content?.excerpt ? (
          <Text style={styles.excerpt} numberOfLines={2}>
            {content.excerpt}
          </Text>
        ) : null}
        <View style={styles.meta}>
          <View style={styles.metaLeft}>
            <Icon name="clock" size={12} color={theme.colors.muted} />
            <Text style={styles.duration}>
              {formatDuration(content?.durationMinutes) || "—"}
            </Text>
          </View>
          {isProject && <View style={styles.projectDot} />}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.line,
    shadowColor: "#172522",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  pressed: {
    opacity: 0.92,
  },
  imageWrap: {
    aspectRatio: 16 / 10,
    backgroundColor: theme.colors.greenLight,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  topLeft: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 1,
  },
  badgeProject: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: theme.colors.amber,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    zIndex: 1,
  },
  badgeProjectText: {
    color: "#3D2E00",
    fontSize: 10,
    fontWeight: "800",
  },
  body: {
    padding: 12,
  },
  category: {
    color: theme.colors.greenDark,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 17,
    marginBottom: 4,
  },
  excerpt: {
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 6,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 2,
  },
  metaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    minWidth: 0,
  },
  duration: {
    color: theme.colors.muted,
    fontSize: 11,
    flexShrink: 1,
  },
  projectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.amber,
  },
});
