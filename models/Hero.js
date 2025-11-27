const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    // Main Content
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    subtitle: {
        type: String,
        trim: true,
        maxlength: [80, 'Subtitle cannot exceed 80 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [300, 'Description cannot exceed 300 characters']
    },

    // Media Assets
    backgroundImage: {
        type: String,
        required: [true, 'Background image is required']
    },
    backgroundVideo: {
        type: String,
        default: null
    },
    mobileImage: {
        type: String,  // Optional mobile-optimized image
        default: null
    },

    // Call to Action
    ctaText: {
        type: String,
        default: 'Learn More',
        trim: true,
        maxlength: [30, 'CTA text cannot exceed 30 characters']
    },
    ctaLink: {
        type: String,
        default: '#',
        trim: true
    },
    secondaryCtaText: {
        type: String,
        trim: true,
        maxlength: [30, 'Secondary CTA text cannot exceed 30 characters']
    },
    secondaryCtaLink: {
        type: String,
        trim: true
    },

    // Visual Styling
    overlayOpacity: {
        type: Number,
        default: 60,
        min: [0, 'Opacity must be between 0 and 100'],
        max: [100, 'Opacity must be between 0 and 100']
    },
    overlayColor: {
        type: String,
        default: 'black',
        enum: ['black', 'blue', 'red', 'purple', 'green', 'custom']
    },
    textAlignment: {
        type: String,
        default: 'left',
        enum: ['left', 'center', 'right']
    },
    textColor: {
        type: String,
        default: 'white',
        enum: ['white', 'black', 'custom']
    },

    // Animation Settings
    animationType: {
        type: String,
        default: 'fade',
        enum: ['fade', 'slide', 'zoom', 'none']
    },
    animationDuration: {
        type: Number,
        default: 5000,  // milliseconds
        min: [2000, 'Animation duration must be at least 2 seconds'],
        max: [15000, 'Animation duration cannot exceed 15 seconds']
    },

    // Display Control
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    order: {
        type: Number,
        default: 0,
        index: true
    },
    displayFrom: {
        type: Date,
        default: null  // Optional: Schedule when to start showing
    },
    displayUntil: {
        type: Date,
        default: null  // Optional: Schedule when to stop showing
    },

    // SEO & Accessibility
    altText: {
        type: String,
        trim: true,
        maxlength: [150, 'Alt text cannot exceed 150 characters']
    },
    ariaLabel: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
heroSchema.index({ isActive: 1, order: 1 });
heroSchema.index({ displayFrom: 1, displayUntil: 1 });

// Virtual for checking if slide should be displayed based on schedule
heroSchema.virtual('isScheduledActive').get(function () {
    const now = new Date();
    const fromCheck = !this.displayFrom || this.displayFrom <= now;
    const untilCheck = !this.displayUntil || this.displayUntil >= now;
    return this.isActive && fromCheck && untilCheck;
});

// Method to get active slides
heroSchema.statics.getActiveSlides = async function () {
    const now = new Date();
    return this.find({
        isActive: true,
        $or: [
            { displayFrom: null, displayUntil: null },
            { displayFrom: { $lte: now }, displayUntil: null },
            { displayFrom: null, displayUntil: { $gte: now } },
            { displayFrom: { $lte: now }, displayUntil: { $gte: now } }
        ]
    }).sort({ order: 1 });
};

// Pre-save validation
heroSchema.pre('save', function (next) {
    // Ensure alt text is set if not provided
    if (!this.altText && this.title) {
        this.altText = this.title;
    }

    // Validate date range
    if (this.displayFrom && this.displayUntil && this.displayFrom > this.displayUntil) {
        next(new Error('Display start date must be before end date'));
    }

    next();
});

// Configure toJSON to include virtuals
heroSchema.set('toJSON', { virtuals: true });
heroSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Hero', heroSchema);
