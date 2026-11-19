export interface ShowcaseItem {
  src: string;
  prompt: string;
}

export const showcase: ShowcaseItem[] = [
  { src: "/showcase/38.jpg", prompt: "Sad cat sipping coffee" },
  { src: "/showcase/50.jpg", prompt: "Dragonfly in the new civilization at Andromeda galaxy" },
  { src: "/showcase/11.jpg", prompt: "Astronaut with ice cream" },
  { src: "/showcase/02.jpg", prompt: "A village with an aesthetic vibe" },
  { src: "/showcase/21.jpg", prompt: "Generate an AI world" },
  { src: "/showcase/83.jpg", prompt: "Dog with wings" },
  { src: "/showcase/69.jpg", prompt: "A beautiful rose" },
  { src: "/showcase/16.jpg", prompt: "Cat with green eyes" },
  { src: "/showcase/65.jpg", prompt: "Sky and sea with a sunset" },
  { src: "/showcase/30.jpg", prompt: "A tiger" },
  { src: "/showcase/47.jpg", prompt: "Cat flying in the sky" },
  { src: "/showcase/56.jpg", prompt: "A white tree" },
  { src: "/showcase/29.jpg", prompt: "A beautiful garden with pink flowers" },
  { src: "/showcase/63.jpg", prompt: "A sports car on a running highway" },
  { src: "/showcase/39.jpg", prompt: "A sunflower" },
  { src: "/showcase/40.jpg", prompt: "Ghibli-style cricket stadium in Dharamsala" },
];

export const examplePrompts = [
  "A lighthouse made of glass at the edge of the universe",
  "Sad cat sipping coffee on a rainy morning",
  "Tokyo alley at night, neon reflections, 35mm film",
  "A whale swimming through clouds at golden hour",
  "Isometric tiny greenhouse full of glowing plants",
  "Portrait of an old wizard reading on the moon",
  "Dragonfly in a new civilization in Andromeda",
  "A cozy cabin in a snowy forest, watercolor",
];

export const styleChips = [
  { label: "Cinematic", value: "cinematic lighting, dramatic, film still" },
  { label: "35mm film", value: "shot on 35mm film, grain, natural light" },
  { label: "Watercolor", value: "soft watercolor painting" },
  { label: "Studio Ghibli", value: "in the style of a Ghibli animation" },
  { label: "Isometric", value: "isometric 3D render, clean, soft shadows" },
  { label: "Neon noir", value: "neon noir, moody, rain reflections" },
  { label: "Minimal", value: "minimalist, pastel palette, lots of negative space" },
  { label: "Hyperreal", value: "hyperrealistic, 8k, highly detailed" },
];
