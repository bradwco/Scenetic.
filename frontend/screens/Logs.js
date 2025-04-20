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

const imageSets = [
  [
    "https://img.artpal.com/60196/26-16-9-17-22-51-28m.jpg",
    "https://wallpapers.com/images/hd/movie-background-rl4krsnjuih0u9lc.jpg",
    "https://images.says.com/uploads/story_source/source_image/775847/9480.jpg",
  ],
  [
    "https://cdn.pixabay.com/photo/2018/10/18/18/59/movie-scenes-3757174_1280.jpg",
    "https://compote.slate.com/images/1ece4faf-ce45-4c9d-bcb4-d9c1f8544798.jpeg?crop=1560%2C1040%2Cx0%2Cy0",
    "https://static.skillshare.com/uploads/discussion/tmp/fcd531da.jpg",
  ],
  [
    "https://images.pexels.com/photos/1076183/pexels-photo-1076183.jpeg?cs=srgb&dl=pexels-grizzlybear-1076183.jpg&fm=jpg",
    "https://www.housedigest.com/img/gallery/the-most-random-places-where-celebs-call-home/intro-1621953316.jpg",
    "https://i.insider.com/5a53ffd63225debc198b4f7b?width=700",
  ],
];

export default function Logs({ navigation }) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [imageIndices, setImageIndices] = useState([0, 0, 0]);
  const [logs, setLogs] = useState([
    {
      date: "Apr 27",
      logs: [
        {
          monitor: 1,
          confidence: 91,
          tags: ["Forest", "Fog", "Ruins"],
          time: "5:08 PM",
        },
        {
          monitor: 3,
          confidence: 87,
          tags: ["Snow", "Cave", "Wind"],
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
          time: "9:22 AM",
        },
      ],
    },
  ]);

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handlePrev = (cardIdx) => {
    setImageIndices((prev) => {
      const newIndices = [...prev];
      newIndices[cardIdx] = (newIndices[cardIdx] + 2) % 3;
      return newIndices;
    });
  };

  const handleNext = (cardIdx) => {
    setImageIndices((prev) => {
      const newIndices = [...prev];
      newIndices[cardIdx] = (newIndices[cardIdx] + 1) % 3;
      return newIndices;
    });
  };

  const handleRemoveCard = (sectionIndex, logIndex) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLogs((prevLogs) => {
      const newLogs = [...prevLogs];
      newLogs[sectionIndex].logs.splice(logIndex, 1);
      
      // Remove the date section if it has no more logs
      if (newLogs[sectionIndex].logs.length === 0) {
        newLogs.splice(sectionIndex, 1);
      }
      
      return newLogs;
    });
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
        {logs.map((section, sectionIndex) => (
          <View key={sectionIndex}>
            <Text style={styles.sectionDate}>{section.date}</Text>
            {section.logs.map((log, logIndex) => {
              const globalIndex = `${sectionIndex}-${logIndex}`;
              const isExpanded = expandedIndex === globalIndex;
              const cardIdx = logIndex;

              const imageUri = imageSets[cardIdx][imageIndices[cardIdx]];
              const matchIndex = log.monitor === 1 ? 0 : 
                               log.monitor === 2 ? 1 : 2;
              const currentMonitor = imageIndices[cardIdx] + 1;
              const matchedMonitor = matchIndex === 0 ? 1 : 
                                   matchIndex === 1 ? 2 : 3;
              return (
                <TouchableOpacity
                  key={globalIndex}
                  onPress={() => toggleExpand(globalIndex)}
                  activeOpacity={0.9}
                  style={styles.card}
                >
                  <View style={styles.cardHeaderCentered}>
                    <Text style={styles.cardTitle}>
                      Monitor {currentMonitor}
                    </Text>
                    <TouchableOpacity 
                      style={styles.trashButton}
                      onPress={() => handleRemoveCard(sectionIndex, logIndex)}
                    >
                      <Image
                        source={require("../assets/trash.png")}
                        style={styles.trashIcon}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.carouselContainer}>
                    <TouchableOpacity onPress={() => handlePrev(cardIdx)}>
                      <Image
                        source={require("../assets/left.png")}
                        style={styles.arrowIcon}
                      />
                    </TouchableOpacity>
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.thumbnail}
                    />
                    <TouchableOpacity onPress={() => handleNext(cardIdx)}>
                      <Image
                        source={require("../assets/right.png")}
                        style={styles.arrowIcon}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.matchIndicator}>
                    {imageIndices[cardIdx] === matchIndex ? "✓ MATCH" : ""}
                  </Text>

                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      <Text style={styles.matchText}>
                        Confidence:{" "}
                        <Text style={styles.highlight}>
                          {log.confidence}%
                        </Text>
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
                        You should change your scene to{" "}
                        <Text style={styles.highlight}>
                          Monitor {matchedMonitor}
                        </Text>{" "}
                        for the best match!
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
  carouselContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  arrowIcon: {
    width: 28,
    height: 28,
    tintColor: "#ccc",
  },
  thumbnail: {
    width: "70%",
    aspectRatio: 16 / 9,
    borderRadius: 10,
  },
  matchIndicator: {
    textAlign: "center",
    color: "#4CAF50",
    fontWeight: "bold",
    marginBottom: 6,
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
