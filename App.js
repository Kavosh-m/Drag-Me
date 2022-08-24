import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  PanResponder,
  Animated,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const App = () => {
  const [data, setData] = useState([
    {
      id: '1',
      title: 'twitter',
      website: 'https://www.twitter.com',
      color: 'deepskyblue',
      pan: new Animated.ValueXY(),
    },
    {
      id: '2',
      title: 'facebook',
      website: 'https://www.facebook.com',
      color: 'cornflowerblue',
      pan: new Animated.ValueXY(),
    },
    {
      id: '3',
      title: 'amazon',
      website: 'https://www.amazon.com',
      color: '#fff',
      pan: new Animated.ValueXY(),
    },
    {
      id: '4',
      title: 'instagram',
      website: 'https://www.instagram.com',
      color: 'deeppink',
      pan: new Animated.ValueXY(),
    },
    {
      id: '5',
      title: 'google',
      website: 'https://www.google.com',
      color: '#DB4437',
      pan: new Animated.ValueXY(),
    },
    {
      id: '6',
      title: 'windows',
      website: 'https://www.microsoft.com',
      color: 'cyan',
      pan: new Animated.ValueXY(),
    },
    {
      id: '7',
      title: 'android',
      website: 'https://developer.android.com',
      color: 'green',
      pan: new Animated.ValueXY(),
    },
    {
      id: '8',
      title: 'gitlab',
      website: 'https://www.gitlab.com',
      color: 'darkorange',
      pan: new Animated.ValueXY(),
    },
    {
      id: '9',
      title: 'youtube',
      website: 'https://www.youtube.com',
      color: 'red',
      pan: new Animated.ValueXY(),
    },
  ]);
  const [flatListHeight, setFlatListHeight] = useState(null); // Get FlatList container height on every layout changes
  const [dropedData, setDropedData] = useState([]);

  const isInDropZone = gesture => {
    return gesture.moveY > flatListHeight;
  };

  const panResponder = panAnimatedValue => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        {dx: panAnimatedValue.x, dy: panAnimatedValue.y},
      ]),
      onPanResponderRelease: (evt, gestureState) => {
        if (isInDropZone(gestureState)) {
          console.log(evt.nativeEvent.target);
          let itemObj = data.find(
            item => item.nodeId === evt.nativeEvent.target,
          );

          setDropedData(s => [...s, itemObj]);
          deleteItemFromData(itemObj);
        } else {
          Animated.spring(panAnimatedValue, {
            toValue: {x: 0, y: 0},
            useNativeDriver: true,
          }).start();
        }
      },
    });
  };

  const deleteItemFromData = item => {
    let copyData = [...data];
    copyData.splice(copyData.indexOf(item), 1);

    setData(copyData);
  };

  //Attach element node id to item's object in data
  const updateItemInData = (id, nodeId) => {
    let copyData = [...data];
    let ioi = copyData.find(item => id === item.id);
    let newObject = {...ioi, nodeId};
    copyData.splice(copyData.indexOf(ioi), 1, newObject);
    console.log(copyData);
    setData(copyData);
  };

  //Open url in OS default browser
  const handleLinking = async url => {
    await Linking.openURL(url);
  };

  useEffect(() => {
    console.log('Droped Bank ===> ', dropedData);
  }, [dropedData]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>DRAG ME APP</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        numColumns={4}
        columnWrapperStyle={{margin: 5}}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => {
          return (
            <Animated.View
              onLayout={evt =>
                updateItemInData(item.id, evt.target._children[0]._nativeTag)
              }
              style={[
                {
                  transform: item.pan.getTranslateTransform(),
                },
                styles.social,
              ]}
              {...panResponder(item.pan).panHandlers}>
              <Text numberOfLines={1} style={styles.socialText}>
                {item.title}
              </Text>
            </Animated.View>
          );
        }}
        ListEmptyComponent={
          <Text
            style={{
              position: 'absolute',
              top: '37.5%',
              left: '37.5%',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'justify',
              justifyContent: 'center',
              opacity: 0.7,
            }}>
            No item's left!
          </Text>
        }
        contentContainerStyle={{
          paddingStart: 5,
          paddingTop: 20,
          backgroundColor: 'white',
          // width: ,
          flex: 1,
          alignItems: 'flex-start',
        }}
        onLayout={evt => setFlatListHeight(evt.nativeEvent.layout.height)}
      />
      <FlatList
        data={dropedData}
        numColumns={6}
        columnWrapperStyle={{margin: 10}}
        contentContainerStyle={styles.dropZone}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={{marginEnd: 10}}
              onPress={() => handleLinking(item.website)}>
              <Icon
                name={
                  item.title === 'facebook' ? 'facebook-square' : item.title
                }
                size={50}
                color={item.color}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              textAlign: 'center',
              alignSelf: 'center',
              top: '50%',
              color: '#fff',
              position: 'absolute',
            }}>
            Drag above items and drop them here!
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'justify',
    fontStyle: 'italic',
    alignSelf: 'center',
    marginTop: 20,
  },
  dropZone: {
    flex: 1,
    backgroundColor: '#1f2e2e',
    paddingStart: '5%',
    paddingTop: '5%',
    alignItems: 'flex-start',
  },
  social: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'powderblue',
    marginEnd: 10,
    borderRadius: 5,
  },
  socialText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textTransform: 'capitalize',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
});

export default App;
