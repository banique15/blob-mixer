vec3 displacedPosition = position + normalize(normal) * f(position);
vec3 displacedNormal = normalize(normal);

// Generate new normals
if (fixNormals == 1.0) {
    float offset = .5 / 512.;
    vec3 tangent = orthogonal(normal);
    vec3 bitangent = normalize(cross(normal, tangent));
    vec3 neighbour1 = position + tangent * offset;
    vec3 neighbour2 = position + bitangent * offset;
    vec3 displacedNeighbour1 = neighbour1 + normal * f(neighbour1);
    vec3 displacedNeighbour2 = neighbour2 + normal * f(neighbour2);

    vec3 displacedTangent = displacedNeighbour1 - displacedPosition;
    vec3 displacedBitangent = displacedNeighbour2 - displacedPosition;

    displacedNormal = normalize(cross(displacedTangent, displacedBitangent));
}