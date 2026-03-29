import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Dream } from '../types';
import { Ionicons } from '@expo/vector-icons';

type DreamDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DreamDetail'
>;
type DreamDetailScreenRouteProp = RouteProp<RootStackParamList, 'DreamDetail'>;

interface Props {
  navigation: DreamDetailScreenNavigationProp;
  route: DreamDetailScreenRouteProp;
  updateDream: (dream: Dream) => void;
  deleteDream: (id: string) => void;
}

const DreamDetailScreen: React.FC<Props> = ({
  navigation,
  route,
  updateDream,
  deleteDream,
}) => {
  const { dream } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(dream.title);
  const [editedContent, setEditedContent] = useState(dream.content);
  const [editedMood, setEditedMood] = useState(dream.mood);
  const [editedIsLucid, setEditedIsLucid] = useState(dream.isLucid);
  const [tagInput, setTagInput] = useState('');
  const [editedTags, setEditedTags] = useState(dream.tags);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMoodLabel = (mood: Dream['mood']) => {
    const labels: Record<Dream['mood'], string> = {
      great: '很棒',
      good: '不错',
      neutral: '一般',
      bad: '不好',
      terrible: '糟糕',
    };
    return labels[mood];
  };

  const getMoodIcon = (mood: Dream['mood']) => {
    const icons: Record<Dream['mood'], string> = {
      great: '😊',
      good: '🙂',
      neutral: '😐',
      bad: '😔',
      terrible: '😢',
    };
    return icons[mood];
  };

  const addTag = () => {
    if (tagInput.trim() && !editedTags.includes(tagInput.trim())) {
      setEditedTags([...editedTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!editedTitle.trim()) {
      Alert.alert('提示', '请输入梦境标题');
      return;
    }
    if (!editedContent.trim()) {
      Alert.alert('提示', '请输入梦境内容');
      return;
    }

    const updatedDream: Dream = {
      ...dream,
      title: editedTitle.trim(),
      content: editedContent.trim(),
      mood: editedMood,
      isLucid: editedIsLucid,
      tags: editedTags,
    };

    updateDream(updatedDream);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      '确认删除',
      '确定要删除这个梦境吗？此操作无法撤销。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            deleteDream(dream.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const moodOptions: { value: Dream['mood']; label: string; icon: string }[] = [
    { value: 'great', label: '很棒', icon: '😊' },
    { value: 'good', label: '不错', icon: '🙂' },
    { value: 'neutral', label: '一般', icon: '😐' },
    { value: 'bad', label: '不好', icon: '😔' },
    { value: 'terrible', label: '糟糕', icon: '😢' },
  ];

  if (isEditing) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>梦境标题</Text>
            <TextInput
              style={styles.input}
              placeholder="给你的梦起个名字..."
              placeholderTextColor="#888"
              value={editedTitle}
              onChangeText={setEditedTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>梦境内容</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="描述你的梦境..."
              placeholderTextColor="#888"
              value={editedContent}
              onChangeText={setEditedContent}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>心情</Text>
            <View style={styles.moodContainer}>
              {moodOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.moodOption,
                    editedMood === option.value && styles.moodOptionSelected,
                  ]}
                  onPress={() => setEditedMood(option.value)}
                >
                  <Text style={styles.moodIcon}>{option.icon}</Text>
                  <Text
                    style={[
                      styles.moodLabel,
                      editedMood === option.value && styles.moodLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <TouchableOpacity
              style={[styles.lucidToggle, editedIsLucid && styles.lucidToggleActive]}
              onPress={() => setEditedIsLucid(!editedIsLucid)}
            >
              <Text style={[styles.lucidText, editedIsLucid && styles.lucidTextActive]}>
                ✨ 这是清醒梦
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>标签</Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="添加标签..."
                placeholderTextColor="#888"
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
              />
              <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            {editedTags.length > 0 && (
              <View style={styles.tagsContainer}>
                {editedTags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                    <TouchableOpacity onPress={() => removeTag(tag)}>
                      <Ionicons name="close-circle" size={18} color="#e94560" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
            <Text style={styles.cancelButtonText}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>保存</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>{dream.title}</Text>
        <Text style={styles.date}>{formatDate(dream.date)}</Text>
      </View>

      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>{getMoodIcon(dream.mood)}</Text>
          <Text style={styles.metaText}>{getMoodLabel(dream.mood)}</Text>
        </View>
        {dream.isLucid && (
          <View style={[styles.metaItem, styles.lucidMetaItem]}>
            <Text style={styles.metaIcon}>✨</Text>
            <Text style={[styles.metaText, styles.lucidMetaText]}>清醒梦</Text>
          </View>
        )}
      </View>

      {dream.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {dream.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.contentSection}>
        <Text style={styles.content}>{dream.content}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setIsEditing(true)}>
          <Ionicons name="pencil" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>编辑</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>删除</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    color: '#888',
    fontSize: 15,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#16213e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  lucidMetaItem: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  metaIcon: {
    fontSize: 18,
  },
  metaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  lucidMetaText: {
    color: '#ffd700',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f3460',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    color: '#e94560',
    fontSize: 15,
    fontWeight: '500',
  },
  contentSection: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  content: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 26,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0f3460',
    paddingVertical: 16,
    borderRadius: 12,
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  textArea: {
    minHeight: 150,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moodOption: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#16213e',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodOptionSelected: {
    borderColor: '#e94560',
    backgroundColor: '#0f3460',
  },
  moodIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    color: '#888',
    fontSize: 14,
  },
  moodLabelSelected: {
    color: '#e94560',
    fontWeight: '600',
  },
  lucidToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#16213e',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0f3460',
  },
  lucidToggleActive: {
    borderColor: '#ffd700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  lucidText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  lucidTextActive: {
    color: '#ffd700',
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  addTagButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#16213e',
    borderRadius: 12,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#e94560',
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DreamDetailScreen;
