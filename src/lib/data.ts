import type { Course, LeaderboardEntry, User } from '@/lib/types';
import { BookOpen, Rocket, Castle } from 'lucide-react';
import { PlaceHolderImages } from './placeholder-images';

const avatarUrl = PlaceHolderImages.find(p => p.id === 'user-avatar')?.imageUrl || 'https://picsum.photos/seed/user-avatar/100/100';

export const users: Record<string, User> = {
  'student-1': { id: 'student-1', name: 'Alex', email: 'alex@example.com', role: 'student', avatarUrl, points: 1250 },
  'student-2': { id: 'student-2', name: 'Ben', email: 'ben@example.com', role: 'student', avatarUrl, points: 1500 },
  'student-3': { id: 'student-3', name: 'Charlie', email: 'charlie@example.com', role: 'student', avatarUrl, points: 800 },
  'student-4': { id: 'student-4', name: 'David', email: 'david@example.com', role: 'student', avatarUrl, points: 1800 },
  'student-5': { id: 'student-5', name: 'Eva', email: 'eva@example.com', role: 'student', avatarUrl, points: 950 },
  'teacher-1': { id: 'teacher-1', name: 'Dr. Smith', email: 'smith@example.com', role: 'teacher', avatarUrl },
};

export const courses: Course[] = [
  {
    id: 'space-adventure',
    title: 'Space Adventure',
    description: 'Explore the galaxy and learn about planets, stars, and rockets!',
    icon: Rocket,
    levels: [
      {
        id: '1',
        title: 'The Solar System',
        content: `Our solar system is a vast and amazing place. It has one star, the Sun, and everything that travels around it. This includes eight planets and their moons, dwarf planets, and countless asteroids, comets, and other icy objects. The four planets closest to the Sun are called the inner planets. They are Mercury, Venus, Earth, and Mars. They are smaller and made mostly of rock and metal. Earth is our home, and it's the only planet we know of with liquid water and life. The outer planets are Jupiter, Saturn, Uranus, and Neptune. These are gas giants, much larger than the inner planets. Jupiter is the biggest planet in our solar system. It's so big that all the other planets could fit inside it! Saturn is famous for its beautiful rings, which are made of ice and rock.`,
        unlocked: true,
        quiz: [
          {
            question: 'How many planets are in our solar system?',
            options: ['7', '8', '9', '10'],
            answer: '8',
          },
          {
            question: 'Which planet is known for its rings?',
            options: ['Jupiter', 'Mars', 'Saturn', 'Earth'],
            answer: 'Saturn',
          },
        ],
      },
      {
        id: '2',
        title: 'Mission to Mars',
        content: 'The journey to the red planet is long. Astronauts must prepare for months. They train for zero gravity and learn to fix their spaceship. Mars is a cold, dusty planet. It has the largest volcano in the solar system, Olympus Mons. Rovers, like little robots on wheels, explore Mars for us. They take pictures and study the soil. One day, humans might walk on Mars themselves. It would be a great adventure for all of humanity.',
        unlocked: true,
        quiz: [
          {
            question: 'What is the name of the largest volcano on Mars?',
            options: ['Mount Everest', 'Olympus Mons', 'Mauna Kea', 'Red Peak'],
            answer: 'Olympus Mons',
          },
        ],
      },
      {
        id: '3',
        title: 'Black Holes',
        content: 'A black hole is a place in space where gravity pulls so much that even light cannot get out. The gravity is so strong because matter has been squeezed into a tiny space. This can happen when a star is dying. Because no light can get out, people can\'t see black holes. They are invisible. Space telescopes with special tools can help find black holes.',
        unlocked: false,
        quiz: [],
      },
    ],
  },
  {
    id: 'fairy-tales',
    title: 'Fairy Tale Kingdom',
    description: 'Journey through enchanted forests and magical castles.',
    icon: Castle,
    levels: [
      {
        id: '1',
        title: 'The Brave Knight',
        content: 'Once upon a time, in a kingdom far away, lived a brave knight named Arthur. He was known for his courage and his shiny armor. One day, a fearsome dragon attacked the kingdom. The dragon breathed fire and scared all the people. Arthur knew he had to protect his home. He rode his trusty horse, Valiant, to the dragon\'s lair in the dark mountains. The fight was long and hard, but Arthur was clever. He used his shield to reflect the dragon\'s fire back at it. The dragon was surprised and flew away, never to return. The kingdom was safe, and everyone hailed Arthur as a hero.',
        unlocked: true,
        quiz: [
          {
            question: 'What was the knight\'s name?',
            options: ['Lancelot', 'Galahad', 'Arthur', 'Valiant'],
            answer: 'Arthur',
          },
        ],
      },
      {
        id: '2',
        title: 'The Lost Princess',
        content: 'Princess Lily loved to explore the castle gardens. One sunny afternoon, she followed a beautiful butterfly deep into the woods and got lost. The woods grew dark, and Lily was scared. Suddenly, she saw a little light. It was a friendly firefly who offered to guide her. The firefly led her through the trees to a path she knew. Lily followed the path and found her way back to the castle just as the sun set. She was so grateful to the little firefly.',
        unlocked: false,
        quiz: [],
      },
    ],
  },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, student: users['student-4'], points: 1800 },
  { rank: 2, student: users['student-2'], points: 1500 },
  { rank: 3, student: users['student-1'], points: 1250 },
  { rank: 4, student: users['student-5'], points: 950 },
  { rank: 5, student: users['student-3'], points: 800 },
];
