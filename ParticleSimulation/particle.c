#include <stdlib.h>
#include <math.h>
#include "particle.h"

#define GRAVITY 9.8f
#define DAMPING 0.5f
#define NUM_COLORS 7
int counter = 0;

void initialize_particle(Particle *particle, float width, float height, int index) {
    // right-left alternate
    if (counter % 2 == 0) {
        particle->x = 0.0f;
    } else {
        particle->x = width;
    }

    particle->y = 0.0f;
    particle->prev_x = particle->x;
    particle->prev_y = particle->y;
    particle->radius = RADIUS;
    particle->mass = particle->radius;
    particle->x_vel = 0.0f;
    particle->y_vel = 0.0f;

    int color_index = index / 2;
    particle->color_index = color_index % NUM_COLORS;

    // RGB values based on the color index
    static float COLORS[NUM_COLORS][3] = {
            {1.0f, 0.0f, 0.0f},    // Red
            {1.0f, 0.647f, 0.0f},  // Orange
            {1.0f, 1.0f, 0.0f},    // Yellow
            {0.0f, 1.0f, 0.0f},    // Green
            {0.0f, 0.0f, 1.0f},    // Blue
            {0.294f, 0.0f, 0.509f}, // Indigo
            {0.502f, 0.0f, 0.502f} // Violet
    };

    particle->color_r = COLORS[particle->color_index][0];
    particle->color_g = COLORS[particle->color_index][1];
    particle->color_b = COLORS[particle->color_index][2];

    counter += 1;
}


void update_particles(Particle particles[], int num_particles, float dt, float width) {
    for (int i = 0; i < num_particles; i++) {
        float temp_x = particles[i].x;
        float temp_y = particles[i].y;

        // acceleration of gravity
        float acceleration_y = GRAVITY * dt * dt;

        // position
        particles[i].x += (particles[i].x - particles[i].prev_x);
        particles[i].y += (particles[i].y - particles[i].prev_y) + acceleration_y;

        // velocity
        particles[i].x_vel = (particles[i].x - particles[i].prev_x) / dt;
        particles[i].y_vel = (particles[i].y - particles[i].prev_y + acceleration_y) / dt;

        particles[i].prev_x = temp_x;
        particles[i].prev_y = temp_y;
    }
}

void handle_collisions(Particle particles[], int num_particles, float width, float height) {
    for (int i = 0; i < num_particles; i++) {
        // Collision with walls
        // left
        if (particles[i].x - particles[i].radius < 0) {
            particles[i].x = particles[i].radius;
            particles[i].x_vel *= -1; // Reverse x-direction
        }
        // right
        if (particles[i].x + particles[i].radius > width) {
            particles[i].x = width - particles[i].radius;
            particles[i].x_vel *= -1; // Reverse x-direction
        }
        // top
        if (particles[i].y - particles[i].radius < 0) {
            particles[i].y = particles[i].radius;
            particles[i].y_vel *= -1; // Reverse y-direction
        }
        // bottom
        if (particles[i].y + particles[i].radius > height) {
            particles[i].y = height - particles[i].radius;
            particles[i].y_vel *= -1; // Reverse y-direction
        }

        // collision with other particles
        for (int j = i + 1; j < num_particles; j++) {
            float dx = particles[i].x - particles[j].x;
            float dy = particles[i].y - particles[j].y;
            float distance = sqrtf(dx * dx + dy * dy);
            float min_distance = particles[i].radius + particles[j].radius;

            if (distance < min_distance) {
                // calculate overlap
                float overlap = 0.5f * (distance - min_distance);

                // direction of collision
                float collision_dir_x = dx / distance;
                float collision_dir_y = dy / distance;

                // move particles apart
                particles[i].x -= overlap * collision_dir_x;
                particles[i].y -= overlap * collision_dir_y;
                particles[j].x += overlap * collision_dir_x;
                particles[j].y += overlap * collision_dir_y;

                // calculate relative velocity
                float rel_vel_x = particles[j].x_vel - particles[i].x_vel;
                float rel_vel_y = particles[j].y_vel - particles[i].y_vel;

                // calculate the normal component of relative velocity
                float normal_vel = rel_vel_x * collision_dir_x + rel_vel_y * collision_dir_y;

                // determine which particle is faster
                float speed_i = sqrtf(particles[i].x_vel * particles[i].x_vel + particles[i].y_vel * particles[i].y_vel);
                float speed_j = sqrtf(particles[j].x_vel * particles[j].x_vel + particles[j].y_vel * particles[j].y_vel);

                if (speed_i > speed_j) {
                    particles[j].color_r = particles[i].color_r;
                    particles[j].color_g = particles[i].color_g;
                    particles[j].color_b = particles[i].color_b;
                } else {
                    particles[i].color_r = particles[j].color_r;
                    particles[i].color_g = particles[j].color_g;
                    particles[i].color_b = particles[j].color_b;
                }

                // update velocities
                particles[i].x_vel += normal_vel * collision_dir_x * DAMPING;
                particles[i].y_vel += normal_vel * collision_dir_y * DAMPING;
                particles[j].x_vel -= normal_vel * collision_dir_x * DAMPING;
                particles[j].y_vel -= normal_vel * collision_dir_y * DAMPING;
            }
        }
    }
}


