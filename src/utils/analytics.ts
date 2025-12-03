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

/**
 * Google Ads Conversion Tracking
 */

/**
 * Track when user starts the registration/signup process
 * This should be called when the user clicks "Garantir Minha Vaga" or similar CTA
 */
export const trackStartRegistration = (eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion_event_start_registration', {
      send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with your Google Ads conversion ID
      event_category: 'engagement',
      event_label: 'Start Registration',
      ...eventParams,
    });
  }
};

/**
 * Track completed purchase/checkout
 * This should be called when payment is successfully completed
 * @param value - Transaction value (e.g., 99.00 for R$ 99)
 * @param transactionId - Unique transaction/payment ID
 */
export const trackPurchaseComplete = (
  value: number,
  transactionId?: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion_event_purchase', {
      send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with your Google Ads conversion ID
      value: value,
      currency: 'BRL',
      transaction_id: transactionId,
      event_category: 'ecommerce',
      event_label: 'Purchase Complete',
      ...eventParams,
    });
  }
};

/**
 * Helper function to delay navigation until gtag event is sent
 * Use this when tracking conversions that should redirect to another page
 * @param url - URL to navigate to after event is tracked
 * @param eventName - Google Ads conversion event name
 * @param eventParams - Additional event parameters
 */
export const trackConversionWithRedirect = (
  url: string,
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const callback = function () {
      if (typeof url === 'string') {
        window.location.href = url;
      }
    };

    window.gtag('event', eventName, {
      event_callback: callback,
      event_timeout: 2000,
      ...eventParams,
    });
  } else {
    // If gtag is not available, just navigate
    if (typeof url === 'string') {
      window.location.href = url;
    }
  }
};
