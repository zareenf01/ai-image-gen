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

export const surprisePrompts = [
  ...examplePrompts,
  "A floating island city with waterfalls pouring into the clouds, golden hour",
  "A tiny astronaut tending a bonsai tree on the surface of the moon",
  "A fox made of autumn leaves walking through a misty forest",
  "An underwater library with jellyfish lamps and drifting books",
  "A red vintage tram climbing a hill in Lisbon at sunset, 35mm film",
  "A giant koi fish swimming through the night sky above a quiet village",
  "A greenhouse café on a rainy evening, warm lights, cinematic",
  "A dragon curled around a lighthouse in a stormy sea",
  "A street food stall in Mumbai at night, steam and neon signs",
  "A polar bear in a cozy knitted sweater reading by a fireplace",
  "A desert oasis with a glass pyramid reflecting the stars",
  "A retro robot watering sunflowers in a backyard garden",
  "Northern lights over a frozen lake with a lone red cabin",
  "A cat astronaut floating inside a space station full of plants",
  "A medieval castle built inside a giant hollow tree",
  "Cherry blossom train station in Kyoto, soft morning light",
  "A miniature world inside a glass bottle on a wooden desk",
  "A whale-shaped airship drifting over snowy mountains",
  "A neon-lit ramen shop in the rain, viewed through a foggy window",
  "A hot air balloon festival over Cappadocia at sunrise",
  "An owl wearing tiny glasses in a candlelit study",
  "A futuristic city where buildings are covered in hanging gardens",
  "A sleepy dog curled up on a windowsill during a thunderstorm",
  "A crystal cave lit by glowing blue mushrooms",
  "A paper boat sailing through a flooded street of lanterns",
  "A samurai standing in a field of red spider lilies, wind blowing",
  "An old bookshop on a cobblestone street in Paris, autumn leaves",
  "A jellyfish made of stained glass floating in a cathedral",
  "A cozy treehouse in a rainforest with string lights at dusk",
  "A vintage Polaroid of a picnic on the rings of Saturn",
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
