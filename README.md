# CPR Data Entry Form

A mobile-friendly, offline-capable web application for hospital CPR case data entry and monthly reporting. Built with React, Tailwind CSS, and IndexedDB for local data storage.

## Features

✅ **Offline-First Architecture**
- Works completely offline with Service Worker caching
- All data stored locally in IndexedDB
- No internet connection required for data entry
- Automatic sync indicators

✅ **Comprehensive CPR Case Management**
- Multi-step form for structured data entry
- Covers all aspects of CPR cases:
  - Patient information (name, medical ID)
  - Admission data (date, diagnosis, department)
  - Code Blue response (timing, location, response times)
  - CPR quality metrics (cycles, defibrillation, duration)
  - Documentation status
  - Discharge outcomes
  - Death tracking (before/after 24 hours)

✅ **Mobile-Optimized**
- Responsive design for phones, tablets, and desktops
- Touch-friendly interface
- Progressive Web App (PWA) support
- Can be installed as a standalone app on mobile devices

✅ **Data Management**
- View all recorded CPR cases
- Edit existing cases
- Delete cases with confirmation
- Filter cases by month and year
- Export monthly reports as CSV/Excel files

✅ **Professional UI**
- Clinical workflow-optimized interface
- Color-coded status indicators
- Real-time validation
- Intuitive step-by-step form navigation

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Local Storage**: IndexedDB
- **Offline Support**: Service Worker
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/karimhany1984/cpr-form.git
cd cpr-form

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
# Build the project
pnpm build

# Preview production build
pnpm preview
```

## Usage

### Adding a New CPR Case

1. Click on the **"New Entry"** tab
2. Fill in the hospital information (name, governorate, month, year)
3. Navigate through the form steps:
   - Patient Information
   - Admission Data
   - Code Blue Response
   - CPR Details
   - Documentation
   - Discharge & Outcomes
4. Click **"Save Case"** to store the data locally

### Viewing and Managing Cases

1. Click on the **"View Cases"** tab
2. Filter cases by month and year
3. View detailed case information in card format
4. **Edit** a case by clicking the Edit button (returns to form)
5. **Delete** a case with confirmation
6. **Export** monthly reports as CSV files

### Exporting Reports

1. Go to the **"View Cases"** tab
2. Select the desired month and year
3. Click **"Export to Excel"**
4. A CSV file will be downloaded with all cases for that month

## Offline Functionality

The app uses a Service Worker to enable offline functionality:

- **First Visit**: App downloads essential files and caches them
- **Subsequent Visits**: App loads from cache first, then updates from network
- **Offline Mode**: All features work without internet connection
- **Data Persistence**: All entered data is stored locally in IndexedDB
- **Sync Status**: Online/offline status indicator in the header

## Data Storage

All data is stored locally on your device using IndexedDB:
- No data is sent to external servers
- Data persists even after closing the browser
- Data is private and only accessible on your device
- You can export data as CSV files anytime

## Form Fields

### Hospital Information
- Hospital Name
- Governorate
- Month
- Year

### Patient Data
- Full Patient Name
- Medical ID (Unified Medical ID)

### Admission Data
- Admission Date
- Diagnosis
- Department

### Code Blue Response
- Cardiac Arrest Date
- Cardiac Arrest Location
- Code Blue Announcement Time
- CPR Start Time
- Code Blue Team Arrival Time
- Response Time (minutes)

### CPR Details
- Number of CPR Cycles
- Defibrillation Used (Yes/No)
- CPR End Time
- Total Resuscitation Time (minutes)
- Resuscitation Outcome (Success/Failure)

### Documentation
- CPR Form Exists (Yes/No)
- CPR Form Complete (Yes/No)

### Discharge & Outcomes
- Discharge Date
- Discharge Status
- Death Before 24 Hours (Yes/No)
- Death After 24 Hours (Yes/No)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Installation as PWA

### On Android
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Install app" or "Add to home screen"

### On iOS
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

## Development

### Project Structure

```
client/
├── public/
│   ├── sw.js              # Service Worker for offline support
│   └── manifest.json      # PWA manifest
├── src/
│   ├── components/
│   │   ├── CPRForm.tsx    # Main data entry form
│   │   └── CPRCasesList.tsx # Cases display component
│   ├── hooks/
│   │   └── useCPRCases.ts # Custom hook for case management
│   ├── lib/
│   │   └── db.ts          # IndexedDB utilities
│   ├── pages/
│   │   └── Home.tsx       # Main page
│   ├── App.tsx            # App router
│   ├── main.tsx           # React entry point
│   └── index.css          # Global styles
└── index.html
```

### Adding New Features

1. Create components in `client/src/components/`
2. Use the `useCPRCases` hook for data management
3. Update styles in `client/src/index.css`
4. Test offline functionality with DevTools

## Troubleshooting

### Data not persisting
- Check browser's IndexedDB support
- Clear browser cache and try again
- Ensure cookies/storage is not disabled

### Service Worker not registering
- Check browser console for errors
- Ensure HTTPS (or localhost for development)
- Clear browser cache and reload

### Export not working
- Ensure you have selected a month and year
- Check browser's download permissions
- Try a different browser if issues persist

## Performance

- Initial load: ~2-3 seconds
- Offline load: <500ms (from cache)
- Data entry: Real-time validation
- Export: <1 second for typical monthly data

## Security

- All data stored locally on device
- No external API calls for data storage
- No tracking or analytics
- HTTPS recommended for production

## License

MIT License - feel free to use and modify

## Support

For issues or feature requests, please contact the development team or create an issue in the repository.

---

**Version**: 1.0.0  
**Last Updated**: May 2026  
**Status**: Production Ready
