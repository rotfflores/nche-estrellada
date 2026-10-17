// English companion to config.js. Event details, images and RSVP storage stay shared.
(() => {
  const config = JSON.parse(JSON.stringify(window.INVITATION_CONFIG));
  const stages = [
    { alt:"Victoria as a child in a plaid dress against a red and black backdrop", stage:"Stage 1", title:"The soccer-loving kid", phrase:"I loved playing soccer, and I always ended up with scraped knees!" },
    { alt:"Childhood family birthday photograph with three children, an adult and a cake", stage:"Stage 2", title:"Family birthdays", phrase:"My parents always spoiled me. My best gift? A Super Nintendo." },
    { note:"And so the years and all those stages went by… until 2022" },
    { alt:"Victoria with her arms open beside a mountain lake", stage:"Stage 3", title:"Mountain climber", phrase:"After so many romantic disappointments, all that's left is to climb Everest. Just kidding!" },
    { alt:"Victoria smiling as she runs in a street race", stage:"Stage 4", title:"My running era", phrase:"One of the loveliest chapters of my life. I hope my knees let me keep running." },
    { alt:"Victoria in a black dress, seated against a green wall", stage:"Stage 5", title:"My feminine side", phrase:"A side I'd like to embrace again, little by little. I promise myself I will." },
    { alt:"Victoria outdoors, holding a microphone", stage:"Stage 6", title:"Letting go to find myself again", phrase:"I left a profession and some relationships behind to reconnect with myself. Today, I'm grateful I did." },
  ];
  const albumAlts = [
    "Three women in a garden beside a waterfall",
    "Two men and a woman smiling in front of balloons",
    "Three women smiling at a gathering",
    "Three women at a collectibles shop",
    "Three people in front of a collectibles display",
    "Three people smiling outdoors among the trees",
    "Two women smiling together at a table",
    "Two women smiling on an outdoor walk",
    "Two women smiling together at night",
    "Victoria with Leo and Ángel on a hike through a green ravine",
  ];
  const groupAlts = [
    "Friends posing together at a bowling alley",
    "Three friends in party hats sitting together on a couch",
    "Two friends posing together at a gathering",
    "Two friends posing with actors in white coats",
    "Two friends taking a selfie at sunset beside a Greek flag",
    "Two friends taking a selfie under purple lights",
    "Two friends in matching shirts at a park",
    "Six friends gathered around a restaurant table",
    "Two friends posing with horror characters on a train",
    "Two friends making peace signs in front of a stage",
    "Three smiling friends taking a selfie",
    "Four friends smiling together on an outing",
    "Portrait of Victoria in a red dress against a gray background",
    "One friend doing another's makeup outdoors",
  ];
  const groupCaptions = {
    "assets/grupales/grupo-3.jpg":"Among all the reasons to celebrate are the people who make my days brighter.",
    "assets/grupales/grupo-4.jpg":"Today I raise a glass to life, the paths we've shared and the joy of crossing paths.",
    "assets/grupales/grupo-1.jpg":"Birthdays are also a chance to look back and smile at all the people who made the journey beautiful.",
    "assets/grupales/grupo-12.jpg":"I celebrate life, its surprises and the chance encounters that quietly become so important.",
    "assets/grupales/grupo-2.jpg":"One of life's loveliest gifts is meeting people who leave a mark on your heart.",
  };

  config.locale = "en";
  config.date = "November 7";
  config.time = "4:30 p.m.";
  config.countdownDone = "Today's the day!";
  config.letter = {
    quote:"I don't have favorite places, I have favorite people",
    quoteHighlight:"favorite people",
    title:"My favorite place is with you",
    message:[
      "This birthday, I want to be close to the people who make my days brighter.",
      "Sharing a meal, laughing, singing and making another memory together is my favorite way to celebrate.",
      "I'd love for you to be there.",
    ],
  };
  config.evolution.title = "Every version of me";
  config.evolution.highlight = "version";
  config.evolution.intro = "I've changed, learned and discovered new ways to be myself. Today I celebrate everything I've lived through and the person I'm becoming.";
  config.evolution.photos = config.evolution.photos.map((photo, index) => ({ ...photo, ...stages[index] }));
  config.album.title = "My favorite memories are shared";
  config.album.highlight = "shared";
  config.album.photos = config.album.photos.map((photo, index) => ({ ...photo, alt:albumAlts[index] || photo.alt }));
  config.groupGallery.title = "Paths we've shared";
  config.groupGallery.photos = config.groupGallery.photos.map((photo, index) => ({ ...photo, alt:groupAlts[index] || photo.alt, ...(groupCaptions[photo.src] ? { caption:groupCaptions[photo.src] } : {}) }));
  Object.assign(config.venue, {
    eyebrow:"Where shall we meet?",
    title:"Let's eat something delicious and different!",
    highlight:"different",
    description:"Doña Vero: Mexican tradition with an extravagant twist.",
    flavors:"A journey of flavors from pre-Hispanic cuisine to the unexpected, with tlayudas, vegan options and unusual quesadillas.",
    flavorsStrong:"tlayudas, vegan options and unusual quesadillas",
    highlights:[
      { icon:"trofeo", text:"Six-time winner of Mexico City's most exotic quesadilla!", strong:"Six-time winner" },
      { icon:"corazon", text:"Heart-shaped tacos and tortillas." },
      { icon:"flor", text:"Seasonal marigold pulque, among other flavors…" },
    ],
    timeLabel:"Meet-up time",
    note:"A private space for our celebration.",
    thanks:"Thank you, Camilo, for giving us a space to celebrate.",
    foodCaption:"A taste of Doña Vero's flavors",
  });
  config.venue.photos.space.alt = "Doña Vero's colorful table with a yellow plate, tamales, sauces and fruit";
  config.venue.photos.tacos.alt = "Grilled meat, cactus, onion and avocado in green heart-shaped tortillas";
  config.venue.photos.kitchen.alt = "Orange drink in a glass mug decorated with a marigold, beside pan de muerto";
  config.karaoke = {
    eyebrow:"Singing at the top of our lungs is encouraged",
    title:"The microphone is waiting for us!",
    highlight:"microphone",
    description:"There'll be karaoke, games and surprises! Most of all, lots of love and the joy of being together.",
    cue:"Start thinking about your song!",
  };
  config.rsvp = {
    title:"Please RSVP!",
    text:"I'd love to celebrate with you. Let me know if you can make it so I can plan our gathering.",
    answerLabel:"Your reply",
    yesLabel:"Yes, I'll be there",
    noLabel:"I can't make it this time",
    nameLabel:"Your name",
    messageLabel:"Leave me a message",
    optionalLabel:"Optional",
    button:"Send reply",
    nameError:"Please enter your name so I know who's replying.",
    answerError:"Please choose whether you can make it.",
    thanksYesTitle:"Thank you, {nombre}!",
    thanksYesText:"I'm so happy you'll be there. See you on {fecha} at {hora} at {lugar}.",
    thanksNoTitle:"Thanks for letting me know",
    thanksNoText:"Thank you for thinking of me. I'll miss you that day.",
    editLabel:"Change my reply",
  };
  config.closing = {
    title:"How lovely that our paths crossed",
    highlight:"crossed",
    message:[
      "Thank you for making time to be with me on such a special day. You mean so much to me, and I'm so happy our paths crossed.",
      "I love you all so much.",
    ],
    farewell:"With love,",
    signature:config.name,
    backLabel:"Back to the beginning",
    footerThanks:"Thank you for being one of my favorite people.",
  };

  // The English page is in /en/, while the shared photographs and audio stay in /assets/.
  const localAsset = value => typeof value === "string" && value.startsWith("assets/") ? `../${value}` : value;
  const prefixAssets = value => {
    if (Array.isArray(value)) return value.map(prefixAssets);
    if (value && typeof value === "object") {
      for (const key of Object.keys(value)) value[key] = prefixAssets(value[key]);
      return value;
    }
    return localAsset(value);
  };
  window.INVITATION_CONFIG = Object.freeze(prefixAssets(config));
})();
