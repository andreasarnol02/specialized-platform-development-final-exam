import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import BrandMark from "./BrandMark";

// Shared auth shell: centered white card with brand mark, title, subtitle,
// error box, form children and footer alt-links.
export default function AuthCard({ title, subtitle, error, children, footer }) {
  return (
    <View style={styles.card}>
      <View style={styles.brandWrap}>
        <BrandMark showWordmark />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {children}

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    maxWidth: 440,
    width: "100%",
    alignSelf: "center",
    marginTop: 16,
    padding: 24,
    borderRadius: 18,
    gap: 14,
    backgroundColor: theme.colors.white,
    ...theme.shadow,
  },
  brandWrap: {
    alignItems: "center",
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    color: theme.colors.ink,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.muted,
    textAlign: "center",
  },
  errorBox: {
    backgroundColor: "#FDECEA",
    borderWidth: 1,
    borderColor: "#F5C6C2",
    borderRadius: 10,
    padding: 10,
  },
  errorText: {
    fontSize: 13,
    color: theme.colors.danger,
  },
  footer: {
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 4,
  },
});
