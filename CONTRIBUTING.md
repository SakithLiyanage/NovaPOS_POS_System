# Contributing to NovaPOS

Thank you for your interest in contributing to NovaPOS! This document provides guidelines for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/novapos.git`
3. Create a branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Run tests: `npm test`
6. Commit: `git commit -m "Add your feature"`
7. Push: `git push origin feature/your-feature`
8. Open a Pull Request

## Development Setup

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Set up environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Seed database
cd backend && npm run seed

# Start development
npm run dev
```

## Code Style

- Use ESLint and Prettier
- Follow existing code patterns
- Write meaningful commit messages
- Add comments for complex logic

## Pull Request Guidelines

- Keep PRs focused and small
- Include tests for new features
- Update documentation as needed
- Ensure all tests pass
- Request review from maintainers

## Reporting Issues

- Use GitHub Issues
- Include steps to reproduce
- Provide environment details
- Include screenshots if applicable

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.
