export const GenderOptions = ["Male", "Female", "Other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
    "Birth Certificate",
    "Driver's License",
    "Medical Insurance Card/Policy",
    "Military ID Card",
    "National Identity Card",
    "Passport",
    "Resident Alien Card (Green Card)",
    "Social Security Card",
    "State ID Card",
    "Student ID Card",
    "Voter ID Card",
  ];
  
  export const Doctors = [
    {
      image: "/assets/icons/IMG_2057.svg",
      name: "Chair One: Edu",
    },
    
    {
      image: "/assets/icons/IMG_2057.svg",
      name: "Chair two: Sam",
    },
    {
      image: "/assets/icons/IMG_2057.svg",
      name: "Chair three: Jeff",
    },
    {
      image: "/assets/images/dr-livingston.png",
      name: "David Livingston",
    },
  ];


  export const ServicesA = [
    {
     image: "/assets/icons/IMG_2057.svg",
     name: "Haircut, massage and black dye",
     amount:"KES 1,000", 
     duration:"1hr"
   },
 ];

 export const ServicesB = [
  {
   image: "/assets/icons/IMG_2057.svg",
   name: "Haircut with black dye" 

 },
];
  
  export const StatusIcon = {
    scheduled: "/assets/icons/check.svg",
    pending: "/assets/icons/pending.svg",
    cancelled: "/assets/icons/cancelled.svg",
  };