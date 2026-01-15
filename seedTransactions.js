// seedTransactions.js
import admin from "firebase-admin";
import fs from "fs";

// Replace this with your Firebase service account key JSON path
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const userId = "CHARLES001";  // your user document ID
const totalBalance = 167589;   // final balance
const months = 84;             // 2019-2025 = 7 years * 12 months
const monthlyAmount = Number((totalBalance / months).toFixed(2)); // evenly divide

const startYear = 2019;
const startMonth = 0; // January

const transactions = [];

for(let i = 0; i < months; i++){
  const year = startYear + Math.floor((startMonth + i)/12);
  const month = (startMonth + i)%12 + 1; // 1-12
  const date = `${year}-${month.toString().padStart(2,'0')}-01`;

  transactions.push({
    amount: monthlyAmount,
    type: "interest",
    description: "Monthly interest",
    currency: "USD",
    date: date,
    time: "09:00"
  });
}

async function seed() {
  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      transactions: transactions
    });
    console.log(`✅ Successfully seeded ${months} transactions for ${userId}`);
  } catch (err) {
    console.error(err);
  }
}

seed();
