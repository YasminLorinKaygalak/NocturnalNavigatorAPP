import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { supabase } from './supabase'; 

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signUpUser = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'User signed up! Please check your email to confirm.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Sign Up</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          borderBottomWidth: 1,
          marginBottom: 20,
          fontSize: 18,
          paddingVertical: 10,
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderBottomWidth: 1,
          marginBottom: 20,
          fontSize: 18,
          paddingVertical: 10,
        }}
      />

      <Button
        title={loading ? 'Signing Up...' : 'Sign Up'}
        onPress={signUpUser}
        disabled={loading || !email || !password}
      />

      <Text style={{ marginTop: 20 }}>
        Already have an account? Sign In.
      </Text>
    </View>
  );
};

export default SignUpScreen;
