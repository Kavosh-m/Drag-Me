import React from 'react';
import {Text} from 'react-native';

const EmptyPlaceholder = ({message, fontColor}) => {
  return (
    <Text
      style={{
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        alignSelf: 'center',
        top: '50%',
        color: fontColor,
        position: 'absolute',
      }}>
      {message}
    </Text>
  );
};

export default EmptyPlaceholder;
