import * as turf from '@turf/turf';

/**
 * Calculate the distance between two points on the golf course
 * @param {Object} point1 - {latitude, longitude}
 * @param {Object} point2 - {latitude, longitude}
 * @returns {number} - Distance in meters
 */
export const calculateDistance = (point1, point2) => {
  const from = turf.point([point1.longitude, point1.latitude]);
  const to = turf.point([point2.longitude, point2.latitude]);
  return turf.distance(from, to, { units: 'meters' });
};

/**
 * Calculate the bearing between two points
 * @param {Object} point1 - {latitude, longitude}
 * @param {Object} point2 - {latitude, longitude}
 * @returns {number} - Bearing in degrees
 */
export const calculateBearing = (point1, point2) => {
  const from = turf.point([point1.longitude, point1.latitude]);
  const to = turf.point([point2.longitude, point2.latitude]);
  return turf.bearing(from, to);
};

/**
 * Check if a point is within a hazard area
 * @param {Object} point - {latitude, longitude}
 * @param {Array} hazardCoords - [latitude, longitude]
 * @param {number} radius - Radius in meters
 * @returns {boolean}
 */
export const isPointInHazard = (point, hazardCoords, radius = 10) => {
  const from = turf.point([point.longitude, point.latitude]);
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
  if (distance === null) return 'N/A';
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  }
  return `${(distance / 1000).toFixed(1)}km`;
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
      hole.coordinates &&
      Array.isArray(hole.coordinates) &&
      hole.coordinates.length >= 2 &&
      hole.coordinates[0].length === 2 &&
      hole.coordinates[1].length === 2
    );
  });
};

/**
 * Get current hole data
 * @param {Object} courseData - Course data object
 * @param {number} holeNumber - Hole number
 * @returns {Object} - Hole data
 */
export const getCurrentHoleData = (courseData, holeNumber) => {
  if (!validateCourseData(courseData)) return null;
  return courseData.holes.find(hole => hole.number === holeNumber);
};

/**
 * Calculate distance to next hazard
 * @param {Object} playerLocation - Player location {latitude, longitude}
 * @param {Array} hazardLocation - Hazard location [latitude, longitude]
 * @returns {number} - Distance in meters
 */
export const calculateDistanceToHazard = (playerLocation, hazardLocation) => {
  if (!playerLocation || !hazardLocation) return null;
  return calculateDistance(playerLocation, {
    latitude: hazardLocation[0],
    longitude: hazardLocation[1]
  });
}; 