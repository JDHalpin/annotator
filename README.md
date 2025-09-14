# Annotator

AI tool for annotations and functional documentation with a fully responsive UI built using Bootstrap 5.x breakpoints.

## Features

- **Responsive Design**: Fully responsive interface that adapts to all screen sizes
- **Bootstrap 5.x Integration**: Uses the latest Bootstrap framework with all breakpoints
- **AI-Powered**: Intelligent annotation and documentation assistance
- **Modern Interface**: Clean, professional design with intuitive navigation

## Responsive Breakpoints

The application uses Bootstrap 5.x breakpoints for optimal display across devices:

- **xs**: `< 576px` (Extra small devices - portrait phones)
- **sm**: `≥ 576px` (Small devices - landscape phones)
- **md**: `≥ 768px` (Medium devices - tablets)
- **lg**: `≥ 992px` (Large devices - desktops)
- **xl**: `≥ 1200px` (Extra large devices - large desktops)
- **xxl**: `≥ 1400px` (Extra extra large devices - larger desktops)

## Responsive Features

### Navigation
- **Mobile**: Collapsible hamburger menu with icons only
- **Tablet**: Expanded navigation with icons and selective text
- **Desktop**: Full navigation with icons and text labels

### Sidebar
- **Mobile/Small**: Hidden by default, toggleable overlay
- **Tablet**: Narrow fixed sidebar (200px)
- **Desktop**: Standard fixed sidebar (280px)
- **Large Desktop**: Wider sidebar (320px) for better content organization

### Layout
- **Mobile**: Single column, stacked cards, full-width components
- **Tablet**: 2-column grid for statistics cards, responsive content areas
- **Desktop**: Multi-column layouts, optimized spacing and typography
- **Large Desktop**: Maximum container width with centered layout

### Components
- **Cards**: Responsive sizing and spacing, mobile-optimized content
- **Tables**: Horizontal scrolling on mobile, full display on desktop
- **Forms**: Stacked on mobile, inline on desktop
- **Buttons**: Full-width on mobile, standard sizing on desktop

## Getting Started

1. Open `index.html` in your web browser
2. The application will automatically detect your screen size and adjust the layout
3. Resize your browser window to see responsive behavior in action

## Files

- `index.html` - Main application interface
- `styles.css` - Custom responsive CSS styles
- `app.js` - JavaScript for responsive behavior and interactivity
- `README.md` - This documentation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

The application uses:
- Bootstrap 5.3.2 (CDN)
- Bootstrap Icons (CDN)
- Vanilla JavaScript (no additional dependencies)

To customize the responsive behavior, modify the breakpoint values in `styles.css` and the corresponding JavaScript in `app.js`.
