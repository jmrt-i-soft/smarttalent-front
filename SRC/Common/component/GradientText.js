import React from 'react';
import { colors } from "../../Constants/colors";
import { Text, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

interface GradientTextProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

const GradientText = ({ children, style, gradientType, ...rest }: GradientTextProps) => {

  let gradientColors = [];
  let gradientLocations = [];

  if (gradientType === 'purpleGradient') {
    gradientColors = ["#899CFF", "#924FFF", "#F442B5", "#D61672"];
    gradientLocations = [0.4, 0.45, 0.68, 1]; // Matches the Figma percentages
  } else if (gradientType === 'orangeGradient') {
    gradientColors = [colors.buttonGradientStart, colors.buttonGradientEnd];
    gradientLocations = [0, 0.45];
  } else {
    // Default gradient (fallback if no gradientType is provided)
    gradientColors = [colors.buttonGradientStart, colors.buttonGradientEnd];
    gradientLocations = [0, 0.45];
  }

  return (
    <MaskedView
      maskElement={
        <Text style={style} {...rest}>
          {children}
        </Text>
      }>
      <LinearGradient
        colors={gradientColors}
        locations={gradientLocations}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Text style={[style, { opacity: 0 }]} {...rest}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
