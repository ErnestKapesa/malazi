const PERMISSIONS = {
  student: {
    can: [
      'view_properties',
      'save_favorites',
      'send_messages',
      'book_viewings',
      'write_reviews',
      'update_profile',
      'view_history',
      'schedule_visits',
      'submit_applications',
      'rate_properties',
      'report_issues',
      'view_lease_agreements',
      'request_maintenance',
    ],
    maxBookings: 3,
    maxFavorites: 20,
    features: {
      instantBooking: false,
      prioritySupport: false,
      advancedSearch: true,
      priceAlerts: true
    }
  },
  owner: {
    can: [
      'manage_properties',
      'respond_to_inquiries',
      'view_applications',
      'manage_bookings',
      'view_analytics',
      'update_profile',
      'manage_business',
      'create_listings',
      'edit_listings',
      'delete_listings',
      'manage_amenities',
      'view_tenant_history',
      'generate_reports',
      'manage_payments',
      'set_availability',
      'manage_maintenance',
      'bulk_operations',
    ],
    maxListings: 10,
    maxPhotosPerListing: 15,
    features: {
      analytics: true,
      bulkOperations: true,
      promotedListings: true,
      prioritySupport: true
    }
  }
}

export const permissionService = {
  can(role, action) {
    return PERMISSIONS[role]?.can.includes(action) || false
  },

  getPermissions(role) {
    return PERMISSIONS[role]?.can || []
  },

  getFeatures(role) {
    return PERMISSIONS[role]?.features || {}
  },

  getLimits(role) {
    const { maxListings, maxPhotosPerListing, maxBookings, maxFavorites } = PERMISSIONS[role] || {}
    return { maxListings, maxPhotosPerListing, maxBookings, maxFavorites }
  },

  requirePermission(role, action) {
    if (!this.can(role, action)) {
      throw new Error(`Permission denied: ${action} requires ${role} role`)
    }
  },

  hasFeature(role, feature) {
    return PERMISSIONS[role]?.features?.[feature] || false
  }
} 