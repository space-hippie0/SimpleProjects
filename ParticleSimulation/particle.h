#ifndef PARTICLE_H
#define PARTICLE_H

#include <stdio.h>

#define NUM_COLORS 7

typedef struct {
    float x;
    float y;
    float prev_x;
    float prev_y;
    float radius;
    float mass;
    float x_vel;
    float y_vel;
    int color_index;
    float color_r;
    float color_g;
    float color_b;
} Particle;


#define RADIUS 10.0f

void initialize_particle(Particle *particle, float width, float height, int index); // Updated to initialize a single particle
void update_particles(Particle particles[], int num_particles, float dt, float width); // Added width parameter
void handle_collisions(Particle particles[], int num_particles, float width, float height);
void output_particles_to_csv(Particle particles[], int num_particles, FILE *file);

#endif // PARTICLE_H
