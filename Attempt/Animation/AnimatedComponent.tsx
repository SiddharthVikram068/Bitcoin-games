import React from "react";
import { StyleSheet, View } from "react-native";
import FadeIn from "./FadeIn";
import FadeOut from "./FadeOut";
import { useFadeAnimation } from "./useFadeAnimation";

interface AnimatedComponentProps {
  children: React.ReactNode;
  fadeInDelay: number;
  fadeOutDelay: number;
}

const AnimatedComponent: React.FC<AnimatedComponentProps> = ({
  children,
  fadeInDelay,
  fadeOutDelay,
}) => {
  const { showComponent, hideComponent } = useFadeAnimation(fadeInDelay, fadeOutDelay);

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        {showComponent && !hideComponent && (
          <FadeIn visible={showComponent} style={styles.fadeContainer}>
            {children}
          </FadeIn>
        )}
        {hideComponent && (
          <FadeOut visible={hideComponent} style={styles.fadeContainer}>
            {children}
          </FadeOut>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  fadeContainer: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
});

export default AnimatedComponent;