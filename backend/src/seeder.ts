import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from './models/Department';
import Module from './models/Module';

dotenv.config();

const departmentsData = [
  { name: 'Computer Engineering', code: 'CE' },
  { name: 'Civil Engineering', code: 'CEE' },
  { name: 'Electrical and Information Engineering', code: 'EIE' },
  { name: 'Mechanical and Manufacturing Engineering', code: 'MME' },
  { name: 'Marine Engineering', code: 'ME' },
];

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ruhengikuppihub';

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Department.deleteMany({});
    await Module.deleteMany({});
    console.log('Cleared existing data');

    const createdDepartments = await Department.insertMany(departmentsData);
    console.log('Inserted Departments');

    const ceDept = createdDepartments.find(d => d.code === 'CE');
    const ceeDept = createdDepartments.find(d => d.code === 'CEE');
    const eieDept = createdDepartments.find(d => d.code === 'EIE');
    const mmeDept = createdDepartments.find(d => d.code === 'MME');
    const meDept = createdDepartments.find(d => d.code === 'ME');

    const modulesData = [
      // Semester 1 (Common)
      { code: 'EE1301', name: 'Fundamentals of Electricity', year: 1, semester: 1 },
      { code: 'ME1201', name: 'Engineering Drawing', year: 1, semester: 1 },
      { code: 'ME1202', name: 'Fundamentals of Thermodynamics', year: 1, semester: 1 },
      { code: 'IS1301', name: 'Communication for Engineers', year: 1, semester: 1 },
      { code: 'CE1202', name: 'Introduction to Infrastructure Planning', year: 1, semester: 1 },
      { code: 'CE1101', name: 'Basic Concepts in Environmental Engineering', year: 1, semester: 1 },
      
      // Semester 2 (Common)
      { code: 'CE2201', name: 'Fundamentals of Fluid Mechanics', year: 1, semester: 2 },
      { code: 'CE2302', name: 'Mechanics of Materials', year: 1, semester: 2 },
      { code: 'EE1102', name: 'Programming Fundamentals', year: 1, semester: 2 },
      { code: 'ME2201', name: 'Engineering Mechanics', year: 1, semester: 2 },
      { code: 'ME2302', name: 'Fundamentals of Materials and Manufacturing Engineering', year: 1, semester: 2 },
      { code: 'IS2401', name: 'Linear Algebra and Differential Equations', year: 1, semester: 2 },
      { code: 'EE2201', name: 'Fundamentals of Electronics', year: 1, semester: 2 },

      // Semester 3 (Year 2, Sem 3) - Department Wise
      { code: 'CS3201', name: 'Object Oriented Programming', department: ceDept?._id, year: 2, semester: 3 },
      { code: 'CE3201', name: 'Structural Mechanics', department: ceeDept?._id, year: 2, semester: 3 },
      { code: 'EE3201', name: 'Circuit Theory', department: eieDept?._id, year: 2, semester: 3 },
      { code: 'ME3201', name: 'Applied Thermodynamics', department: mmeDept?._id, year: 2, semester: 3 },
      { code: 'MR3201', name: 'Marine Engineering Knowledge', department: meDept?._id, year: 2, semester: 3 },

      // Semester 4 (Year 2, Sem 4)
      { code: 'CS2402', name: 'Data Structures', department: ceDept?._id, year: 2, semester: 4 },
      { code: 'CS2403', name: 'Algorithms', department: ceDept?._id, year: 2, semester: 4 },
    ];

    const createdModules = await Module.insertMany(modulesData);
    console.log('Inserted Modules');

    // Create a demo user for the resources
    await mongoose.connection.collection('users').deleteMany({});
    const demoUser = await mongoose.connection.collection('users').insertOne({
      name: 'System Admin',
      email: 'admin@ruh.ac.lk',
      passwordHash: 'hashed', // Not real
      role: 'admin',
      points: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Inserted Demo User');

    // Create sample resources for EE1301
    const ee1301 = createdModules.find(m => m.code === 'EE1301');
    if (ee1301) {
      await mongoose.connection.collection('resources').deleteMany({});
      const resourcesData = [
        {
          title: 'Kirchhoff\'s Laws Full Lecture',
          description: 'A great tutorial on YouTube explaining KCL and KVL.',
          type: 'kuppi',
          module: ee1301._id,
          link: 'https://www.youtube.com/watch?v=0WbGE0kXq1E',
          uploadedBy: demoUser.insertedId,
          tags: ['kcl', 'kvl', 'circuits'],
          createdAt: new Date()
        },
        {
          title: 'AC Circuits Problem Solving',
          description: 'Step by step guide on solving AC circuit problems with complex numbers.',
          type: 'kuppi',
          module: ee1301._id,
          link: 'https://www.youtube.com/watch?v=1rI2D5FvH-s',
          uploadedBy: demoUser.insertedId,
          tags: ['ac', 'complex numbers'],
          createdAt: new Date()
        },
        {
          title: '2023 Mid Semester Exam',
          description: 'The official mid-semester paper for 2023.',
          type: 'past_paper',
          module: ee1301._id,
          link: 'https://www.example.com/ee1301_mid_2023.pdf',
          uploadedBy: demoUser.insertedId,
          year: 2023,
          examType: 'mid',
          tags: [],
          createdAt: new Date()
        },
        {
          title: 'Assignment 1: DC Circuits',
          description: 'First assignment covering resistors, capacitors, and node analysis.',
          type: 'assignment',
          module: ee1301._id,
          link: 'https://www.example.com/ee1301_ass1.pdf',
          uploadedBy: demoUser.insertedId,
          itemNumber: 1,
          tags: [],
          createdAt: new Date()
        },
        {
          title: 'Quiz 1 Solutions',
          description: 'Solutions for the first spot quiz on Ohm\'s Law.',
          type: 'quiz',
          module: ee1301._id,
          link: 'https://www.example.com/ee1301_quiz1.pdf',
          uploadedBy: demoUser.insertedId,
          itemNumber: 1,
          tags: [],
          createdAt: new Date()
        }
      ];
      await mongoose.connection.collection('resources').insertMany(resourcesData);
      console.log('Inserted Sample Resources for EE1301');
    }

    console.log('Database Seeding Completed');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
