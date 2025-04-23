import React, { useState } from "react";
import { Text, View, Button, TextInput, ScrollView, Alert, Linking, Modal, TouchableOpacity, StyleSheet } from "react-native";
import Checkbox from "expo-checkbox";
import { generateVideo } from "../scripts/api-abstraction.js";
import { useRouter } from 'expo-router';  
import { supabase } from '../supabase/supabase';

export default function GooeyInterpretation() {
  const router = useRouter();  
  const [dreamInput, setDreamInput] = useState('');
  const [animationLink, setAnimationLink] = useState('');
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showWebView, setShowWebView] = useState(false); 
  const [modalVisible, setModalVisible] = useState(false);  

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

  const handleGooey = async () => {
    if (!disclaimerChecked) {
      Alert.alert("Disclaimer", "You need to accept the disclaimer to proceed.");
      return;
    }

    if (dreamInput.trim() === '') {
      Alert.alert("Input Required", "Please enter your dream description.");
      return;
    }

    setIsLoading(true);
    try {
      // Generate the Gooey animation link
      const link = await generateVideo(dreamInput);
      console.log("Generated animation link:", link);  // Log to verify the link

      if (!link) {
        throw new Error("Animation link generation failed");
      }

      setAnimationLink(link);
      setShowWebView(true);

      // Get user data
      const { userId, username } = await getUserData();
      if (!userId || !username) {
        Alert.alert("User Error", "Failed to fetch user information.");
        setIsLoading(false);
        return;
      }

      // Get the current date and time
      const currentDate = new Date();
      const date = currentDate.toISOString().split("T")[0];
      const time = currentDate.toTimeString().split(" ")[0];

      // Insert the dream log into the database
      const { data, error } = await supabase.from("dream").insert([
        {
          username: username,
          input: dreamInput,
          output: link,
          date: date,
          time: time,
          theme: null,
          rating: null,
        },
      ]);

      if (error) {
        console.error("Error inserting into Dream table:", error);
        Alert.alert("Database Error", `Failed to save the dream log: ${error.message}`);
      } else {
        console.log("Dream log successfully inserted:", data);
        Alert.alert("Success", "Dream log successfully saved.");
      }
    } catch (error) {
      console.error('Error generating Gooey animation:', error);
      Alert.alert("Error", "Failed to generate animation from Gooey API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (path: string) => {
    setModalVisible(false); 
    router.push(path);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Navigate to Pages Button */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
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

            <TouchableOpacity style={styles.pageButton} onPress={() => handleNavigate('./')}>
              <Text style={styles.pageButtonText}>Home Page</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pageButton} onPress={() => handleNavigate('./gemini')}>
              <Text style={styles.pageButtonText}>Textual Interpretation Page</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pageButton} onPress={() => handleNavigate('./gooey')}>
              <Text style={styles.pageButtonText}>Visual Interpretation Page</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pageButton} onPress={() => handleNavigate('./dream')}>
              <Text style={styles.pageButtonText}>Dream Log Page</Text>
            </TouchableOpacity>

            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Welcome Text */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome to your Dream Visual Interpretation Screen!</Text>
        <Text style={styles.subText}>Enjoy your Gooey Powered Dream Interpretation</Text>
      </View>

      {/* Disclaimer */}
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
          <Text style={styles.disclaimerText}>
            I fully acknowledge that this is for entertainment only!
          </Text>
        </TouchableOpacity>
      </View>

      {/* Gooey API Section */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Input your dream details below to get your dream interpreted visually!</Text>
        <TextInput
          placeholder="Enter your dream input"
          value={dreamInput}
          onChangeText={setDreamInput}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleGooey}
          disabled={isLoading}
        >
          <Text style={styles.actionButtonText}>{isLoading ? "Generating..." : "Generate Animation"}</Text>
        </TouchableOpacity>

        {animationLink ? (
          <Text style={styles.outputText}>
            Animation Link:
            <Text style={styles.linkText} onPress={() => Linking.openURL(animationLink)}>
              Click here to view
            </Text>
          </Text>
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
  welcomeSection: {
    marginVertical: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF69B4",  // Matching the Gemini page color
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
    textAlign: "center",
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
  linkText: {
    color: "#FF69B4",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});
