import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const mockProperties = [
    {
      id: "1",
      title: "Luxury Apartment in Lekki",
      price: "₦250,000/month",
      location: "Lekki Phase 1, Lagos",
      bedrooms: 3,
      bathrooms: 2,
    },
    {
      id: "2",
      title: "Modern Studio in Victoria Island",
      price: "₦180,000/month",
      location: "Victoria Island, Lagos",
      bedrooms: 1,
      bathrooms: 1,
    },
    {
      id: "3",
      title: "Spacious Family House in Ikeja",
      price: "₦350,000/month",
      location: "Ikeja GRA, Lagos",
      bedrooms: 4,
      bathrooms: 3,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to Reent</Text>
          <Text style={styles.subtitle}>
            Find your perfect rental property in Nigeria
          </Text>
        </View>

        <View style={styles.propertiesSection}>
          <Text style={styles.sectionTitle}>Featured Properties</Text>
          {mockProperties.map((property) => (
            <TouchableOpacity
              key={property.id}
              style={styles.propertyCard}
              onPress={() =>
                navigation.navigate("PropertyDetail", {
                  propertyId: property.id,
                })
              }
            >
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle}>{property.title}</Text>
                <Text style={styles.propertyPrice}>{property.price}</Text>
                <Text style={styles.propertyLocation}>
                  📍 {property.location}
                </Text>
                <View style={styles.propertyDetails}>
                  <Text style={styles.detailText}>
                    🛏️ {property.bedrooms} bed
                  </Text>
                  <Text style={styles.detailText}>
                    🚿 {property.bathrooms} bath
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Reent - Nigerian Rental Marketplace
          </Text>
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
  header: {
    padding: 20,
    backgroundColor: "#4F46E5",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#e2e8f0",
  },
  propertiesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  propertyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  propertyDetails: {
    flexDirection: "row",
    gap: 16,
  },
  detailText: {
    fontSize: 14,
    color: "#64748b",
  },
  footer: {
    padding: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  footerText: {
    fontSize: 14,
    color: "#64748b",
  },
});

export default HomeScreen;
