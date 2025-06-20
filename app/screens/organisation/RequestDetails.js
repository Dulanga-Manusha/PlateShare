import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { EyeIcon, EyeSlashIcon, CheckIcon } from 'react-native-heroicons/outline';
import useAxios from '../../hooks/useAxios';
import DonationItem from '../../components/organisation/DonationItem';

export default function RequestDetails() {
  const axios = useAxios();
  const navigation = useNavigation();
  const route = useRoute();
  const { requestId, isFromHistory } = route.params;
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchRequestDetails = async () => {
      setLoading(true)
      try {
        // Fetch the specific request by ID using the dedicated endpoint
        const response = await axios.get(`/api/orgrequests/requests/${requestId}`);
        const foundRequest = response.data.foodRequest;

        if (foundRequest) {
          setRequest(foundRequest);
        } else {
          setError("Request not found");
        }
      } catch (error) {
        console.error("Error fetching request details:", error);
        setError("Failed to load request details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequestDetails();
  }, [requestId]);

  // Format dates to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate total donated quantity and progress percentage
  const calculateProgress = () => {
    if (!request || !request.donations || request.donations.length === 0) {
      return {
        totalDonated: 0,
        percentage: 0,
        isComplete: false
      };
    }
    
    const totalDonated = request.donations.reduce((sum, donation) => sum + donation.quantity, 0);
    const percentage = Math.min((totalDonated / request.quantity) * 100, 100);
    
    return {
      totalDonated,
      percentage,
      isComplete: percentage >= 100
    };
  };

  if (loading) {
    return (
        <SafeAreaView className="flex-1 bg-gray-100 pt-5">
          <View className="relative py-4 shadow-sm bg-white">
            <TouchableOpacity
                className="absolute z-10 p-2 bg-gray-100 rounded-full top-4 left-4"
                onPress={() => navigation.goBack()}
            >
              <ArrowLeftIcon size={20} color="#00CCBB" />
            </TouchableOpacity>
            <Text className="text-center text-xl font-bold">Request Details</Text>
          </View>

          <ScrollView className="flex-1 p-4">
            {/* Main request card */}
            <View className="bg-white rounded-lg p-4 mb-4 shadow">
              {/* Title and urgency badge */}
              <View className="flex-row justify-between items-center mb-2">
                <View className="w-2/3 h-7 bg-gray-200 rounded" />
                <View className="bg-gray-100 px-2 py-1 rounded-full">
                  <View className="w-12 h-4 bg-gray-200 rounded" />
                </View>
              </View>

              {/* Requested Items */}
              <View className="mb-4">
                <View className="h-5 w-32 bg-gray-200 rounded mb-1" />
                <View className="h-5 w-full bg-gray-200 rounded" />
              </View>

              {/* Quantity Needed */}
              <View className="mb-1">
                <View className="h-5 w-32 bg-gray-200 rounded mb-1" />
                <View className="h-5 w-28 bg-gray-200 rounded" />
              </View>

              {/* Progress bar */}
              <View className="mb-4">
                <View className="flex-row justify-between items-center mb-1">
                  <View className="h-4 w-48 bg-gray-200 rounded" />
                  <View className="h-4 w-8 bg-gray-200 rounded" />
                </View>
                <View className="h-2.5 w-full bg-gray-200 rounded-full">
                  <View
                      className="h-2.5 rounded-full bg-gray-400"
                      style={{ width: '45%' }}
                  />
                </View>
              </View>

              {/* Needed By */}
              <View className="mb-4">
                <View className="h-5 w-24 bg-gray-200 rounded mb-1" />
                <View className="h-5 w-48 bg-gray-200 rounded" />
              </View>

              {/* Additional Notes */}
              <View className="mb-4">
                <View className="h-5 w-36 bg-gray-200 rounded mb-1" />
                <View className="h-5 w-full bg-gray-200 rounded" />
              </View>

              {/* Tags */}
              <View className="flex-row mb-2">
                <View className="bg-gray-100 px-2 py-1 rounded-full mr-2">
                  <View className="w-24 h-4 bg-gray-200 rounded" />
                </View>
                <View className="bg-gray-100 px-2 py-1 rounded-full">
                  <View className="w-24 h-4 bg-gray-200 rounded" />
                </View>
              </View>
            </View>

            {/* Donations section */}
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <View className="h-6 w-24 bg-gray-200 rounded" />
                <View className="h-6 w-8 bg-gray-200 rounded-full ml-2" />
              </View>

              {/* Donation items */}
              {Array(2).fill().map((_, index) => (
                  <View key={`donation-${index}`} className="bg-white p-4 rounded-lg mb-3 shadow-sm">
                    <View className="flex-row">
                      <View className="w-20 h-20 rounded-md bg-gray-200" />
                      <View className="ml-3 flex-1 justify-center">
                        <View className="h-5 w-32 bg-gray-200 rounded mb-1" />
                        <View className="h-4 w-48 bg-gray-200 rounded mb-1" />
                        <View className="flex-row items-center mt-1">
                          <View className="h-4 w-24 bg-gray-200 rounded" />
                        </View>
                      </View>
                    </View>
                    <View className="mt-2 pt-2 border-t border-gray-100">
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                          <View className="w-6 h-6 rounded-full bg-gray-200" />
                          <View className="h-4 w-32 bg-gray-200 rounded ml-2" />
                        </View>
                        <View className="bg-gray-200 px-3 py-1.5 rounded-md">
                          <View className="h-4 w-20 bg-gray-300 rounded" />
                        </View>
                      </View>
                    </View>

                    {/* Reviews section */}
                    <View className="mt-3">
                      <View className="h-4 w-28 bg-gray-200 rounded mb-1" />
                      <View className="bg-gray-50 p-2 rounded mb-1">
                        <View className="flex-row justify-between">
                          <View className="flex-row items-center">
                            <View className="h-4 w-14 bg-gray-200 rounded mr-2" />
                            <View className="flex-row">
                              {[...Array(5)].map((_, i) => (
                                  <View key={i} className="w-3 h-3 rounded-full bg-gray-200 mr-1" />
                              ))}
                            </View>
                          </View>
                          <View className="flex-row">
                            <View className="w-4 h-4 rounded bg-gray-200 mr-4" />
                            <View className="w-4 h-4 rounded bg-gray-200" />
                          </View>
                        </View>
                        <View className="h-4 w-full bg-gray-200 rounded mt-1" />
                      </View>
                    </View>
                  </View>
              ))}
            </View>

            {/* Action buttons */}
            <View className="flex-row justify-between mb-10">
              <View className="bg-gray-500/20 px-4 py-3 rounded-md flex-1 mr-2 flex-row justify-center items-center">
                <EyeIcon size={18} color="#00CCBB" strokeWidth={2.5} />
                <View className="h-5 w-24 bg-gray-500/30 rounded ml-2" />
              </View>

              <View className="bg-gray-500/20 px-4 py-3 rounded-md flex-1 ml-2 flex-row justify-center items-center">
                <CheckIcon size={18} color="#f59e0b" strokeWidth={2.5} />
                <View className="h-5 w-32 bg-gray-500/30 rounded ml-2" />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
    );
  }
  
  if (error || !request) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-red-500 text-center mb-4">{error || "Request not found"}</Text>
          <TouchableOpacity 
            className="bg-[#00CCBB] px-4 py-2 rounded-md"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const progress = calculateProgress();
  
  // Add a function to toggle visibility
  const toggleVisibility = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/orgrequests/requests/${requestId}/toggle-visibility`);

      // Get the updated request with all details including donations
      const updatedRequestResponse = await axios.get(`/api/orgrequests/requests/${requestId}`);
      const updatedRequest = updatedRequestResponse.data.foodRequest;
      
      setRequest(updatedRequest);

      // Show a success message
      Alert.alert(
        "Success",
        `Request is now ${updatedRequest.visibility ? 'public' : 'private'}`
      );
    } catch (error) {
      console.error("Error toggling visibility:", error);
      Alert.alert("Error", "Failed to update visibility. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add a function to mark the request as complete
  const markRequestComplete = async () => {
    try {
      setLoading(true);
      await axios.put(`/api/orgrequests/requests/${requestId}/complete`);

      // Fetch the updated request to get the latest data
      const updatedRequestResponse = await axios.get(`/api/orgrequests/requests/${requestId}`);
      const updatedRequest = updatedRequestResponse.data.foodRequest;

      setRequest(updatedRequest);

      // Show a success message
      Alert.alert(
        "Success",
        "Request marked as complete",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error("Error marking request as complete:", error);
      Alert.alert("Error", "Failed to mark request as complete. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-5">
      <View className="relative py-4 shadow-sm bg-white">
        <TouchableOpacity
          className="absolute z-10 p-2 bg-gray-100 rounded-full top-4 left-4"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeftIcon size={20} color="#00CCBB" />
        </TouchableOpacity>
        <Text className="text-center text-xl font-bold">Request Details</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-lg p-4 mb-4 shadow">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-bold text-gray-800">{request.title}</Text>
            {request.urgent ? (
              <View className="bg-red-100 px-2 py-1 rounded-full">
                <Text className="text-xs font-medium text-red-800">Urgent</Text>
              </View>
            ) : (
              <View className="bg-yellow-100 px-2 py-1 rounded-full">
                <Text className="text-xs font-medium text-yellow-600">General</Text>
              </View>
            )}
          </View>
          
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-1">Requested Items:</Text>
            <Text className="text-gray-600">{request.products}</Text>
          </View>

          <View className="mb-1">
            <Text className="text-gray-700 font-medium mb-1">Quantity Needed:</Text>
            <Text className="text-gray-600">{request.quantity} servings</Text>
          </View>
          
          {/* Progress bar */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-sm text-gray-500">
                {progress.totalDonated} of {request.quantity} servings donated
              </Text>
              <Text className="text-sm font-medium" style={{ color: progress.isComplete ? '#10b981' : '#f59e0b' }}>
                {progress.percentage.toFixed(0)}%
              </Text>
            </View>
            <View className="h-2.5 w-full bg-gray-200 rounded-full">
              <View 
                className={`h-2.5 rounded-full ${progress.isComplete ? 'bg-green-500' : 'bg-yellow-500'}`} 
                style={{ width: `${progress.percentage}%` }}
              />
            </View>
          </View>
          
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-1">Needed By:</Text>
            <Text className="text-gray-600">{formatDate(request.dateTime)}</Text>
          </View>
          
          {request.notes && (
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-1">Additional Notes:</Text>
              <Text className="text-gray-600 italic">"{request.notes}"</Text>
            </View>
          )}
          
          <View className="flex-row mb-2">
            {request.delivery && (
              <View className="bg-blue-100 px-2 py-1 rounded-full mr-2">
                <Text className="text-xs font-medium text-blue-800">Delivery Needed</Text>
              </View>
            )}
            <View className={`px-2 py-1 rounded-full ${request.visibility ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Text className={`text-xs font-medium ${request.visibility ? 'text-green-800' : 'text-gray-800'}`}>
                {request.visibility ? 'Public Request' : 'Private Request'}
              </Text>
            </View>
          </View>
        </View>
        
        <View className="mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Donations ({request.donations ? request.donations.length : 0})
          </Text>
          {request.donations && request.donations.length > 0 ? (
            request.donations.map(donation => (
              <DonationItem key={donation.id} donation={donation} isFromHistory={isFromHistory} />
            ))
          ) : (
            <View className="bg-white p-4 rounded-lg items-center">
              <Text className="text-gray-500">No donations yet</Text>
            </View>
          )}
        </View>
        
        {!isFromHistory && (
          <View className="flex-row justify-between mb-10">
            <TouchableOpacity 
              className="bg-[#00CCBB]/20 px-4 py-3 rounded-md flex-1 mr-2 flex-row justify-center items-center"
              onPress={toggleVisibility}
            >
              {request.visibility ? 
                <EyeSlashIcon size={18} color="#00CCBB" strokeWidth={2.5} /> : 
                <EyeIcon size={18} color="#00CCBB" strokeWidth={2.5} />
              }
              <Text className="text-[#00CCBB] text-center font-semibold ml-2">
                {request.visibility ? 'Make Private' : 'Make Public'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`px-4 py-3 rounded-md flex-1 ml-2 flex-row justify-center items-center ${
                progress.isComplete ? 'bg-green-500/20' : 'bg-yellow-500/20'
              }`}
              onPress={markRequestComplete}
            >
              <CheckIcon size={18} color={progress.isComplete ? '#10b981' : '#f59e0b'} strokeWidth={2.5} />
              <Text className={`text-center font-semibold ml-2 ${
                progress.isComplete ? 'text-green-600' : 'text-yellow-600'
              }`}>
                Mark as Complete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
