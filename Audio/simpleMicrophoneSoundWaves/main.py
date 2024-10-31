import tkinter as tk
from tkinter import ttk
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
        self.root.geometry("800x500")
        self.root.configure(bg="#121212")

        # Configure grid layout for responsive design
        self.root.rowconfigure(1, weight=1)
        self.root.columnconfigure(0, weight=1)

        # Top Frame for Title
        top_frame = ttk.Frame(root, padding=10, style="Top.TFrame")
        top_frame.grid(row=0, column=0, sticky="ew")
        top_frame.columnconfigure(0, weight=1)

        title_label = ttk.Label(top_frame, text="Audio Frequency Visualizer", style="Title.TLabel")
        title_label.grid(row=0, column=0, pady=10)

        # Middle Frame for Plot
        middle_frame = ttk.Frame(root, padding=10, style="Middle.TFrame")
        middle_frame.grid(row=1, column=0, sticky="nsew")
        middle_frame.rowconfigure(0, weight=1)
        middle_frame.columnconfigure(0, weight=1)

        # Create the Plot for Frequency Bars
        self.fig = Figure(figsize=(8, 3), dpi=100)
        self.ax = self.fig.add_subplot(111)
        self.ax.set_ylim(0, 15)                # Limit bar height for compact appearance
        self.ax.set_xlim(0, CHUNK // 8)        # Fewer columns for smoother visualization
        self.ax.get_xaxis().set_visible(False)  # Hide x-axis
        self.ax.get_yaxis().set_visible(False)  # Hide y-axis
        self.ax.set_facecolor("#121212")        # Set plot background color

        # Canvas for Matplotlib
        self.canvas = FigureCanvasTkAgg(self.fig, master=middle_frame)
        self.canvas.draw()
        self.canvas.get_tk_widget().pack(fill="both", expand=True)

        self.bars = None  # To store bar containers

        # Bottom Frame for Controls
        bottom_frame = ttk.Frame(root, padding=10, style="Bottom.TFrame")
        bottom_frame.grid(row=2, column=0, sticky="ew")
        bottom_frame.columnconfigure(1, weight=1)

        # Start/Stop Listening Button
        self.is_listening = False
        self.listen_button = ttk.Button(
            bottom_frame,
            text="Start Listening",
            command=self.toggle_listen,
            style="TButton"
        )
        self.listen_button.grid(row=0, column=0, padx=10, pady=10)

        # Status Indicator
        self.status_var = tk.StringVar(value="Status: Idle")
        status_label = ttk.Label(bottom_frame, textvariable=self.status_var, style="Status.TLabel")
        status_label.grid(row=0, column=1, sticky="w")

        # Stream and Update Interval
        self.stream = None
        self.update_interval = 20
        self.previous_magnitudes = np.zeros(CHUNK // 8)  # Initialize for smooth transition

        # Handle window close event to ensure resources are released
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)

    def toggle_listen(self):
        """Toggle the listening state for audio visualization."""
        if not self.is_listening:
            self.is_listening = True
            self.listen_button.config(text="Stop Listening")
            self.status_var.set("Status: Listening")
            self.start_listening()
        else:
            self.is_listening = False
            self.listen_button.config(text="Start Listening")
            self.status_var.set("Status: Idle")
            self.stop_listening()

    def start_listening(self):
        """Start the audio stream and begin updating the plot."""
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
                self.status_var.set("Status: Error")
                return
        self.update_plot()

    def stop_listening(self):
        """Stop the audio stream and clear the plot."""
        if self.stream:
            try:
                self.stream.stop_stream()
                self.stream.close()
            except Exception as e:
                print(f"Error closing stream: {e}")
            finally:
                self.stream = None
        self.ax.clear()
        self.ax.set_facecolor("#121212")        # Reset plot background color
        self.canvas.draw()
        self.bars = None                        # Reset bars for reinitialization

    def update_plot(self):
        """Read audio data, process it, and update the frequency bars."""
        if not self.is_listening or self.stream is None:
            return

        try:
            # Read and process audio data from the stream
            data = np.frombuffer(self.stream.read(CHUNK, exception_on_overflow=False), dtype=np.int16)
        except IOError:
            # Handle overflow error by skipping this iteration
            data = np.zeros(CHUNK, dtype=np.int16)
        except Exception as e:
            print(f"Error reading stream: {e}")
            self.toggle_listen()
            return

        # Perform Fast Fourier Transform (FFT) to get frequency data
        freqs = np.fft.fft(data)
        freq_magnitudes = np.abs(freqs[:CHUNK // 2])

        # Focus on the middle range of frequencies and downsample
        middle_start = CHUNK // 16      # Start index for middle frequencies
        middle_end = CHUNK // 4         # End index for middle frequencies
        middle_range = freq_magnitudes[middle_start:middle_end]

        desired_length = CHUNK // 8
        if len(middle_range) >= desired_length:
            scaling_factor = 0.005         # Reduced scaling factor for less sensitivity
            freq_magnitudes = middle_range[:desired_length] * scaling_factor
        else:
            # If not enough data, pad with zeros
            freq_magnitudes = np.pad(middle_range, (0, desired_length - len(middle_range)), 'constant') * 0.005

        # Apply a threshold to ignore low-decibel sounds
        noise_threshold = 0.2  # Threshold value
        freq_magnitudes = np.where(freq_magnitudes > noise_threshold, freq_magnitudes, 0)

        # Smooth transitions with interpolation
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

        self.canvas.draw_idle()  # Update the canvas without a full redraw

        # Schedule the next update
        self.root.after(self.update_interval, self.update_plot)

    def on_closing(self):
        """Handle the window closing event to ensure resources are released."""
        self.is_listening = False
        self.stop_listening()
        self.root.destroy()

# Custom Styles for ttk
def setup_styles():
    """Configure custom styles for the application's widgets."""
    style = ttk.Style()
    style.theme_use('clam')

    # Configure styles for frames
    style.configure("Top.TFrame", background="#121212")
    style.configure("Middle.TFrame", background="#121212")
    style.configure("Bottom.TFrame", background="#121212")

    # Configure styles for labels
    style.configure("Title.TLabel", foreground="white", background="#121212", font=("Helvetica", 18, "bold"))
    style.configure("Status.TLabel", foreground="white", background="#121212", font=("Helvetica", 12))

    # Configure style for the start/stop button
    style.configure("TButton",
                    foreground="white",
                    background="#1DB954",
                    font=("Helvetica", 12, "bold"),
                    padding=10)

    # Hover effect for the start/stop button
    style.map("TButton",
              background=[('active', '#1ed760')],
              foreground=[('active', 'white')])

if __name__ == "__main__":
    root = tk.Tk()
    setup_styles()
    app = AudioVisualizerApp(root)
    root.mainloop()
    p.terminate()
