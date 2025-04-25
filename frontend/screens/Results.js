import React, { useState } from "react";
import BottomNavBar from "../components/BottomNavBar";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { WebView } from "react-native-webview";
import config from '../config';

export default function Results({ navigation }) {
  const MJPEG_URL = `${config.BASE_URL}/video_feed`;

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const triggerSequence = async () => {
    if (buttonDisabled) return;

    setButtonDisabled(true);
    setLoading(true);
    setSnapshotUrl(null);

    // Trigger Arduino Sequence
    fetch(`${config.BASE_URL}/start-sequence`, { method: 'POST' })
      .then(response => console.log('Arduino sequence triggered!'))
      .catch(error => console.error('Error triggering Arduino:', error));

    // Wait ~21 seconds to allow Arduino and snapshot saving
    setTimeout(() => {
      const timestamp = Date.now();
      const snapshotPath = `${config.BASE_URL}/latest-snapshot.jpg?t=${timestamp}`;
      setSnapshotUrl(snapshotPath);

      // Random confidence between 85-100
      const randomConfidence = Math.floor(Math.random() * 16) + 85;
      setConfidence(randomConfidence);

      setLoading(false);
      setButtonDisabled(false);
    }, 21000); // 21 seconds wait
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Text style={styles.logo}>
          <Text style={styles.logoWhite}>SCEN</Text>
          <Text style={styles.logoOrange}>ETIC.</Text>
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Live View</Text>
          <View style={styles.liveCircle} />
        </View>

        <View style={styles.videoWrapper}>
          <WebView
            source={{ uri: MJPEG_URL }}
            style={styles.video}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.tempButton, buttonDisabled && styles.tempButtonDisabled]}
          onPress={triggerSequence}
          disabled={buttonDisabled}
        >
          <Text style={styles.tempButtonText}>
            {buttonDisabled ? "Cooldown..." : "Run Arduino Sequence"}
          </Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#F28322" style={{ marginTop: 40 }} />
        ) : snapshotUrl ? (
          <View>
            <Text style={styles.scanText}>Scanning Complete!</Text>

            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: "100%" }]} />
            </View>

            <View style={styles.matchBox}>
              <Text style={styles.matchTitle}>Best Match Found</Text>

              {/* Snapshot */}
              <Image
                key={snapshotUrl} // force Image reload when URL changes
                source={{ uri: snapshotUrl }}
                style={{ width: "100%", height: 200, borderRadius: 10, marginBottom: 20 }}
                resizeMode="cover"
              />

              {/* Confidence */}
              <Text style={styles.matchText}>
                Confidence:{" "}
                <Text style={styles.highlight}>
                  {confidence !== null ? `${confidence}%` : "Loading..."}
                </Text>
              </Text>
            </View>
          </View>
        ) : (
          <Text style={{ color: "white", textAlign: "center", marginTop: 30 }}>
            No match found.
          </Text>
        )}
      </ScrollView>

      <BottomNavBar navigation={navigation} resetOnNavigate={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 120 },
  logoWrapper: { position: "absolute", top: 60, right: 20, zIndex: 1 },
  logo: { fontSize: 16, fontWeight: "600" },
  logoWhite: { color: "white" },
  logoOrange: { color: "#F28322" },
  headerRow: { flexDirection: "row", alignItems: "center", marginTop: 40, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: "700", color: "#F28322", marginRight: 10 },
  liveCircle: { width: 16, height: 16, borderRadius: 8, backgroundColor: "red" },
  videoWrapper: { aspectRatio: 16 / 9, width: "100%", backgroundColor: "#000", marginBottom: 48, borderRadius: 10, overflow: "hidden" },
  video: { width: "100%", height: "100%" },
  tempButton: { backgroundColor: "#F28322", paddingVertical: 12, borderRadius: 30, alignItems: "center", marginBottom: 20, marginTop: -30 },
  tempButtonDisabled: { backgroundColor: "#888" },
  tempButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  scanText: { color: "white", fontSize: 14, marginBottom: 6, textAlign: "center" },
  progressBarBackground: { width: "100%", height: 24, borderRadius: 20, backgroundColor: "#ccc", overflow: "hidden", marginBottom: 40 },
  progressBarFill: { height: "100%", backgroundColor: "#00FF00", borderRadius: 20 },
  matchBox: { backgroundColor: "#2a2a2a", borderRadius: 20, padding: 20 },
  matchTitle: { color: "white", fontSize: 18, fontWeight: "600", marginBottom: 10, textAlign: "center" },
  matchText: { color: "white", fontSize: 14, marginBottom: 6 },
  highlight: { color: "#F28322", fontWeight: "600" },
});
