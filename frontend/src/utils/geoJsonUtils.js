import * as turf from '@turf/turf';

/**
 * Convert course data to GeoJSON format
 * @param {Object} courseData - Course data object
 * @returns {Object} GeoJSON object
 */
export const courseToGeoJSON = (courseData) => {
  const features = [];

  // Add holes
  courseData.holes.forEach(hole => {
    // Add tee to hole line
    features.push({
      type: 'Feature',
      properties: {
        type: 'hole',
        number: hole.number,
        par: hole.par
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [hole.coordinates[0][1], hole.coordinates[0][0]], // Tee
          [hole.coordinates[1][1], hole.coordinates[1][0]]  // Hole
        ]
      }
    });

    // Add hazards
    hole.hazards?.forEach(hazard => {
      features.push({
        type: 'Feature',
        properties: {
          type: 'hazard',
          hazardType: hazard.type
        },
        geometry: {
          type: 'Point',
          coordinates: [hazard.coords[1], hazard.coords[0]]
        }
      });
    });
  });

  return {
    type: 'FeatureCollection',
    features
  };
};

/**
 * Calculate distance between two points
 * @param {Array} point1 - [latitude, longitude]
 * @param {Array} point2 - [latitude, longitude]
 * @returns {number} Distance in meters
 */
export const calculateDistance = (point1, point2) => {
  const from = turf.point([point1[1], point1[0]]);
  const to = turf.point([point2[1], point2[0]]);
  return turf.distance(from, to, { units: 'meters' });
};

/**
 * Check if a point is within a hazard area
 * @param {Array} point - [latitude, longitude]
 * @param {Array} hazardCoords - [latitude, longitude]
 * @param {number} radius - Radius in meters
 * @returns {boolean}
 */
export const isPointInHazard = (point, hazardCoords, radius = 10) => {
  const from = turf.point([point[1], point[0]]);
  const to = turf.point([hazardCoords[1], hazardCoords[0]]);
  const distance = turf.distance(from, to, { units: 'meters' });
  return distance <= radius;
};

/**
 * Get the nearest hazard to a point
 * @param {Array} point - [latitude, longitude]
 * @param {Array} hazards - Array of hazard coordinates
 * @returns {Object} Nearest hazard info
 */
export const getNearestHazard = (point, hazards) => {
  if (!hazards || hazards.length === 0) return null;

  let nearest = null;
  let minDistance = Infinity;

  hazards.forEach(hazard => {
    const distance = calculateDistance(point, hazard.coords);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...hazard, distance };
    }
  });

  return nearest;
};

/**
 * Calculate the bearing between two points
 * @param {Array} point1 - [latitude, longitude]
 * @param {Array} point2 - [latitude, longitude]
 * @returns {number} Bearing in degrees
 */
export const calculateBearing = (point1, point2) => {
  const from = turf.point([point1[1], point1[0]]);
  const to = turf.point([point2[1], point2[0]]);
  return turf.bearing(from, to);
}; 