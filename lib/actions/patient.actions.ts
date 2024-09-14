"use server"

import axios from 'axios';
import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite";

import {
    BUCKET_ID,
    DATABASE_ID,
    ENDPOINT,
    PATIENT_COLLECTION_ID,
    TRANSACTION_COLLECTION_ID,
    PROJECT_ID,
    databases,
    storage,
    users
  } from "../appwrite.config";
  import { parseStringify } from "../utils";


  export const createUser = async (user: CreateUserParams) => {
    try {
      // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
      const newUser = await users.create(
        ID.unique(),
        user.email,
        user.phone,
        undefined,
        user.name
      )
    //  console.log({newUser})
      return parseStringify(newUser);
      
    } catch (error: any) {
      // Check existing user
      if (error && error?.code === 409) {
        const existingUser = await users.list([
          Query.equal("email", [user.email]),
        ]);
  
        return existingUser.users[0];
      }
      console.error("An error occurred while creating a new user:", error);
    }
  };

  // GET USER
export const getUser = async (userId: string) => {
    try {
      const user = await users.get(userId);
  
      return parseStringify(user);
    } catch (error) {
      console.error(
        "An error occurred while retrieving the user details:",
        error
      );
    }
  };
  //66cc975c0011c129780c  66cc8ea7001cee116f48  66cc8dc10012e97c462f
    // GET PATIENT
export const getPatient = async (userId: string) => {
  //console.log(`Patient id:`, userId);

  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [
        Query.equal('userId', [userId])
      ]
    )
    return parseStringify(patients.documents[0])
       
   } 
    catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};
  
 // REGISTER PATIENT
export const registerPatient = async ({
  
    ...patient
  }: RegisterUserParams) => {
    try {
    //Payment
      // const paymentResponse = await initiatePayment(patient.name); // Assuming patient.userId is used for payment initiation
    
      // console.log('Payment initiated:', paymentResponse);
      // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
      const newPatient = await databases.createDocument(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        ID.unique(),
        
        {
         
          ...patient,
        }
      );
      console.log({newPatient})


      return parseStringify(newPatient);
    } catch (error) {
      console.error("An error occurred while creating a new patient:", error);
    }
  };
   



  //Payment & checkout
 
  export const initiatePayment = async ({name, email, phone, appointmentId}: PaymentParams) => {
    const api_key = process.env.NEXT_PUBLIC_API_KEY!;
    const transaction_reference = `txn_${new Date().getTime()}_${Math.random().toString(36).substring(7)}`; // Unique reference
  
    // // Store the transaction reference and patient data
    // await databases.createDocument(DATABASE_ID!, TRANSACTION_COLLECTION_ID!, transaction_reference, {
    //   //patient, // Store patient data directlyn
    //   name,
    //   email,
    //   phone,
    //   status: 'pending', // Payment status starts as pending

    // });
  //  console.log(`user name ${name}`)
  //  console.log(`user name ${phone}`)
  //  console.log(`user name ${appointmentId}`)
  
    const requestBody = {
      customer_details: {
        full_name: name,
        location: "Juja",
        phone_number: phone,
        email: "edu@chpter.co"
      },
      products: [
        {
          product_name: "Appointment",
          quantity: 1,
          unit_price: 1,
          digital_link: ""
        }
      ],
      amount: {
        currency: "KES",
        delivery_fee: 0.00,
        discount_fee: 0.00,
        total: 1.00
      },
      callback_details: {
        transaction_reference: transaction_reference,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-callback`
      },
      appointmentId: appointmentId,
    };
    

    const authHeader = {
      'Api-Key': api_key
    };
  
    const config = {
      method: 'post',
      url: 'https://api.chpter.co/v1/initiate/mpesa-payment',
      headers: authHeader,
      data: requestBody,
    };
  
    try {
      const response = await axios(config);
   //   console.log('Payment initiated:', response.data);
      const newTransaction = await databases.createDocument(
        DATABASE_ID!,
        TRANSACTION_COLLECTION_ID!,
        transaction_reference,  // Use the transaction_reference as the document ID
        {
          transaction_reference: transaction_reference,
          
            name: name,
           // email: email,
            phone: phone,
            appointmentId,
            status: 'pending', // Set the initial status to pending

          },
        );
      console.log(`transactin ${newTransaction}`)
      return {
        message: 'Payment initiated successfully. Await callback for final result.',
       
      };
    } catch (error) {
      throw new Error(`Error initiating payment: ${error}`);
    }
  };
  
