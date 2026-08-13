import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../theme";
import ContentCard from "../components/ContentCard";
import SearchInput from "../components/SearchInput";
import { CATEGORIES } from "../components/CategoryRow";
import { getCategoryLabel } from "../utils/content";
import { Spinner, ErrorState, EmptyState } from "../components/states";
import { apiClient } from "../api/client";

// Category chips: "Semua" (all) + the fixed categories (value = API value,
// label = Indonesian display label).
const CATEGORY_OPTIONS = [
  { value: "", label: "Semua" },
  ...CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
];

const TYPE_FILTERS = [
  { label: "Semua", value: "" },
  { label: "Artikel", value: "article" },
  { label: "Video", value: "video" },
];

export default function ContentsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [contents, setContents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(route.params?.category || "");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Sync category when arriving from the Home screen (category deep link).
  useEffect(() => {
    setCategory(route.params?.category || "");
  }, [route.params?.category]);

  // Shared fetch used by the first load and by load-more (append).
  const fetchPage = useCallback(
    async (nextPage, { append = false } = {}) => {
      const { data } = await apiClient.get("/contents", {
        params: {
          search: search || undefined,
          category: category || undefined,
          type: type || undefined,
          page: nextPage,
        },
      });
      const payload = data?.data ?? data;
      setContents((prev) =>
        append ? [...prev, ...(payload.contents || [])] : payload.contents || []
      );
      setPagination(payload || null);
      setPage(nextPage);
    },
    [search, category, type]
  );

  const load = useCallback(
    async (nextPage = 1) => {
      setLoading(true);
      setError("");
      try {
        await fetchPage(nextPage);
      } catch (err) {
        setError("Gagal memuat konten.");
      } finally {
        setLoading(false);
      }
    },
    [fetchPage]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const handleLoadMore = () => {
    if (loading || loadingMore) return;
    if (!pagination || page >= pagination.pages) return;
    const next = page + 1;
    setLoadingMore(true);
    fetchPage(next, { append: true })
      .catch(() => {
        // Keep the current list; the user can load more later.
      })
      .finally(() => setLoadingMore(false));
  };

  const submitSearch = () => setSearch(searchInput.trim());

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setType("");
  };

  const selectCategory = (value) => setCategory(value);
  const selectType = (value) => setType(value);

  const hasFilter = Boolean(search || category || type);
  const canLoadMore = Boolean(pagination) && page < pagination.pages;

  const headerBlock = (
    <View>
      <View style={styles.headerPad}>
        <Text style={theme.typography.pageTitle}>Materi Belajar</Text>
        <Text style={styles.subtitle}>
          Cari dan filter artikel serta video.
        </Text>
        <View style={styles.resultPill}>
          <Text style={styles.resultPillText}>
            {pagination?.total ?? contents.length} konten
          </Text>
        </View>
        <View style={styles.searchWrap}>
          <SearchInput
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmit={submitSearch}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {CATEGORY_OPTIONS.map((filter) => {
          const isSelected = category === filter.value;
          return (
            <Pressable
              key={filter.value || "all"}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => selectCategory(filter.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {TYPE_FILTERS.map((filter) => {
          const isSelected = type === filter.value;
          return (
            <Pressable
              key={filter.label}
              style={[
                styles.chip,
                styles.typeChip,
                isSelected && styles.chipSelected,
              ]}
              onPress={() => selectType(filter.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {hasFilter ? (
        <View style={[styles.headerPad, styles.filterRow]}>
          <Text style={styles.filterText} numberOfLines={1}>
            {search
              ? `Hasil untuk "${search}"`
              : category
                ? `Kategori ${getCategoryLabel(category)}`
                : `Tipe ${type}`}
          </Text>
          <Pressable onPress={clearFilters} hitSlop={8}>
            <Text style={styles.clearFilter}>Hapus Filter</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  if (loading && contents.length === 0) return <Spinner />;
  if (error && contents.length === 0) {
    return <ErrorState message={error} onRetry={() => load(1)} />;
  }

  if (contents.length === 0) {
    return (
      <View style={styles.flex}>
        {headerBlock}
        <EmptyState
          icon="search"
          title="Konten tidak ditemukan"
          message="Coba kata kunci atau filter lain."
        />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.flex}
      data={contents}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={headerBlock}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator style={styles.footer} color={theme.colors.green} />
        ) : canLoadMore ? (
          <Pressable
            style={styles.loadMore}
            onPress={handleLoadMore}
            accessibilityRole="button"
            accessibilityLabel="Muat Lebih Banyak"
          >
            <Text style={styles.loadMoreText}>Muat Lebih Banyak</Text>
          </Pressable>
        ) : null
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.4}
      renderItem={({ item }) => (
        <ContentCard
          content={item}
          style={styles.gridCard}
          onPress={() => navigation.navigate("ContentDetail", { id: item._id })}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  headerPad: {
    paddingHorizontal: 14,
    paddingTop: 14,
    gap: 10,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eyebrow: {
    fontSize: theme.typography.eyebrow.fontSize,
    fontWeight: theme.typography.eyebrow.fontWeight,
    letterSpacing: theme.typography.eyebrow.letterSpacing,
    color: theme.colors.greenDark,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 4,
  },
  resultPill: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.greenLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radii.pill,
  },
  resultPillText: {
    color: theme.colors.greenDark,
    fontSize: 12,
    fontWeight: "700",
  },
  searchWrap: {
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 4,
  },
  chip: {
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  typeChip: {
    minHeight: 34,
    paddingVertical: 6,
  },
  chipSelected: {
    backgroundColor: theme.colors.green,
    borderColor: theme.colors.green,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.inkSoft,
  },
  chipTextSelected: {
    color: theme.colors.white,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingTop: 6,
  },
  filterText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.muted,
  },
  clearFilter: {
    color: theme.colors.greenDark,
    fontWeight: "600",
    fontSize: 13,
  },
  columnWrapper: {
    gap: 12,
    paddingHorizontal: 14,
  },
  listContent: {
    gap: 12,
    paddingBottom: 32,
  },
  gridCard: {
    width: "48%",
    flexGrow: 1,
  },
  footer: {
    paddingVertical: 16,
  },
  loadMore: {
    alignSelf: "center",
    marginVertical: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.green,
  },
  loadMoreText: {
    color: theme.colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
});
