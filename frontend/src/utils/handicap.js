/**
 * Calculate a golf handicap based on the USGA formula
 * @param {Array} scores - Array of recent scores
 * @param {Array} courseRatings - Array of course ratings
 * @param {Array} slopeRatings - Array of slope ratings
 * @returns {number} - Calculated handicap index
 */
export const calculateHandicap = (scores, courseRatings, slopeRatings) => {
  if (!scores || !courseRatings || !slopeRatings || scores.length === 0) {
    return null;
  }

  // Calculate differentials
  const differentials = scores.map((score, index) => {
    const differential = ((score - courseRatings[index]) * 113) / slopeRatings[index];
    return differential;
  });

  // Sort differentials and take the lowest ones (up to 8)
  const sortedDifferentials = differentials.sort((a, b) => a - b);
  const lowestDifferentials = sortedDifferentials.slice(0, Math.min(8, sortedDifferentials.length));

  // Calculate average of lowest differentials
  const average = lowestDifferentials.reduce((sum, diff) => sum + diff, 0) / lowestDifferentials.length;

  // Apply USGA formula
  const handicapIndex = average * 0.96;

  // Round to nearest tenth
  return Math.round(handicapIndex * 10) / 10;
};

/**
 * Calculate course handicap
 * @param {number} handicapIndex - Player's handicap index
 * @param {number} slopeRating - Course slope rating
 * @returns {number} - Course handicap
 */
export const calculateCourseHandicap = (handicapIndex, slopeRating) => {
  return Math.round((handicapIndex * slopeRating) / 113);
};

/**
 * Calculate net score
 * @param {number} grossScore - Player's gross score
 * @param {number} courseHandicap - Player's course handicap
 * @returns {number} - Net score
 */
export const calculateNetScore = (grossScore, courseHandicap) => {
  return grossScore - courseHandicap;
}; 