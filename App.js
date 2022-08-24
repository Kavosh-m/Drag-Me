import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  PanResponder,
  Animated,
} from 'react-native';
import {EmptyPlaceholder, TouchableIcon} from './src/components';

import brands from './src/assets/fakeData.json';

const App = () => {
  const [data, setData] = useState(() =>
    brands.map(item => {
      return {...item, pan: new Animated.ValueXY()};
    }),
  );
  const [flatListHeight, setFlatListHeight] = useState(null); // Get FlatList container height on every layout changes
  const [dropedData, setDropedData] = useState([]); // List of items available in drop zone

  // Check if item is in drop zone or not
  const isInDropZone = gesture => {
    return gesture.moveY > flatListHeight;
  };

  const panResponder = panAnimatedValue => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, {dx: panAnimatedValue.x, dy: panAnimatedValue.y}],
        {useNativeDriver: false},
      ),
      onPanResponderRelease: (evt, gestureState) => {
        if (isInDropZone(gestureState)) {
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
    setData(copyData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>DRAG ME APP</Text>
      <View style={[styles.zone, {backgroundColor: '#fff'}]}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          numColumns={4}
          columnWrapperStyle={{margin: 5}}
          showsVerticalScrollIndicator={false}
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
            <EmptyPlaceholder message="No item's left!" fontColor="gray" />
          }
          contentContainerStyle={styles.flatlistContainer}
          onLayout={evt => setFlatListHeight(evt.nativeEvent.layout.height)}
        />
      </View>

      {/* Drop Zone */}
      <View style={styles.zone}>
        <FlatList
          data={dropedData}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.flatlistContainer,
            {alignItems: 'flex-start'},
          ]}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return <TouchableIcon data={item} />;
          }}
          ListEmptyComponent={
            <EmptyPlaceholder
              message="Drag above items and drop them here!"
              fontColor="#fff"
            />
          }
        />
      </View>
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
  flatlistContainer: {minHeight: '100%', minWidth: '100%'},
  zone: {
    flex: 1,
    backgroundColor: '#1f2e2e',
    paddingStart: '3%',
    paddingTop: '3%',
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
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
});

export default App;
