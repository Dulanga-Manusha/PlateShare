import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import useAxiosModified from "../../hooks/useAxiosModified";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EmailVerify = ({ role='user',formData, setFormData, prevStep, nextStep ,title='Verify It Is You',type='verify'}) => {
    const request=useAxiosModified()
    const [email, setEmail] = useState(formData.email || '');
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Mock function to simulate API call to send verification code
    const sendVerificationCode = async () => {

        try {
            setIsCodeSent(false);
            setError('');

            // Validate email format
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError('Please enter a valid email address');
                return;
            }
            setIsSending(true);
            const response= await  request('post', '/auth/send-code',  { email ,type})
                .then(response => {
                    setIsCodeSent(true);
                    setCountdown(120); // 2 minutes countdown
                    setFormData(prev => ({ ...prev, email,role}));
                })
                .catch(err => setError(err));
        } catch (err) {
            setError('Failed to send verification code. Please try again.');
        } finally {
            setIsSending(false);
        }
    };



    // Mock function to verify code
    const verifyCode = async () => {
        try {
            if (!verificationCode || verificationCode.length !== 6) {
                setError('Please enter a 6-digit verification code');
                return;
            }

            setIsVerifying(true);
            setError('');

            if(type==='verify'){
                const response= await  request('post', '/auth/verify-code',  { email: email,code:verificationCode })
                    .then(data => {
                        nextStep();
                    })
                    .catch(err => setError(err));
            }else {
                const response= await  request('post', '/auth/passreset-verify-code',  { email: email,code:verificationCode })
                    .then(async  data => {
                        const token =data.data.tokens.verifyToken
                        await AsyncStorage.setItem('verifyToken', token);
                        nextStep();
                    })
                    .catch(err => setError(err));
            }


        } catch (err) {
            setError('Invalid verification code. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    // Handle resend code
    const handleResendCode = async () => {
        if (countdown > 0) return;

        setIsResending(true);
        setError('');
        await sendVerificationCode();
        setIsResending(false);
    };

    // Countdown timer effect
    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    return (
        <View className="space-y-4 p-4">
            <View className="items-center pb-5">
                <Text className="text-2xl font-bold text-gray-800 mb-2">{title}</Text>

            </View>

            {!isCodeSent ? (
                <>
                    <View>
                        <Text className="text-gray-600">Email Address <Text className="text-red-500">*</Text></Text>
                        <TextInput
                            className="border border-gray-300 bg-white rounded-lg p-3 mb-1"
                            placeholder="abc@example.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    {error ? (
                        <Text className="text-red-500 text-left mb-2">{error}</Text>
                    ) : <></>
                    }
                    <TouchableOpacity
                        className="bg-[#00CCBB] px-6 py-3 rounded-lg mt-6"
                        onPress={sendVerificationCode}
                        disabled={isSending}
                    >
                        <Text className="text-center text-white font-bold">
                            Send Verification Code
                        </Text>
                    </TouchableOpacity>


                </>
            ) : (
                <>
                    <Text className="text-gray-600 text-center">
                        We've sent a 6-digit verification code to {email}
                    </Text>

                    <View className="mt-6">
                        <Text className="text-gray-600 mb-3">Verification Code <Text className="text-red-500">*</Text></Text>

                        <OTPTextInput
                            handleTextChange={setVerificationCode}
                            inputCount={6}
                            keyboardType="numeric"
                            tintColor="#00CCBB"
                            offTintColor="#DDD"
                        />
                    </View>

                    {error ? (
                        <Text className="text-red-500 text-left mb-2">{error}</Text>
                    ) : <></>
                    }

                    <TouchableOpacity
                        onPress={handleResendCode}
                        disabled={countdown > 0 || isResending}
                        className="items-end mt-3 mb-5"
                    >
                        {isResending ? (
                            <ActivityIndicator color="#00CCBB" />
                        ) : (
                            <Text className="text-[#00CCBB]">
                                {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend verification code'}
                            </Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-[#00CCBB] px-6 py-3 rounded-lg items-center"
                        onPress={verifyCode}
                        disabled={isVerifying || !verificationCode}
                    >
                        {isVerifying ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-center text-white font-bold">
                                Verify Code
                            </Text>
                        )}
                    </TouchableOpacity>


                </>
            )}



            <TouchableOpacity
                disabled={isSending}
                className="bg-gray-100 px-6 py-3 rounded-lg mt-4"
                onPress={prevStep}
            >
                <Text className="text-center text-gray-700">Back</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EmailVerify;
