const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Expert = require('../models/Expert');
const Booking = require('../models/Booking');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const expertsData = [
  {
    name: "Dr. Sarah Chen",
    category: "LLM Architecture",
    experience: 8,
    rating: 4.9,
    bio: "Former lead researcher at top AI lab. Specializes in building and fine-tuning large language models for domain-specific applications.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    expertiseTags: ["Transformers", "Fine-tuning", "RAG", "PyTorch"],
  },
  {
    name: "Marcus Johnson",
    category: "Prompt Engineering",
    experience: 5,
    rating: 4.8,
    bio: "Master prompt engineer helping enterprises maximize their ROI from commercial LLMs through advanced prompting techniques.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
    expertiseTags: ["Chain of Thought", "Few-Shot", "System Prompts", "GPT-4"],
  },
  {
    name: "Elena Rodriguez",
    category: "Computer Vision",
    experience: 10,
    rating: 5.0,
    bio: "Expert in computer vision systems for autonomous vehicles and medical imaging. Deep expertise in CNNs and ViTs.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    expertiseTags: ["Object Detection", "Image Segmentation", "OpenCV", "TensorFlow"],
  },
  {
    name: "David Kim",
    category: "AI Automation",
    experience: 6,
    rating: 4.7,
    bio: "Helps startups automate their workflows using AI agents and integrations. Builds scalable AI pipelines.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
    expertiseTags: ["LangChain", "AutoGPT", "Zapier", "Workflow Automation"],
  },
  {
    name: "Dr. Aisha Patel",
    category: "AI Product Strategy",
    experience: 12,
    rating: 4.9,
    bio: "Advises Fortune 500 companies on integrating AI into their product roadmaps. Focuses on ethical AI and ROI.",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=400&auto=format&fit=crop",
    expertiseTags: ["Product Strategy", "AI Ethics", "Market Analysis", "Enterprise AI"],
  },
  {
    name: "James Wilson",
    category: "LLM Architecture",
    experience: 7,
    rating: 4.6,
    bio: "Specializes in optimizing AI models for edge devices and reducing inference costs for high-traffic applications.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    expertiseTags: ["Model Quantization", "ONNX", "Edge AI", "Performance Optimization"],
  },
  {
    name: "Nina Simone",
    category: "Prompt Engineering",
    experience: 4,
    rating: 4.8,
    bio: "Creative AI specialist helping artists and agencies generate high-quality assets using Midjourney, Stable Diffusion, and DALL-E.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    expertiseTags: ["Midjourney", "Stable Diffusion", "Creative AI", "Generative Art"],
  },
  {
    name: "Dr. Robert Chen",
    category: "AI Automation",
    experience: 9,
    rating: 4.9,
    bio: "Pioneer in creating self-healing code systems and automated testing frameworks powered by machine learning.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    expertiseTags: ["DevOps AI", "Automated Testing", "CI/CD", "Machine Learning"],
  }
];

// Generate slots for the next 7 days
const generateAvailableSlots = () => {
  const slots = [];
  const times = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];
  
  for (let i = 1; i <= 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    // Randomly pick a few slots to simulate partial availability
    const dailySlots = times.filter(() => Math.random() > 0.3);
    
    if (dailySlots.length > 0) {
      slots.push({
        date: dateString,
        slots: dailySlots
      });
    }
  }
  return slots;
};

const importData = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/neurolink';
    await mongoose.connect(uri);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await Expert.deleteMany();
    await Booking.deleteMany();
    console.log('Data Cleared!');

    // Add generated slots to experts
    const expertsWithSlots = expertsData.map(expert => {
      return { ...expert, availableSlots: generateAvailableSlots() };
    });

    await Expert.insertMany(expertsWithSlots);
    console.log('Experts Imported!');

    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

importData();
