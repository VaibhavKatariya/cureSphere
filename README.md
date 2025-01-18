# CureSphere  

CureSphere is an AI-powered healthcare platform designed to revolutionize disease detection and preventive care. By leveraging advanced *AI technologies, **Next.js* for seamless development, *Firebase* for authentication and database management, and a *Symptom Checker API*, CureSphere empowers individuals to assess their health and take proactive steps toward well-being.  


## 🚀 *Features*  

- *AI-Based Symptom Checker*  
  Input symptoms to receive an AI-driven analysis and potential health insights.  

- *Predictive Health Risk Analysis*  
  Get insights into possible health risks based on lifestyle, medical history, and symptoms.  

- *Personalized Health Recommendations*  
  Receive actionable tips to improve health and reduce potential risks.  

- *Telemedicine Integration*  
  Connect with healthcare professionals for consultations (planned future enhancement).  

## 🛠 *Tech Stack*  

- *Frontend and Backend Framework*: [Next.js](https://nextjs.org/)  
- *Authentication and Database*: [Firebase](https://firebase.google.com/)  
- *Symptom Checker*: Symptom Checker API  



## 📋 *Installation and Setup*  

Follow these steps to set up CureSphere on your local system:

### 1. *Clone the Repository*  
bash
git clone https://github.com/vaibhavkatariya/curesphere.git
cd curesphere


### 2. *Install Dependencies*  
Install the required dependencies for the project:  
bash
npm install


### 3. *Set Up Firebase*  
- Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.  
- Enable *Authentication* and *Firestore Database* in your project settings.  
- Download the firebaseConfig file and replace it in the /config/firebase.js file in your project.  

### 4. *Environment Variables*  
Create a .env.local file in the root directory and add the following variables:  

NEXT_PUBLIC_FIREBASE_API_KEY=<your-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SYMPTOM_API_URL=<symptom-checker-api-url>
NEXT_PUBLIC_SYMPTOM_API_KEY=<your-api-key>


### 5. *Start the Development Server*  
Run the development server:  
bash
npm run dev
  
Visit http://localhost:3000 to view the application.  

---

## 🔒 *Authentication*  

CureSphere uses *Firebase Authentication* to manage user signups and logins. It supports:  
- *Email/Password Authentication*  
- Future enhancements: Google and social logins.  

---

## 📅 *Roadmap*  

### Current Features:
- Symptom Checker Integration
- Firebase Authentication and Database

### Upcoming Enhancements:
- Predictive Health Risk Models
- Telemedicine Support
- Advanced Data Visualization for Health Trends
- Best Insurance Recommendations

---

## 👨‍💻 *Contributing*  

We welcome contributions to enhance CureSphere! Follow these steps:  
1. Fork the repository.  
2. Create a new branch: git checkout -b feature-xyz.  
3. Commit changes: git commit -m 'Add new feature'.  
4. Push the branch: git push origin feature-xyz.  
5. Open a Pull Request.  

---

## ⚖ *License*  

This project is licensed under the *MIT License*.  

---

## 🏆 *Acknowledgments*  

- Hacking Winters Hackathon at *Jaypee Institute of Information technology*.  
- Open-source libraries and APIs used in this project.  

---

## 📞 *Contact*  

For queries, feel free to reach out:  
- *Developers*: 
  - Vaibhav Katariya
  - Yasharth Singh
  - Rajat Dagar
  - Rochak Kumar
  - Lakshay Gupta