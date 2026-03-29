import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Dream } from '../types';
import { Ionicons } from '@expo/vector-icons';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
  dreams: Dream[];
}

const HomeScreen: React.FC<Props> = ({ navigation, dreams }) => {
  const [searchText, setSearchText] = useState('');

  const filteredDreams = dreams.filter(
    (dream) =>
      dream.title.toLowerCase().includes(searchText.toLowerCase()) ||
      dream.content.toLowerCase().includes(searchText.toLowerCase()) ||
      dream.tags.some((tag) => tag.toLowerCase().includes(searchText.toLowerCase()))
  );

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const renderDreamItem = ({ item }: { item: Dream }) => (
    <TouchableOpacity
      style={styles.dreamCard}
      onPress={() => navigation.navigate('DreamDetail', { dream: item })}
    >
      <View style={styles.dreamHeader}>
        <Text style={styles.dreamTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.moodIcon}>{getMoodIcon(item.mood)}</Text>
      </View>
      <Text style={styles.dreamDate}>{formatDate(item.date)}</Text>
      <Text style={styles.dreamContent} numberOfLines={3}>
        {item.content}
      </Text>
      {item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <Text style={styles.moreTags}>+{item.tags.length - 3}</Text>
          )}
        </View>
      )}
      {item.isLucid && (
        <View style={styles.lucidBadge}>
          <Text style={styles.lucidText}>✨ 清醒梦</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="搜索梦境..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddDream')}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>记录梦境</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.calendarButton]}
          onPress={() => navigation.navigate('Calendar')}
        >
          <Ionicons name="calendar" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>日历</Text>
        </TouchableOpacity>
      </View>

      {filteredDreams.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🌙</Text>
          <Text style={styles.emptyText}>
            {searchText.length > 0 ? '没有找到相关梦境' : '还没有记录任何梦境'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchText.length > 0 ? '试试其他关键词' : '点击上方按钮开始记录'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredDreams}
          renderItem={renderDreamItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  calendarButton: {
    backgroundColor: '#0f3460',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    gap: 12,
  },
  dreamCard: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  dreamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dreamTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  moodIcon: {
    fontSize: 24,
    marginLeft: 8,
  },
  dreamDate: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  dreamContent: {
    color: '#ddd',
    fontSize: 15,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    backgroundColor: '#0f3460',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tagText: {
    color: '#e94560',
    fontSize: 13,
    fontWeight: '500',
  },
  moreTags: {
    color: '#888',
    fontSize: 13,
    alignSelf: 'center',
  },
  lucidBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ffd700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lucidText: {
    color: '#1a1a2e',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 15,
  },
});

export default HomeScreen;
