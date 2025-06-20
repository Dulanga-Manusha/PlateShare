import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList, 
  Image,
  ActivityIndicator 
} from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import useAxios from '../../hooks/useAxios';

const CategoryResultsScreen = ({ route }) => {
  const axios = useAxios();
  const { categoryId, categoryName } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  
  // TODO: Replace with actual user location
  const location = "Buyer Location 1";

  useEffect(() => {
    const fetchCategoryItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/products/category/${categoryId}/${location}`
        );
        
        if (response.data) {
          const fetchedRestaurants = response.data.restaurants || [];
          const fetchedProducts = response.data.products || [];
          
          setRestaurants(fetchedRestaurants);
          setProducts(fetchedProducts);
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching category items:', error);
        setError('Failed to load category items');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryItems();
  }, [categoryId, location]);

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity 
      className="flex-row mx-4 mb-4 bg-white rounded-lg shadow overflow-hidden"
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate("Restaurant", {
          id: item.id,
          imgUrl: item.image,
          title: item.name,
          rating: item.averageRating || 4.5,
          short_description: item.description,
          long: item.long || 0,
          lat: item.lat || 0,
        });
      }}
    >
      <Image 
        source={{ uri: item.image || "https://picsum.photos/400/300" }} 
        className="w-32 h-32"
        resizeMode="cover"
      />
      <View className="flex-1 p-3">
        <Text className="text-lg font-bold" numberOfLines={1}>{item.name}</Text>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
          {item.description || "Delicious food from this restaurant"}
        </Text>
        <View className="mt-2">
          <Text className="text-xs text-green-700">1.2 km away</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => {
    return (
      <TouchableOpacity
        className="flex-row mx-4 mb-4 bg-white rounded-lg shadow overflow-hidden"
        activeOpacity={0.7}
        onPress={() => {
          navigation.navigate("Restaurant", {
            id: item.restaurant_id,
            imgUrl: item.restaurant?.image,
            title: item.restaurant?.name,
            rating: 4.5,
            short_description: "Restaurant with this product",
            highlightedProductId: item.id
          });
        }}
      >
        <Image
          source={{ uri: item.image || "https://picsum.photos/400/300" }}
          className="w-32 h-32"
          resizeMode="cover"
        />
        <View className="flex-1 p-3">
          <Text className="text-lg font-bold" numberOfLines={1}>{item.name}</Text>
          <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
            {item.description || "Delicious food item"}
          </Text>
          <View className="flex-row items-center justify-between mt-2">
            <Text className="font-bold text-green-600">
              {item.price === 0 ? "Free" : `Rs. ${item.price}`}
            </Text>
            <Text className="text-xs text-gray-500">
              {item.restaurant?.name || "Restaurant"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 pt-7">
        <View className="relative py-4 shadow-sm bg-white">
          <TouchableOpacity
            className="absolute z-10 p-2 bg-gray-100 rounded-full top-5 left-4"
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon size={20} color="#00CCBB" />
          </TouchableOpacity>
          <Text className="text-center text-xl font-bold">Searching for {categoryName}</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00CCBB" />
          <Text className="mt-2 text-gray-500">Loading {categoryName} items...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 pt-7">
        <View className="relative py-4 shadow-sm bg-white">
          <TouchableOpacity
            className="absolute z-10 p-2 bg-gray-100 rounded-full top-5 left-4"
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon size={20} color="#00CCBB" />
          </TouchableOpacity>
          <Text className="text-center text-xl font-bold">{categoryName}</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">{error}</Text>
          <TouchableOpacity 
            className="mt-4 py-2 px-4 bg-green-500 rounded-full"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-white font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const noResultsMessage = (
    <View className="flex-1 items-center justify-center py-10">
      <Text className="text-gray-500">No {categoryName} items found nearby</Text>
      <TouchableOpacity 
        className="mt-4 py-2 px-4 bg-green-500 rounded-full"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-white font-bold">Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-7">
      <View className="relative py-4 shadow-sm bg-white">
        <TouchableOpacity
          className="absolute z-10 p-2 bg-gray-100 rounded-full top-5 left-4"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={20} color="#00CCBB" />
        </TouchableOpacity>
        <Text className="text-center text-xl font-bold">Search Results for {categoryName}</Text>
      </View>

      {restaurants.length === 0 && products.length === 0 ? (
        noResultsMessage
      ) : (
        <FlatList
          data={[
            ...(restaurants.length > 0 ? [{ type: 'header', id: 'restaurants-header', title: 'Restaurants' }] : []),
            ...restaurants.map(item => ({ type: 'restaurant', ...item })),
            ...(products.length > 0 ? [{ type: 'header', id: 'products-header', title: 'Food Items' }] : []),
            ...products.map(item => ({ type: 'product', ...item })),
          ]}
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return (
                <View className="px-4 pt-2 pb-2">
                  <Text className="text-lg font-bold">{item.title}</Text>
                </View>
              );
            } else if (item.type === 'restaurant') {
              return renderRestaurantItem({ item });
            } else {
              return renderProductItem({ item });
            }
          }}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: 20
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-10">
              <Text className="text-gray-500">No items found for this category</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default CategoryResultsScreen;
