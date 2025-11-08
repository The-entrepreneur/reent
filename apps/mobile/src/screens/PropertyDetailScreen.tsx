import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "PropertyDetail">;

const PropertyDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { propertyId } = route.params;

  // Mock property data - in real app, this would come from API
  const mockProperty = {
    id: propertyId,
    title: "Luxury Apartment in Lekki",
    price: "₦250,000/month",
    location: "Lekki Phase 1, Lagos",
    description: "Beautiful 3-bedroom apartment with modern amenities, located in the heart of Lekki Phase 1. Features include:\n\n• 24/7 Security\n• Swimming Pool\n• Gym Facility\n• Constant Water Supply\n• Backup Generator\n• Parking Space",
    bedrooms: 3,
    bathrooms: 2,
    area: "1200 sq ft",
    agent: {
      name: "John Adebayo",
      phone: "+234 801 234 5678",
      rating: 4.8,
    },
    amenities: [
      "Swimming Pool",
      "Gym",
      "24/7 Security",
      "Parking",
      "Water Supply",
      "Backup Power",
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Property Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/400x300/4F46E5/ffffff?text=Property+Image" }}
            style={styles.propertyImage}
            resizeMode="cover"
          />
        </View>

        {/* Property Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.propertyTitle}>{mockProperty.title}</Text>
          <Text style={styles.propertyPrice}>{mockProperty.price}</Text>
          <Text style={styles.propertyLocation}>📍 {mockProperty.location}</Text>

          {/* Property Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockProperty.bedrooms}</Text>
              <Text style={styles.statLabel}>Bedrooms</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockProperty.bathrooms}</Text>
              <Text style={styles.statLabel}>Bathrooms</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockProperty.area}</Text>
              <Text style={styles.statLabel}>Area</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{mockProperty.description}</Text>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {mockProperty.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <Text style={styles.amenityText}>✓ {amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Agent Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Agent</Text>
            <View style={styles.agentContainer}>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{mockProperty.agent.name}</Text>
                <Text style={styles.agentPhone}>{mockProperty.agent.phone}</Text>
                <Text style={styles.agentRating}>⭐ {mockProperty.agent.rating}/5</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Contact Agent</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Property</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 250,
  },
  propertyImage: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    padding: 20,
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 8,
  },
  propertyLocation: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4F46E5",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 24,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  amenityItem: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  amenityText: {
    fontSize: 14,
    color: "#475569",
  },
  agentContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  agentPhone: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 4,
  },
  agentRating: {
    fontSize: 14,
    color: "#64748b",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  contactButton: {
    flex: 2,
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  contactButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  saveButtonText: {
    color: "#475569",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PropertyDetailScreen;
