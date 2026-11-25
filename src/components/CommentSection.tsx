import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Comment } from "../types/comment";
import { useAuthStore } from "../store/authStore";
import { RootStackParamList } from "../navigation/types";
import { COLORS } from "../constants/colors";

import {
  addComment,
  subscribeToComments,
  updateComment,
  deleteComment,
} from "../services/api/commentApi";

interface Props {
  movieId: number;
}

export default function CommentSection({ movieId }: Props) {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList>
    >();

  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore(
    (state) => state.isLoggedIn
  );

  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [readError, setReadError] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  // Realtime listener
  useEffect(() => {
    setLoading(true);
    setReadError(false);
    setComments([]);
    setText("");
    setEditingId(null);

    const unsubscribe = subscribeToComments(
      movieId,
      (data) => {
        setComments(data);
        setLoading(false);
        setReadError(false);
      },
      (error) => {
        console.log("COMMENT LISTENER ERROR:", error);
        setLoading(false);
        setReadError(true);
      }
    );

    return () => {
      unsubscribe();
      console.log("COMMENT LISTENER CLOSED");
    };
  }, [movieId]);

  useEffect(() => {
    setText("");
    setEditingId(null);
  }, [user?.id]);

  // Сэтгэгдэл нэмэх болон засах
  const handleSubmit = async () => {
    if (!isLoggedIn || !user) {
      navigation.navigate("Login");
      return;
    }

    if (!text.trim() || submitting) return;

    try {
      setSubmitting(true);

      if (editingId) {
        await updateComment(
          movieId,
          editingId,
          text
        );
      } else {
        await addComment(movieId, text);
      }

      setText("");
      setEditingId(null);
    } catch (error) {
      console.log("COMMENT SUBMIT ERROR:", error);

      Alert.alert(
        "Error",
        "Unable to save comment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Засах горим
  const handleEdit = (comment: Comment) => {
    if (
      !isLoggedIn ||
      comment.userId !== user?.id ||
      submitting
    ) return;

    setEditingId(comment.id);
    setText(comment.text);
  };

  // Засах үйлдлийг цуцлах
  const cancelEdit = () => {
    setEditingId(null);
    setText("");
  };

  // Сэтгэгдэл устгах
  const handleDelete = (comment: Comment) => {
    if (
      !isLoggedIn ||
      comment.userId !== user?.id ||
      submitting
    ) return;

    Alert.alert(
      "Delete comment",
      "Are you sure you want to delete this comment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setSubmitting(true);

              await deleteComment(movieId, comment.id);

              if (editingId === comment.id) {
                cancelEdit();
              }
            } catch (error) {
              console.log("COMMENT DELETE ERROR:", error);

              Alert.alert(
                "Error",
                "Unable to delete comment."
              );
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Comments</Text>

        <Text style={styles.count}>
          {comments.length} comments
        </Text>
      </View>

      {/* Comment input */}
      {isLoggedIn && user ? (
        <View style={styles.inputCard}>
          {editingId && (
            <Text style={styles.editingLabel}>
              Editing comment
            </Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            placeholderTextColor="#777"
            multiline
            maxLength={500}
            value={text}
            onChangeText={setText}
            editable={!submitting}
            textAlignVertical="top"
          />

          <View style={styles.inputFooter}>
            <Text style={styles.counter}>
              {text.length}/500
            </Text>

            <View style={styles.actions}>
              {editingId && (
                <Pressable
                  onPress={cancelEdit}
                  disabled={submitting}
                >
                  <Text style={styles.cancelText}>
                    Cancel
                  </Text>
                </Pressable>
              )}

              <Pressable
                style={[
                  styles.postButton,
                  (!text.trim() || submitting) &&
                    styles.disabledButton,
                ]}
                disabled={!text.trim() || submitting}
                onPress={handleSubmit}
              >
                {submitting ? (
                  <ActivityIndicator
                    color="#fff"
                    size="small"
                  />
                ) : (
                  <Text style={styles.buttonText}>
                    {editingId ? "Save" : "Post comment"}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.guestCard}>
          <Text style={styles.guestText}>
            Sign in to join the conversation.
          </Text>

          <Pressable
            style={styles.postButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>
              Login
            </Text>
          </Pressable>
        </View>
      )}

      {/* Comments list */}
      {loading ? (
        <ActivityIndicator
          color={COLORS.primary}
          style={{ marginVertical: 20 }}
        />
      ) : readError ? (
        <Text style={styles.emptyText}>
          Unable to load comments.
        </Text>
      ) : comments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="chatbubble-outline"
            size={36}
            color="#777"
          />

          <Text style={styles.emptyText}>
            No comments yet.
          </Text>

          <Text style={styles.emptyDescription}>
            Be the first to share your thoughts.
          </Text>
        </View>
      ) : (
        comments.map((comment) => (
          <View
            key={comment.id}
            style={styles.commentCard}
          >
            <View style={styles.commentHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {comment.userName
                    .charAt(0)
                    .toUpperCase()}
                </Text>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {comment.userName}
                </Text>

                <Text style={styles.date}>
                  {new Date(
                    comment.createdAt
                  ).toLocaleString()}
                </Text>
              </View>

              {isLoggedIn &&
                user?.id === comment.userId && (
                  <View style={styles.commentActions}>
                    <Pressable
                      disabled={submitting}
                      onPress={() => handleEdit(comment)}
                    >
                      <Ionicons
                        name="create-outline"
                        size={20}
                        color="#aaa"
                      />
                    </Pressable>

                    <Pressable
                      disabled={submitting}
                      onPress={() => handleDelete(comment)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#ef4444"
                      />
                    </Pressable>
                  </View>
                )}
            </View>

            <Text style={styles.commentText}>
              {comment.text}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    marginBottom: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  heading: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "bold",
  },

  count: {
    color: "#999",
    fontSize: 13,
  },

  inputCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },

  input: {
    color: COLORS.white,
    fontSize: 15,
    minHeight: 85,
    padding: 0,
  },

  inputFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  counter: {
    color: "#888",
    fontSize: 12,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  postButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 9,
  },

  disabledButton: {
    opacity: 0.4,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },

  cancelText: {
    color: "#aaa",
    fontSize: 13,
  },

  editingLabel: {
    color: COLORS.primary,
    fontSize: 13,
    marginBottom: 10,
  },

  guestCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },

  guestText: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
  },

  commentCard: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  avatarText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },

  date: {
    color: "#888",
    fontSize: 11,
    marginTop: 4,
  },

  commentActions: {
    flexDirection: "row",
    gap: 15,
    marginLeft: 10,
  },

  commentText: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 21,
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },

  emptyText: {
    color: "#aaa",
    fontSize: 15,
    textAlign: "center",
  },

  emptyDescription: {
    color: "#777",
    fontSize: 13,
    textAlign: "center",
  },
});