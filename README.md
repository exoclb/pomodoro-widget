# Pomodoro Timer Widget for StreamElements

A beautiful, customizable Pomodoro timer widget designed for StreamElements overlays. This widget helps streamers manage their work sessions using the Pomodoro Technique with a clean, card-like interface.

## Features

### Core Functionality
- **Timer Modes**: Pomodoro or Stopwatch
- **Customizable Durations**: Work Timer, Short Break, Long Break (1-59 minutes)
- **Session Management**: Configurable number of sessions and long break intervals
- **Progress Tracking**: Visual progress bar and session counter
- **Audio Notifications**: Custom sounds for work/break completion and optional tick sounds

### Visual Customization
- **Scalable Interface**: Adjustable timer size (50%-200%)
- **Color Customization**: All elements can be customized (background, text, icons, progress bar)
- **Typography**: Google Fonts integration with customizable size and weight
- **Show/Hide Elements**: Toggle titles, session box, and countdown display
- **Responsive Design**: Adapts to different screen sizes

### StreamElements Integration
- **Chat Commands**: Control timer via chat commands
- **Persistent State**: Timer state saved across browser refreshes
- **Editor Mode**: Test controls visible in StreamElements editor
- **Field Configuration**: Easy setup through StreamElements widget panel

## Installation

1. **Create New Custom Widget** in StreamElements Dashboard
2. **Copy Files**: Copy the contents of each file into the corresponding fields:
   - `index.html` → HTML field
   - `style.css` → CSS field
   - `script.js` → JavaScript field
   - `fields.json` → Fields field

## Configuration

### Timer Settings
- **Timer Mode**: Choose between Pomodoro or Stopwatch
- **Work Duration**: Focus session length (default: 25 minutes)
- **Short Break**: Short break length (default: 5 minutes)
- **Long Break**: Long break length (default: 15 minutes)
- **Total Sessions**: Number of work sessions (default: 6)
- **Sessions for Long Break**: Work sessions before long break (default: 4)

### Display Options
- **Show Titles**: Display current state (FOCUS, SHORT BREAK, etc.)
- **Show Session Box**: Display session counter (2/6)
- **Show Countdown**: Display timer countdown
- **Timer Scale**: Adjust widget size (50%-200%)

### Customization
- **Colors**: Background, text, icons, progress bar, session box
- **Typography**: Font family (Google Fonts), size, weight
- **Custom Titles**: Edit work, short break, and long break titles
- **Chat Commands**: Customize command names for start/pause/reset

### Audio Settings
- **Enable Sound**: Toggle audio notifications
- **Work Complete Sound**: Sound when work session ends
- **Break Complete Sound**: Sound when break ends
- **Tick Sound**: Optional tick sound during countdown

## Usage

### Chat Commands (Default)
- `!pomodoro start` - Start the timer
- `!pomodoro pause` - Pause the timer
- `!pomodoro reset` - Reset the timer

### Timer Flow
1. **Work Session**: 25-minute focus period
2. **Short Break**: 5-minute break after each work session
3. **Long Break**: 15-minute break after 4 work sessions
4. **Session Complete**: Celebration when all sessions are done

### Editor Mode Features
When editing the widget in StreamElements, additional controls appear:
- **Start/Pause/Reset Buttons**: Manual timer control
- **Test Buttons**: Test work complete, break complete, and session changes

## Technical Details

### File Structure
```
pomodoro-widget/
├── index.html      # Widget HTML structure
├── style.css       # Styling and animations
├── script.js       # Timer logic and StreamElements integration
├── fields.json     # Configuration fields for StreamElements
├── README.md       # Documentation
└── assets/         # Optional icon assets
```

### StreamElements API Integration
- Uses `SE_API.store` for persistent timer state
- Handles `onWidgetLoad` for initialization
- Processes `onEventReceived` for chat commands
- Supports `getOverlayStatus` for editor mode detection

### Browser Compatibility
- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge
- Mobile responsive design

## Customization Examples

### Color Schemes

**Dark Theme**:
- Card Background: `#2C2C2C`
- Timer Text: `#FFFFFF`
- Title Text: `#CCCCCC`
- Progress Bar: `#4CAF50`

**Pastel Theme**:
- Card Background: `#F8F4E6`
- Timer Text: `#8B4513`
- Title Text: `#CD853F`
- Progress Bar: `#DDA0DD`

### Font Combinations
- **Modern**: Montserrat + 600 weight
- **Classic**: Roboto + 500 weight
- **Playful**: Comfortaa + 400 weight

## Troubleshooting

### Common Issues

**Timer not starting**:
- Check if widget is properly loaded
- Verify chat commands are correct
- Ensure JavaScript is enabled

**Audio not playing**:
- Upload audio files to StreamElements
- Check browser audio permissions
- Verify audio file formats (MP3 recommended)

**Styling not applied**:
- Refresh the overlay
- Check for CSS syntax errors
- Verify field data is properly configured

### Debug Mode
Open browser console to see debug messages:
- Timer state changes
- Audio playback status
- StreamElements API calls

## Advanced Features

### State Persistence
The widget automatically saves timer state every 5 seconds, including:
- Current session number
- Timer mode (work/break)
- Remaining time
- Running/paused status

### Animation System
Built-in animations for:
- Timer completion (pulse effect)
- Session completion (shake effect)
- Pause state (pulsing opacity)
- Progress bar (animated stripes)

### Responsive Scaling
Automatically adjusts for different screen sizes:
- Desktop: Full size
- Mobile: Scaled down appropriately
- Custom scaling via timer scale setting

## Contributing

To modify or extend the widget:

1. **Test Locally**: Open `index.html` in browser
2. **Mock StreamElements**: Add mock `SE_API` for testing
3. **Validate**: Ensure all features work in StreamElements editor
4. **Document**: Update README with any new features

## License

This widget is provided as-is for StreamElements users. Feel free to modify and customize for your streaming needs.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify StreamElements widget documentation
3. Test in StreamElements editor mode
4. Check browser console for error messages

---

**Version**: 1.0  
**Compatible with**: StreamElements Custom Widgets  
**Last Updated**: August 2025
