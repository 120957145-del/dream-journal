export interface Dream {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  isLucid: boolean;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
}

export type RootStackParamList = {
  Home: undefined;
  AddDream: undefined;
  DreamDetail: { dream: Dream };
  Calendar: undefined;
};
