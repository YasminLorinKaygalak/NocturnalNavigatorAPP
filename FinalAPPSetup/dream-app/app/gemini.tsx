import React, { useState } from "react";
import { Text, View, Button, TextInput, ScrollView, Alert, Modal, TouchableOpacity, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";
import { textModel } from "../scripts/api-abstraction.js";
import { useRouter } from 'expo-router';
import { supabase } from '../supabase/supabase';

export default function GeminiInterpretation() {
  const [geminiInput, setGeminiInput] = useState('');
  const [geminiOutput, setGeminiOutput] = useState('');
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const getUserData = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("Error fetching user:", error);
        return { userId: null, username: null };
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (profileError || !data) {
        console.error("Error fetching username from profiles:", profileError);
        return { userId: user.id, username: null };
      }

      return { userId: user.id, username: data.username };
    } catch (err) {
      console.error("Unexpected error fetching user data:", err);
      return { userId: null, username: null };
    }
  };

  const handleGemini = async () => {
    if (!disclaimerChecked) {
      Alert.alert("Disclaimer", "You need to accept the disclaimer to proceed.");
      return;
    }

    if (geminiInput.trim() === "") {
      Alert.alert("Input Required", "Please enter a prompt for Gemini.");
      return;
    }

    setIsLoading(true);
    try {
      const dreamPrompt = `Please interpret the following dream: ${geminiInput}`;
      const content = await textModel(dreamPrompt);
      setGeminiOutput(content);

      // Get user data
      const { userId, username } = await getUserData();
      if (!userId || !username) {
        Alert.alert("User Error", "Failed to fetch user information.");
        setIsLoading(false);
        return;
      }

      // Get the current date and time
      const currentDate = new Date();
      const date = currentDate.toLocaleDateString();
      const time = currentDate.toLocaleTimeString();

      // Insert the dream log into the database
      try {
        const { data, error } = await supabase
          .from("dream")
          .insert([
            {
              username: username,
              input: geminiInput,
              output: content,
              date: date,
              time: time,
              theme: null,
              rating: null,
            },
          ]);
      
        if (error) {
          Alert.alert(
            "Database Error",
            `Failed to save the dream log: ${error.message}`
          );
        } else {
          Alert.alert("Success", "Dream log successfully saved.");
        }
      } catch (dbError) {
        console.error("Unexpected error inserting into Dream table:", dbError);
        Alert.alert("Error", "An unexpected error occurred while saving the dream.");
      }
      
    } catch (error) {
      console.error("Error generating Gemini content:", error);
      Alert.alert("Error", "Failed to generate content from Gemini API.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Navigate to Pages Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>All Pages</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose the page you want!</Text>

            <TouchableOpacity
              style={styles.pageButton}
              onPress={() => router.push("./")}
            >
              <Text style={styles.pageButtonText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pageButton}
              onPress={() => router.push("./gemini")}
            >
              <Text style={styles.pageButtonText}>Textual Interpretation Page</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pageButton}
              onPress={() => router.push("./gooey")}
            >
              <Text style={styles.pageButtonText}>Visual Interpretation Page</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pageButton}
              onPress={() => router.push("./dream")}
            >
              <Text style={styles.pageButtonText}>Dream Log Page</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Welcome Message */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome to your Dream Interpretation Screen!</Text>
        <Text style={styles.subText}>Enjoy your Gemini AI Powered Dream Interpretation</Text>
      </View>

      {/* Enhanced "I fully acknowledge" Checkbox Section */}
      <View style={styles.disclaimerSection}>
        <TouchableOpacity
          style={[
            styles.checkboxContainer,
            {
              borderColor: disclaimerChecked ? "#FF69B4" : "#ccc",
              backgroundColor: disclaimerChecked ? "#FF69B4" : "transparent",
            },
          ]}
          onPress={() => setDisclaimerChecked(!disclaimerChecked)}
        >
          <View
            style={[
              styles.customCheckbox,
              { borderColor: disclaimerChecked ? "#FF69B4" : "#ccc" },
            ]}
          >
            {disclaimerChecked && <View style={styles.checkmark} />}
          </View>
          <Text style={styles.disclaimerText}>I fully acknowledge that this is for entertainment only!</Text>
        </TouchableOpacity>
      </View>

      {/* Gemini API Section */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Input your dream details below to get your dream interpreted!</Text>
        <TextInput
          placeholder="Enter your prompt for Gemini"
          value={geminiInput}
          onChangeText={setGeminiInput}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleGemini}
          disabled={isLoading}
        >
          <Text style={styles.actionButtonText}>{isLoading ? "Generating..." : "Generate Content"}</Text>
        </TouchableOpacity>

        {geminiOutput ? (
          <Text style={styles.outputText}>Generated Content: {geminiOutput}</Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFE4E1", // Light pink background
  },
  button: {
    marginVertical: 15,
    backgroundColor: "#FF69B4",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF69B4",
    textAlign: "center",
    marginBottom: 15,
  },
  pageButton: {
    backgroundColor: "#FFB6C1",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  pageButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#FF69B4",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  welcomeSection: {
    marginVertical: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF69B4",
  },
  subText: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  disclaimerSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 30,
    padding: 12,
    width: "80%",
  },
  customCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 5,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: "#FF69B4",
    borderRadius: 3,
  },
  disclaimerText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  inputContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#FF69B4",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#FF69B4",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  outputText: {
    marginTop: 20,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
});
