export const testCourseData = {
  name: "Test Golf Course",
  holes: [
    {
      number: 1,
      par: 4,
      coordinates: [
        [36.5713, -121.9505], // Tee
        [36.5720, -121.9510]  // Hole
      ],
      hazards: [
        {
          type: "bunker",
          coords: [36.5715, -121.9507]
        },
        {
          type: "water",
          coords: [36.5718, -121.9509]
        }
      ]
    },
    {
      number: 2,
      par: 3,
      coordinates: [
        [36.5725, -121.9515], // Tee
        [36.5730, -121.9520]  // Hole
      ],
      hazards: [
        {
          type: "bunker",
          coords: [36.5728, -121.9518]
        }
      ]
    },
    {
      number: 3,
      par: 5,
      coordinates: [
        [36.5735, -121.9525], // Tee
        [36.5740, -121.9530]  // Hole
      ],
      hazards: [
        {
          type: "water",
          coords: [36.5737, -121.9527]
        },
        {
          type: "bunker",
          coords: [36.5739, -121.9529]
        }
      ]
    }
  ]
}; 