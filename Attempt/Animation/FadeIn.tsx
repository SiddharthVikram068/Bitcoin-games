import React, { useEffect, useState } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface FadeInProps {
  visible: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
}

const FadeIn: React.FC<FadeInProps> = ({ visible, style, children }) => {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
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

export default FadeIn;