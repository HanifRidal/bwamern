const { getAllDestinations } = require("../Model/CbfModel");

function calculateSimilarity(userPreferences, spot) {
  // 1 if type matches, 0 otherwise
  const typeMatch = userPreferences.type.includes(spot.type) ? 1 : 0;
  // Normalize popularity to 0-1
  const normalizedPopularity = (spot.Popularity || 0) / 5;

  // Weights: type is more important, popularity is secondary
  const score = typeMatch * 0.7 + normalizedPopularity * 0.3;
  return score;
}

async function recommendSpots(userPreferences) {
  const destinations = await getAllDestinations();

  // Calculate similarity for each spot
  const recommendations = destinations.map((spot) => {
    const similarity = calculateSimilarity(userPreferences, spot);
    return { ...spot, similarity };
  });

  // Sort by similarity, highest first
  recommendations.sort((a, b) => b.similarity - a.similarity);

  // Return top 5
  return recommendations.slice(0, 5);
}

module.exports = { recommendSpots };