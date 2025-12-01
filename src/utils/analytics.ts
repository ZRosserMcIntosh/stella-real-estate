/**
 * Google Analytics 4 utility functions
 * Measurement ID: G-6GBRVEVG2L
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Track page views
 */
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: title || document.title,
    });
  }
};

/**
 * Track custom events
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

/**
 * Track button clicks
 */
export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location || 'unknown',
  });
};

/**
 * Track form submissions
 */
export const trackFormSubmit = (formName: string, success: boolean) => {
  trackEvent('form_submit', {
    form_name: formName,
    success: success,
  });
};

/**
 * Track WhatsApp clicks
 */
export const trackWhatsAppClick = (source: string) => {
  trackEvent('whatsapp_click', {
    source: source,
  });
};

/**
 * Track signup attempts
 */
export const trackSignup = (plan: string, method: string) => {
  trackEvent('sign_up', {
    plan: plan,
    method: method,
  });
};

/**
 * Track login attempts
 */
export const trackLogin = (method: string) => {
  trackEvent('login', {
    method: method,
  });
};

/**
 * Track pricing plan views
 */
export const trackPlanView = (planName: string, price: number) => {
  trackEvent('view_item', {
    item_name: planName,
    value: price,
    currency: 'BRL',
  });
};

/**
 * Track CTA clicks
 */
export const trackCTA = (ctaName: string, location: string) => {
  trackEvent('cta_click', {
    cta_name: ctaName,
    location: location,
  });
};

/**
 * Track outbound links
 */
export const trackOutboundLink = (url: string, linkText?: string) => {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: url,
    link_text: linkText,
  });
};

/**
 * Track navigation
 */
export const trackNavigation = (from: string, to: string) => {
  trackEvent('navigation', {
    from: from,
    to: to,
  });
};

/**
 * Track video plays (for YouTube embeds)
 */
export const trackVideoPlay = (videoTitle: string, videoUrl?: string) => {
  trackEvent('video_play', {
    video_title: videoTitle,
    video_url: videoUrl,
  });
};

/**
 * Track search queries
 */
export const trackSearch = (searchTerm: string, results?: number) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: results,
  });
};

/**
 * Track errors
 */
export const trackError = (errorMessage: string, errorLocation?: string) => {
  trackEvent('exception', {
    description: errorMessage,
    location: errorLocation,
    fatal: false,
  });
};

/**
 * Set user properties
 */
export const setUserProperty = (propertyName: string, value: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', {
      [propertyName]: value,
    });
  }
};

/**
 * Track custom conversion
 */
export const trackConversion = (conversionName: string, value?: number) => {
  trackEvent(conversionName, {
    value: value,
    currency: 'BRL',
  });
};
