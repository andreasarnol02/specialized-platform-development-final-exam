import { useCallback, useEffect, useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "../theme";
import Icon from "../components/Icon";
import Panel from "../components/Panel";
import AppButton from "../components/AppButton";
import ContentImage from "../components/ContentImage";
import TypeBadge from "../components/TypeBadge";
import { Spinner, ErrorState } from "../components/states";
import { useToast } from "../components/Toast";
import { formatDate, formatDuration } from "../utils/format";
import { getContentImage, getCategoryLabel } from "../utils/content";
import { apiClient, getErrorMessage } from "../api/client";

export default function ContentDetailScreen({ navigation, route }) {
  const { id } = route.params;
  const toast = useToast();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [toggling, setToggling] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    Promise.all([
      apiClient.get(`/contents/${id}`),
      apiClient.get("/bookmarks").catch(() => null),
    ])
      .then(([contentRes, bookmarksRes]) => {
        const payload = contentRes?.data?.data ?? contentRes?.data;
        setContent(payload);
        const bookmarks =
          bookmarksRes?.data?.data?.bookmarks ||
          bookmarksRes?.data?.bookmarks ||
          [];
        setSaved(
          bookmarks.some((bm) => bm?.content?._id === id || bm?.content === id)
        );
      })
      .catch(() => setError("Konten tidak ditemukan."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Header title shows the content title once loaded (empty until then).
  useEffect(() => {
    navigation.setOptions({ title: content?.title || "" });
  }, [navigation, content]);

  const handleToggleBookmark = async () => {
    if (toggling) return;
    setToggling(true);
    try {
      if (saved) {
        await apiClient.delete(`/bookmarks/${id}`);
        setSaved(false);
        toast("Penanda dihapus.");
      } else {
        await apiClient.post(`/bookmarks/${id}`);
        setSaved(true);
        toast("Tersimpan ke penanda.");
      }
    } catch (err) {
      toast(getErrorMessage(err), { tone: "error" });
    } finally {
      setToggling(false);
    }
  };

  const openVideoInBrowser = () => {
    const url = content?.videoUrl;
    if (!url) return;
    Linking.openURL(url).catch(() =>
      toast("Tidak dapat membuka tautan video.", { tone: "error" })
    );
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const isVideo = content?.type === "video";
  const isProject = Boolean(content?.isStudentProject);
  const paragraphs = String(content?.body || "").split(/\n{2,}/);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <ContentImage
        src={getContentImage(content)}
        alt={content.title}
        style={styles.image}
      />
      <View style={styles.body}>
        <View style={styles.badgeRow}>
          <Text style={styles.category}>
            {getCategoryLabel(content.category) || "Unggulan"}
          </Text>
          <TypeBadge type={content.type} />
          {isProject && (
            <View style={styles.badgeProject}>
              <Text style={styles.badgeProjectText}>Praktek Siswa</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{content.title}</Text>

        {content.excerpt ? (
          <Text style={styles.excerpt}>{content.excerpt}</Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="clock" size={14} color={theme.colors.muted} />
            <Text style={styles.metaText}>
              {formatDuration(content.durationMinutes) ||
                "Durasi tidak tersedia"}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="calendar" size={14} color={theme.colors.muted} />
            <Text style={styles.metaText}>
              {formatDate(content.createdAt) || "—"}
            </Text>
          </View>
        </View>

        {isVideo ? (
          <Panel style={styles.videoPanel}>
            <View style={styles.videoIconWrap}>
              <Icon name="play" size={22} color={theme.colors.greenDark} />
            </View>
            <Text style={styles.videoTitle}>Deskripsi Video</Text>
            <Text style={styles.videoDesc}>
              Tonton video ini di browser menggunakan tautan di bawah ini.
            </Text>
            {content.videoUrl ? (
              <>
                <Text style={styles.videoUrl} numberOfLines={2}>
                  {content.videoUrl}
                </Text>
                <AppButton
                  variant="primary"
                  block
                  title="Tonton di Browser"
                  icon="arrowRight"
                  onPress={openVideoInBrowser}
                />
              </>
            ) : (
              <Text style={styles.videoDesc}>
                Tautan video belum tersedia.
              </Text>
            )}
          </Panel>
        ) : (
          <View style={styles.articleBlock}>
            <Text style={styles.descTitle}>Isi Artikel</Text>
            {paragraphs.map((paragraph, index) =>
              paragraph.trim() ? (
                <Text key={index} style={styles.paragraph}>
                  {paragraph.trim()}
                </Text>
              ) : null
            )}
          </View>
        )}

        <AppButton
          variant={saved ? "light" : "primary"}
          size="lg"
          block
          icon={saved ? "bookmark" : "bookmark"}
          title={saved ? "Tersimpan di Penanda" : "Simpan ke Penanda"}
          loading={toggling}
          onPress={handleToggleBookmark}
          style={saved && styles.savedButton}
          titleColor={saved ? theme.colors.greenDark : undefined}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxxl,
  },
  image: {
    width: "100%",
    height: 220,
    backgroundColor: "#E5F2ED",
  },
  body: {
    padding: 14,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  category: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.colors.greenDark,
  },
  badgeProject: {
    backgroundColor: theme.colors.amber,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeProjectText: {
    color: "#3D2E00",
    fontSize: 10,
    fontWeight: "800",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.ink,
    lineHeight: 30,
  },
  excerpt: {
    fontSize: 14,
    color: theme.colors.inkSoft,
    lineHeight: 21,
    marginTop: 6,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  videoPanel: {
    marginTop: 18,
    gap: 10,
    alignItems: "center",
  },
  videoIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.greenLight,
    alignItems: "center",
    justifyContent: "center",
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  videoDesc: {
    fontSize: 13,
    color: theme.colors.muted,
    textAlign: "center",
    lineHeight: 19,
  },
  videoUrl: {
    fontSize: 12,
    color: theme.colors.greenDark,
    textAlign: "center",
  },
  articleBlock: {
    marginTop: 18,
  },
  descTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.ink,
  },
  paragraph: {
    fontSize: 14,
    color: theme.colors.inkSoft,
    lineHeight: 23,
    marginTop: 10,
  },
  savedButton: {
    borderWidth: 1,
    borderColor: theme.colors.green,
  },
});
