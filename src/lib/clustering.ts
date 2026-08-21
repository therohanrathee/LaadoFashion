type Point = { lat: number; lng: number }

export type OrderPoint = Point & { id: string }

// Calculate Haversine distance between two points in km
function distance(p1: Point, p2: Point): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLon = (p2.lng - p1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export function kMeansClustering(orders: OrderPoint[], k: number, maxIterations = 100) {
  if (k <= 0) return [];
  if (orders.length === 0) return Array.from({ length: k }, () => []);
  if (k >= orders.length) {
    // If we have more runners than orders, just assign 1 order per runner
    return orders.map(o => [o]).concat(Array.from({ length: k - orders.length }, () => []));
  }

  // 1. Initialize K centroids randomly from the points
  let centroids: Point[] = [];
  const shuffled = [...orders].sort(() => 0.5 - Math.random());
  for (let i = 0; i < k; i++) {
    centroids.push({ lat: shuffled[i].lat, lng: shuffled[i].lng });
  }

  let clusters: OrderPoint[][] = [];
  let iterations = 0;
  let hasChanged = true;

  while (hasChanged && iterations < maxIterations) {
    clusters = Array.from({ length: k }, () => []);
    hasChanged = false;

    // 2. Assign points to the nearest centroid
    for (const order of orders) {
      let minDistance = Infinity;
      let closestCentroidIndex = 0;

      for (let i = 0; i < k; i++) {
        const d = distance(order, centroids[i]);
        if (d < minDistance) {
          minDistance = d;
          closestCentroidIndex = i;
        }
      }

      clusters[closestCentroidIndex].push(order);
    }

    // 3. Recalculate centroids
    for (let i = 0; i < k; i++) {
      if (clusters[i].length === 0) continue;

      const sumLat = clusters[i].reduce((sum, p) => sum + p.lat, 0);
      const sumLng = clusters[i].reduce((sum, p) => sum + p.lng, 0);
      
      const newLat = sumLat / clusters[i].length;
      const newLng = sumLng / clusters[i].length;

      // Check if centroid moved significantly
      if (distance(centroids[i], { lat: newLat, lng: newLng }) > 0.001) {
        hasChanged = true;
      }

      centroids[i] = { lat: newLat, lng: newLng };
    }

    iterations++;
  }

  return clusters;
}
