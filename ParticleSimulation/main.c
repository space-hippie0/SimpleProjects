#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <time.h>
#include "particle.h"

#define NUM_PARTICLES 5000
#define WIDTH 1500
#define HEIGHT 800
#define DT 0.032f // 60 FPS
#define TIME 60.0f

void output_particles_to_csv(Particle particles[], int num_particles, FILE *file) {
    for (int i = 0; i < num_particles; i++) {
        fprintf(file, "%f,%f,%f,%f,%f\n", particles[i].x, particles[i].y, particles[i].color_r, particles[i].color_g, particles[i].color_b);
    }
    fprintf(file, "\n");
}

int main() {
    srand(time(NULL));

    Particle particles[NUM_PARTICLES];
    int current_particle_count = 0;

    FILE *file = fopen("simulation.csv", "w");
    if (!file) {
        fprintf(stderr, "could not open the file!\n");
        return 1;
    }

    float current_time = 0.0f;
    float particle_creation_time = 0.0f;

    while (current_time < TIME) {
        // New particles
        if (current_particle_count < NUM_PARTICLES && current_time >= particle_creation_time) {
            initialize_particle(&particles[current_particle_count], WIDTH, HEIGHT, current_particle_count);
            current_particle_count++;
            particle_creation_time += 0.0000000000000000000005f; // # milliseconds
        }

        update_particles(particles, current_particle_count, DT, WIDTH);

        handle_collisions(particles, current_particle_count, WIDTH, HEIGHT);

        output_particles_to_csv(particles, current_particle_count, file);

        // frame delay
        usleep((int)(DT * 100));
        current_time += DT;
    }

    fclose(file);

    return 0;
}
