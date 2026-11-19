import { useEffect, useState } from "react";

export function useTypewriter(words: string[], paused = false) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (paused) return;
    const word = words[index % words.length];
    let delay = deleting ? 22 : 45 + Math.random() * 40;
    if (!deleting && text === word) delay = 2200;
    if (deleting && text === "") delay = 300;

    const t = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, words, paused]);

  return { text, full: words[index % words.length] };
}
