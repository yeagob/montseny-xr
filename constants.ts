import { Project, Category, Importance } from './types';

export const PROJECTS: Project[] = [
  // === NEW PROJECTS (2025) ===
  {
    id: 'space-creator',
    title: 'SPACE CREATOR',
    categories: [Category.VIDEOGAMES],
    importance: Importance.TOP,
    year: '2020-2025',
    sortYear: 2025,
    description: 'Multiplayer Serious Game designed for corporate team building. An immersive escape room experience that challenges teams to collaborate, solve puzzles, and think creatively under pressure.',
    imageUrl: '/images/projects/space-creator.jpg',
    techStack: ['Unity', 'Multiplayer', 'Serious Game', 'C#', 'Escape Room', 'LiveKit VoiceChat', 'Game Dev'],
    link: 'https://youtu.be/0Jp53uVpq-g?si=eXDNhAsuE1vU2qo8'
  },
  {
    id: 'vr-bicycle',
    title: 'VR BICYCLE SIMULATOR',
    categories: [Category.EXTENDED_REALITY, Category.SIMULATION],
    importance: Importance.NORMAL,
    year: '2025',
    sortYear: 2025,
    description: '(WIP)Advanced VR bicycle simulator featuring realistic physics engine. Supports both VR headsets and flat screen modes with hardware-in-the-loop integration for physical bicycle recreation.',
    imageUrl: '/images/projects/vr-bicycle.jpg',
    techStack: ['Unity', 'VR', 'Physics', 'Hardware-in-Loop', 'C#', 'Python', 'WIP'],
    link: 'https://www.youtube.com/watch?v=h_RpxboDyWY'
  },
  {
    id: 'electric-scooter',
    title: 'ELECTRIC SCOOTER SIMULATOR',
    categories: [Category.SIMULATION],
    importance: Importance.TOP,
    year: '2024-2025',
    sortYear: 2025,
    description: 'Digital twin of an electric scooter. Features custom physics formulas for realistic driving dynamics, Nvidia PhysX for collision simulation, and comprehensive accident data collection system.',
    imageUrl: '/images/projects/electric-scooter.jpg',
    techStack: ['Unity', 'Nvidia PhysX', 'Digital Twin', 'Data Analytics'],
    link: 'https://www.youtube.com/watch?v=pwog3phy4ws'
  },
  {
    id: 'digital-asphalt',
    title: 'DIGITAL ASPHALT LAB',
    categories: [Category.SIMULATION],
    importance: Importance.TOP,
    year: '2018-2022',
    sortYear: 2022,
    description: 'Digital twin laboratory for civil engineering. Visualizes asphalt composition and stress tests using advanced physics simulation and machine learning for material analysis.',
    imageUrl: '/images/projects/digital-asphalt.jpg',
    techStack: ['Unity', 'Physics', 'Digital Twin', 'Machine Learning', 'Materials'],
    link: 'https://www.youtube.com/watch?v=VYWeSJ3niNw'
  },
  {
    id: 'realistic-car',
    title: 'REALISTIC CAR SIMULATION',
    categories: [Category.SIMULATION],
    importance: Importance.NORMAL,
    year: '2024',
    sortYear: 2024,
    description: 'High-fidelity physics and rendering simulation engine. Features advanced tire friction models, suspension dynamics, and HDRP photorealistic graphics.',
    imageUrl: '/images/projects/realistic-car.jpg',
    techStack: ['Unity 3D', 'SUMO', 'HDRP', 'C#', 'Vehicle Dynamics', 'RoadRunner'],
    link: 'https://youtu.be/cDg9jP5xoeQ'
  },
  {
    id: 'factory-robot',
    title: 'FACTORY LLM ROBOT ARM',
    categories: [Category.ARTIFICIAL_INTELLIGENCE, Category.SIMULATION],
    importance: Importance.CASUAL
    ,
    year: '2025',
    sortYear: 2025,
    description: 'Robotic arm controlled by machine learning in Python. Real-time physics simulation in Unity with socket communication for autonomous learning and factory automation.',
    imageUrl: '/images/projects/factory-robot.jpg',
    techStack: ['Python', 'Machine Learning', 'Physics', 'Sockets', 'Unity', 'Robotics'],
    link: 'https://github.com/yeagob/python_to_unity_robot'
  },
  {
    id: 'dragons',
    title: 'HERE BE DRAGONS',
    categories: [Category.EXTENDED_REALITY],
    importance: Importance.TOP,
    year: '2020',
    sortYear: 2021,
    description: 'Immersive XR experience featuring interactive dragon encounters. With stunning visual, light and audio effects in extended reality environments.',
    imageUrl: '/images/projects/dragons.jpg',
    techStack: ['Unity', 'XR', 'VFX', 'C#', 'Spatial Vision','Kinect'],
    link: 'https://www.youtube.com/watch?v=FI9n-p677VA'
  },
  {
    id: 'bromeliad',
    title: 'BROMELIAD',
    categories: [Category.VIDEOGAMES],
    importance: Importance.NORMAL,
    year: '2020',
    sortYear: 2020,
    description: 'Published videogame on Steam. A unique gaming experience with innovative mechanics and immersive gameplay designed for players seeking challenge.',
    imageUrl: '/images/projects/bromelite.jpg',
    techStack: ['Unity', 'Steam', 'C#', 'Game Dev', 'Multiplayer'],
    link: 'https://store.steampowered.com/app/1366010/Bromeliad/'
  },
  {
    id: 'protest-simulator',
    title: 'PROTEST SIMULATOR',
    categories: [Category.SIMULATION],
    importance: Importance.CASUAL
    ,
    year: '2025',
    sortYear: 2025,
    description: 'Web application that transforms your daily steps into support for social causes. Walk for change and make every step count with gamified social impact.',
    imageUrl: '/images/projects/protest-simulator.jpg',
    techStack: ['Web App', 'Backend', 'Frontend', 'React', 'API', 'Node.js', 'Vite'],
    link: 'https://github.com/yeagob/manifiest2'
  },
];
