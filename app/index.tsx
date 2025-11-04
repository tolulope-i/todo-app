import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useTheme } from "../context/ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes";
import { TodoItem } from "../components/TodoItem";
import { ThemeToggle } from "../components/ThemeToggle";
import { FilterTabs } from "../components/FilterTabs";
import { SearchBar } from "../components/SearchBar";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground } from "react-native";

type Filter = "all" | "active" | "completed";

const { width } = Dimensions.get("window");

export default function TodoApp() {
  const { theme } = useTheme();
  const colors = theme === "light" ? lightTheme : darkTheme;

  const [newTodoText, setNewTodoText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const todos = useQuery(api.todos.get) || [];
  const createTodo = useMutation(api.todos.create);
  const updateTodo = useMutation(api.todos.update);
  const updateText = useMutation(api.todos.updateText);
  const deleteTodo = useMutation(api.todos.remove);
  const clearCompleted = useMutation(api.todos.clearCompleted);

  // Loading state
  if (todos === undefined) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={[
              styles.loadingText,
              { color: colors.text, fontFamily: "JosefinSans-Regular" },
            ]}
          >
            Loading todos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.text
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "active" && !todo.completed) ||
      (activeFilter === "completed" && todo.completed);

    return matchesSearch && matchesFilter;
  });

  const itemsLeft = todos.filter((todo) => !todo.completed).length;

  const handleAddTodo = async () => {
    if (newTodoText.trim()) {
      try {
        await createTodo({ text: newTodoText.trim() });
        setNewTodoText("");
      } catch (error) {
        Alert.alert("Error", "Failed to create todo");
      }
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      await updateTodo({ id: id as any, completed });
    } catch (error) {
      Alert.alert("Error", "Failed to update todo");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo({ id: id as any });
    } catch (error) {
      Alert.alert("Error", "Failed to delete todo");
    }
  };

  const handleClearCompleted = async () => {
    try {
      await clearCompleted();
    } catch (error) {
      Alert.alert("Error", "Failed to clear completed todos");
    }
  };

  const handleEditStart = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleEditSave = async (id: string) => {
    if (editText.trim()) {
      try {
        await updateText({ id: id as any, text: editText.trim() });
        setEditingId(null);
        setEditText("");
      } catch (error) {
        Alert.alert("Error", "Failed to update todo");
      }
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header Section with Background Image and Gradient Overlay */}
        <View style={styles.headerContainer}>
          <ImageBackground
            source={
              theme === "light"
                ? require("../assets/images/bg-desktop-light.png")
                : require("../assets/images/bg-desktop-dark.png")
            }
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["rgba(85,221,255,0.5)", "rgba(192,88,243,0.5)"]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.headerContent}>
                <Text style={styles.title}>T O D O</Text>
                <ThemeToggle />
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Add Todo Card */}
          <View
            style={[styles.addCard, { backgroundColor: colors.cardBackground }]}
          >
            <View style={styles.addTodoContainer}>
              <View
                style={[
                  styles.checkboxPlaceholder,
                  { borderColor: colors.border },
                ]}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    fontFamily: "JosefinSans-Regular",
                  },
                ]}
                placeholder="Create a new todo..."
                placeholderTextColor={colors.placeholder}
                value={newTodoText}
                onChangeText={setNewTodoText}
                onSubmitEditing={handleAddTodo}
                returnKeyType="done"
              />
              <TouchableOpacity
                onPress={handleAddTodo}
                style={styles.addButton}
              >
                <Text
                  style={[
                    {
                      color: colors.primary,
                      fontFamily: "JosefinSans-Bold",
                      fontSize: 18,
                    },
                  ]}
                >
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <SearchBar searchText={searchText} onSearchChange={setSearchText} />

          {/* Scrollable Todo List Card */}
          <View
            style={[
              styles.todoCard,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            {filteredTodos.length === 0 ? (
              <View style={styles.emptyState}>
                <Text
                  style={[
                    styles.emptyText,
                    {
                      color: colors.textSecondary,
                      fontFamily: "JosefinSans-Regular",
                    },
                  ]}
                >
                  {searchText ? "No todos match your search" : "No todos yet"}
                </Text>
                {!searchText && (
                  <Text
                    style={[
                      styles.emptySubText,
                      {
                        color: colors.textSecondary,
                        fontFamily: "JosefinSans-Regular",
                      },
                    ]}
                  >
                    Add a todo to get started!
                  </Text>
                )}
              </View>
            ) : (
              <FlatList
                data={filteredTodos}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TodoItem
                    todo={item}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onEditStart={handleEditStart}
                    onEditSave={handleEditSave}
                    onEditCancel={handleEditCancel}
                    isEditing={editingId === item._id}
                    editText={editText}
                    onEditTextChange={setEditText}
                  />
                )}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            )}

            {/* Desktop Filter Tabs - shown only on larger screens */}
            {width >= 768 && (
              <FilterTabs
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                itemsLeft={itemsLeft}
                onClearCompleted={handleClearCompleted}
                variant="desktop"
              />
            )}
          </View>

          {/* Mobile Filter Tabs - shown only on smaller screens */}
          {width < 768 && (
            <View
              style={[
                styles.filterCard,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <FilterTabs
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                itemsLeft={itemsLeft}
                onClearCompleted={handleClearCompleted}
                variant="mobile"
              />
            </View>
          )}

          {/* Hint Text */}
          <Text
            style={[
              styles.hintText,
              {
                color: colors.textSecondary,
                fontFamily: "JosefinSans-Regular",
              },
            ]}
          >
            Drag and drop to reorder list
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerContainer: {
    width: "100%",
    height: 200,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    paddingTop: 60,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    maxWidth: 540,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 10,
    fontFamily: "JosefinSans-Bold",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    maxWidth: 540,
    width: "100%",
    alignSelf: "center",
    marginTop: -90,
  },
  addCard: {
    borderRadius: 4,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  todoCard: {
    borderRadius: 4,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flex: 1,
    maxHeight: 500,
    minHeight: 200,
  },
  filterCard: {
    borderRadius: 4,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addTodoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  checkboxPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: "center",
  },
  hintText: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  addButton: {
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#00aaff",
  },
});
