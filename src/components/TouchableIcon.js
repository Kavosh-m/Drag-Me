import React from 'react';
import {Linking, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const TouchableIcon = ({data}) => {
  //Open url in OS default browser
  const handleLinking = async url => {
    await Linking.openURL(url);
  };

  return (
    <TouchableOpacity
      style={{marginEnd: 10}}
      onPress={() => handleLinking(data.website)}>
      <Icon
        name={data.title === 'facebook' ? 'facebook-square' : data.title}
        size={50}
        color={data.color}
      />
    </TouchableOpacity>
  );
};

export default TouchableIcon;
