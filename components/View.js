// components/View.js
import React from 'react';
import { View as DefaultView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const View = ({ children, style, isSafe }) => {
  const insets = useSafeAreaInsets();

  if (isSafe) {
    return (
      <DefaultView style={[styles.safeView(insets), style]}>
        {children}
      </DefaultView>
    );
  }

  return <DefaultView style={style}>{children}</DefaultView>;
};

const styles = StyleSheet.create({
  safeView: (insets) => ({
    flex: 1, // Quan trọng để safe area hoạt động đúng trong nhiều trường hợp
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  }),
});

export default View;