# Sorting Algorithm Visualizer

A web application to visualize and compare different sorting algorithms in real-time, built with Next.js, TypeScript, and Tailwind CSS.

> **Note**: This repository is part of the blog post ["What a Comeback: Google Firebase Studio Strikes Back This Time, Lovable Still Performs Flawlessly"](https://medium.com/@wjleon/what-a-comeback-google-firebase-studio-strikes-back-this-time-lovable-still-performs-flawlessly-cc9aafabaf6c) on Medium.

![Sorting Algorithm Visualizer](https://via.placeholder.com/800x400?text=Sorting+Algorithm+Visualizer)

## Features

- **Side-by-Side Comparison**: Compare two different sorting algorithms simultaneously on the same dataset
- **Multiple Algorithms**: Choose from various sorting algorithms including Bubble Sort, Quick Sort, Merge Sort, Heap Sort, Selection Sort, and Insertion Sort
- **Customizable Input**: Adjust the number of elements and choose from different initial distributions
- **Real-Time Metrics**: Track comparisons and elapsed time for each algorithm
- **Audio Feedback**: Hear the sorting process with audio tones based on element values
- **Animation Controls**: Start, pause, and reset the visualization with adjustable animation speed

## Sorting Algorithms

The application includes the following sorting algorithms:

- **Bubble Sort**: O(n²) - Simple comparison-based algorithm
- **Selection Sort**: O(n²) - In-place comparison sort
- **Insertion Sort**: O(n²) - Builds the sorted array one item at a time
- **Merge Sort**: O(n log n) - Divide and conquer algorithm
- **Quick Sort**: O(n log n) average, O(n²) worst case - Divide and conquer algorithm
- **Heap Sort**: O(n log n) - Comparison-based sort using a binary heap data structure

## Getting Started

### Prerequisites

- Node.js (version 18 or later)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/sorting-algorithm-visualizer.git
cd sorting-algorithm-visualizer
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Select Algorithms**: Choose different sorting algorithms for the left and right panels from the dropdown menus.
2. **Configure Input**: Set the number of elements (10-200) and select the initial distribution.
3. **Start Visualization**: Click the "Start" button to begin the sorting process.
4. **Control Playback**: Use the "Pause" and "Reset" buttons to control the visualization.
5. **Adjust Speed**: Use the speed slider to control the animation speed.
6. **Toggle Sound**: Turn audio feedback on or off using the sound toggle.

## Project Structure

```
sorting-algorithm-visualizer/
├── src/
│   ├── app/                  # Next.js app directory
│   ├── components/           # React components
│   ├── context/              # Global state management
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions and sorting algorithms
├── public/                   # Static assets
├── .gitignore                # Git ignore file
├── next.config.js            # Next.js configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Deployment

This project is ready to be deployed on Vercel:

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and sign up or log in.
3. Click "New Project" and import your GitHub repository.
4. Keep the default settings and click "Deploy".
5. Once deployed, Vercel will provide you with a URL to access your application.

## Performance Considerations

- The application is optimized for arrays of up to 200 elements.
- For large arrays (>100 elements), simplified rendering is used to maintain performance.
- On mobile devices, animations are reduced to improve performance.
- The application respects the user's "prefers-reduced-motion" setting.

## Browser Compatibility

The application is compatible with modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by various sorting algorithm visualizers
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
