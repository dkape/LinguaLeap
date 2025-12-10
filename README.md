# LinguaLeap - AI-Powered Reading App

**LinguaLeap** is an interactive language learning application that helps children learn to read in German and English. Teachers create AI-generated reading challenges from classic literature, while students solve them in a gamified environment with leaderboards and progress tracking.

## ✨ What Makes LinguaLeap Special

- 🤖 **AI-Generated Content** from public domain books (Project Gutenberg)
- 🏫 **Class Management** for teachers with student progress tracking
- 🎮 **Gamified Learning** with points, leaderboards, and achievements
- 🌍 **Bilingual Support** - Complete German and English interfaces
- 📊 **Reading Analytics** - Track speed, comprehension, and improvement
- � **Modern sInterface** - Beautiful, responsive design for all devices

## 🚀 Quick Start

### For Teachers
1. **Sign up** at `/de/signup/teacher` (German) or `/en/signup/teacher` (English)
2. **Create classes** and add students by email
3. **Generate challenges** using AI with your chosen topics and difficulty
4. **Monitor progress** through detailed analytics and leaderboards

### For Students  
1. **Sign up** at `/de/signup/student` 
2. **Join classes** (your teacher will add you)
3. **Complete challenges** - read passages and answer quizzes
4. **Earn points** and climb the leaderboard!

## 🛠️ Installation & Setup

### 🐳 Docker Development (Recommended)
```bash
git clone <repository-url>
cd LinguaLeap
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh
```

### 🏗️ Manual Setup
```bash
git clone <repository-url>
cd LinguaLeap
npm install && cd server && npm install && cd ..
```

**Detailed instructions:** → [Docker Setup Guide](docs/docker-setup.md) | [Quick Start Guide](docs/quick-start.md)

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [📖 User Guide](docs/user-guide.md) | Complete guide for teachers and students |
| [🐳 Docker Setup](docs/docker-setup.md) | Local development with Docker |
| [☸️ Kubernetes Deployment](docs/kubernetes-deployment.md) | Production deployment with Helm |
| [🚀 Quick Start](docs/quick-start.md) | Get up and running in 5 minutes |
| [⚙️ Development Setup](docs/development-setup.md) | Manual developer environment setup |
| [🏗️ Features Overview](docs/features-overview.md) | Complete feature list and technical details |
| [🔧 API Reference](docs/api-reference.md) | API endpoints and integration guide |
| [🧪 Testing Guide](docs/testing-guide.md) | Testing procedures and guidelines |
| [🏛️ Architecture Overview](docs/architecture-overview.md) | System architecture and design |

## 🎯 Key Features

### Teachers
- Create and manage student classes
- Generate AI-powered reading challenges
- Monitor student progress and reading speed
- View class leaderboards and analytics

### Students  
- Complete interactive reading challenges
- Earn points through reading and quizzes
- Track personal progress and improvements
- Compete on class leaderboards

### System
- Secure email verification
- German/English language switching
- Real-time progress tracking
- Mobile-responsive design

## 🏗️ Built With

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, ShadCN/UI
- **Backend:** Node.js, Express.js, MongoDB, JWT Authentication
- **Database:** MongoDB with Mongoose ODM
- **AI:** Google Gemini for content generation
- **Content:** Project Gutenberg public domain books
- **Deployment:** Docker, Kubernetes, Helm, ArgoCD, Traefik

## 🌍 Languages

- **🇩🇪 German** (Default) - Complete interface and content
- **🇬🇧 English** - Full translation and localization
- **Language Switching** - Seamless switching with user preferences

## 🧪 Testing

```bash
cd server && npm test
```

Tests cover user registration, challenge generation, progress tracking, and multi-language functionality.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Project Gutenberg](https://www.gutenberg.org/) for public domain literature
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI content generation
- [ShadCN/UI](https://ui.shadcn.com/) for beautiful React components

---

**Ready to start?** → [Quick Start Guide](docs/quick-start.md) | **Need help?** → [User Guide](docs/user-guide.md)

*Empowering children to leap into the world of reading! 🚀📚*
