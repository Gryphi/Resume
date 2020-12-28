precision mediump float;

#define INF 1.0e+12
#define EPS 1.0e-3 // Reflect/shadow/transmission ray offset
#define MAX_RECURSION 2 // Maximum depth for rays
#define MAX_LIGHTS 10
#define MAX_MATERIALS 10
#define M_PI 3.1415926535897932384626433832795

/*******************************************
                DATA TYPES
********************************************/
struct Material {
  vec3 kd;
  vec3 ks;
  vec3 ka;
  vec3 kt;
  float shininess;
  float refraction;
  int special;
};

struct Light {
    vec3 pos;
    vec3 color;
    vec3 atten;
    vec3 towards;
    float angle;
};

struct Ray {
  vec3 p0;
  vec3 v;
};

struct Intersection {
  vec3 p; // Point of intersection
  vec3 n; // Normal of intersection
  int mIdx; // Index into materials array
  float sCoeff; // Coefficient for checkerboard or special material
};


/*******************************************
                UNIFORMS
********************************************/
// Uniforms set from Javascript that are constant
// over all fragments
uniform int numLights;
uniform Light lights[MAX_LIGHTS];
uniform int numMaterials;
uniform Material materials[MAX_MATERIALS];
uniform int showLights;
uniform float beaconRadius;

// Ray tracer special options
uniform int orthographic;

// Camera parameters
uniform vec3 cameraPos;
uniform vec3 right;
uniform vec3 up;
uniform float fovx;
uniform float fovy;


/*******************************************
           RAY CASTING FUNCTIONS
********************************************/

// TODO: Put helper functions here if you'd like

/** TODO: PUT YOUR CODE HERE **/


/**
* Given a point on a plane and a normal, intersect a ray
* with the plane they determine
*
* @param {Ray} ray : The ray in world coordinates
* @param {vec3} n : The plane normal
* @param {vec3} p : A point on the plane
* @param {int} mIdx : Array index of material that the plane is made of
* @param {Intersection (out)} intersect : The intersection
*
* @returns {float} t : Parameter t so that point of intersection is ray.p0 + t*ray.v
*/
float rayIntersectPlane(Ray ray, vec3 n, vec3 p, int mIdx, out Intersection intersect) {
    float denom = dot(ray.v, n);
    float t = INF;
    if (abs(denom) > 0.0) {
        // The ray is not parallel to the plane
        float num = dot(p - ray.p0, n);
        t = num / denom;
        if (t > 0.0) {
            // Plane is in front of ray
            intersect.p = ray.p0 + t*ray.v;
            intersect.n = n;
            intersect.mIdx = mIdx;
        }
        else {
            t = INF;
        }
    }
    return t;
}

float getTriangleArea(vec3 a, vec3 b, vec3 c){
    return (length(cross((a-b),(a-c)))/2.0);
}


vec3 getBarycentricCoords(vec3 a, vec3 b, vec3 c, vec3 p){
    vec3 coords;

    if (getTriangleArea(a,b,c) == 0.0){
        coords.x = 0.0;
        coords.y = 0.0;
        if (p == a){
            coords.z = 1.0;
        }else{
            coords.z = 0.0;
        }
    }else{
        float alpha = (getTriangleArea(p,c,b) / getTriangleArea(a,b,c));
		float beta = (getTriangleArea(p,c,a) / getTriangleArea(a,b,c));
		float gamma = (getTriangleArea(p,a, b) / getTriangleArea(a,b,c));

        float sum = alpha + beta + gamma;
        float e = .00001;

        if (1.0 + e > sum && 1.0 - e < sum){
			coords.x = alpha;
			coords.y = beta;
			coords.z = gamma;
		}else{
			coords.x = 0.0;
			coords.y = 0.0;
			coords.z = 0.0;
		} 
        return coords;
    }
}

/**
* Intersect a ray with a given triangle /\abc, assuming a, b, and c
* have been specified in CCW order with respect to the triangle normal
*
* @param {Ray} ray : The ray in world coordinates
* @param {vec3} a : Point a on the triangle
* @param {vec3} b : Point b on the triangle
* @param {vec3} c: Point c on the triangle
* @param {int} mIdx : Array index of material that the triangle is made of
* @param {mat4} MInv: Inverse of the transformation M that's applied to the triangle before ray intersection
* @param {mat3} N: The normal transformation associated to M
* @param {Intersection (out)} intersect : The intersection
*
* @returns {float} t : Parameter t so that point of intersection is ray.p0 + t*ray.v
*/
float rayIntersectTriangle(Ray ray, vec3 a, vec3 b, vec3 c,
                            int mIdx, mat4 MInv, mat3 N,
                            out Intersection intersect) {
    vec3 tRayp0 = (MInv*vec4(ray.p0,1.0)).xyz;
    vec3 tRayv = (MInv*vec4(ray.v,0.0)).xyz;
    float t = INF;
    vec3 n = normalize(cross((b-a),(c-a)));
    if (dot(ray.v,n) != 0.0){
        vec3 l = a - tRayp0;
        t = dot(l,n)/dot(tRayv,n);

        if (t >= 0.0){
            intersect.p = ray.p0 + t*ray.v;
            intersect.n = normalize(N*n);
            intersect.mIdx = mIdx;
            vec3 coords = getBarycentricCoords(a,b,c,intersect.p);
            if(coords.x == 0.0 && coords.y == 0.0 && coords.z == 0.0){
                t = INF;
                intersect.p = vec3(0.0,0.0,0.0);
                intersect.n = vec3(0.0,0.0,0.0);
            }
        }else{
            t = INF;
        }
    }
    return t;
}


/**
* Intersect a ray with a given sphere
*
* @param {Ray} ray : The ray in world coordinates
* @param {vec3} c : Center of the sphere
* @param {float} r : Radius of the sphere
* @param {int} mIdx : Array index of material that the sphere is made of
* @param {mat4} MInv: Inverse of the transformation M that's applied to the sphere before ray intersection
* @param {mat3} N: The normal transformation associated to M
* @param {Intersection (out)} intersect : The intersection
*
* @returns {float} t : Parameter t so that point of intersection is ray.p0 + t*ray.v
*/
float rayIntersectSphere(Ray ray, vec3 c, float r,
                            int mIdx, mat4 MInv, mat3 N,
                            out Intersection intersect) {
    intersect.mIdx = mIdx; // Store away the material index
    intersect.sCoeff = 1.0; // TODO: Change this for special material extra task
    intersect.p = vec3(0.0,0.0,0.0);
    intersect.n = vec3(0.0,0.0,0.0);
    vec3 tRayp0 = (MInv*vec4(ray.p0,1.0)).xyz;
    vec3 tRayv = (MInv*vec4(ray.v,0.0)).xyz;

    float t = INF;

    float i = 20.0; // for changing dimension of checkerboard (higher number, more checkers)

    float A = dot(tRayv,tRayv);
    vec3 w = (tRayp0 - c);

    float B = 2.0*dot(w,tRayv);

    float C = (dot(w,w) - (r*r));

    float discriminant = ((B*B) - (4.0*A*C));
    
    if (discriminant < 0.0) return INF;

    float t1 = (-B + (sqrt(discriminant)))/(2.0*A);
    float t2 = (-B - (sqrt(discriminant)))/(2.0*A);

    if (t2 < 0.0) return INF;

    if (t1 >= 0.0|| discriminant == 0.0){
        intersect.p = ray.p0 + t1*ray.v;
        vec3 n = (tRayp0 + t1*tRayv - c);
        intersect.n = normalize(N*n);
        float f = cos((i*acos(intersect.n.z)))*cos((i*atan(intersect.n.y,intersect.n.x)));
        if (f > 0.0) f = 1.0;
        else f = 0.0;
        intersect.sCoeff = f;
        return t1;
    }else{
        intersect.p = ray.p0 + t2*ray.v;
        vec3 n = (tRayp0 + t2*tRayv - c);
        intersect.n = normalize(N*n);
        float f = cos((i*acos(intersect.n.z)))*cos((i*atan(intersect.n.y,intersect.n.x)));
        if (f > 0.0) f = 1.0;
        else f = 0.0;
        intersect.sCoeff = f;
        return t2;
    }

    return INF;
    

    /*
    //if d = 0 double root, only one intersection
    //if d < 0 t = inf
    //else t1 t2
        float discriminant = ((B*B) - (4.0*A*C));
        if (discriminant == 0.0) {
            t = (-B - (sqrt(discriminant)/(2.0*A)));
            intersect.p = ray.p0 + t*ray.v;
            vec3 n = (tRayp0 + t*tRayv - c);
            intersect.n = normalize(n*N);
        } else if (discriminant > 0.0){
            float t1 = (-B - (sqrt(discriminant)/(2.0*A)));
            float t2 = (-B + (sqrt(discriminant)/(2.0*A)));
            if (t1 >= 0.0 && t2 >= 0.0){
                if (t1 < t2) t = t1;
                else t = t2;
                intersect.p = ray.p0 + t*ray.v;
                vec3 n = (tRayp0 + t*tRayv - c);
                intersect.n = normalize(n*N);

            }else if (t1 < 0.0 && t2 >= 0.0){
                t = t2;
                intersect.p = ray.p0 + t*ray.v;
                vec3 n = (tRayp0 + t*tRayv - c);
                intersect.n = normalize(n*N);

            }else if (t1 >= 0.0 && t2 < 0.0){
                t = t1;
                intersect.p = ray.p0 + t*ray.v;
                vec3 n = (tRayp0 + t*tRayv - c);
                intersect.n = normalize(n*N);

            }else{
                t = INF;
                intersect.p = vec3(0.0,0.0,0.0);
                intersect.n = vec3(0.0,0.0,0.0);
            }
        } else {
            t = INF;
            intersect.p = vec3(0.0,0.0,0.0);
            intersect.n = vec3(0.0,0.0,0.0);
        }

    return t;
    */
}


/**
* Intersect a ray with a (possibly transformed) box, whose extent
* in untransformed space is [center[0]-width/2, center[0]+width/2],
*                           [center[1]-height/2, center[1]+height/2],
*                           [center[2]-length/2, center[2]+length/2]
*
* @param {Ray} ray : The ray in world coordinates
* @param {float} W : Extent of the box along the x dimension
* @param {float} H : Extent of the box along the y dimension
* @param {float} L : Extent of the box along the z dimension
* @param {vec3} c : Center of the box
* @param {int} mIdx : Array index of material that the box is made of
* @param {mat4} MInv: Inverse of the transformation M that's applied to the box before ray intersection
* @param {mat3} N: The normal transformation associated to M
* @param {Intersection (out)} intersect : The intersection
*
* @returns {float} t : Parameter t so that point of intersection is ray.p0 + t*ray.v
*/
float rayIntersectBox(Ray ray, float W, float H, float L,
                        vec3 c, int mIdx, mat4 MInv, mat3 N,
                        out Intersection intersect) {
    intersect.mIdx = mIdx; // Store away the material index

    float t = INF;
    vec3 n;
    ray.p0 = (MInv*vec4(ray.p0,1.0)).xyz;
    ray.v = (MInv*vec4(ray.v,0.0)).xyz;
    //front
    vec3 n1 = normalize(vec3(0,0,1));
    vec3 a1 = vec3(c.x,c.y,c.z+L/2.0);
    float t1 = dot((a1 - ray.p0),n1)/dot(ray.v,n1);
    intersect.p = ray.p0 + t1*ray.v;
    intersect.n = n1;
    intersect.sCoeff = 1.0; // TODO: Change this for special material extra task
    if (((c.x-W/2.0) <= intersect.p.x && intersect.p.x <= (c.x+W/2.0))&&((c.y-H/2.0) <= intersect.p.y && intersect.p.y <= (c.y+H/2.0))){
        if(t1 < t){
            t = t1; 
            n = n1;
        }
    }
    //back
    vec3 n2 = normalize(vec3(0,0,-1));
    vec3 a2 = vec3(c.x,c.y,c.z-L/2.0);
    float t2 = dot((a2 - ray.p0),n2)/dot(ray.v,n2);
    intersect.p = ray.p0 + t2*ray.v;
    intersect.n = n2;
    intersect.sCoeff = 1.0; // TODO: Change this for special material extra task
    if (((c.x-W/2.0) <= intersect.p.x && intersect.p.x <= (c.x+W/2.0))&&((c.y-H/2.0) <= intersect.p.y && intersect.p.y <= (c.y+H/2.0))){
        if(t2 < t){
            t = t2; 
            n = n2;
        }
    }
    //rside
    vec3 n3 = normalize(vec3(1,0,0));
    vec3 a3 = vec3(c.x+W/2.0,c.y,c.z);
    float t3 = dot((a3 - ray.p0),n3)/dot(ray.v,n3);
    intersect.p = ray.p0 + t3*ray.v;
    intersect.n = n3;
    intersect.sCoeff = 1.0; // TODO: Change this for special material extra task
    if (((c.z-L/2.0) <= intersect.p.z && intersect.p.z <= (c.z+L/2.0))&&((c.y-H/2.0) <= intersect.p.y && intersect.p.y <= (c.y+H/2.0))){
        if(t3 < t){
            t = t3; 
            n = n3;
        }
    }
    //lside
    vec3 n4 = normalize(vec3(-1,0,0));
    vec3 a4 = vec3(c.x-W/2.0,c.y,c.z);
    float t4 = dot((a4 - ray.p0),n4)/dot(ray.v,n4);
    intersect.p = ray.p0 + t4*ray.v;
    intersect.n = n4;
    intersect.sCoeff = 1.0; // TODO: Change this for special material extra task
    if (((c.z-L/2.0) <= intersect.p.z && intersect.p.z <= (c.z+L/2.0))&&((c.y-H/2.0) <= intersect.p.y && intersect.p.y <= (c.y+H/2.0))){
        if(t4 < t){
            t = t4; 
            n = n4;
        }
    }
    //top
    vec3 n5 = normalize(vec3(0,1,0));
    vec3 a5 = vec3(c.x,c.y+H/2.0,c.z);
    float t5 = dot((a5 - ray.p0),n5)/dot(ray.v,n5);
    intersect.p = ray.p0 + t5*ray.v;
    intersect.n = n5;
    intersect.sCoeff = 1.0; // TODO: Change this for special material extra task
    if (((c.z-L/2.0) <= intersect.p.z && intersect.p.z <= (c.z+L/2.0))&&((c.x-W/2.0) <= intersect.p.x && intersect.p.x <= (c.x+W/2.0))){
        if(t5 < t){
            t = t5; 
            n = n5;
        }
    }
    //bot
    vec3 n6 = normalize(vec3(0,-1,0));
    vec3 a6 = vec3(c.x,c.y-H/2.0,c.z);
    float t6 = dot((a6 - ray.p0),n6)/dot(ray.v,n6);
    intersect.p = ray.p0 + t6*ray.v;
    intersect.n = n6;
    intersect.sCoeff = 1.0; // TODO: Change this for special material extra task
    if (((c.z-L/2.0) <= intersect.p.z && intersect.p.z <= (c.z+L/2.0))&&((c.x-W/2.0) <= intersect.p.x && intersect.p.x <= (c.x+W/2.0))){
        if(t6 < t){
            t = t6; 
            n = n6;
        }
    }

    intersect.p = ray.p0 + t*ray.v;
    intersect.n = normalize(N*n);

    float i = 40.0; //changing dimensions of checkerboard (higher number, more checkers)

    float f = cos(i*intersect.p.x)*cos(i*intersect.p.y)*cos(i*intersect.p.z);
    if (f > 0.0) f = 1.0;
    else f = 0.0;

    intersect.sCoeff = f; // TODO: Change this for special material extra task
    if (!((c.x-W/2.0) <= intersect.p.x && intersect.p.x <= (c.x+W/2.0))||!((c.y-H/2.0) <= intersect.p.y && intersect.p.y <= (c.y+H/2.0)) || t < 0.0){
        t = INF;
        intersect.p = vec3(0.0,0.0,0.0);
        intersect.n = vec3(0.0,0.0,0.0);
    }
    
    return t;
}


/**
* Intersect a ray with a given cylinder
*
* @param {Ray} ray : The ray in world coordinates
* @param {vec3} c : Center of cylinder
* @param {float} r : Radius of cylinder
* @param {float} h : Height of cylinder
* @param {int} mIdx : Array index of material that the cylinder is made of
* @param {mat4} MInv: Inverse of the transformation M that's applied to the cylinder before ray intersection
* @param {mat3} N: The normal transformation associated to M
* @param {Intersection (out)} intersect : The intersection
*
* @returns {float} t : Parameter t so that point of intersection is ray.p0 + t*ray.v
*/
float rayIntersectCylinder(Ray ray, vec3 c, float r, float h,
                            int mIdx, mat4 MInv, mat3 N,
                            out Intersection intersect) {
    intersect.mIdx = mIdx; // Store away the material index
    intersect.sCoeff = 1.0; // TODO: Change this for special material extra task
/** TODO: PUT YOUR CODE HERE **/
    // TODO: The below three are dummy values
    intersect.p = vec3(0, 0, 0);
    intersect.n = vec3(0, 0, 0);
    return INF;
}


/**
* Intersect a ray with a given cone
*
* @param {Ray} ray : The ray in world coordinates
* @param {vec3} c : Center of cone
* @param {float} r : Radius of cone
* @param {float} h : Height of cone
* @param {int} mIdx : Array index of material that the cone is made of
* @param {mat4} MInv: Inverse of the transformation M that's applied to the cone before ray intersection
* @param {mat3} N: The normal transformation associated to M
* @param {Intersection (out)} intersect : The intersection
*
* @returns {float} t : Parameter t so that point of intersection is ray.p0 + t*ray.v
*/
float rayIntersectCone(Ray ray, vec3 c, float r, float h,
                            int mIdx, mat4 MInv, mat3 N,
                            out Intersection intersect) {
    intersect.mIdx = mIdx; // Store away the material index
    intersect.sCoeff = 1.0; // TODO: Change this for special material extra task
/** TODO: PUT YOUR CODE HERE **/
    // TODO: The below three are dummy values
    intersect.p = vec3(0, 0, 0);
    intersect.n = vec3(0, 0, 0);
    return INF;
}


/**
* A function which intersects a ray with a scene, returning the
* t parameter of the closest intersection, or INF if no intersection
* happened, along with an out parameter storing the point, normal,
* and material of the intersection
* NOTE: This function is merely declared here; it is defined in its
* entirety in Javascript before this shader is compiled, since information
* about the scene must be hardcoded into the shader
*
* @param {Ray} ray : The ray in world coordinates
* @param {Intersection (out)} intersect : The intersection
*
* @returns {float} t : Parameter t so that point of intersection is ray.p0 + t*ray.v
*/
float rayIntersectScene(Ray ray, out Intersection intersect){return INF;}


/*******************************************
        RAY ILLUMINATION FUNCTIONS
********************************************/

/**
* Pull a material out of the list of materials, based on its
* index.  This function is necessary, because it is not possible
* to use non-constant indices into arrays in GLSL, so one must
* loop over the entire array of materials to find the right one
*
* @param {int} mIdx : The index into the materials array of the
*                     material we seekd
*
* @returns {Material} m : The appropriate material struct
*/
Material getMaterial(int mIdx) {
    Material m;
    for (int i = 0; i < MAX_MATERIALS; i++) {
        if (i == mIdx) {
            m = materials[i];
        }
        if (i >= numMaterials) {
            break;
        }
    }
    return m;
}

/**
* Determine whether a point is in the shadow of a light
*
* @param {Intersection} intersect : Intersection point we're checking
* @param {int} lightIndex : Index into the array of lights of
*                           the light we want to check
*/
bool pointInShadow(Intersection intersect, Light l) {

    vec3 L = l.pos - intersect.p;

    Ray ray;
    ray.v = L;
    ray.p0 = intersect.p+EPS*ray.v;

    float t = rayIntersectScene(ray,intersect);

    if(t < 1.0) return true;

    return false; 
}

/**
* Get the phong illumination color
*/
vec3 getPhongColor(Intersection intersect, Material m, vec3 eye) {
    vec3 color = vec3(0.0,0.0,0.0);
    // To help with debugging, color the fragment based on the
    // normal of the intersection.  But this should eventually
    // be replaced with code to do Phong illumination below
    //color = 0.5*(intersect.n + 1.0);
    for (int i = 0; i < MAX_LIGHTS; i++) {
        if (i < numLights) {
            vec3 L = lights[i].pos - intersect.p; 
            float LDistSqr = dot(L, L);
            L = normalize(L);
            
            // Lambertian Term
            float kdCoeff = dot(intersect.n, L);
            if(m.special == 1) kdCoeff *= intersect.sCoeff;
            if (kdCoeff < 0.0) {
                kdCoeff = 0.0;
            }

            // Specular Term
            // Find a vector from the uEye to tpos.  Then take its 
            // dot product with the vector to the light reflected 
            // about the normal, raised to a power 
            vec3 dh = normalize(eye - intersect.p);
            vec3 h = -reflect(L, intersect.n);
            float ksCoeff = dot(h, dh);
            if (ksCoeff < 0.0) {
                ksCoeff = 0.0;
            }
            ksCoeff = pow(ksCoeff, m.shininess);



            vec3 lColor = lights[i].color/(lights[i].atten.x + lights[i].atten.y*sqrt(LDistSqr) + lights[i].atten.z*LDistSqr);
            
            float angle = acos(dot(normalize(lights[i].towards),normalize(intersect.p-lights[i].pos)));

            if(!pointInShadow(intersect,lights[i]))
                if(angle < lights[i].angle) color += lColor*(kdCoeff*m.kd + ksCoeff*m.ks); 
        }
    }
/** TODO: PUT YOUR CODE HERE **/
    return color;
}


/**
*
*/
varying vec2 v_position;
Ray getRay() {
    Ray ray;
    ray.p0 = cameraPos;
    // TODO: Finish constructing ray by figuring out direction, using
    // v_position.x, v_position.y, fovx, fovy, up, and right
    if (orthographic == 1) {
        // TODO: Fill in code for constructing orthographic rays
        // (You can ignore this if you aren't doing the orthographic extra task)
        ray.v = cross(up,right);
        ray.p0 = cameraPos + 10.0*right*v_position.x + 10.0*up*v_position.y;
/** TODO: PUT YOUR CODE HERE **/
    }
    else {
        // TODO: Fill in ordinary perspective ray based on fovx and fovy (the default option)

        ray = Ray(ray.p0, cross(up,right) + (right*(v_position.x*tan(fovx/2.0))) + (up*(v_position.y*tan(fovy/2.0))));
    }
    return ray;
}

void showLightBeacons(Ray rayInitial, float tInitial) {
    // Show light beacons if the user so chooses
    // (NOTE: This requires a working implementation of rayIntersectSphere)
    mat4 identity4 = mat4(1.0);
    mat3 identity3 = mat3(1.0);
    Intersection intersect;
    if (showLights == 1) {
        for (int i = 0; i < MAX_LIGHTS; i++) {
            if (i < numLights) {
                Light light = lights[i];
                float tlight = rayIntersectSphere(rayInitial, light.pos, beaconRadius,
                                                  0, identity4, identity3, intersect);
                if (tlight < tInitial) {
                    gl_FragColor = vec4(light.color, 1.0);
                }
            }
        }
    }
}

void main() {
    Ray ray = getRay();
    Ray rayInitial = ray;
    bool insideObj = false;
    Intersection intersect;
    intersect.sCoeff = 1.0;
    vec3 color = vec3(0.0, 0.0, 0.0);
    vec3 weight = vec3(1.0, 1.0, 1.0);
    float t;
    float tInitial;
    for (int depth = 0; depth < MAX_RECURSION; depth++) {
        t = rayIntersectScene(ray, intersect);
        if (depth == 0) {
            tInitial = t;
        }
        if (t < INF) {
            Material m = getMaterial(intersect.mIdx);
            // Figure out whether the ray is inside the object it
            // intersected by using the dot product between a vector
            // from the endpoint of the ray and the intersection
            // point and the intersection normal
            if (dot(ray.p0 - intersect.p, intersect.n) < 0.0) {
                intersect.n *= -1.0;
                insideObj = true;
            }
            else {
                insideObj = false;
            }
            color += weight*getPhongColor(intersect, m, rayInitial.p0);
            ray.v = reflect(ray.v,intersect.n);
            ray.p0 = intersect.p + EPS*ray.v;
            weight*=m.ks;
            // TODO: Reflect ray, multiply weight by specular of this object,
            // and recursively continue
            // If doing extra task on transmission, only reflect if the
            // transmission coefficient kt is zero in all components
            // Otherwise, do transmission with snell's law

/** TODO: PUT YOUR CODE HERE **/
        }
        else {
            // Ray doesn't intersect anything, so no use continuing
            break;
        }
    }
    gl_FragColor = vec4(color, 1.0);
    showLightBeacons(rayInitial, tInitial);
}
