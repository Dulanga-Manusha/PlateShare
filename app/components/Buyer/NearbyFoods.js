import { View, Text, TouchableOpacity, FlatList, Image, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import useAxios from '../../hooks/useAxios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";

const SCREEN_WIDTH = Dimensions.get("window").width;

const NearbyFoods = () => {
  const axios = useAxios();
  const navigation = useNavigation();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Replace with actual user location
  const location = "Buyer Location 1";
  
  useEffect(() => {
    const fetchNearbyFoods = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/products/nearby/${location}`);
        setDishes(response.data.products || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching nearby foods:", error);
        setError("Failed to load nearby foods");
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyFoods();
  }, []);

  // Render horizontal item
  const renderHorizontalItem = ({ item: dish }) => (
    <TouchableOpacity
      className="mb-4 bg-white rounded-lg"
      style={{
        width: SCREEN_WIDTH - 30,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
        padding: 6,
        backgroundColor: "white",
      }}
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate("Restaurant", {
          id: dish.restaurant_id,
          imgUrl: dish.restaurant?.image,
          title: dish.restaurant?.name,
          rating: dish.restaurant?.averageRating,
          short_description: dish.restaurant?.short_description,
          highlightedProductId: dish.id
        });
      }}
    >
      <View className="overflow-hidden rounded-lg">
        <View className="flex-row items-center px-3 py-2">
          {/* Food Details */}
          <View className="flex-1 pr-4">
            <Text className="text-lg font-bold" numberOfLines={1}>{dish.name}</Text>
            <Text className="mt-1 text-sm text-gray-500" numberOfLines={2}>
              {dish.description || dish.short_description}
            </Text>
            <Text className="mt-2 font-bold text-green-600">
              {dish.price === 0 ? "Free" : `Rs. ${dish.price}`}
            </Text>
          </View>

          {/* Image */}
          <Image
            source={{ uri: dish.image }}
            className="rounded-lg w-28 h-28"
            resizeMode="cover"
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="pb-4">
        <View className="flex-row items-center justify-between px-4 pt-2">
          <Text className="text-lg font-bold">Near By Foods</Text>
          <View className="flex-row items-center">
            <Text className="mr-1 font-medium text-gray-300">See All</Text>
            <Icon name="chevron-right" size={16} color="#d1d5db" />
          </View>
        </View>

        <FlatList
          data={[1, 2, 3]} // Dummy data for skeleton loaders
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingTop: 10,
          }}
          renderItem={() => (
            <View
              className="mb-4 bg-gray-200 rounded-lg"
              style={{
                width: SCREEN_WIDTH - 30,
                marginHorizontal: 5,
                height: 150,
                padding: 10,
              }}
            >
              <View className="flex-row items-center px-3 py-2">
                <View className="flex-1 pr-4">
                  <View className="w-3/4 h-5 mb-2 bg-gray-300 rounded" />
                  <View className="w-full h-4 mb-1 bg-gray-300 rounded" />
                  <View className="w-1/2 h-4 mb-2 bg-gray-300 rounded" />
                  <View className="w-1/4 h-4 bg-gray-300 rounded" />
                </View>
                <View className="bg-gray-300 rounded-lg w-28 h-28" />
              </View>
            </View>
          )}
          keyExtractor={(_, index) => `skeleton-${index}`}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View className="py-8">
        <Text className="text-center text-red-500">{error}</Text>
      </View>
    );
  }

  const EmptyListComponent = () => (
    <View className="flex items-center justify-center py-10">
      <Text className="text-gray-500">No foods available nearby at the moment</Text>
    </View>
  );

  const handleSeeAllPress = () => {
    navigation.navigate("AllNearbyFoodsScreen", { dishes });
  };

  return (
    <View className="pb-4">
      <View className="flex-row items-center justify-between px-4 pt-2">
        <Text className="text-lg font-bold">Near By Foods</Text>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={handleSeeAllPress}
        >
          <Text className="mr-1 font-medium text-green-600">See All</Text>
          <Icon name="chevron-right" size={16} color="#16a34a" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={dishes.slice(0, 5)}
        renderItem={renderHorizontalItem}
        keyExtractor={(item) => item._id || item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingTop: 10,
        }}
        ListEmptyComponent={EmptyListComponent}
      />
    </View>
  );
};

export default NearbyFoods;
