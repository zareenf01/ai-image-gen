# Imagify - AI Image Generator

Imagify is your go-to solution for transforming text into stunning AI-generated images. Just type in your idea, and let the AI do the magic! Perfect for social media, creative projects, or just for fun. Give it a try and see what you can create!

## Features

- **AI-Powered Image Generation**: Convert text prompts into high-quality AI-generated images.
- **Download & Share**: Easily download or share your generated images with a single click.
- **Responsive Design**: Fully responsive design for seamless experience on all device sizes.
- **User-friendly Interface**: Simple and intuitive UI for an enhanced user experience.

## Built With

### Frontend
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Prisma](https://www.prisma.io/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) (FLUX.1 schnell) for image generation

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js
- npm (Node Package Manager)

### Cloning the Repository

To clone the repository, run:

```sh
git clone https://github.com/zareenf01/ai-image-gen.git
```
### Installing Dependencies
Backend:
```sh
cd server
npm install
```
Go to the .env_sample file and add your environment variables:
```sh
DATABASE_URL=YOUR_MONGODB_CONNECTION_STRING
CF_ACCOUNT_ID=YOUR_CLOUDFLARE_ACCOUNT_ID
CF_API_TOKEN=YOUR_CLOUDFLARE_WORKERS_AI_TOKEN
PORT=4000
```
Frontend:
```sh
cd frontend
npm install
```
Go to the .env_sample file and add your environment variables:
```sh
VITE_API_URL=YOUR_BACKEND_API
```
### Running the Application
Backend:
```sh
npm run dev
```
Frontend:
```sh
npm run dev
```
Now your development server is running on localhost
