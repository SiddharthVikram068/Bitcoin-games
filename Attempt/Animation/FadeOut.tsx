import React, { useEffect, useState } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface FadeOutProps {
  visible: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
}

const FadeOut: React.FC<FadeOutProps> = ({ visible, style, children }) => {
  const [opacity] = useState(new Animated.Value(1));

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Animated.View style={[style, { opacity }]}>
      {children}
    </Animated.View>
  );
};

export default FadeOut;