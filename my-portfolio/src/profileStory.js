export const PROFILE_STORY_COPY = Object.freeze({
  statementLines: Object.freeze([
    Object.freeze({ lead: 'As a ', accent: 'creative developer', tail: ', ' }),
    'I build thoughtful digital ',
    'experiences where design meets ',
    'practical technology.',
  ]),
  facts: Object.freeze([
    Object.freeze({ label: 'Based', value: 'Indonesia' }),
    Object.freeze({ label: 'Focus', value: 'Web, Product & Automation' }),
    Object.freeze({ label: 'Languages', value: 'English, Indonesian' }),
    Object.freeze({ label: 'Availability', value: 'Open for freelance' }),
  ]),
});

export const getProfileStoryMotion = (reducedMotion) => reducedMotion
  ? {
      enableScrollMotion: false,
      pinStage: false,
      textDuration: 0,
      textDelay: 0,
      lineStagger: 0,
      textTravel: 0,
      portraitTravel: 0,
      scrub: false,
      portraitScrub: false,
      portraitOpacity: 1,
    }
  : {
      enableScrollMotion: true,
      pinStage: false,
      textDuration: 0.72,
      textDelay: 0,
      lineStagger: 0.12,
      textTravel: 0,
      portraitTravel: -16,
      textStart: 'top 88%',
      textEnd: 'top -18%',
      textEase: 'power2.inOut',
      scrub: true,
      portraitScrub: true,
      portraitOpacity: 1,
    };
