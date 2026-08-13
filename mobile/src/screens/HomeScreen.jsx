import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { theme } from "../theme";
import Icon from "../components/Icon";
import BrandMark from "../components/BrandMark";
import AppButton from "../components/AppButton";
import ContentCard from "../components/ContentCard";
import CategoryRow from "../components/CategoryRow";
import { Spinner, ErrorState } from "../components/states";
import { getInitial } from "../utils/format";
import { apiClient } from "../api/client";
import { useAuth } from "../context/AuthContext";

const HOME_LIMIT = 8;

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [contents, setContents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    apiClient
      .get("/contents", { params: { page: 1 } })
      .then(({ data }) => {
        const payload = data?.data ?? data;
        setContents(payload.contents || []);
        setTotal(payload.total || 0);
      })
      .catch(() => setError("Failed to load content."))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const openContents = () => navigation.navigate("ContentsTab");
  const openContentsList = () =>
    navigation.navigate("ContentsTab", { screen: "Contents" });
  const openCategory = (value) =>
    navigation.navigate("ContentsTab", {
      screen: "Contents",
      params: { category: value },
    });
  const openContent = (content) =>
    navigation.navigate("ContentDetail", { id: content._id });

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const latest = contents.slice(0, HOME_LIMIT);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <BrandMark showWordmark size={31} />
          <View style={styles.headerRight}>
            <Pressable
              style={styles.avatar}
              onPress={() => navigation.navigate("Profile")}
              accessibilityRole="button"
              accessibilityLabel="Profil"
            >
              <Text style={styles.avatarText}>{getInitial(user?.name)}</Text>
            </Pressable>
          </View>
        </View>

        {/* Greeting hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Halo,{" "}
            <Text style={styles.heroTitleAccent}>
              {user?.name?.split(" ")[0] || "Siswa"}.
            </Text>
          </Text>
          <Text style={styles.heroSub}>
            Artikel dan video tentang membuat barang, memperbaiki kendaraan,
            dan merapikan rumah.
          </Text>
          <View style={styles.heroActions}>
            <AppButton
              variant="primary"
              title="Jelajahi Konten"
              icon="arrowRight"
              size="lg"
              onPress={openContentsList}
              style={styles.heroButton}
            />
          </View>
          <View style={styles.proofRow}>
            <Text style={styles.proof}>
              <Text style={styles.proofStrong}>{total}</Text> konten
            </Text>
            <Text style={styles.proof}>
              <Text style={styles.proofStrong}>Praktek Siswa</Text> karya dari
              siswa
            </Text>
          </View>
        </View>

        {/* Category panel */}
        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionTitle}>Bidang</Text>
          <Pressable style={styles.textLink} onPress={openContents} hitSlop={8}>
            <Text style={styles.linkText}>Lihat Semua</Text>
            <Icon name="arrowRight" size={14} color={theme.colors.greenDark} />
          </Pressable>
        </View>
        <View style={styles.categoryWrap}>
          <CategoryRow onSelect={openCategory} />
        </View>

        {/* Latest contents */}
        <View style={styles.contentsHeading}>
          <View>
            <Text style={styles.sectionTitle}>Konten Terbaru</Text>
          </View>
          <Pressable style={styles.textLink} onPress={openContents} hitSlop={8}>
            <Text style={styles.linkText}>Lihat Semua</Text>
            <Icon name="arrowRight" size={15} color={theme.colors.greenDark} />
          </Pressable>
        </View>
        {latest.length === 0 ? (
          <Text style={styles.noContents}>Belum ada konten.</Text>
        ) : (
          <View style={styles.grid}>
            {latest.map((content) => (
              <ContentCard
                key={content._id}
                content={content}
                style={styles.gridCard}
                onPress={() => openContent(content)}
              />
            ))}
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footerText}>2026 My Skill - Proyek Kelompok</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.greenLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: theme.colors.ink,
    fontWeight: "700",
    fontSize: 13,
  },
  hero: {
    margin: 14,
    backgroundColor: "#E5F2ED",
    borderWidth: 1,
    borderColor: "#D6E8E0",
    borderRadius: theme.radii.hero,
    padding: theme.spacing.xl,
    gap: 10,
  },
  eyebrow: {
    fontSize: theme.typography.eyebrow.fontSize,
    fontWeight: theme.typography.eyebrow.fontWeight,
    letterSpacing: theme.typography.eyebrow.letterSpacing,
    color: theme.colors.greenDark,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: theme.colors.ink,
    lineHeight: 40,
  },
  heroTitleAccent: {
    color: theme.colors.greenDark,
  },
  heroSub: {
    fontSize: 14,
    color: theme.colors.inkSoft,
    lineHeight: 21,
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 14,
    marginTop: 2,
  },
  heroButton: {
    backgroundColor: "#172522",
  },
  textLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  linkText: {
    color: theme.colors.greenDark,
    fontWeight: "600",
    fontSize: 13,
  },
  proofRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 2,
  },
  proof: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  proofStrong: {
    color: theme.colors.ink,
    fontWeight: "700",
  },
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 24,
  },
  categoryWrap: {
    paddingHorizontal: 14,
    marginTop: 4,
  },
  contentsHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 14,
    paddingTop: 28,
    paddingBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.ink,
    marginTop: 2,
  },
  noContents: {
    color: theme.colors.muted,
    paddingHorizontal: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 14,
  },
  gridCard: {
    width: "48%",
    flexGrow: 1,
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 28,
  },
});
