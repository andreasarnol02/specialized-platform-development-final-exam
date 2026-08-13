import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { theme } from "../theme";
import Icon from "../components/Icon";
import ContentImage from "../components/ContentImage";
import TypeBadge from "../components/TypeBadge";
import { Spinner, ErrorState, EmptyState } from "../components/states";
import { useToast } from "../components/Toast";
import { formatDate, formatDuration } from "../utils/format";
import { getContentImage, getCategoryLabel } from "../utils/content";
import { apiClient, getErrorMessage } from "../api/client";

// Bookmark list: each row is the saved content; tap to open detail,
// trash button to remove the bookmark.
export default function BookmarksScreen() {
  const navigation = useNavigation();
  const toast = useToast();

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    apiClient
      .get("/bookmarks")
      .then(({ data }) => {
        const payload = data?.data ?? data;
        setBookmarks(payload.bookmarks || []);
      })
      .catch(() => setError("Gagal memuat penanda."))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleRemove = async (bookmark) => {
    const contentId = bookmark?.content?._id || bookmark?.content;
    if (!contentId || removingId) return;
    setRemovingId(contentId);
    try {
      await apiClient.delete(`/bookmarks/${contentId}`);
      setBookmarks((prev) =>
        prev.filter((bm) => (bm.content?._id || bm.content) !== contentId)
      );
      toast("Penanda dihapus.");
    } catch (err) {
      toast(getErrorMessage(err), { tone: "error" });
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const items = bookmarks
    .map((bm) => ({ ...bm, contentObj: bm.content?._id ? bm.content : null }))
    .filter((bm) => bm.contentObj);

  if (items.length === 0) {
    return (
      <EmptyState
        icon="heart"
        title="Belum ada konten tersimpan"
        message="Simpan konten favorit Anda dengan mengetuk tombol penanda di halaman detail."
      />
    );
  }

  return (
    <FlatList
      style={styles.flex}
      data={items}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          onPress={() =>
            navigation.navigate("ContentDetail", { id: item.contentObj._id })
          }
          accessibilityRole="button"
          accessibilityLabel={item.contentObj.title}
        >
          <ContentImage
            src={getContentImage(item.contentObj)}
            alt={item.contentObj.title}
            style={styles.thumb}
          />
          <View style={styles.rowBody}>
            <View style={styles.rowTop}>
              <Text style={styles.category} numberOfLines={1}>
                {getCategoryLabel(item.contentObj.category) || "Unggulan"}
              </Text>
              <TypeBadge type={item.contentObj.type} />
            </View>
            <Text style={styles.title} numberOfLines={2}>
              {item.contentObj.title}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {formatDuration(item.contentObj.durationMinutes) || "—"} ·{" "}
              {formatDate(item.createdAt) || ""}
            </Text>
          </View>
          <Pressable
            style={styles.remove}
            onPress={() => handleRemove(item)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Hapus penanda"
            disabled={removingId === item.contentObj._id}
          >
            <Icon
              name="trash"
              size={16}
              color={
                removingId === item.contentObj._id
                  ? theme.colors.line
                  : theme.colors.danger
              }
            />
          </Pressable>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  listContent: {
    padding: 14,
    gap: 12,
    paddingBottom: 32,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: 12,
    shadowColor: "#172522",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  pressed: {
    opacity: 0.92,
  },
  thumb: {
    width: 76,
    height: 64,
    borderRadius: 10,
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  category: {
    flex: 1,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.colors.greenDark,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.ink,
    lineHeight: 17,
  },
  meta: {
    fontSize: 11,
    color: theme.colors.muted,
  },
  remove: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDECEA",
  },
});
