import React, { useState } from "react";
import BottomNavBar from "../components/BottomNavBar";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Logs({ navigation }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const mockLogs = [
    {
      date: "Apr 27",
      logs: [
        {
          monitor: 1,
          confidence: 91,
          tags: ["Forest", "Fog", "Ruins"],
          image: "https://img.artpal.com/60196/26-16-9-17-22-51-28m.jpg",
          time: "5:08 PM",
        },
        {
          monitor: 3,
          confidence: 87,
          tags: ["Snow", "Cave", "Wind"],
          image:
            "https://live.staticflickr.com/2919/14408389822_5ae12fe015_b.jpg",
          time: "3:47 PM",
        },
      ],
    },
    {
      date: "Apr 24",
      logs: [
        {
          monitor: 2,
          confidence: 75,
          tags: ["Night", "Rain", "Neon"],
          image:
            "https://www.the-driveby-tourist.com/wp-content/uploads/2022/02/SOOB-1.jpg",
          time: "9:22 AM",
        },
      ],
    },
  ];

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Text style={styles.logo}>
          <Text style={styles.logoWhite}>SCEN</Text>
          <Text style={styles.logoOrange}>ETIC.</Text>
        </Text>
      </View>

      <Text style={styles.title}>Past Matches</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {mockLogs.map((section, sectionIndex) => (
          <View key={sectionIndex}>
            <Text style={styles.sectionDate}>{section.date}</Text>
            {section.logs.map((log, logIndex) => {
              const globalIndex = `${sectionIndex}-${logIndex}`;
              const isExpanded = expandedIndex === globalIndex;
              return (
                <TouchableOpacity
                  key={globalIndex}
                  onPress={() => toggleExpand(globalIndex)}
                  activeOpacity={0.9}
                  style={styles.card}
                >
                  <View style={styles.cardHeaderCentered}>
                    <Text style={styles.cardTitle}>Monitor {log.monitor}</Text>
                    <TouchableOpacity style={styles.trashButton}>
                      <Image
                        source={require("../assets/trash.png")}
                        style={styles.trashIcon}
                      />
                    </TouchableOpacity>
                  </View>

                  <Image source={{ uri: log.image }} style={styles.thumbnail} />

                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      <Text style={styles.matchText}>
                        Confidence:{" "}
                        <Text style={styles.highlight}>{log.confidence}%</Text>
                      </Text>
                      <Text style={styles.matchText}>
                        Tags:{" "}
                        {log.tags.map((tag) => (
                          <Text key={tag} style={styles.highlight}>
                            [{tag}]{" "}
                          </Text>
                        ))}
                      </Text>
                      <Text style={styles.matchText}>
                        Time: <Text style={styles.highlight}>{log.time}</Text>
                      </Text>
                      <Text style={styles.matchText}>
                        You should shoot your movie scene on scene{" "}
                        <Text style={styles.highlight}>{log.monitor}</Text>!
                      </Text>
                    </View>
                  )}

                  <Image
                    source={
                      isExpanded
                        ? require("../assets/up.png")
                        : require("../assets/down.png")
                    }
                    style={styles.chevron}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <BottomNavBar navigation={navigation} resetOnNavigate={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  logoWrapper: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 1,
  },
  logo: {
    fontSize: 16,
    fontWeight: "600",
  },
  logoWhite: {
    color: "white",
  },
  logoOrange: {
    color: "#F28322",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F28322",
    marginBottom: 20,
    marginTop: 40,
  },
  sectionDate: {
    color: "#aaa",
    fontSize: 14,
    marginVertical: 8,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardHeaderCentered: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    position: "relative",
  },
  cardTitle: {
    color: "#F28322",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  trashButton: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 4,
  },
  trashIcon: {
    width: 20,
    height: 20,
    tintColor: "red",
  },
  thumbnail: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 10,
    marginBottom: 10,
  },
  expandedContent: {
    marginTop: 10,
  },
  matchText: {
    color: "white",
    fontSize: 14,
    marginBottom: 6,
  },
  highlight: {
    color: "#F28322",
    fontWeight: "600",
  },
  chevron: {
    width: 18,
    height: 18,
    tintColor: "#aaa",
    alignSelf: "flex-end",
    marginTop: 8,
  },
});
