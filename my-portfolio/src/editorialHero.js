export const EDITORIAL_HERO_COPY = Object.freeze({
  availability: 'AVAILABLE FOR FREELANCE',
  quote: 'I design digital experiences that make complex ideas feel clear.',
  givenName: 'JOVAN',
  surname: 'CHANDRA',
  services: Object.freeze(['WEB DESIGN', 'E-COMMERCE', 'PRODUCT']),
});

export const getEditorialHeroMotion = (reducedMotion) => reducedMotion
  ? {
      letterDuration: 0,
      letterStagger: 0,
      metadataDuration: 0,
      enableScrollMotion: false,
    }
  : {
      letterDuration: 0.9,
      letterStagger: 0.055,
      metadataDuration: 0.75,
      enableScrollMotion: true,
    };
