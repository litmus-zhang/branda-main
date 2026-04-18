export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  registered: number;
  status: 'upcoming' | 'ongoing' | 'past';
  details: string;
  organizer: string;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Web Development Workshop',
    description: 'Learn modern web development with React and Next.js',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    date: '2026-02-28',
    time: '10:00 AM',
    location: 'Tech Hub, San Francisco',
    category: 'Workshop',
    capacity: 50,
    registered: 42,
    status: 'upcoming',
    details: 'Join us for an intensive 2-day workshop on modern web development. Learn React, Next.js, TypeScript, and best practices for building scalable web applications. Perfect for developers of all levels.',
    organizer: 'Tech Academy'
  },
  {
    id: '2',
    title: 'AI & Machine Learning Summit',
    description: 'Explore the future of AI and machine learning technologies',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=500&h=300&fit=crop',
    date: '2026-03-15',
    time: '9:00 AM',
    location: 'Convention Center, NYC',
    category: 'Conference',
    capacity: 200,
    registered: 178,
    status: 'upcoming',
    details: 'A comprehensive summit featuring industry experts discussing cutting-edge AI applications, neural networks, and machine learning deployment strategies. Includes hands-on sessions and networking opportunities.',
    organizer: 'AI Innovations Inc'
  },
  {
    id: '3',
    title: 'Startup Pitch Competition',
    description: 'Pitch your startup idea and win funding',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    date: '2026-02-20',
    time: '6:00 PM',
    location: 'Innovation Hub, Boston',
    category: 'Competition',
    capacity: 30,
    registered: 28,
    status: 'upcoming',
    details: 'Showcase your startup idea to venture capitalists and investors. Winners get up to $50,000 in funding. Open to founders and entrepreneurs of all experience levels.',
    organizer: 'Startup Connect'
  },
  {
    id: '4',
    title: 'Digital Marketing Masterclass',
    description: 'Master modern digital marketing strategies',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    date: '2026-02-10',
    time: '2:00 PM',
    location: 'Online',
    category: 'Webinar',
    capacity: 500,
    registered: 342,
    status: 'ongoing',
    details: 'Learn SEO, social media marketing, content strategy, and analytics from industry experts. This ongoing series covers everything you need to build a successful digital presence.',
    organizer: 'Marketing Pro'
  },
  {
    id: '5',
    title: 'Cloud Computing Essentials',
    description: 'Understanding cloud architecture and deployment',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=300&fit=crop',
    date: '2026-02-05',
    time: '11:00 AM',
    location: 'Tech Park, Seattle',
    category: 'Workshop',
    capacity: 60,
    registered: 58,
    status: 'ongoing',
    details: 'Dive deep into AWS, Azure, and Google Cloud platforms. Learn about infrastructure, databases, security, and best practices for deploying applications at scale.',
    organizer: 'Cloud Masters'
  },
  {
    id: '6',
    title: 'UX/UI Design Conference',
    description: 'Design trends and best practices from industry leaders',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    date: '2026-01-30',
    time: '9:00 AM',
    location: 'Design Center, Los Angeles',
    category: 'Conference',
    capacity: 150,
    registered: 150,
    status: 'past',
    details: 'A comprehensive conference exploring modern design principles, accessibility, user research, and emerging design tools. Featured talks from award-winning designers.',
    organizer: 'Design Alliance'
  },
  {
    id: '7',
    title: 'Cybersecurity Workshop',
    description: 'Protect your applications from threats',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop',
    date: '2026-01-20',
    time: '10:00 AM',
    location: 'Security Institute, Chicago',
    category: 'Workshop',
    capacity: 40,
    registered: 40,
    status: 'past',
    details: 'Learn essential security practices including encryption, authentication, vulnerability assessment, and incident response. Hands-on labs with real-world scenarios.',
    organizer: 'Security Experts'
  },
  {
    id: '8',
    title: 'DevOps Best Practices',
    description: 'CI/CD pipelines and infrastructure automation',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    date: '2026-01-15',
    time: '1:00 PM',
    location: 'Tech Campus, Austin',
    category: 'Training',
    capacity: 80,
    registered: 80,
    status: 'past',
    details: 'Master continuous integration, continuous deployment, containerization, and orchestration tools. Build scalable and reliable deployment pipelines.',
    organizer: 'DevOps Academy'
  }
];
