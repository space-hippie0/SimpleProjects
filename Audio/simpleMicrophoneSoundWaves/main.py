import tkinter as tk
import pyaudio
import numpy as np
from matplotlib.figure import Figure
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

# Audio stream settings
CHUNK = 256        # Number of audio samples per frame
RATE = 16000       # Sampling rate in Hz

# Initialize PyAudio
p = pyaudio.PyAudio()

class AudioVisualizerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Frequency Visualizer")
        self.root.geometry("800x400")
        self.root.configure(bg="black")  # Set window background to black

        # Start/Stop Button
        self.is_listening = False
        self.listen_button = tk.Button(
            root,
            text="Start Listening",
            command=self.toggle_listen,
            bg="#333333",
            fg="white",
            font=("Arial", 16),
            width=20
        )
        self.listen_button.pack(pady=20)

        # Create the Plot for Frequency Bars
        self.fig = Figure(figsize=(8, 3), dpi=100)
        self.ax = self.fig.add_subplot(111)
        self.ax.set_ylim(0, 15)                # Limit bar height for compact appearance
        self.ax.set_xlim(0, CHUNK // 8)        # Fewer columns for smoother visualization
        self.ax.get_xaxis().set_visible(False)
        self.ax.get_yaxis().set_visible(False)
        self.ax.set_facecolor("black")          # Set plot background to black

        # Canvas for Matplotlib
        self.canvas = FigureCanvasTkAgg(self.fig, master=root)
        self.canvas.get_tk_widget().pack()

        self.bars = None

        # Stream and Update Interval
        self.stream = None
        self.update_interval = 20               # Update interval in milliseconds
        self.previous_magnitudes = np.zeros(CHUNK // 8)  # Initialize for smooth transition

        # Handle window close event to ensure resources are released
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)

    def toggle_listen(self):
        if not self.is_listening:
            self.is_listening = True
            self.listen_button.config(text="Stop Listening")
            self.start_listening()
        else:
            self.is_listening = False
            self.listen_button.config(text="Start Listening")
            self.stop_listening()

    def start_listening(self):
        # Start audio stream with smaller buffer
        if self.stream is None:
            try:
                self.stream = p.open(
                    format=pyaudio.paInt16,
                    channels=1,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK
                )
            except Exception as e:
                print(f"Error opening stream: {e}")
                self.is_listening = False
                self.listen_button.config(text="Start Listening")
                return
        self.update_plot()

    def stop_listening(self):
        # Stop the audio stream safely
        if self.stream:
            try:
                self.stream.stop_stream()
                self.stream.close()
            except Exception as e:
                print(f"Error closing stream: {e}")
            finally:
                self.stream = None
        # Clear the plot after stopping
        self.ax.clear()
        self.ax.set_facecolor("black")  # Reset plot background to black
        self.canvas.draw()
        self.bars = None                # Reset bars for reinitialization

    def update_plot(self):
        if not self.is_listening or self.stream is None:
            return

        try:
            # Read and process audio data
            data = np.frombuffer(self.stream.read(CHUNK, exception_on_overflow=False), dtype=np.int16)
        except IOError:
            # Handle overflow error by skipping this iteration
            data = np.zeros(CHUNK, dtype=np.int16)
        except Exception as e:
            print(f"Error reading stream: {e}")
            self.toggle_listen()
            return

        # Perform FFT to get frequency data
        freqs = np.fft.fft(data)
        freq_magnitudes = np.abs(freqs[:CHUNK // 2])

        # Focus on the middle range of frequencies and downsample
        # This targets the most perceptible frequency range for better visuals
        middle_start = CHUNK // 16    # Start index for middle frequencies
        middle_end = CHUNK // 4        # End index for middle frequencies
        middle_range = freq_magnitudes[middle_start:middle_end]
        # Ensure we have enough data points to match previous_magnitudes
        desired_length = CHUNK // 8    # 32 bars
        # Downsample to match desired_length
        if len(middle_range) >= desired_length:
            freq_magnitudes = middle_range[:desired_length] * 0.02
        else:
            # If not enough data, pad with zeros
            freq_magnitudes = np.pad(middle_range, (0, desired_length - len(middle_range)), 'constant') * 0.02

        # Smooth transitions with stronger interpolation
        smoothed_magnitudes = (self.previous_magnitudes * 0.8) + (freq_magnitudes * 0.2)
        self.previous_magnitudes = smoothed_magnitudes

        # Initialize or update bars without clearing the canvas
        if self.bars is None:
            self.bars = self.ax.bar(
                range(len(smoothed_magnitudes)),
                smoothed_magnitudes,
                color="blue",
                width=0.8
            )
        else:
            for bar, new_height in zip(self.bars, smoothed_magnitudes):
                bar.set_height(new_height)

        self.canvas.draw_idle()  # Use draw_idle to avoid full redraw

        # Schedule the next update
        self.root.after(self.update_interval, self.update_plot)

    def on_closing(self):
        # Ensure that the audio stream is properly closed
        self.is_listening = False
        self.stop_listening()
        self.root.destroy()

# Run the app
if __name__ == "__main__":
    root = tk.Tk()
    app = AudioVisualizerApp(root)
    root.mainloop()
    # Close the PyAudio instance
    p.terminate()
