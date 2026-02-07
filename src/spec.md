# Encoreats - Live Music Marketplace

A B2B2C marketplace connecting venues, musicians, and customers for live music events.

## User Roles

### Venues
- Book musicians for events
- Manage event listings
- Generate marketing assets
- Track ROI and analytics
- Verify musician attendance via QR scanning

### Musicians
- Manage availability calendar
- Track gigs and payment status
- Generate QR tickets for events
- View wallet with three payment states

### Customers
- Browse upcoming events
- Search by city, date, and genre
- Reserve tables at events

## Core Features

### Authentication
- Internet Identity integration for all user roles
- Role-based access control (venue/musician/customer)

### Event Management
- Venues can search and filter musicians by genre, budget, and availability
- Booking workflow with contract generation
- Event status tracking (pending, confirmed, completed)
- QR code generation for event verification

### Payment System (Mock Escrow)
- Three wallet states: Locked, Available, Paid
- Funds locked on booking confirmation
- Automatic release 24 hours after event or upon QR verification
- Payment tracking and history

### Analytics & ROI
- Revenue tracking for venues
- Attendance counting
- Comparison charts showing gig night vs average revenue
- Dashboard analytics for business insights

### Marketing Tools
- Auto-generated 9:16 marketing images with artist photo, venue, and date
- Event promotion materials

## Backend Data Storage

### Profiles
- User ID, role, name, phone, bio, rating, location
- Role-based profile management

### Gigs
- Gig ID, venue ID, musician ID, date, price, status, contract URL
- Booking and event management

### Transactions
- Mock escrow system with payment state tracking
- Transaction history and wallet management

### ROI Data
- Gig-specific sales and attendance data
- Analytics for venue performance tracking

## User Interface

### Design Theme
- Dark mode with neon accents (purple, electric blue, hot pink)
- Glassmorphism UI elements
- Mobile-first responsive design
- Poppins font for headings, Inter for body text

### Public Pages
- Landing page with hero section
- Event search and filtering
- Event detail pages with booking options

### Venue Dashboard
- Musician search and booking interface
- ROI analytics and reporting
- Marketing asset generation
- QR scanner for attendance verification

### Musician Dashboard
- Availability calendar management
- Wallet view with payment states
- QR ticket generation for events
- Gig history and earnings tracking

## Technical Requirements

### Frontend Components
- Authorization system
- QR code generation and scanning
- Blob storage for images and documents
- PDF contract generation using jspdf and html2canvas

### Search and Filtering
- Event search by location, date, genre
- Musician filtering by availability, genre, budget
- Real-time availability checking

### File Management
- Contract PDF generation and storage
- Marketing image creation and storage
- Profile image handling
