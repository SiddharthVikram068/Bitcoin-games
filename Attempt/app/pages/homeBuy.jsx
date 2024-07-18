import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, Image, RefreshControl } from 'react-native';

const API_KEY = '51446685f8204d9ba351e99e93bd16d4';
const NEWS_API_URL = `https://newsapi.org/v2/everything?q=Blockchain%20and%20Stocks&apiKey=${API_KEY}`;

const NewsItem = ({ title, url, imageUrl, index }) => (
  <TouchableOpacity style={styles.newsItem} onPress={() => Linking.openURL(url)}>
    {index % 2 === 0 && imageUrl ? (
      <Image source={{ uri: imageUrl }} style={styles.newsImage} />
    ) : null}
    <Text style={styles.newsTitle}>{title}</Text>
    {index % 2 !== 0 && imageUrl ? (
      <Image source={{ uri: imageUrl }} style={styles.newsImage} />
    ) : null}
  </TouchableOpacity>
);

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async (pageNum = 1) => {
    try {
      const response = await fetch(`${NEWS_API_URL}&page=${pageNum}`);
      const data = await response.json();
      setNews(pageNum === 1 ? data.articles : [...news, ...data.articles]);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchNews(1);
  };

  const onLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage);
  };

  if (loading && page === 1) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>Web3 News</Text> */}
      <FlatList
        data={news}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <NewsItem imageUrl={item.urlToImage} title={item.title} url={item.url} />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0029',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0029',
  },
  listContainer: {
    padding: 0,
    marginTop: 10,
  },
  newsItem: {
    backgroundColor: '#1a1a2e',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  newsImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  newsTitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 10,
  },
});

export default NewsList;
