import * as turf from '@turf/turf';

/**
 * Calculate the distance between two points on the golf course
 * @param {Array} point1 - [latitude, longitude]
 * @param {Array} point2 - [latitude, longitude]
 * @returns {number} - Distance in meters
 */
export const calculateDistance = (point1, point2) => {
  const from = turf.point([point1[1], point1[0]]);
  const to = turf.point([point2[1], point2[0]]);
  return turf.distance(from, to, { units: 'meters' });
};

/**
 * Calculate the bearing between two points
 * @param {Array} point1 - [latitude, longitude]
 * @param {Array} point2 - [latitude, longitude]
 * @returns {number} - Bearing in degrees
 */
export const calculateBearing = (point1, point2) => {
  const from = turf.point([point1[1], point1[0]]);
  const to = turf.point([point2[1], point2[0]]);
  return turf.bearing(from, to);
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
 * Format distance for display
 * @param {number} distance - Distance in meters
 * @returns {string} - Formatted distance
 */
export const formatDistance = (distance) => {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)}km`;
  }
  return `${Math.round(distance)}m`;
};

/**
 * Get the next hole number
 * @param {number} currentHole - Current hole number
 * @param {number} totalHoles - Total number of holes
 * @returns {number} - Next hole number
 */
export const getNextHole = (currentHole, totalHoles) => {
  return currentHole < totalHoles ? currentHole + 1 : 1;
};

/**
 * Validate course data structure
 * @param {Object} courseData - Course data object
 * @returns {boolean} - Whether the data is valid
 */
export const validateCourseData = (courseData) => {
  if (!courseData || !courseData.holes || !Array.isArray(courseData.holes)) {
    return false;
  }

  return courseData.holes.every(hole => {
    return (
      hole.number &&
      hole.par &&
      Array.isArray(hole.coordinates) &&
      hole.coordinates.length === 2 &&
      hole.coordinates.every(coord => 
        Array.isArray(coord) && 
        coord.length === 2 &&
        typeof coord[0] === 'number' &&
        typeof coord[1] === 'number'
      )
    );
  });
}; 