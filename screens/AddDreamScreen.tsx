import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Dream } from '../types';
import { Ionicons } from '@expo/vector-icons';

type AddDreamScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddDream'>;

interface Props {
  navigation: AddDreamScreenNavigationProp;
  addDream: (dream: Dream) => void;
}

const AddDreamScreen: React.FC<Props> = ({ navigation, addDream }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLucid, setIsLucid] = useState(false);
  const [mood, setMood] = useState<Dream['mood']>('neutral');

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const saveDream = () => {
    if (!title.trim()) {
      Alert.alert('提示', '请输入梦境标题');
      return;
    }
    if (!content.trim()) {
      Alert.alert('提示', '请输入梦境内容');
      return;
    }

    const newDream: Dream = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString(),
      tags,
      isLucid,
      mood,
    };

    addDream(newDream);
    navigation.goBack();
  };

  const moodOptions: { value: Dream['mood']; label: string; icon: string }[] = [
    { value: 'great', label: '很棒', icon: '😊' },
    { value: 'good', label: '不错', icon: '🙂' },
    { value: 'neutral', label: '一般', icon: '😐' },
    { value: 'bad', label: '不好', icon: '😔' },
    { value: 'terrible', label: '糟糕', icon: '😢' },
  ];

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
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>梦境内容</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="描述你的梦境..."
            placeholderTextColor="#888"
            value={content}
            onChangeText={setContent}
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
                style={[styles.moodOption, mood === option.value && styles.moodOptionSelected]}
                onPress={() => setMood(option.value)}
              >
                <Text style={styles.moodIcon}>{option.icon}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    mood === option.value && styles.moodLabelSelected,
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
            style={[styles.lucidToggle, isLucid && styles.lucidToggleActive]}
            onPress={() => setIsLucid(!isLucid)}
          >
            <Text style={[styles.lucidText, isLucid && styles.lucidTextActive]}>
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
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
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
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>取消</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={saveDream}>
          <Text style={styles.saveButtonText}>保存梦境</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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

export default AddDreamScreen;
