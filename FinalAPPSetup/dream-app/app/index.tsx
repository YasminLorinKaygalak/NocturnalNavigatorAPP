import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { supabase } from "../supabase/supabase";
import Auth from "./Auth";
import { Session } from "@supabase/supabase-js";

export default function Index() {
  const [showUserManual, setShowUserManual] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Authentication Section */}
      <View style={styles.authSection}>
        {session && session.user ? (
          <View style={styles.userDetails}>
            <Text style={styles.userWelcome}>
              Hi, {session.user.email.split("@")[0]}! 👋
            </Text>
            <TouchableOpacity
              onPress={() => supabase.auth.signOut()}
              style={styles.signOutButton}
            >
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Auth />
        )}
      </View>

      {/* Navigate to Pages Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>All Pages</Text>
      </TouchableOpacity>

      {/* Page Selection Modal */}
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
              <Text style={styles.pageButtonText}>
                Textual Interpretation Page
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pageButton}
              onPress={() => router.push("./gooey")}
            >
              <Text style={styles.pageButtonText}>
                Visual Interpretation Page
              </Text>
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

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome to Nocturnal Navigator! 🌙</Text>
        <Text style={styles.subText}>Your gateway to dream insights and logs.</Text>
      </View>

      {/* User Manual */}
      <TouchableOpacity
        onPress={() => setShowUserManual(!showUserManual)}
        style={styles.manualButton}
      >
        <Text style={styles.manualButtonText}>
          {showUserManual ? "Hide User Manual 👆" : "Check User Manual 👇"}
        </Text>
      </TouchableOpacity>

      {showUserManual && (
        <View style={styles.manualSection}>
          <Text style={styles.sectionTitle}>User Manual</Text>
          <Text style={styles.sectionText}>1. Describe your dream in the input field.</Text>
          <Text style={styles.sectionText}>
            2. Click "Generate Dream Interpretation."
          </Text>
          <Text style={styles.sectionText}>
            3. View your dream analysis visually or textually.
          </Text>
        </View>
      )}

      {/* Technology Section */}
      <View style={styles.technologySection}>
        <Text style={styles.sectionTitle}>Powered By:</Text>
        <Text style={styles.sectionText}>
          This app uses Gooey AI and Gemini AI for dream interpretations.
        </Text>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/gooey-logo.png")}
            style={styles.logo}
          />
          <Image
            source={require("../assets/images/gemini-logo.png")}
            style={styles.logo}
          />
        </View>
      </View>

      {/* Footer Section */}
      <View style={styles.footerSection}>
        <Text style={styles.footerText}>
          Interpretation is for entertainment purposes only. 🌌
        </Text>
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
  authSection: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#FFF0F5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  userWelcome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF69B4",
  },
  signOutButton: {
    backgroundColor: "#FF69B4",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  signOutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  button: {
    marginVertical: 15,
    backgroundColor: "#FF69B4",
    paddingVertical: 8,  // Smaller padding for smaller buttons
    paddingHorizontal: 15, // Smaller padding for smaller buttons
    borderRadius: 25,  // Slightly smaller border radius
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,  // Smaller text size for the button
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
  manualButton: {
    marginVertical: 10,
    backgroundColor: "#FFB6C1",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "center",
  },
  manualButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  manualSection: {
    backgroundColor: "#FFF0F5",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF69B4",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
  },
  technologySection: {
    marginVertical: 20,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
    marginHorizontal: 10,
  },
  footerSection: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
});
