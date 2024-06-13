import pygame
import csv
import math
import itertools
from collections import deque
import subprocess

global PARTICLE_RADIUS


WIDTH, HEIGHT = 1500, 800
PARTICLE_RADIUS = 5
BACKGROUND_COLOR = (0, 0, 0)
FRAME_DELAY = 30  # milliseconds
FRAMES_PER_SECOND = 1000 // FRAME_DELAY
BUFFER_SECONDS = 60
BUFFER_SIZE = FRAMES_PER_SECOND * BUFFER_SECONDS

PARTICLE_RADIUS_VISUAL = PARTICLE_RADIUS

def frame_generator(file_name):
    with open(file_name, 'r') as file:
        reader = csv.reader(file)
        for key, group in itertools.groupby(reader, lambda x: len(x) == 0):
            if not key:
                frame = [(float(row[0]), float(row[1]), float(row[2]), float(row[3]), float(row[4])) for row in group]
                yield frame

def update_particle_properties():
    global PARTICLE_RADIUS, PARTICLE_RADIUS_VISUAL
    while True:
        option = input(
            f"_" * 70 + "Choose an option << \n(-1: SIM TIME, 0: GRAVITY, 1: RADIUS, 2: NUMBER, 3: SIZE,"
                        " 4: COMPILE & RUN, 5: OPEN FILE, 6: QUIT): ")

        if option == '-1':
            property_name = "TIME"
        elif option == '0':
            property_name = "GRAVITY"
        elif option == '1':
            property_name = "RADIUS"
        elif option == '2':
            property_name = "NUMBER"
        elif option == '3':
            property_name = "SIZE"
        elif option == '4':
            print("compiling...")
            # compile
            subprocess.run(["gcc", "main.c", "particle.c", "-o", "particle_sim", "-lm"])
            subprocess.run(["./particle_sim"])
            print("running...")
            return "simulation.csv"
        elif option == '5':
            return getFileName()
        elif option == '6':
            print("Quitting the program...")
            exit(0)
        else:
            print("Invalid option, please try again.")
            continue

        try:
            user_input = float(input(f"Enter new value for {property_name}: "))
        except ValueError:
            print("Invalid input. Please enter a valid float.")
            continue

        if option in ['0']:
            with open("particle.c", "r") as file:
                lines = file.readlines()

            with open("particle.c", "w") as file:
                for line in lines:
                    if line.startswith(f"#define {property_name}"):
                        file.write(f"#define {property_name} {user_input}f\n")
                    else:
                        file.write(line)
        elif option in ['-1']:
            with open("main.c", "r") as file:
                lines = file.readlines()

            with open("main.c", "w") as file:
                for line in lines:
                    if line.startswith(f"#define {property_name}"):
                        file.write(f"#define {property_name} {user_input}f\n")
                    else:
                        file.write(line)

        elif option in ['1']:
            with open("particle.h", "r") as file:
                lines = file.readlines()
            with open("particle.h", "w") as file:
                for line in lines:
                    if line.startswith(f"#define {property_name}"):
                        file.write(f"#define {property_name} {user_input}f\n")
                        PARTICLE_RADIUS = user_input
                        PARTICLE_RADIUS_VISUAL = user_input
                    else:
                        file.write(line)

        elif option in ['2']:
            with open("main.c", "r") as file:
                lines = file.readlines()
            with open("main.c", "w") as file:
                for line in lines:
                    if line.startswith(f"#define NUM_PARTICLES "):
                        file.write(f"#define NUM_PARTICLES {int(user_input) % 9001}\n")
                    else:
                        file.write(line)

        elif option in ['3']:
            with open("main.c", "r") as file:
                lines = file.readlines()

            with open("main.c", "w") as file:
                for line in lines:
                    if line.startswith(f"#define WIDTH "):
                        if int(user_input) == 0:
                            file.write("#define WIDTH 750\n")
                        elif int(user_input) == 1:
                            file.write("#define WIDTH 1500\n")
                    elif line.startswith("#define HEIGHT "):
                        if int(user_input) == 0:
                            file.write("#define HEIGHT 400\n")
                        elif int(user_input) == 1:
                            file.write("#define HEIGHT 800\n")
                    else:
                        file.write(line)
        print(f"-" * 70 + f"{property_name} updated successfully.")


def getFileName():
    while True:
        user_input = input("please enter filename    #")
        if user_input.startswith('B') or user_input.startswith('b'):
            screen = pygame.display.set_mode((WIDTH, HEIGHT))
            user_input = f"scriptB/{user_input[1:]}.csv"
            break
        elif user_input.startswith('S') or user_input.startswith('s'):
            screen = pygame.display.set_mode((WIDTH / 2, HEIGHT / 2))
            user_input = f"scriptS/{user_input[1:]}.csv"
            break
    return user_input

def simulation_loop(file_name):
    global PARTICLE_RADIUS, PARTICLE_RADIUS_VISUAL
    pygame.init()
    pygame.display.set_caption("Particle Simulation")
    screen = pygame.display.set_mode((WIDTH, HEIGHT))

    frame_gen = frame_generator(file_name)

    frames = deque(maxlen=BUFFER_SIZE)
    frame_index = 0
    running = True
    paused = False
    clock = pygame.time.Clock()

    # preload buffer
    try:
        for _ in range(BUFFER_SIZE):
            frames.append(next(frame_gen))
    except StopIteration:
        pass

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
                return False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_p:
                    paused = not paused
                elif event.key == pygame.K_r:
                    frame_index = 0
                    frame_gen = frame_generator(file_name)
                    frames.clear()
                    try:
                        for _ in range(BUFFER_SIZE):
                            frames.append(next(frame_gen))
                    except StopIteration:
                        pass
                    paused = False
                elif event.key == pygame.K_RIGHT:
                    if frame_index + FRAMES_PER_SECOND * 5 >= len(frames):
                        frame_index = 0
                    else:
                        frame_index = min(frame_index + FRAMES_PER_SECOND * 5, len(frames) - 1)
                elif event.key == pygame.K_LEFT:
                    frame_index = max(frame_index - FRAMES_PER_SECOND * 5, 0)

        if not paused:
            screen.fill(BACKGROUND_COLOR)

            if frame_index < len(frames):
                for particle in frames[frame_index]:
                    x, y, r, g, b = particle[0], particle[1], particle[2], particle[3], particle[4]
                    color = (int(r * 255), int(g * 255), int(b * 255))

                    if math.isfinite(x) and math.isfinite(y):
                        pygame.draw.circle(screen, color, (int(x), int(y)), int(PARTICLE_RADIUS_VISUAL))

                frame_index += 1

                # load more frames
                if len(frames) - frame_index < BUFFER_SIZE // 2:
                    try:
                        for _ in range(BUFFER_SIZE // 2):
                            frames.append(next(frame_gen))
                    except StopIteration:
                        pass
            else:
                frame_index = 0
                frame_gen = frame_generator(file_name)
                frames.clear()
                try:
                    for _ in range(BUFFER_SIZE):
                        frames.append(next(frame_gen))
                except StopIteration:
                    pass

            pygame.display.flip()
            clock.tick(FRAME_DELAY)
        else:
            clock.tick(FRAME_DELAY)

    pygame.quit()
    return False



def main():
    while True:
        file_name = update_particle_properties()
        restart = simulation_loop(file_name)
        if not restart:
            break


if __name__ == "__main__":
    main()
