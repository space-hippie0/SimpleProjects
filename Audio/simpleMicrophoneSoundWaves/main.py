import tkinter as tk
import pyaudio
import numpy as np
from matplotlib.figure import Figure
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

# Audio stream settings
CHUNK = 256  # Reduced chunk size for lower processing load
RATE = 16000  # Lower sampling rate to reduce the amount of data

# Initialize PyAudio
p = pyaudio.PyAudio()


class AudioVisualizerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Frequency Visualizer")
        self.root.geometry("800x300")

        # Start/Stop Button
        self.is_listening = False
        self.listen_button = tk.Button(root, text="Start Listening", command=self.toggle_listen)
        self.listen_button.pack()

        # Create the Plot for Frequency Bars
        self.fig = Figure(figsize=(8, 3), dpi=100)
        self.ax = self.fig.add_subplot(111)
        self.ax.set_ylim(0, 30)  # Limit bar height for compact appearance
        self.ax.set_xlim(0, CHUNK // 8)  # Fewer columns for smoother visualization
        self.ax.get_xaxis().set_visible(False)
        self.ax.get_yaxis().set_visible(False)

        # Canvas for Matplotlib
        self.canvas = FigureCanvasTkAgg(self.fig, master=root)
        self.canvas.get_tk_widget().pack()
        self.bars = None

        # Stream and Update Interval
        self.stream = None
        self.update_interval = 20  # Faster update interval for real-time effect
        self.previous_magnitudes = np.zeros(CHUNK // 8)  # Initialize previous magnitudes for smooth transition

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
        self.stream = p.open(format=pyaudio.paInt16,
                             channels=1,
                             rate=RATE,
                             input=True,
                             frames_per_buffer=CHUNK)
        self.update_plot()

    def stop_listening(self):
        # Stop the audio stream safely
        if self.stream:
            self.stream.stop_stream()
            self.stream.close()
            self.stream = None
        # Clear the plot after stopping
        self.ax.clear()
        self.canvas.draw()

    def update_plot(self):
        if not self.is_listening or self.stream is None:
            return

        try:
            # Read and process audio data
            data = np.frombuffer(self.stream.read(CHUNK, exception_on_overflow=False), dtype=np.int16)
        except IOError:
            data = np.zeros(CHUNK, dtype=np.int16)

        # Perform FFT to get frequency data
        freqs = np.fft.fft(data)
        freq_magnitudes = np.abs(freqs[:CHUNK // 2])

        # Downsample and scale magnitudes
        freq_magnitudes = freq_magnitudes[::4] * 0.05

        # Interpolate between previous and current magnitudes for smoothness
        smoothed_magnitudes = (self.previous_magnitudes * 0.7) + (freq_magnitudes * 0.3)
        self.previous_magnitudes = smoothed_magnitudes

        # Initialize or update bars without clearing the canvas
        if self.bars is None:
            self.bars = self.ax.bar(range(len(smoothed_magnitudes)), smoothed_magnitudes, color="blue", width=0.8)
        else:
            for bar, new_height in zip(self.bars, smoothed_magnitudes):
                bar.set_height(new_height)

        self.canvas.draw_idle()  # Use draw_idle to avoid full redraw

        # Schedule the next update
        self.root.after(self.update_interval, self.update_plot)


# Run the app
root = tk.Tk()
app = AudioVisualizerApp(root)
root.mainloop()

# Close the PyAudio
p.terminate()

