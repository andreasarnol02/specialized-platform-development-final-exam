import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

// My Skill brand mark: a rotated green square with a white lowercase "s",
// optional wordmark "My Skill" (two-tone).
export default function BrandMark({
  size = 31,
  markSize,
  dark = false,
  showWordmark = false,
  wordmarkDark,
}) {
  const markFontSize = markSize ?? Math.round(size * 0.645);
  const wordmarkFontSize = Math.round(size * 0.645);
  const wordDark = wordmarkDark != null ? wordmarkDark : dark;

  const firstColor = wordDark ? theme.colors.white : theme.colors.ink;
  const secondColor = wordDark
    ? theme.colors.ribbonTextSoft
    : theme.colors.greenDark;

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.mark,
          {
            width: size,
            height: size,
            borderRadius: Math.round(size * 0.32),
          },
        ]}
      >
        <Text
          style={[
            styles.markText,
            { fontSize: markFontSize, lineHeight: size },
          ]}
        >
          s
        </Text>
      </View>
      {showWordmark ? (
        <Text
          style={[
            styles.wordmark,
            {
              color: firstColor,
              fontSize: wordmarkFontSize,
              letterSpacing: -0.045 * wordmarkFontSize,
            },
          ]}
        >
          My<Text style={{ color: secondColor }}> Skill</Text>
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mark: {
    backgroundColor: theme.colors.green,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-7deg" }],
  },
  markText: {
    color: theme.colors.white,
    fontWeight: "900",
    textAlign: "center",
  },
  wordmark: {
    fontWeight: "800",
  },
});
